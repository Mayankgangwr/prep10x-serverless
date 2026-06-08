import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { failedResponse, successResponse } from "@/lib/api";
import prisma from "@/lib/prisma/client";
import { DayStatus } from "@/generated/prisma/client";

export const runtime = "nodejs";

export async function POST(
    request: Request,
    props: { params: Promise<{ weekNumber: string }> }
) {
    try {
        const params = await props.params;
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return failedResponse("UNAUTHORIZED", "You must be signed in.", 401);
        }

        const weekNum = parseInt(params.weekNumber, 10);
        if (isNaN(weekNum) || weekNum < 1) {
            return failedResponse("INVALID_WEEK", "Invalid week number.", 400);
        }

        const body = await request.json();
        const { dayNumber } = body;

        if (!dayNumber || dayNumber < 1 || dayNumber > 5) {
            return failedResponse("INVALID_DAY", "Day number must be between 1 and 5.", 400);
        }

        // Find the user's active roadmap
        const roadmap = await prisma.preparationPlan.findFirst({
            where: { userId: session.user.id, softDeleted: false },
            orderBy: { createdAt: "desc" },
        });

        if (!roadmap) {
            return failedResponse("NOT_FOUND", "No active roadmap found.", 404);
        }

        const absoluteDay = (weekNum - 1) * 5 + dayNumber;

        // Upsert the day record
        const day = await prisma.preparationPlanDay.upsert({
            where: {
                planId_absoluteDay: {
                    planId: roadmap.id,
                    absoluteDay,
                },
            },
            create: {
                planId: roadmap.id,
                weekNumber: weekNum,
                dayNumber,
                absoluteDay,
                status: DayStatus.completed,
                startedAt: new Date(),
                completedAt: new Date(),
            },
            update: {
                status: DayStatus.completed,
                completedAt: new Date(),
            },
        });

        // Update denormalized counts on PreparationPlan
        const completedCount = await prisma.preparationPlanDay.count({
            where: { planId: roadmap.id, status: DayStatus.completed },
        });

        const skippedCount = await prisma.preparationPlanDay.count({
            where: { planId: roadmap.id, status: DayStatus.skipped },
        });

        const percentage = roadmap.totalDays > 0
            ? parseFloat(((completedCount / roadmap.totalDays) * 100).toFixed(2))
            : 0;

        // Calculate streak
        const allDays = await prisma.preparationPlanDay.findMany({
            where: { planId: roadmap.id },
            orderBy: { absoluteDay: "desc" },
            select: { absoluteDay: true, status: true },
        });

        let currentStreak = 0;
        for (const d of allDays) {
            if (d.status === DayStatus.completed) {
                currentStreak++;
            } else {
                break;
            }
        }

        const isAllCompleted = completedCount >= roadmap.totalDays;

        await prisma.preparationPlan.update({
            where: { id: roadmap.id },
            data: {
                completedDays: completedCount,
                skippedDays: skippedCount,
                percentage,
                currentStreak,
                longestStreak: Math.max(roadmap.longestStreak, currentStreak),
                lastActivityAt: new Date(),
                ...(isAllCompleted
                    ? { planStatus: "completed", completedAt: new Date() }
                    : { planStatus: "in_progress" }),
            },
        });

        return successResponse({
            day,
            progress: {
                completedDays: completedCount,
                totalDays: roadmap.totalDays,
                percentage,
                currentStreak,
                longestStreak: Math.max(roadmap.longestStreak, currentStreak),
            },
        });
    } catch (error: any) {
        console.error("[complete-day]", error);
        return failedResponse("INTERNAL_ERROR", error.message, 500);
    }
}

// GET: fetch completion status for all days in a week
export async function GET(
    request: Request,
    props: { params: Promise<{ weekNumber: string }> }
) {
    try {
        const params = await props.params;
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return failedResponse("UNAUTHORIZED", "You must be signed in.", 401);
        }

        const weekNum = parseInt(params.weekNumber, 10);

        const roadmap = await prisma.preparationPlan.findFirst({
            where: { userId: session.user.id, softDeleted: false },
            orderBy: { createdAt: "desc" },
        });

        if (!roadmap) {
            return failedResponse("NOT_FOUND", "No active roadmap found.", 404);
        }

        const days = await prisma.preparationPlanDay.findMany({
            where: { planId: roadmap.id, weekNumber: weekNum },
            orderBy: { dayNumber: "asc" },
        });

        return successResponse({
            days,
            progress: {
                completedDays: roadmap.completedDays,
                totalDays: roadmap.totalDays,
                percentage: roadmap.percentage,
                currentStreak: roadmap.currentStreak,
                longestStreak: roadmap.longestStreak,
            },
        });
    } catch (error: any) {
        console.error("[get-day-progress]", error);
        return failedResponse("INTERNAL_ERROR", error.message, 500);
    }
}
