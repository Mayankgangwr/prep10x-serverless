import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { z } from "zod";

import { auth } from "@/lib/auth/auth";
import { handleApiError, successResponse, failedResponse } from "@/lib/api";
import prisma from "@/lib/prisma/client";
import { extractTextFromPdf } from "@/lib/resume/extract-text";
import { buildResumeAnalysisPrompt } from "@/prompts/resume.prompt";
import { callConfiguredProvider } from "@/providers/ai-service.provider";
import { validateResponse } from "@/lib/utils";
import { resumeAnalysisSchema } from "@/modules/resume/schemas";
import { mapResumeAnalysisToCreateInput } from "@/modules/resume/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return failedResponse(
                "UNAUTHORIZED",
                "You must be signed in to analyze a resume.",
                401
            );
        }

        const resume = await prisma.resume.findFirst({
            where: {
                userId: session.user.id,
                softDeleted: false,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                resumeAnalysis: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        return successResponse({ resume });
    } catch (error) {
        return handleApiError(error, {
            fallbackCode: "RESUME_ANALYSIS_FAILED",
            fallbackMessage: "Failed to analyze the resume.",
        });
    }

}