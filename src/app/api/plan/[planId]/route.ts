import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { failedResponse, handleApiError, successResponse } from "@/lib/api";
import { deleteUserPlan, updateUserPlan } from "@/modules/plan/service";
import { planIdSchema, planUpdateSchema } from "@/modules/plan/validation";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const unauthorizedResponse = () =>
    failedResponse("UNAUTHORIZED", "You must be signed in to manage plans.", 401);

export async function PATCH(
    request: Request,
    context: { params: { planId: string } }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return unauthorizedResponse();
        }

        const { planId } = context.params;
        const planIdResult = planIdSchema.safeParse({ planId });

        if (!planIdResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Invalid plan id.",
                        details: planIdResult.error.flatten(),
                    },
                },
                { status: 400 }
            );
        }

        const body = await request.json();
        const parsed = planUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Invalid plan data.",
                        details: parsed.error.flatten(),
                    },
                },
                { status: 400 }
            );
        }

        const plan = await updateUserPlan(
            session.user.id,
            planIdResult.data.planId,
            parsed.data
        );

        if (!plan) {
            return failedResponse("PLAN_NOT_FOUND", "Plan not found.", 404);
        }

        return successResponse(plan);
    } catch (error) {
        return handleApiError(error, {
            fallbackCode: "PLAN_UPDATE_FAILED",
            fallbackMessage: "Failed to update plan.",
        });
    }
}

export async function DELETE(
    _request: Request,
    context: { params: { planId: string } }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return unauthorizedResponse();
        }

        const { planId } = context.params;
        const planIdResult = planIdSchema.safeParse({ planId });

        if (!planIdResult.success) {
            return failedResponse(
                "VALIDATION_ERROR",
                "Invalid plan id.",
                400,
                planIdResult.error.flatten()
            );
        }

        const deleted = await deleteUserPlan(
            session.user.id,
            planIdResult.data.planId
        );

        if (!deleted) {
            return failedResponse("PLAN_NOT_FOUND", "Plan not found.", 404);
        }

        return successResponse({ planId: planIdResult.data.planId });
    } catch (error) {
        return handleApiError(error, {
            fallbackCode: "PLAN_DELETE_FAILED",
            fallbackMessage: "Failed to delete plan.",
        });
    }
}
