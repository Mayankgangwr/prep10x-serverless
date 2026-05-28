import z from "zod";

import { planFormSchema } from "./schemas";

export const planIdSchema = z.object({
    planId: z.string().cuid("Invalid plan id"),
});

export const planCreateSchema = planFormSchema;

export const planUpdateSchema = planFormSchema.partial();

export const planDeleteSchema = planIdSchema;
