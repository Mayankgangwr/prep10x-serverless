import React from "react";
import { Award, Compass, MessageSquare, ClipboardCheck, AlertCircle } from "lucide-react";
import { HiringRecommendation as RecType } from "@/types";

type RecommendationCardProps = {
  recommendation: RecType | null;
  readinessLevel: string | null;
  readinessRationale: string | null;
};

const getVerdictStyles = (verdict: string) => {
  switch (verdict.toLowerCase()) {
    case "strong hire":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-emerald-500/5 hover:bg-emerald-500/20";
    case "hire":
      return "bg-teal-500/10 text-teal-500 border-teal-500/30 shadow-teal-500/5 hover:bg-teal-500/20";
    case "hire with conditions":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-amber-500/5 hover:bg-amber-500/20";
    case "hold":
      return "bg-orange-500/10 text-orange-500 border-orange-500/30 shadow-orange-500/5 hover:bg-orange-500/20";
    default:
      return "bg-rose-500/10 text-rose-500 border-rose-500/30 shadow-rose-500/5 hover:bg-rose-500/20";
  }
};

const getReadinessStyles = (level: string) => {
  switch (level.toLowerCase()) {
    case "high":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20";
    case "medium-high":
      return "bg-teal-500/10 text-teal-500 border-teal-500/30 hover:bg-teal-500/20";
    case "medium":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20";
    case "medium-low":
      return "bg-orange-500/10 text-orange-500 border-orange-500/30 hover:bg-orange-500/20";
    default:
      return "bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500/20";
  }
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  readinessLevel,
  readinessRationale,
}) => {
  if (!recommendation && !readinessLevel) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 text-left">
      {/* Role Readiness Assessment */}
      {readinessLevel && (
        <div className="p-6 rounded-3xl border border-border/50 bg-surface/30 backdrop-blur-md shadow-lg space-y-4 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                <Compass size={22} className="stroke-[2px]" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-text">Role Readiness</h3>
                <p className="text-xs text-muted">Onboarding & ramp-up estimate</p>
              </div>
            </div>
            <span className={`px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border shadow-xs transition-all duration-300 ${getReadinessStyles(readinessLevel)}`}>
              {readinessLevel} Ready
            </span>
          </div>

          {readinessRationale && (
            <div className="p-4 rounded-2xl bg-surface/40 border border-border/40 text-sm text-text leading-relaxed hover:bg-surface/60 transition-colors">
              {readinessRationale}
            </div>
          )}
        </div>
      )}

      {/* Hiring Decision & Focus Areas */}
      {recommendation && (
        <div className="p-6 rounded-3xl border border-border/50 bg-surface/30 backdrop-blur-md shadow-lg space-y-5 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                <Award size={22} className="stroke-[2px]" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-text">AI Verdict</h3>
                <p className="text-xs text-muted">Hiring recommendation summary</p>
              </div>
            </div>
            <span className={`px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border shadow-xs transition-all duration-300 ${getVerdictStyles(recommendation.verdict)}`}>
              {recommendation.verdict}
            </span>
          </div>

          {/* Verdict Conditions */}
          {recommendation.conditionsIfAny && (
            <div className="flex gap-2.5 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-text leading-relaxed">
              <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-500">Verdict Conditions:</strong>{" "}
                <span className="text-muted">{recommendation.conditionsIfAny}</span>
              </div>
            </div>
          )}

          {/* Interview Focus Areas */}
          {recommendation.suggestedInterviewFocusAreas &&
            recommendation.suggestedInterviewFocusAreas.length > 0 && (
              <div className="space-y-3 pt-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted flex items-center gap-2">
                  <ClipboardCheck size={14} className="text-primary" />
                  <span>Interview Focus Areas</span>
                </span>
                <div className="grid gap-3">
                  {recommendation.suggestedInterviewFocusAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface/40 border border-border/40 text-xs text-text leading-relaxed hover:bg-surface/60 hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 transition-transform group-hover:scale-110">
                        <MessageSquare size={12} className="stroke-[2px]" />
                      </div>
                      <span className="mt-0.5 font-medium">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};
