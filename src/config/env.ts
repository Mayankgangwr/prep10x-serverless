import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().min(1).optional(),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),

  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_BASE_URL: z.string().url().optional(),
  OPENAI_MODEL: z.string().min(1).optional(),

  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  GEMINI_MODEL: z.string().min(1).optional(),
  GEMINI_TEMPERATURE: z.coerce.number().min(0).max(2).optional(),
  GEMINI_TIMEOUT_MS: z.coerce.number().positive().optional(),
  GEMINI_RETRY_ATTEMPTS: z.coerce.number().int().positive().optional(),
  GEMINI_PROJECT_NAME: z.string().min(1).optional(),
  GEMINI_PROJECT_NUMBER: z.coerce.number().positive().optional(),
});

export const env = serverEnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
  OPENAI_MODEL: process.env.OPENAI_MODEL,

  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL,
  GEMINI_TEMPERATURE: process.env.GEMINI_TEMPERATURE,
  GEMINI_TIMEOUT_MS: process.env.GEMINI_TIMEOUT_MS,
  GEMINI_RETRY_ATTEMPTS: process.env.GEMINI_RETRY_ATTEMPTS,
  GEMINI_PROJECT_NAME: process.env.GEMINI_PROJECT_NAME,
  GEMINI_PROJECT_NUMBER: process.env.GEMINI_PROJECT_NUMBER,
});