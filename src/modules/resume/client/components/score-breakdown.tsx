import React, { useEffect, useState } from "react";
import { ResumeScoreBreakdown, RoleFitBreakdown } from "@/types";
import { Award, CheckCircle2 } from "lucide-react";

type ScoreBreakdownProps = {
  resumeScore: number | null;
  roleFitScore: number | null;
  resumeBreakdown: ResumeScoreBreakdown | null;
  roleFitBreakdown: RoleFitBreakdown | null;
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-500 stroke-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 60) return "text-amber-500 stroke-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-rose-500 stroke-rose-500 bg-rose-500/10 border-rose-500/20";
};

const getScoreBarColor = (score: number) => {
  if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-teal-400";
  if (score >= 60) return "bg-gradient-to-r from-amber-500 to-orange-400";
  return "bg-gradient-to-r from-rose-500 to-pink-500";
};

const formatKeyLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const CircularProgress: React.FC<{ score: number; label: string }> = ({ score, label }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  
  // Use a local state for animation to make the gauge draw itself smoothly on mount
  const [offset, setOffset] = useState(circumference);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  const colorClasses = getScoreColor(score);
  const colorSplit = colorClasses.split(" ");
  const textClass = colorSplit[0];
  const strokeClass = colorSplit[1];
  const badgeClass = colorSplit.slice(2).join(" ");

  return (
    <div className="flex flex-col items-center p-5 rounded-2xl border border-border/40 bg-surface/50 shadow-sm hover:border-primary/20 transition-all duration-300 group">
      <span className="text-xs font-bold text-muted uppercase tracking-wider mb-4 group-hover:text-text transition-colors">
        {label}
      </span>
      <div className="relative flex items-center justify-center w-28 h-28">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-border/30 dark:stroke-border/10"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Active progress track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={`transition-all duration-1000 ease-out ${strokeClass}`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 4px currentColor)",
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-black tracking-tight">{score}</span>
          <span className="text-[9px] uppercase tracking-widest text-muted font-bold">/ 100</span>
        </div>
      </div>
      <div className={`mt-4 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border shadow-2xs transition-colors ${badgeClass}`}>
        {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work"}
      </div>
    </div>
  );
};

const BreakdownBar: React.FC<{ name: string; value: number }> = ({ name, value }) => {
  const barColor = getScoreBarColor(value);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(value);
    }, 150);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="space-y-2 group">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-text/90 group-hover:text-primary transition-colors">
          {formatKeyLabel(name)}
        </span>
        <span className="font-bold text-muted group-hover:text-text transition-colors">
          {value}%
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-secondary/60 border border-border/40 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  resumeScore,
  roleFitScore,
  resumeBreakdown,
  roleFitBreakdown,
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 text-left">
      {/* Resume Score Section */}
      {resumeScore !== null && (
        <div className="p-6 rounded-3xl border border-border/50 bg-surface/30 backdrop-blur-md shadow-lg space-y-6 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <CircularProgress score={resumeScore} label="Resume Quality" />
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <CheckCircle2 size={16} />
                </div>
                <h3 className="text-base font-bold tracking-tight text-text">Resume Structure</h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Evaluates overall formatting, career progression consistency, spellcheck, and technical clarity.
              </p>
            </div>
          </div>
          {resumeBreakdown && (
            <div className="pt-5 border-t border-border/40 space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted block">
                Quality Breakdown
              </span>
              <div className="grid gap-4">
                {Object.entries(resumeBreakdown).map(([key, value]) => (
                  <BreakdownBar key={key} name={key} value={value} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Role Fit Score Section */}
      {roleFitScore !== null && (
        <div className="p-6 rounded-3xl border border-border/50 bg-surface/30 backdrop-blur-md shadow-lg space-y-6 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <CircularProgress score={roleFitScore} label="Target Fit" />
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Award size={16} />
                </div>
                <h3 className="text-base font-bold tracking-tight text-text">Role Fit Alignment</h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Measures the alignment of your professional background, soft skills, and tech capabilities against requirements.
              </p>
            </div>
          </div>
          {roleFitBreakdown && (
            <div className="pt-5 border-t border-border/40 space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted block">
                Requirements Alignment
              </span>
              <div className="grid gap-4">
                {Object.entries(roleFitBreakdown).map(([key, value]) => (
                  <BreakdownBar key={key} name={key} value={value} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
