import type { Plan as PlanRecord } from "@/generated/prisma/client";
import type { PlanFormValues, PlanItem } from "./types";

type UpdatePlanInput = Partial<PlanFormValues>;

export const parsePlanFeatures = (featuresText: string) =>
    featuresText
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean);

export const toPlanFormValues = (plan: PlanItem): PlanFormValues => ({
    name: plan.name,
    price: plan.price,
    billingCycle: plan.billingCycle,
    description: plan.description,
    featuresText: plan.features.join(", "),
    status: plan.status,
});

export const toPlanItem = (plan: PlanRecord): PlanItem => ({
    id: plan.id,
    name: plan.name,
    price: plan.price,
    billingCycle: plan.billingCycle,
    description: plan.description,
    features: plan.features,
    status: plan.status,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
});


export const buildPlanWriteData = (values: PlanFormValues) => ({
    name: values.name.trim(),
    price: values.price,
    billingCycle: values.billingCycle,
    description: values.description.trim(),
    features: parsePlanFeatures(values.featuresText),
    status: values.status,
});

export const mergeUpdateValues = (
    existingPlan: PlanItem,
    values: UpdatePlanInput
): PlanFormValues => ({
    name: values.name ?? existingPlan.name,
    price: values.price ?? existingPlan.price,
    billingCycle: values.billingCycle ?? existingPlan.billingCycle,
    description: values.description ?? existingPlan.description,
    featuresText:
        values.featuresText ?? existingPlan.features.join(", "),
    status: values.status ?? existingPlan.status,
});