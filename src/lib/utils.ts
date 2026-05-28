import { ZodSchema } from "zod";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}





export function validateResponse<T>(
  schema: ZodSchema<T>,
  payload: unknown,
  errorMessage = "Invalid response format"
): T {
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw new Error(errorMessage);
  }

  return parsed.data;
}