import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, Lightbulb, UserCheck, ShieldAlert, Cpu, Award, BookOpen } from "lucide-react";
import { SkillAnalysis as SkillAnalysisType } from "@/types";

type SkillAnalysisProps = {
  skills: SkillAnalysisType | null;
};

type TabType = "core" | "tools" | "soft";

const getProficiencyColor = (signal: string) => {
  switch (signal.toLowerCase()) {
    case "expert":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/25 shadow-xs";
    case "advanced":
      return "bg-teal-500/10 text-teal-500 border-teal-500/25 shadow-xs";
    case "intermediate":
      return "bg-blue-500/10 text-blue-500 border-blue-500/25 shadow-xs";
    default:
      return "bg-secondary text-secondary-foreground border-border/40";
  }
};

const getCriticalityColor = (crit: string) => {
  switch (crit.toLowerCase()) {
    case "must-have":
      return "bg-rose-500/10 text-rose-500 border-rose-500/25 shadow-xs";
    case "important":
      return "bg-amber-500/10 text-amber-500 border-amber-500/25 shadow-xs";
    default:
      return "bg-blue-500/10 text-blue-500 border-blue-500/25 shadow-xs";
  }
};

export const SkillAnalysis: React.FC<SkillAnalysisProps> = ({ skills }) => {
  const [activeTab, setActiveTab] = useState<TabType>("core");

  if (!skills) return null;

  const coreSkills = skills.coreSkills || { matched: [], missing: [] };
  const tools = skills.toolsAndPlatforms || { matched: [], missing: [] };
  const soft = skills.softSkills || { detected: [], gaps: [] };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "core", label: "Core Skills", icon: <Cpu size={14} /> },
    { id: "tools", label: "Tools & Tech", icon: <Award size={14} /> },
    { id: "soft", label: "Soft Signals", icon: <BookOpen size={14} /> },
  ];

  return (
    <div className="rounded-3xl border border-border/50 bg-surface/30 backdrop-blur-md p-6 shadow-lg space-y-6 text-left transition-all duration-300 hover:shadow-xl hover:border-primary/20">
      {/* Header & Glass Tab Selector */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border/40 pb-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-text">Capabilities & Tech Stack</h3>
          <p className="text-xs text-muted">Comparative breakdown of your capabilities vs target role</p>
        </div>
        
        {/* Custom Segmented Tab Controller */}
        <div className="flex p-1 rounded-2xl bg-surface/50 border border-border/40 self-start sm:self-auto shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                  : "text-muted hover:text-text hover:bg-surface/30"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        {/* Core Skills Tab */}
        {activeTab === "core" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Matched Core Skills */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-500">
                <CheckCircle2 size={16} />
                <span>Matched Core ({coreSkills.matched?.length || 0})</span>
              </div>
              <div className="space-y-3">
                {coreSkills.matched?.length > 0 ? (
                  coreSkills.matched.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/2 hover:bg-emerald-500/5 transition-all duration-300 space-y-2.5 shadow-2xs group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-sm text-text group-hover:text-emerald-500 transition-colors">
                          {item.skill}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded-lg border ${getProficiencyColor(item.proficiencySignal)}`}>
                          {item.proficiencySignal}
                        </span>
                      </div>
                      {item.evidenceFromResume && (
                        <p className="text-xs text-muted leading-relaxed pl-2.5 border-l-2 border-emerald-500/30 italic">
                          "{item.evidenceFromResume}"
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted italic p-4 border border-dashed border-border/40 rounded-2xl">
                    No matched core skills extracted.
                  </p>
                )}
              </div>
            </div>

            {/* Missing Core Skills */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-500">
                <AlertTriangle size={16} />
                <span>Critical Gaps ({coreSkills.missing?.length || 0})</span>
              </div>
              <div className="space-y-3">
                {coreSkills.missing?.length > 0 ? (
                  coreSkills.missing.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-border/40 bg-surface/40 hover:bg-surface/60 hover:-translate-y-0.5 transition-all duration-300 space-y-2.5 shadow-2xs group"
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-sm text-text group-hover:text-primary transition-colors">
                          {item.skill}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded-lg border ${getCriticalityColor(item.criticality)}`}>
                          {item.criticality}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10 text-amber-500 shrink-0">
                          <Lightbulb size={12} className="stroke-[2px]" />
                        </div>
                        <span>Est. Prep time: <strong className="text-text">{item.estimatedLearningDays} days</strong></span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted italic p-4 border border-dashed border-border/40 rounded-2xl">
                    All core target skills match!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tools & Platforms Tab */}
        {activeTab === "tools" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Matched Tools */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-500">
                <CheckCircle2 size={16} />
                <span>Matched Tools ({tools.matched?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tools.matched?.length > 0 ? (
                  tools.matched.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 shadow-3xs transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-500/10"
                    >
                      {tool}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-muted italic w-full p-4 border border-dashed border-border/40 rounded-2xl">
                    No matched tools identified.
                  </p>
                )}
              </div>
            </div>

            {/* Missing Tools */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-rose-500">
                <ShieldAlert size={16} />
                <span>Missing Tools ({tools.missing?.length || 0})</span>
              </div>
              <div className="space-y-3">
                {tools.missing?.length > 0 ? (
                  tools.missing.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3.5 rounded-2xl border border-border/40 bg-surface/40 hover:bg-surface/60 transition-all duration-300 text-sm shadow-2xs group"
                    >
                      <span className="font-bold text-text group-hover:text-primary transition-colors">{item.tool}</span>
                      <span className={`px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest rounded-md border ${getCriticalityColor(item.criticality)}`}>
                        {item.criticality}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted italic w-full p-4 border border-dashed border-border/40 rounded-2xl">
                    All target tools match!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Soft Skills Tab */}
        {activeTab === "soft" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Detected Soft Skills */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-500">
                <UserCheck size={16} />
                <span>Detected Strengths ({soft.detected?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {soft.detected?.length > 0 ? (
                  soft.detected.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 shadow-3xs transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-500/10"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-muted italic w-full p-4 border border-dashed border-border/40 rounded-2xl">
                    No soft skills extracted.
                  </p>
                )}
              </div>
            </div>

            {/* Soft Skills Gaps */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-500">
                <AlertTriangle size={16} />
                <span>Soft Gaps & Blocks ({soft.gaps?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {soft.gaps?.length > 0 ? (
                  soft.gaps.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500/5 text-amber-500 border border-amber-500/10 shadow-3xs transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-500/10"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-muted italic w-full p-4 border border-dashed border-border/40 rounded-2xl">
                    No soft skill gaps identified.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
