import crypto from "node:crypto";
import type { StoredFile } from "./types";

type CloudinaryUploadResponse = {
  public_id: string;
  secure_url: string;
  resource_type: string;
  bytes: number;
  format: string;
  original_filename?: string;
};

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

const getRequiredEnv = (name: string) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const signCloudinaryParams = (params: Record<string, string>, apiSecret: string) => {
  const payload = Object.entries(params)
    .filter(([, value]) => value.length > 0)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
};

export const uploadResumeToCloudinary = async (file: File): Promise<StoredFile> => {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Only PDF/DOC/DOCX files are allowed.");
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    throw new Error("File size must be less than 5 MB.");
  }

  const cloudName = getRequiredEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = getRequiredEnv("CLOUDINARY_API_KEY");
  const apiSecret = getRequiredEnv("CLOUDINARY_API_SECRET");
  const folder = process.env.CLOUDINARY_RESUME_FOLDER?.trim() || "prep10x/resumes";
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const buffer = Buffer.from(await file.arrayBuffer());
  const checksum = crypto.createHash("sha256").update(buffer).digest("hex");

  const signature = signCloudinaryParams(
    {
      folder,
      timestamp,
    },
    apiSecret
  );

  const formData = new FormData();
  formData.append("file", new Blob([buffer], { type: file.type }), file.name);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;

    throw new Error(
      errorBody?.error?.message ?? "Cloudinary upload failed"
    );
  }

  const uploaded = (await response.json()) as CloudinaryUploadResponse;

  return {
    provider: "cloudinary",
    publicId: uploaded.public_id,
    secureUrl: uploaded.secure_url,
    resourceType: uploaded.resource_type,
    fileName: uploaded.original_filename ?? file.name,
    bytes: uploaded.bytes,
    format: uploaded.format,
    checksum,
  };
};
