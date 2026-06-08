import { headers } from "next/headers";
import { createHash } from "node:crypto";

import { auth } from "@/lib/auth/auth";
import { handleApiError, successResponse, failedResponse } from "@/lib/api";
import prisma from "@/lib/prisma/client";
import { z } from "zod";
import { buildPreparationPlanPrompt, ROADMAP_PROMPT_VERSION, InterviewType } from "@/prompts/roadmap.prompt";
import { callConfiguredProvider } from "@/providers/ai-service.provider";
import { DayStatus } from "@/generated/prisma/client";

export const runtime = "nodejs";

// get the data for roadmap
export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return failedResponse(
                "UNAUTHORIZED",
                "You must be signed in to get the roadmap.",
                401
            );
        }

        const roadmap = await prisma.preparationPlan.findFirst({
            where: {
                userId: session.user.id,
                softDeleted: false,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!roadmap) {
            return failedResponse(
                "ROADMAP_NOT_FOUND",
                "You must have a roadmap to get the roadmap.",
                404
            );
        }

        return successResponse({ roadmap });
    } catch (error) {
        return handleApiError(error, {
            fallbackCode: "ROADMAP_FAILED",
            fallbackMessage: "Failed to get the roadmap.",
        });
    }

}

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return failedResponse(
                "UNAUTHORIZED",
                "You must be signed in to create a roadmap.",
                401
            );
        }

        const data = await request.json();

        // 1. Validate incoming payload (frontend sends analysisId)
        const schema = z.object({
            analysisId: z.string().min(1, "Analysis ID is required"),
            durationWeeks: z.number().min(2).max(8).default(4),
            interviewTypes: z.array(z.string()).default(["DSA/Coding", "System Design", "Behavioral/HR"]),
        });

        const validationResult = schema.safeParse(data);

        if (!validationResult.success) {
            return failedResponse(
                "INVALID_PAYLOAD",
                "Invalid payload.",
                400,
                validationResult.error.issues
            );
        }

        const { analysisId, durationWeeks, interviewTypes } = validationResult.data;

        // 2. Fetch the ResumeAnalysis and associated Resume
        const analysis = await prisma.resumeAnalysis.findUnique({
            where: { id: analysisId },
            include: { resume: true }
        });

        if (!analysis || analysis.resume.userId !== session.user.id) {
            return failedResponse(
                "ANALYSIS_NOT_FOUND",
                "Resume analysis not found or access denied.",
                404
            );
        }

        if (analysis.preparationPlanId) {
            return failedResponse(
                "ROADMAP_ALREADY_EXISTS",
                "A roadmap has already been generated for this analysis.",
                400
            );
        }

        const targetRole = analysis.resume.targetRole || "Software Engineer";
        const experienceLevel = analysis.resume.experienceLevel || "Mid";

        // 3. Prepare the input for the prompt
        // Assuming the insights field contains the original parsed analysis object
        const insights = analysis.insights as any;
        
        if (!insights) {
             return failedResponse(
                "INVALID_ANALYSIS_DATA",
                "The analysis data is missing required insights.",
                400
            );
        }

        const promptInput = {
            resumeScore: analysis.resumeScore || 0,
            roleFitScore: analysis.roleFitScore || 0,
            roleReadinessLevel: analysis.roleReadinessLevel,
            candidateSnapshot: insights.candidateSnapshot || {
                 currentTitle: "Unknown",
                 totalYearsExperience: 0,
                 primaryTechStack: [],
                 senioritySignal: "Unclear"
            },
            strengths: analysis.strengths || [],
            weaknesses: analysis.weaknesses || [],
            skillAnalysis: insights.skillAnalysis || {
                coreSkills: { matched: [], missing: [] },
                toolsAndPlatforms: { missing: [] },
                softSkills: { gaps: [] }
            },
            experienceGapAnalysis: insights.experienceGapAnalysis || {
                 criticalGaps: [],
                 transferableStrengths: []
            },
            targetRole,
            experienceLevel,
            durationWeeks,
            interviewTypes: interviewTypes as InterviewType[],
        };

        // 4. Build prompt and call AI
        const prompt = buildPreparationPlanPrompt(promptInput);
        const startTime = Date.now();
        const aiResult = await callConfiguredProvider(prompt);
        const generationTimeMs = Date.now() - startTime;
        
        const planData = aiResult.data as any;

        // 5. Save to DB in a transaction
        const savedPlan = await prisma.$transaction(async (tx) => {
            // Create the main plan
            const plan = await tx.preparationPlan.create({
                data: {
                    userId: session.user.id,
                    resumeId: analysis.resumeId,
                    targetRole,
                    experienceLevel,
                    durationWeeks,
                    interviewTypes,
                    planData: planData,
                    promptVersion: ROADMAP_PROMPT_VERSION,
                    planVersion: 1,
                    planTheme: planData?.planMeta?.planTheme || "Custom Plan",
                    overallStrategy: planData?.planMeta?.overallStrategy || "",
                    planConfidence: planData?.planConfidenceScore || 0,
                    planStatus: "generated",
                    totalDays: planData?.planMeta?.totalWorkingDays || (durationWeeks * 5),
                    providerUsed: aiResult.providerUsed,
                    modelUsed: aiResult.modelUsed,
                    generationTimeMs,
                }
            });

            // Create generation history record
            await tx.preparationPlanGeneration.create({
                data: {
                    planId: plan.id,
                    version: 1,
                    promptVersion: ROADMAP_PROMPT_VERSION,
                    providerUsed: aiResult.providerUsed,
                    modelUsed: aiResult.modelUsed,
                    generationTimeMs,
                    success: true,
                    planDataSnapshot: planData,
                }
            });

            // Create PlanDay records
            const daysToCreate = [];
            for (let week = 1; week <= durationWeeks; week++) {
                for (let day = 1; day <= 5; day++) {
                    const absoluteDay = (week - 1) * 5 + day;
                    daysToCreate.push({
                        planId: plan.id,
                        weekNumber: week,
                        dayNumber: day,
                        absoluteDay,
                        status: (absoluteDay === 1 ? DayStatus.available : DayStatus.locked),
                    });
                }
            }
            
            if (daysToCreate.length > 0) {
                 await tx.preparationPlanDay.createMany({
                     data: daysToCreate
                 });
            }

            // Link to analysis
            await tx.resumeAnalysis.update({
                where: { id: analysis.id },
                data: { preparationPlanId: plan.id }
            });

            return plan;
        });

        return successResponse(savedPlan);
    } catch (error) {
        return handleApiError(error, {
            fallbackCode: "ROADMAP_GENERATION_FAILED",
            fallbackMessage: "Failed to generate roadmap.",
        });
    }
}