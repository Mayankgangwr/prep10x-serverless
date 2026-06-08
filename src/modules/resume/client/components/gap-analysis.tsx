import React from "react";
import { Check, X, ShieldAlert, Sparkles, HelpCircle, AlertCircle, ArrowUpRight } from "lucide-react";
import { ExperienceGapAnalysis as GapType } from "@/types";

type GapAnalysisProps = {
  gapAnalysis: GapType | null;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
};

export const GapAnalysis: React.FC<GapAnalysisProps> = ({
  gapAnalysis,
  strengths,
  weaknesses,
  suggestions,
}) => {
  return (
    <div className="space-y-8 text-left">
      {/* Experience Gap & Overview */}
      {gapAnalysis && (
        <div className="p-6 rounded-3xl border border-border/50 bg-surface/30 backdrop-blur-md shadow-lg space-y-5 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <ShieldAlert size={22} className="stroke-[2px]" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-text">Experience Gap Analysis</h3>
              <p className="text-xs text-muted">Core background match relative to expected experience level</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-2xl bg-surface/50 border border-border/40 hover:bg-surface/70 transition-colors">
            <div className="space-y-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Experience Differential</span>
              <p className="text-sm text-text font-medium leading-relaxed max-w-md">
                {gapAnalysis.summary}
              </p>
            </div>
            <div className={`px-4.5 py-3 rounded-xl border font-black text-center shrink-0 shadow-xs ${
              gapAnalysis.yearsGapVsExpected > 0 
                ? "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5"
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5"
            }`}>
              <div className="text-2xl tracking-tight">
                {gapAnalysis.yearsGapVsExpected > 0 ? `+${gapAnalysis.yearsGapVsExpected}` : "0"}
              </div>
              <div className="text-[9px] uppercase tracking-widest font-extrabold mt-0.5">
                {gapAnalysis.yearsGapVsExpected > 0 ? "Years Needed" : "Gap Met"}
              </div>
            </div>
          </div>

          {/* Critical Gaps list */}
          {gapAnalysis.criticalGaps && gapAnalysis.criticalGaps.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted block">
                Critical Areas to Address
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                {gapAnalysis.criticalGaps.map((gap, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-xs text-text leading-relaxed">
                    <X size={14} className="mt-0.5 shrink-0 text-rose-500" />
                    <span className="font-medium text-text/90">{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Strengths & Weaknesses Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strengths Card */}
        <div className="p-6 rounded-3xl border border-emerald-500/10 bg-emerald-500/2 shadow-lg space-y-4 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300">
          <h3 className="text-base font-bold tracking-tight text-emerald-500 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 shadow-xs shrink-0">
              <Check size={16} className="stroke-[3px]" />
            </div>
            <span>Core Strengths & Assets</span>
          </h3>
          <ul className="space-y-3">
            {strengths && strengths.length > 0 ? (
              strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-text leading-relaxed group">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                    <Check className="stroke-[3px]" size={10} />
                  </div>
                  <span className="font-medium">{str}</span>
                </li>
              ))
            ) : (
              <p className="text-xs text-muted italic">No key strengths listed.</p>
            )}
          </ul>
        </div>

        {/* Weaknesses Card */}
        <div className="p-6 rounded-3xl border border-rose-500/10 bg-rose-500/2 shadow-lg space-y-4 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all duration-300">
          <h3 className="text-base font-bold tracking-tight text-rose-500 flex items-center gap-2 border-b border-rose-500/10 pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 shadow-xs shrink-0">
              <X size={16} className="stroke-[3px]" />
            </div>
            <span>Improvement Gaps</span>
          </h3>
          <ul className="space-y-3">
            {weaknesses && weaknesses.length > 0 ? (
              weaknesses.map((weak, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-text leading-relaxed group">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                    <X className="stroke-[3px]" size={10} />
                  </div>
                  <span className="font-medium">{weak}</span>
                </li>
              ))
            ) : (
              <p className="text-xs text-muted italic">No significant weaknesses noted.</p>
            )}
          </ul>
        </div>
      </div>

      {/* AI Tips & Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="p-6 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/2 to-transparent shadow-lg space-y-4 transition-all duration-300 hover:shadow-xl hover:border-primary/30">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary">
            <Sparkles size={16} className="animate-pulse" />
            <span>Actionable AI Optimization Tips</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {suggestions.map((sug, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-surface/50 border border-border/40 text-xs leading-relaxed text-text hover:bg-surface/80 hover:-translate-y-0.5 transition-all duration-300 group shadow-2xs">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 transition-transform group-hover:scale-110">
                  <HelpCircle size={13} className="stroke-[2.5px]" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-text group-hover:text-primary transition-colors flex items-center gap-1">
                    Suggestion #{idx + 1}
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <p className="text-muted leading-normal">{sug}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
