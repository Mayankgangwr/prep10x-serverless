import { failedResponse, handleApiError, successResponse } from "@/lib/api";
import { extractTextFromPdf } from "@/lib/resume/extract-text";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return failedResponse(
                "VALIDATION_ERROR",
                "Resume file is required.",
                400
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const text = await extractTextFromPdf(buffer);

        return successResponse({ text });
    } catch (error) {
        return handleApiError(error, {
            fallbackCode: "RESUME_EXTRACT_FAILED",
            fallbackMessage: "Failed to extract text from resume PDF.",
        });
    }
}
