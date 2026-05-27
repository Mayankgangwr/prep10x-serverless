import z from "zod";
import { uploadResumeSchema } from "./schemas";

export type UploadResumeValues = z.infer<typeof uploadResumeSchema>;
