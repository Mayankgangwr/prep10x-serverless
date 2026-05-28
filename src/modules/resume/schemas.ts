
import z from "zod";

export const uploadResumeSchema = z.object({
  resume: z
    .union([z.instanceof(File), z.undefined()])
    .refine((file): file is File => file instanceof File, {
      message: "Resume file is required",
    })
    .refine(
      (file) =>
        file instanceof File &&
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      {
        message: "Only PDF or DOC/DOCX files are allowed",
      }
    ),
  targetExperience: z.string().min(1, "Target experience is required"),
  targetRole: z.string().min(1, "Target role is required"),
});


export const resumeAnalysisSchema = z.object({
  candidateSnapshot: z.object({
    currentTitle: z.string(),
    totalYearsExperience: z.number(),
    primaryTechStack: z.array(z.string()),
    industryDomains: z.array(z.string()),
    senioritySignal: z.enum(["Junior", "Mid", "Senior", "Lead", "Principal", "Unclear"]),
  }),

  resumeScore: z.number().min(0).max(100),
  resumeScoreBreakdown: z.object({
    achievementClarity: z.number(),
    technicalDepth: z.number(),
    careerProgression: z.number(),
    formattingAndClarity: z.number(),
    quantifiedImpact: z.number(),
  }),

  roleFitScore: z.number().min(0).max(100),
  roleFitBreakdown: z.object({
    technicalSkillMatch: z.number(),
    experienceRelevance: z.number(),
    domainKnowledge: z.number(),
    softSkillsAndLeadership: z.number(),
  }),

  roleReadinessLevel: z.enum(["Low", "Medium-Low", "Medium", "Medium-High", "High"]),
  roleReadinessRationale: z.string().min(1),

  skillAnalysis: z.object({
    coreSkills: z.object({
      matched: z.array(
        z.object({
          skill: z.string(),
          proficiencySignal: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
          evidenceFromResume: z.string(),
        })
      ),
      missing: z.array(
        z.object({
          skill: z.string(),
          criticality: z.enum(["Must-Have", "Important", "Nice-to-Have"]),
          estimatedLearningDays: z.number(),
        })
      ),
    }),
    toolsAndPlatforms: z.object({
      matched: z.array(z.string()),
      missing: z.array(
        z.object({
          tool: z.string(),
          criticality: z.enum(["Must-Have", "Important", "Nice-to-Have"]),
        })
      ),
    }),
    softSkills: z.object({
      detected: z.array(z.string()),
      gaps: z.array(z.string()),
    }),
  }),

  experienceGapAnalysis: z.object({
    summary: z.string().min(1),
    criticalGaps: z.array(z.string()),
    transferableStrengths: z.array(z.string()),
    yearsGapVsExpected: z.number(),
  }),

  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),

  learningPlanFoundation: z.object({
    totalLearningDays: z.number(),
    prioritizedLearningAreas: z.array(
      z.object({
        area: z.string(),
        why: z.string(),
        suggestedResources: z.array(z.string()),
        estimatedDaysNeeded: z.number(),
        priority: z.enum(["Critical", "High", "Medium", "Low"]),
      })
    ),
    recommendedLearningSequence: z.array(z.string()),
    milestone_checkpoints: z.array(
      z.object({
        week: z.number(),
        goalDescription: z.string(),
        successCriteria: z.string(),
      })
    ),
  }),

  hiringRecommendation: z.object({
    verdict: z.enum(["Strong Hire", "Hire", "Hire with Conditions", "Hold", "Reject"]),
    conditionsIfAny: z.string(),
    suggestedInterviewFocusAreas: z.array(z.string()),
  }),

  dataConfidence: z.object({
    score: z.number().min(0).max(100),
    flags: z.array(z.string()),
  }),

  suggestions: z.array(z.string()),
});
