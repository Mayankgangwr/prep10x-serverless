import z from "zod";
import { resumeAnalysisSchema, uploadResumeSchema } from "./schemas";

export type UploadResumeValues = z.infer<typeof uploadResumeSchema>;

export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>;
