import { NextResponse } from "next/server";

import { uploadBuffer } from "@/lib/resume/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Resume file is required.",
          },
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await uploadBuffer({
      buffer,
      fileName: file.name,
      mimeType: file.type,
      folder: "prep10x/resumes",
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload resume.";

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPLOAD_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}
