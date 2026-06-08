import React from "react";
import Link from "next/link";
import {
    CheckCircle2,
    PlayCircle,
    BookOpen,
    Code,
    Monitor,
    CheckSquare,
    Zap
} from "lucide-react";
import { PreparationPlan } from "../../types";

const getResourceIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("video")) return <PlayCircle className="w-4 h-4 text-blue-500" />;
    if (t.includes("article") || t.includes("blog") || t.includes("docs")) return <BookOpen className="w-4 h-4 text-emerald-500" />;
    if (t.includes("practice") || t.includes("exercise") || t.includes("hands-on")) return <Code className="w-4 h-4 text-orange-500" />;
    if (t.includes("book")) return <BookOpen className="w-4 h-4 text-purple-500" />;
    return <Monitor className="w-4 h-4 text-primary" />;
};

interface RoadmapTimelineProps {
    plan: PreparationPlan;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ plan }) => {
    return (
        <div className="w-full lg:w-[65%] space-y-8 relative">
            {/* Connecting Line */}
            <div className="absolute left-[27px] top-4 bottom-10 w-0.5 bg-gradient-to-b from-primary via-border to-transparent" />

            {plan.phases.map((phase) => (
                <div key={phase.weekNumber} className="relative pl-16 group">
                    {/* Timeline Node */}
                    <div className={`absolute left-0 top-5 w-14 h-14 rounded-2xl flex items-center justify-center border-2 z-10 transition-all duration-300 shadow-sm
                        ${phase.status === 'completed' ? 'bg-primary/10 border-primary text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white' :
                          phase.status === 'in_progress' ? 'bg-surface border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] animate-pulse' :
                          'bg-surface border-border text-muted group-hover:border-primary/50'}`}
                    >
                        {phase.status === 'completed' ? (
                            <CheckCircle2 className="w-6 h-6" />
                        ) : phase.status === 'in_progress' ? (
                            <Zap className="w-6 h-6 fill-current" />
                        ) : (
                            <span className="font-bold text-lg">{phase.weekNumber}</span>
                        )}
                    </div>

                    {/* Phase Card (Bento Style) */}
                    <div className={`relative bg-surface/40 backdrop-blur-md rounded-3xl border transition-all duration-300 overflow-hidden
                        ${phase.status === 'in_progress' ? 'border-primary/50 shadow-xl shadow-primary/5' :
                          phase.status === 'completed' ? 'border-border/60 opacity-80 hover:opacity-100' :
                          'border-border/40 hover:border-border hover:shadow-md'}`}
                    >
                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full
                                        ${phase.status === 'completed' ? 'bg-primary/10 text-primary' :
                                          phase.status === 'in_progress' ? 'bg-primary text-white shadow-lg shadow-primary/30' :
                                          'bg-elevated text-muted border border-border'}`}
                                    >
                                        {phase.focusArea}
                                    </span>
                                </div>
                                
                                <div>
                                    <Link href={`/roadmap/week/${phase.weekNumber}`} className="group-hover:text-primary transition-colors inline-block">
                                        <h3 className="text-2xl font-bold text-text mb-2 tracking-tight">
                                            {phase.title}
                                        </h3>
                                    </Link>
                                    <p className="text-muted text-sm leading-relaxed">
                                        {phase.description}
                                    </p>
                                </div>

                                {/* Topics List */}
                                <div className="grid grid-cols-1 gap-2 pt-2">
                                    {phase.topicsToCover.map((topic, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-text/80 font-medium">
                                            <div className={`mt-0.5 rounded-full p-0.5 ${phase.status === 'completed' ? 'bg-primary/20 text-primary' : 'bg-border/50 text-muted'}`}>
                                                <CheckSquare className="w-3 h-3" />
                                            </div>
                                            {topic}
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="pt-4 mt-2 border-t border-border/50">
                                    <Link href={`/roadmap/week/${phase.weekNumber}`} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-white bg-primary/10 hover:bg-primary px-4 py-2 rounded-xl transition-all">
                                        Open Daily Plan <Zap className="w-4 h-4 fill-current" />
                                    </Link>
                                </div>
                            </div>

                            {/* Resources Sidebar within Card */}
                            {phase.resources && phase.resources.length > 0 && (
                                <div className="md:w-64 flex-shrink-0 bg-elevated/50 rounded-2xl p-4 border border-border/50 h-fit">
                                    <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Learn & Practice</h4>
                                    <div className="flex flex-col gap-2">
                                        {phase.resources.map((resource, i) => (
                                            <a key={i} href={resource.url} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface border border-transparent hover:border-border transition-all group/link">
                                                <div className="p-1.5 rounded-lg bg-surface group-hover/link:bg-elevated transition-colors border border-border/50">
                                                    {getResourceIcon(resource.type)}
                                                </div>
                                                <span className="text-xs font-semibold text-text/90 group-hover/link:text-primary line-clamp-2">
                                                    {resource.title}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
