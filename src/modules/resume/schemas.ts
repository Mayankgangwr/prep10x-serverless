
import z from "zod";

export const uploadResumeSchema = z.object({
  resume: z
    .union([z.instanceof(File), z.undefined()])
    .refine((file): file is File => file instanceof File, {
      message: "Resume file is required",
    })
    .refine(
      (file) =>
        file instanceof File &&
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      {
        message: "Only PDF or DOC/DOCX files are allowed",
      }
    ),
  targetExperience: z.string().min(1, "Target experience is required"),
  targetRole: z.string().min(1, "Target role is required"),
});
