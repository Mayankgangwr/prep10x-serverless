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

const unauthorizedResponse = () =>
  failedResponse(
    "UNAUTHORIZED",
    "You must be signed in to upload a resume.",
    401
  );

const resumeUploadFormSchema = z.object({
  targetRole: z.string().min(1, "Target role is required."),
  targetExperience: z.string().min(1, "Target experience is required."),
  planId: z.string().nullable().optional(),
});

const checksumBuffer = (buffer: Buffer) => {
  return createHash("sha256").update(buffer).digest("hex");
};

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    const formData = await request.formData();
    const file = formData.get("resume");
    const rawPlanId = formData.get("planId");
    const parsed = resumeUploadFormSchema.safeParse({
      targetRole: formData.get("targetRole"),
      targetExperience: formData.get("targetExperience"),
      planId: typeof rawPlanId === "string" && rawPlanId.length > 0 ? rawPlanId : null,
    });

    if (!(file instanceof File)) {
      return failedResponse("VALIDATION_ERROR", "Resume file is required.", 400);
    }

    if (!parsed.success) {
      return failedResponse(
        "VALIDATION_ERROR",
        "Invalid resume upload payload.",
        400,
        parsed.error.flatten()
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const extractedText = await extractTextFromPdf(fileBuffer);

    if (!extractedText.trim()) {
      return failedResponse(
        "EMPTY_RESUME_TEXT",
        "We could not extract readable text from the resume.",
        400
      );
    }

    const prompt = buildResumeAnalysisPrompt(
      extractedText,
      parsed.data.targetRole,
      parsed.data.targetExperience,
      4
    );

    const aiResult = await callConfiguredProvider(prompt);
    const validatedAnalysis = validateResponse(
      resumeAnalysisSchema,
      aiResult.data,
      "Invalid AI analysis response"
    );

    const checksum = await checksumBuffer(fileBuffer);

    const saved = await prisma.$transaction(async (tx) => {
      const resume = await tx.resume.upsert({
        where: {
          userId: session.user.id,
        },
        create: {
          userId: session.user.id,
          extractedText,
          targetRole: parsed.data.targetRole,
          experienceLevel: parsed.data.targetExperience,
          checksum,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          resourceType: "document",
          storageProvider: "cloudinary",
          publicId: checksum,
          secureUrl: "",
          originalFileUrl: null,
          aiStatus: "processing",
          softDeleted: false,
          aiFailureReason: null,
        },
        update: {
          extractedText,
          targetRole: parsed.data.targetRole,
          experienceLevel: parsed.data.targetExperience,
          checksum,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          resourceType: "document",
          storageProvider: "cloudinary",
          publicId: checksum,
          secureUrl: "",
          originalFileUrl: null,
          aiStatus: "processing",
          softDeleted: false,
          aiFailureReason: null,
        },
      });

      const analysis = await tx.resumeAnalysis.create({
        data: {
          ...mapResumeAnalysisToCreateInput(validatedAnalysis, resume.id, {
            providerUsed: aiResult.providerUsed,
            modelUsed: aiResult.modelUsed,
            planId: parsed.data.planId ?? null,
            extractedTextSummary: extractedText.slice(0, 500),
          }),
        },
      });

      const updatedResume = await tx.resume.update({
        where: {
          id: resume.id,
        },
        data: {
          aiStatus: "processed",
          aiLastProcessedAt: new Date(),
          aiFailureReason: null,
        },
      });

      return {
        resume: updatedResume,
        analysis,
      };
    });

    return successResponse(saved, 201);
  } catch (error) {
    return handleApiError(error, {
      fallbackCode: "RESUME_UPLOAD_FAILED",
      fallbackMessage: "Failed to upload and analyze resume.",
    });
  }
}
