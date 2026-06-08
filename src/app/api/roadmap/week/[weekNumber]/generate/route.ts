import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { failedResponse, successResponse } from "@/lib/api";
import prisma from "@/lib/prisma/client";
import { buildWeeklyPathPrompt } from "@/prompts/weekly-learning";
import { callConfiguredProvider } from "@/providers/ai-service.provider";

export const runtime = "nodejs";

export async function POST(
    request: Request,
    props: { params: Promise<{ weekNumber: string }> }
) {
    try {
        const params = await props.params;
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return failedResponse("UNAUTHORIZED", "You must be signed in.", 401);
        }

        const { weekNumber } = params;
        const weekNum = parseInt(weekNumber, 10);
        if (isNaN(weekNum) || weekNum < 1) {
            return failedResponse("INVALID_WEEK", "Invalid week number.", 400);
        }

        // Fetch user's roadmap
        const roadmap = await prisma.preparationPlan.findFirst({
            where: { userId: session.user.id, softDeleted: false },
            orderBy: { createdAt: "desc" },
            include: { resume: true }
        });

        if (!roadmap) {
            return failedResponse("NOT_FOUND", "No active roadmap found.", 404);
        }

        const planData = roadmap.planData as any;
        const weeklyPlanArray = planData.weeklyPlan;

        if (!weeklyPlanArray || !Array.isArray(weeklyPlanArray)) {
            return failedResponse("INVALID_PLAN", "Roadmap data is corrupted.", 500);
        }

        const targetWeek = weeklyPlanArray.find(w => w.week === weekNum);
        if (!targetWeek) {
            return failedResponse("NOT_FOUND", `Week ${weekNum} not found in roadmap.`, 404);
        }

        if (targetWeek.generatedDailyPlan) {
            return successResponse(targetWeek.generatedDailyPlan);
        }

        const promptInput = {
            weeklyPlan: targetWeek,
            targetRole: roadmap.targetRole,
            experienceLevel: roadmap.experienceLevel,
            senioritySignal: (planData.planMeta?.senioritySignal) || "Mid-level",
            activeInterviewTypes: roadmap.interviewTypes,
        };

        const prompt = buildWeeklyPathPrompt(promptInput);
        const aiResult = await callConfiguredProvider(prompt);

        const generatedPlan = aiResult.data;

        if (!generatedPlan || typeof generatedPlan !== "object") {
            return failedResponse("PARSE_ERROR", "Failed to parse AI output.", 500);
        }

        // Update the planData JSON
        const updatedWeeklyPlanArray = weeklyPlanArray.map(w => {
            if (w.week === weekNum) {
                return { ...w, generatedDailyPlan: generatedPlan };
            }
            return w;
        });

        const updatedPlanData = {
            ...planData,
            weeklyPlan: updatedWeeklyPlanArray
        };

        await prisma.preparationPlan.update({
            where: { id: roadmap.id },
            data: { planData: updatedPlanData }
        });

        // Also unlock the days if necessary? 
        // For now, we rely on the generated data.

        return successResponse(generatedPlan);

    } catch (error: any) {
        console.error("[generate-daily-plan]", error);
        return failedResponse("INTERNAL_ERROR", error.message, 500);
    }
}
