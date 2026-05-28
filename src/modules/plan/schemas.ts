import z from "zod";

export const billingCycles = ["monthly", "quarterly", "yearly"] as const;

export const planStatuses = ["active", "draft"] as const;

export const planFormSchema = z.object({
    name: z.string().trim().min(3, "Plan name is required"),
    price: z.coerce.number().min(0, "Plan price must be 0 or greater"),
    billingCycle: z.enum(billingCycles),
    description: z.string().trim().min(10, "Description is required"),
    featuresText: z
        .string()
        .trim()
        .min(3, "Add at least one feature separated by commas"),
    status: z.enum(planStatuses),
});

export const planItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().min(0),
    billingCycle: z.enum(billingCycles),
    description: z.string(),
    features: z.array(z.string()).min(1),
    status: z.enum(planStatuses),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const planStorageSchema = z.array(planItemSchema);
