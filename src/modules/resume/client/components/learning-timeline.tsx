import React from "react";
import { BookOpen, Calendar, CheckSquare, ListOrdered, Link2, ChevronRight, Award, Compass } from "lucide-react";
import { LearningPlanFoundation as PlanType } from "@/types";

type LearningTimelineProps = {
  plan: PlanType | null;
};

const getPriorityColor = (prio: string) => {
  switch (prio.toLowerCase()) {
    case "critical":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5";
    case "high":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5";
    case "medium":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/5";
    default:
      return "bg-secondary text-secondary-foreground border-border/40";
  }
};

export const LearningTimeline: React.FC<LearningTimelineProps> = ({ plan }) => {
  if (!plan) return null;

  return (
    <div className="space-y-6 text-left">
      {/* Overview Block */}
      <div className="p-6 rounded-3xl border border-border/50 bg-surface/30 backdrop-blur-md shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <BookOpen size={22} className="stroke-[2px]" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-text">Upskilling Roadmap</h3>
            <p className="text-xs text-muted">Custom curriculum mapped from your skill gaps</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/15 shadow-2xs">
          <Calendar size={16} className="text-primary animate-pulse" />
          <span className="text-sm font-bold text-text">
            {plan.totalLearningDays} Prep Days Required
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Study Areas & Sequence (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Prioritized Areas */}
          {plan.prioritizedLearningAreas && plan.prioritizedLearningAreas.length > 0 && (
            <div className="p-5 rounded-3xl border border-border/50 bg-surface/30 backdrop-blur-md shadow-lg space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted">
                Prioritized Focus Areas
              </h4>
              <div className="space-y-4">
                {plan.prioritizedLearningAreas.map((area, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-border/40 bg-surface/40 hover:bg-surface/60 transition-all duration-300 space-y-3 shadow-2xs">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-xs text-text leading-snug">{area.area}</span>
                      <span className={`px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest rounded-md border ${getPriorityColor(area.priority)}`}>
                        {area.priority}
                      </span>
                    </div>
                    {area.why && (
                      <p className="text-[11px] text-muted leading-relaxed">
                        {area.why}
                      </p>
                    )}
                    {area.suggestedResources && area.suggestedResources.length > 0 && (
                      <div className="pt-2 border-t border-border/30 space-y-1.5">
                        <span className="text-[9px] font-extrabold text-muted uppercase tracking-widest flex items-center gap-1">
                          <Link2 size={10} className="text-primary" /> Curated Syllabus
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {area.suggestedResources.map((res, rIdx) => (
                            <div
                              key={rIdx}
                              className="flex items-center justify-between p-2 rounded-xl bg-surface/50 border border-border/30 hover:border-primary/30 text-[10px] text-primary font-bold group cursor-pointer transition-all hover:bg-surface"
                            >
                              <span className="truncate max-w-[150px]">{res}</span>
                              <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Sequence */}
          {plan.recommendedLearningSequence && plan.recommendedLearningSequence.length > 0 && (
            <div className="p-5 rounded-3xl border border-border/50 bg-surface/30 backdrop-blur-md shadow-lg space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted flex items-center gap-2">
                <ListOrdered size={14} className="text-primary" />
                <span>Recommended Order</span>
              </h4>
              <div className="space-y-3 relative pl-4.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-border/60">
                {plan.recommendedLearningSequence.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-2.5 py-0.5 group">
                    <span className="absolute -left-[24px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-surface border border-border text-[9px] font-bold text-muted transition-colors group-hover:border-primary group-hover:text-primary">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-text leading-tight">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Milestone checkpoints timeline (2/3 width) */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-border/50 bg-surface/30 backdrop-blur-md shadow-lg space-y-6">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted flex items-center gap-2">
            <CheckSquare size={14} className="text-primary" />
            <span>Week-by-Week Milestones</span>
          </h4>

          {plan.milestone_checkpoints && plan.milestone_checkpoints.length > 0 ? (
            <div className="relative pl-7 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-border/20">
              {plan.milestone_checkpoints.map((checkpoint, idx) => (
                <div key={idx} className="relative group">
                  {/* Glowing vertical marker */}
                  <span className="absolute -left-[35px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-surface border-2 border-primary text-[10px] font-black text-primary transition-all duration-300 group-hover:scale-110 shadow-[0_0_8px_rgba(var(--primary),0.2)]">
                    W{checkpoint.week}
                  </span>

                  <div className="p-5 rounded-2xl border border-border/40 bg-surface/40 hover:bg-surface/60 transition-all duration-300 space-y-3.5 shadow-2xs hover:border-primary/20 hover:shadow-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                        Week {checkpoint.week} Objective
                      </span>
                      <h5 className="font-bold text-sm text-text leading-relaxed">
                        {checkpoint.goalDescription}
                      </h5>
                    </div>
                    {checkpoint.successCriteria && (
                      <div className="mt-2.5 pt-3 border-t border-border/30 space-y-1.5">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                          <Award size={12} className="stroke-[2.5px]" />
                          Success Condition
                        </span>
                        <p className="text-xs text-muted leading-relaxed pl-2 border-l border-emerald-500/30 italic">
                          {checkpoint.successCriteria}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted italic">No milestones defined.</p>
          )}
        </div>
      </div>
    </div>
  );
};
