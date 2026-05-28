import "server-only";

import {
  ResumeAnalysisProvider,
  RoleReadinessLevel,
  type Prisma,
} from "@/generated/prisma/client";

import type { ResumeAnalysis } from "./types";

const roleReadinessLevelMap: Record<
  ResumeAnalysis["roleReadinessLevel"],
  RoleReadinessLevel
> = {
  Low: "Low",
  "Medium-Low": "Medium_Low",
  Medium: "Medium",
  "Medium-High": "Medium_High",
  High: "High",
};

type BuildResumeAnalysisCreateInputOptions = {
  providerUsed: ResumeAnalysisProvider;
  modelUsed: string;
  inputTokens?: number;
  outputTokens?: number;
  extractedTextSummary?: string | null;
};

const getSkillNames = (
  items: Array<{ skill?: string; tool?: string }>
): string[] => {
  return items
    .map((item) => item.skill ?? item.tool ?? "")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
};

export const mapResumeAnalysisToCreateInput = (
  analysis: ResumeAnalysis,
  resumeId: string,
  options: BuildResumeAnalysisCreateInputOptions
): Prisma.ResumeAnalysisCreateInput => {
  const matchedSkills = getSkillNames(analysis.skillAnalysis.coreSkills.matched);
  const missingSkills = getSkillNames(analysis.skillAnalysis.coreSkills.missing).concat(
    analysis.skillAnalysis.toolsAndPlatforms.missing
      .map((item) => item.tool.trim())
      .filter((value) => value.length > 0)
  );

  return {
    resume: {
      connect: {
        id: resumeId,
      },
    },
    providerUsed: options.providerUsed,
    modelUsed: options.modelUsed,
    resumeScore: analysis.resumeScore,
    resumeScoreBreakdown: analysis.resumeScoreBreakdown,
    roleFitScore: analysis.roleFitScore,
    roleFitBreakdown: analysis.roleFitBreakdown,
    summary: analysis.experienceGapAnalysis.summary,
    candidateSnapshot: analysis.candidateSnapshot,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    matchedSkills,
    missingSkills,
    skillAnalysis: analysis.skillAnalysis,
    experienceGapAnalysis: analysis.experienceGapAnalysis,
    roleReadinessLevel: roleReadinessLevelMap[analysis.roleReadinessLevel],
    roleReadinessRationale: analysis.roleReadinessRationale,
    learningPlanFoundation: analysis.learningPlanFoundation,
    hiringRecommendation: analysis.hiringRecommendation,
    dataConfidence: analysis.dataConfidence,
    suggestions: analysis.suggestions,
    extractedTextSummary: options.extractedTextSummary ?? null,
    insights: analysis,
    inputTokens: options.inputTokens ?? 0,
    outputTokens: options.outputTokens ?? 0,
  };
};
