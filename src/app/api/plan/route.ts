import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { handleApiError, successResponse, failedResponse } from "@/lib/api";
import { createUserPlan, getUserPlans } from "@/modules/plan/service";
import { planCreateSchema } from "@/modules/plan/validation";

export const runtime = "nodejs";

const unauthorizedResponse = () =>
    failedResponse("UNAUTHORIZED", "You must be signed in to manage plans.", 401);

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return unauthorizedResponse();
        }

        const plans = await getUserPlans(session.user.id);

        return successResponse(plans);
    } catch (error) {
        return handleApiError(error, {
            fallbackCode: "PLANS_FETCH_FAILED",
            fallbackMessage: "Failed to fetch plans.",
        });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return unauthorizedResponse();
        }

        const body = await request.json();
        const parsed = planCreateSchema.safeParse(body);

        if (!parsed.success) {
            return failedResponse(
                "VALIDATION_ERROR",
                "Invalid plan data.",
                400,
                parsed.error.flatten()
            );
        }

        const plan = await createUserPlan(session.user.id, parsed.data);

        return successResponse(plan, 201);
    } catch (error) {
        return handleApiError(error, {
            fallbackCode: "PLAN_CREATE_FAILED",
            fallbackMessage: "Failed to create plan.",
        });
    }
}
