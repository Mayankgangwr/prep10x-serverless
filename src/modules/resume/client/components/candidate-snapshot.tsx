import React from "react";
import { Briefcase, Layers, Cpu, Award, Calendar, Sparkles } from "lucide-react";
import { CandidateSnapshot as SnapshotType } from "@/types";

type CandidateSnapshotProps = {
  snapshot: SnapshotType | null;
};

export const CandidateSnapshot: React.FC<CandidateSnapshotProps> = ({ snapshot }) => {
  if (!snapshot) return null;

  return (
    <div className="rounded-3xl border border-border/50 bg-surface/30 backdrop-blur-md p-6 shadow-lg space-y-6 text-left transition-all duration-300 hover:shadow-xl hover:border-primary/20">
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
          <Briefcase size={22} className="stroke-[2px]" />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-tight text-text">Profile Snapshot</h3>
          <p className="text-xs text-muted">Extracted candidate metrics and signals</p>
        </div>
      </div>

      {/* Grid of Key Info */}
      <div className="grid gap-4 grid-cols-2">
        {/* Current Title */}
        <div className="p-4 rounded-2xl border border-border/40 bg-surface/40 hover:bg-surface/60 transition-all duration-300 space-y-1.5 hover:shadow-xs group">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
            <Sparkles size={12} className="text-primary group-hover:scale-110 transition-transform" />
            <span>Title</span>
          </div>
          <span className="text-sm font-bold text-text line-clamp-1 group-hover:text-primary transition-colors">
            {snapshot.currentTitle || "N/A"}
          </span>
        </div>

        {/* Total Experience */}
        <div className="p-4 rounded-2xl border border-border/40 bg-surface/40 hover:bg-surface/60 transition-all duration-300 space-y-1.5 hover:shadow-xs group">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
            <Calendar size={12} className="text-primary group-hover:scale-110 transition-transform" />
            <span>Experience</span>
          </div>
          <span className="text-sm font-bold text-text group-hover:text-primary transition-colors">
            {snapshot.totalYearsExperience !== undefined ? `${snapshot.totalYearsExperience} Years` : "N/A"}
          </span>
        </div>

        {/* Seniority Signal */}
        <div className="p-4 rounded-2xl border border-border/40 bg-surface/40 hover:bg-surface/60 transition-all duration-300 space-y-1.5 hover:shadow-xs group">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
            <Award size={12} className="text-primary group-hover:scale-110 transition-transform" />
            <span>Seniority</span>
          </div>
          <span className="text-sm font-bold text-text group-hover:text-primary transition-colors">
            {snapshot.senioritySignal || "Unclear"}
          </span>
        </div>

        {/* Domains Focus */}
        <div className="p-4 rounded-2xl border border-border/40 bg-surface/40 hover:bg-surface/60 transition-all duration-300 space-y-1.5 hover:shadow-xs group">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
            <Layers size={12} className="text-primary group-hover:scale-110 transition-transform" />
            <span>Domain Focus</span>
          </div>
          <span className="text-sm font-bold text-text line-clamp-1 group-hover:text-primary transition-colors">
            {snapshot.industryDomains?.join(", ") || "General"}
          </span>
        </div>
      </div>

      {/* Tech Stack & Industry Tags */}
      <div className="space-y-5 pt-1">
        {/* Primary Tech Stack */}
        {snapshot.primaryTechStack && snapshot.primaryTechStack.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
              <Cpu size={14} className="text-primary" />
              <span>Primary Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {snapshot.primaryTechStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/10 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/20 hover:border-primary/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Industry Domains */}
        {snapshot.industryDomains && snapshot.industryDomains.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
              <Layers size={14} className="text-accent-foreground" />
              <span>Target Industry Domains</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {snapshot.industryDomains.map((domain) => (
                <span
                  key={domain}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-secondary/50 text-secondary-foreground border border-border/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:border-primary/20"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
