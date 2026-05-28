import prisma from "@/lib/prisma/client";
import type { Prisma } from "@/generated/prisma/client";

export const planSelect = {
    id: true,
    userId: true,
    name: true,
    price: true,
    billingCycle: true,
    description: true,
    features: true,
    status: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.PlanSelect;

export const findPlansByUserId = async (userId: string) =>
    prisma.plan.findMany({
        where: { userId },
        orderBy: [{ createdAt: "desc" }],
        select: planSelect,
    });

export const findPlanByIdAndUserId = async (planId: string, userId: string) =>
    prisma.plan.findFirst({
        where: {
            id: planId,
            userId,
        },
        select: planSelect,
    });

export const createPlanForUser = async (
    userId: string,
    data: Pick<
        Prisma.PlanUncheckedCreateInput,
        "name" | "price" | "billingCycle" | "description" | "features" | "status"
    >
) =>
    prisma.plan.create({
        data: {
            userId,
            ...data,
        },
        select: planSelect,
    });

export const updatePlanForUser = async (
    planId: string,
    userId: string,
    data: Pick<
        Prisma.PlanUpdateManyMutationInput,
        "name" | "price" | "billingCycle" | "description" | "features" | "status"
    >
) =>
    prisma.plan.updateMany({
        where: {
            id: planId,
            userId,
        },
        data,
    });

export const deletePlanForUser = async (planId: string, userId: string) =>
    prisma.plan.deleteMany({
        where: {
            id: planId,
            userId,
        },
    });
