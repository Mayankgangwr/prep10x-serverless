import z from "zod";

import { planFormSchema, planItemSchema } from "./schemas";

export type PlanFormValues = z.infer<typeof planFormSchema>;

export type PlanItem = z.infer<typeof planItemSchema>;
