"use client";

import { useCallback, useState } from "react";

import type { PlanFormValues, PlanItem } from "./types";
import { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";

type UsePlanManagerArgs = {
    initialPlans: PlanItem[];
};

const parseErrorMessage = async (response: Response) => {
    try {
        const payload = (await response.json()) as ApiErrorResponse;

        return payload.error?.message ?? "Request failed.";
    } catch {
        return "Request failed.";
    }
};

const buildPlanPayload = (values: PlanFormValues) => ({
    name: values.name,
    price: values.price,
    billingCycle: values.billingCycle,
    description: values.description,
    featuresText: values.featuresText,
    status: values.status,
});

export const usePlanManager = ({ initialPlans }: UsePlanManagerArgs) => {
    const [plans, setPlans] = useState<PlanItem[]>(initialPlans);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const refreshPlans = useCallback(async () => {
        setIsRefreshing(true);

        try {
            const response = await fetch("/api/plan", {
                method: "GET",
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error(await parseErrorMessage(response));
            }

            const payload = (await response.json()) as ApiSuccessResponse<PlanItem[]>;
            setPlans(payload.data);
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    const addPlan = useCallback(async (values: PlanFormValues) => {
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(buildPlanPayload(values)),
            });

            if (!response.ok) {
                throw new Error(await parseErrorMessage(response));
            }

            const payload = (await response.json()) as ApiSuccessResponse<PlanItem>;
            setPlans((currentPlans) => [payload.data, ...currentPlans]);

            return payload.data;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    const editPlan = useCallback(
        async (planId: string, values: PlanFormValues) => {
            setIsSubmitting(true);

            try {
                const response = await fetch(`/api/plan/${planId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(buildPlanPayload(values)),
                });

                if (!response.ok) {
                    throw new Error(await parseErrorMessage(response));
                }

                const payload = (await response.json()) as ApiSuccessResponse<PlanItem>;

                setPlans((currentPlans) =>
                    currentPlans.map((plan) =>
                        plan.id === planId ? payload.data : plan
                    )
                );

                return payload.data;
            } finally {
                setIsSubmitting(false);
            }
        },
        []
    );

    const removePlan = useCallback(async (planId: string) => {
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/plan/${planId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(await parseErrorMessage(response));
            }

            setPlans((currentPlans) =>
                currentPlans.filter((plan) => plan.id !== planId)
            );
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return {
        plans,
        isRefreshing,
        isSubmitting,
        refreshPlans,
        addPlan,
        editPlan,
        removePlan,
    };
};
