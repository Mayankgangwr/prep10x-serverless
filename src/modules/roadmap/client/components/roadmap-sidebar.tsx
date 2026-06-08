import React from "react";
import Link from "next/link";
import {
    Target,
    TrendingUp,
    Briefcase,
    Award,
    ArrowRight,
    BrainCircuit
} from "lucide-react";
import { PreparationPlan, AnalysisSummary } from "../../types";

interface RoadmapSidebarProps {
    plan: PreparationPlan;
    analysisSummary: AnalysisSummary;
}

export const RoadmapSidebar: React.FC<RoadmapSidebarProps> = ({ plan, analysisSummary }) => {
    const activePhase = plan.phases.find(p => p.status !== "completed") || plan.phases[0];
    const targetWeek = activePhase?.weekNumber || 1;
    const isCompleted = activePhase?.status === "completed"; // if all are completed

    return (
        <div className="w-full lg:w-[35%] space-y-6">
            {/* Target Role Card */}
            <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                    <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Target Role</h3>
                <p className="text-xl font-extrabold text-text tracking-tight">{plan.targetRole}</p>
            </div>

            {/* Analysis Bento Box */}
            <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-elevated/50 p-5 border-b border-border/50 flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-xl text-accent">
                        <BrainCircuit className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-text tracking-tight text-lg">AI Analysis</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-primary mb-3 uppercase tracking-wider">
                            <TrendingUp className="w-4 h-4" />
                            Superpowers
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {analysisSummary.strengths.map((strength, i) => (
                                <span key={i} className="text-xs font-semibold bg-primary/5 text-primary/90 border border-primary/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    {strength}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4 border-t border-border/50">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-warning mb-3 uppercase tracking-wider">
                            <Briefcase className="w-4 h-4" />
                            Focus Areas
                        </h4>
                        <ul className="space-y-2.5">
                            {analysisSummary.criticalGaps.map((gap, i) => (
                                <li key={i} className="text-sm text-muted font-medium flex items-start gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0 shadow-[0_0_5px_rgba(var(--warning),0.5)]" />
                                    <span className="leading-snug">{gap}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Milestones Box */}
            {plan.mockInterviewCheckpoints && plan.mockInterviewCheckpoints.length > 0 && (
                <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold text-text mb-5 flex items-center gap-2 text-lg tracking-tight">
                        <Award className="w-5 h-5 text-accent" />
                        Mock Interviews
                    </h3>
                    <div className="space-y-3">
                        {plan.mockInterviewCheckpoints.map((mock, i) => (
                            <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl bg-elevated/50 border border-border/50 hover:border-primary/30 transition-colors group">
                                <div className="w-12 h-12 rounded-xl bg-surface border border-border flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                                    <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Wk</span>
                                    <span className="text-lg font-extrabold text-primary leading-none">{mock.weekNumber}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-text">{mock.type}</p>
                                    <p className="text-xs text-muted font-medium mt-0.5">{mock.focus}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* CTA Card (Ultra Modern) */}
            <div className="relative overflow-hidden rounded-3xl shadow-xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-90 transition-opacity group-hover:opacity-100" />
                <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                    <Target className="w-32 h-32 text-white" />
                </div>
                
                <div className="relative z-10 p-8 flex flex-col items-start justify-between h-full min-h-[220px]">
                    <div>
                        <h3 className="font-extrabold text-2xl text-white mb-2 tracking-tight">Ready to execute?</h3>
                        <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[200px]">
                            {isCompleted ? "You have completed your roadmap!" : `Start conquering Week ${targetWeek}. Log your progress daily.`}
                        </p>
                    </div>
                    <Link href={`/roadmap/week/${targetWeek}`} className="mt-6 bg-white/10 hover:bg-white text-white hover:text-primary backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl text-sm font-bold transition-all w-full flex items-center justify-center gap-2 group/btn shadow-lg">
                        {isCompleted ? "Review Week " + targetWeek : "Start Week " + targetWeek}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
