import React from "react";
import { Container } from "@/components/ui/container";
import { Sparkles, Target } from "lucide-react";
import { RoadmapTimeline } from "./components/roadmap-timeline";
import { RoadmapSidebar } from "./components/roadmap-sidebar";
import { PreparationPlan, AnalysisSummary } from "../types";

interface RoadmapViewProps {
    plan: PreparationPlan;
    analysisSummary: AnalysisSummary;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ plan, analysisSummary }) => {
    const completedWeeks = plan.phases.filter(p => p.status === "completed").length;
    const progressPercentage = Math.round((completedWeeks / plan.totalWeeks) * 100) || 0;

    return (
        <Container className="px-0 md:px-4 py-8 max-w-7xl mx-auto">
            <div className="space-y-12">
                {/* Hero Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

                    <div className="space-y-2 z-10 relative">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2 border border-primary/20 backdrop-blur-md">
                            <Sparkles className="w-4 h-4" />
                            AI-Generated Plan
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text">
                            Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Roadmap</span>
                        </h1>
                        <p className="text-muted text-lg max-w-2xl">
                            {plan.overview}
                        </p>
                    </div>

                    {/* Progress Widget */}
                    <div className="w-full md:w-auto min-w-[280px] bg-surface/60 backdrop-blur-xl border border-border/50 p-5 rounded-3xl shadow-sm z-10 relative overflow-hidden group hover:border-primary/30 transition-colors">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-[30px] -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
                        <div className="flex justify-between w-full mb-3 text-sm font-bold">
                            <span className="text-text flex items-center gap-2">
                                <Target className="w-4 h-4 text-primary" /> Progress
                            </span>
                            <span className="text-primary">{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-border/40 rounded-full h-3 overflow-hidden relative">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                style={{ width: `${progressPercentage}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', transform: 'skewX(-20deg)' }} />
                            </div>
                        </div>
                        <p className="text-xs text-muted mt-3 font-medium">
                            {completedWeeks} of {plan.totalWeeks} modules unlocked
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <RoadmapTimeline plan={plan} />
                    <RoadmapSidebar plan={plan} analysisSummary={analysisSummary} />
                </div>
            </div>
        </Container>
    );
};
