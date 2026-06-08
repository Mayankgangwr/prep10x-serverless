import { z } from "zod";

export const ResourceSchema = z.object({
    title: z.string(),
    type: z.enum(["article", "video", "practice_problem", "book", "course"]),
    url: z.string().url(),
});

export const MockInterviewSchema = z.object({
    weekNumber: z.number(),
    type: z.enum(["Technical", "Behavioral", "System Design"]),
    focus: z.string(),
});

export const PreparationPhaseSchema = z.object({
    weekNumber: z.number(),
    title: z.string(),
    focusArea: z.string(),
    description: z.string(),
    topicsToCover: z.array(z.string()),
    resources: z.array(ResourceSchema),
    status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
    generatedDailyPlan: z.any().optional(),
});

export const PreparationPlanSchema = z.object({
    id: z.string().optional(),
    analysisId: z.string(),
    targetRole: z.string(),
    totalWeeks: z.number(),
    overview: z.string(),
    phases: z.array(PreparationPhaseSchema),
    mockInterviewCheckpoints: z.array(MockInterviewSchema).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type Resource = z.infer<typeof ResourceSchema>;
export type MockInterview = z.infer<typeof MockInterviewSchema>;
export type PreparationPhase = z.infer<typeof PreparationPhaseSchema>;
export type PreparationPlan = z.infer<typeof PreparationPlanSchema>;
