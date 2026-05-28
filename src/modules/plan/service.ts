import {
    createPlanForUser,
    deletePlanForUser,
    findPlanByIdAndUserId,
    findPlansByUserId,
    updatePlanForUser,
} from "./repository";
import { mergeUpdateValues, buildPlanWriteData, toPlanItem } from "./actions";
import type { PlanFormValues, PlanItem } from "./types";

type CreatePlanInput = PlanFormValues;

type UpdatePlanInput = Partial<PlanFormValues>;

export const getUserPlans = async (userId: string): Promise<PlanItem[]> => {
    const plans = await findPlansByUserId(userId);

    return plans.map(toPlanItem);
};

export const createUserPlan = async (
    userId: string,
    values: CreatePlanInput
): Promise<PlanItem> => {
    const createdPlan = await createPlanForUser(userId, buildPlanWriteData(values));

    return toPlanItem(createdPlan);
};

export const updateUserPlan = async (
    userId: string,
    planId: string,
    values: UpdatePlanInput
): Promise<PlanItem | null> => {
    const existingPlan = await findPlanByIdAndUserId(planId, userId);

    if (!existingPlan) {
        return null;
    }

    const mergedValues = mergeUpdateValues(toPlanItem(existingPlan), values);

    await updatePlanForUser(planId, userId, buildPlanWriteData(mergedValues));

    const updatedPlan = await findPlanByIdAndUserId(planId, userId);

    return updatedPlan ? toPlanItem(updatedPlan) : null;
};

export const deleteUserPlan = async (userId: string, planId: string) => {
    const deleted = await deletePlanForUser(planId, userId);

    return deleted.count > 0;
};
