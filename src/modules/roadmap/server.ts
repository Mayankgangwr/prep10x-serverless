import prisma from "@/lib/prisma/client";
import { PreparationPlan } from "./schemas";
import { AnalysisSummary } from "./types";

export interface RoadmapDataResponse {
    plan: PreparationPlan | null;
    analysisSummary: AnalysisSummary | null;
}

export async function getRoadmapData(userId: string): Promise<RoadmapDataResponse> {
    const roadmap = await prisma.preparationPlan.findFirst({
        where: { userId, softDeleted: false },
        orderBy: { createdAt: "desc" }
    });

    if (!roadmap) {
        return { plan: null, analysisSummary: null };
    }

    const analysis = await prisma.resumeAnalysis.findFirst({
        where: { resumeId: roadmap.resumeId },
        orderBy: { createdAt: "desc" }
    });

    const planData = roadmap.planData as any;
    
    const plan: PreparationPlan = {
        id: roadmap.id,
        analysisId: roadmap.resumeId,
        targetRole: roadmap.targetRole,
        totalWeeks: roadmap.durationWeeks,
        overview: planData?.planMeta?.overallStrategy || planData?.planMeta?.planTheme || "Your personalized interview preparation roadmap.",
        createdAt: roadmap.createdAt.toISOString(),
        updatedAt: roadmap.updatedAt.toISOString(),
        phases: planData?.weeklyPlan?.map((week: any, index: number) => ({
            weekNumber: week.week,
            title: week.weekTheme || `Week ${week.week}`,
            focusArea: week.focusArea || "Technical Core",
            description: week.weekObjective || "",
            topicsToCover: week.topics?.map((t: any) => t.title) || [],
            resources: week.topics?.filter((t: any) => t.resourceType).map((t: any) => ({
                title: t.title,
                type: t.resourceType,
                url: "#"
            })) || [],
            status: index === 0 ? "in_progress" : "pending",
            generatedDailyPlan: week.generatedDailyPlan
        })) || [],
        mockInterviewCheckpoints: planData?.mockInterviewSchedule?.map((mock: any) => ({
            weekNumber: mock.week,
            type: mock.type,
            focus: mock.focus
        })) || []
    };

    const analysisSummary: AnalysisSummary = {
        strengths: analysis?.strengths || ["General Software Engineering"],
        criticalGaps: (analysis?.insights as any)?.skillAnalysis?.coreSkills?.missing?.map((g: any) => g.skill) || ["Advanced algorithms"]
    };

    return { plan, analysisSummary };
}
