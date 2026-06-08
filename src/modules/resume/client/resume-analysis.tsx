"use client";
import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { Analysis } from "@/types";
import type { PreparationPlan } from "@/generated/prisma";
import { ScoreBreakdown } from "./components/score-breakdown";
import { CandidateSnapshot } from "./components/candidate-snapshot";
import { SkillAnalysis } from "./components/skill-analysis";
import { GapAnalysis } from "./components/gap-analysis";
import { LearningTimeline } from "./components/learning-timeline";
import { RecommendationCard } from "./components/recommendation-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type ResumeAnalysisProps = {
  analysis: Analysis | null;
};

const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({ analysis }) => {
  if (!analysis) return null;
  const router = useRouter();
  const handleGenerateRoadmap = async (id: string) => {
    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        body: JSON.stringify({ analysisId: id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const payload = (await response.json()) as {
          success: false;
          error?: { message?: string };
        };

        throw new Error(
          payload.error?.message ?? "Failed to save resume data."
        );
      }

      const data = (await response.json()) as {
        success: true;
        data: PreparationPlan;
      };

      if (data.data) {
        router.push(`/roadmap/${data.data.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-8 py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Banner Recommendation */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 text-left shadow-lg backdrop-blur-md transition-all hover:shadow-xl hover:border-primary/30">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 shadow-xs">
              <Sparkles size={11} className="animate-spin duration-3000" />
              <span>AI Analysis Complete</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
              Ready for the next step?
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              We parsed your background and calculated a fit for your target role. Check your customized strengths, gaps, and milestones below.
            </p>
          </div>
          {!analysis.roadmapId && !analysis.preparationPlanId ? (
            <Button onClick={() => handleGenerateRoadmap(analysis.id)} className="min-w-36 flex w-full sm:w-auto items-center justify-center gap-2 font-bold shadow-md hover:shadow-xl transition-all hover:scale-[1.03] rounded-2xl px-6 py-6 bg-primary hover:bg-primary/95 text-primary-foreground">
              <span>Generate Roadmap</span>
              <ArrowRight size={16} />
            </Button>

          ) : (
            <Link href="/roadmap">
              <Button className="min-w-36 flex w-full sm:w-auto items-center justify-center gap-2 font-bold shadow-md hover:shadow-xl transition-all hover:scale-[1.03] rounded-2xl px-6 py-6 bg-primary hover:bg-primary/95 text-primary-foreground">
                <span>View Roadmap</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          )
          }
        </div >
      </div >

      {/* Main Responsive Grid Layout */}
      < div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" >
        {/* Left Side Column: Candidate Profile & Decision (4 cols on lg) */}
        < div className="lg:col-span-5 space-y-8 lg:sticky lg:top-4" >
          <CandidateSnapshot snapshot={analysis.candidateSnapshot} />
          <RecommendationCard
            recommendation={analysis.hiringRecommendation}
            readinessLevel={analysis.roleReadinessLevel}
            readinessRationale={analysis.roleReadinessRationale}
          />
        </div >

        {/* Right Side Column: Detailed Score Breakdowns, Skill Tabs, Gap Analysis, & Roadmap (8 cols on lg) */}
        < div className="lg:col-span-7 space-y-8" >
          <ScoreBreakdown
            resumeScore={analysis.resumeScore}
            roleFitScore={analysis.roleFitScore}
            resumeBreakdown={analysis.resumeScoreBreakdown}
            roleFitBreakdown={analysis.roleFitBreakdown}
          />

          <SkillAnalysis skills={analysis.skillAnalysis} />

          <GapAnalysis
            gapAnalysis={analysis.experienceGapAnalysis}
            strengths={analysis.strengths}
            weaknesses={analysis.weaknesses}
            suggestions={analysis.suggestions}
          />

          <LearningTimeline plan={analysis.learningPlanFoundation} />
        </div >
      </div >
    </div >
  );
};

export default ResumeAnalysis;