export const buildResumeAnalysisPrompt = (
  resumeText: string,
  role: string,
  experience: string,
  learningDurationWeeks: number // 2–8
): string => {
  return `
You are an elite-level AI Talent Intelligence Engine built for enterprise hiring and candidate upskilling platforms.

Your task is to perform a deep, structured analysis of the candidate's resume against a target role, and produce a comprehensive JSON output that will power:
1. A hiring-fit assessment
2. A personalized, day-by-day learning plan over ${learningDurationWeeks} weeks

---

## TARGET ROLE CONTEXT
- Role: ${role}
- Expected Experience Level: ${experience}
- Learning Plan Duration: ${learningDurationWeeks} weeks (${learningDurationWeeks * 5} working days)

---

## ANALYSIS INSTRUCTIONS

### Scoring Rubrics (strictly follow these):

**resumeScore** (0–100): Overall resume quality score.
- 90–100: Exceptional. Quantified achievements, clear progression, tailored, zero ambiguity.
- 70–89: Strong. Good depth, minor gaps in impact language or formatting.
- 50–69: Average. Present but vague. Responsibilities listed, not achievements.
- 30–49: Weak. Sparse detail, missing metrics, unclear progression.
- 0–29: Poor. Incomplete, irrelevant, or misleading.

**roleFitScore** (0–100): How well this candidate's background fits the target role RIGHT NOW.
- Weight: Technical Skills 40% | Experience Relevance 30% | Domain Knowledge 20% | Soft Skills/Leadership 10%

**roleReadinessLevel**:
- "High" = Can contribute in ≤ 2 weeks with minimal ramp-up
- "Medium-High" = 2–4 weeks ramp, minor skill gaps
- "Medium" = 4–6 weeks ramp, moderate gaps fillable with focused learning
- "Medium-Low" = 6–10 weeks ramp, significant gaps
- "Low" = Fundamental skill gaps; not ready without major upskilling

---

## REQUIRED JSON OUTPUT FORMAT

Return ONLY valid JSON. No markdown. No explanation. No extra keys. No trailing commas.

{
  "candidateSnapshot": {
    "currentTitle": string,
    "totalYearsExperience": number,
    "primaryTechStack": string[],
    "industryDomains": string[],
    "senioritySignal": "Junior" | "Mid" | "Senior" | "Lead" | "Principal" | "Unclear"
  },

  "resumeScore": number,
  "resumeScoreBreakdown": {
    "achievementClarity": number,
    "technicalDepth": number,
    "careerProgression": number,
    "formattingAndClarity": number,
    "quantifiedImpact": number
  },

  "roleFitScore": number,
  "roleFitBreakdown": {
    "technicalSkillMatch": number,
    "experienceRelevance": number,
    "domainKnowledge": number,
    "softSkillsAndLeadership": number
  },

  "roleReadinessLevel": "Low" | "Medium-Low" | "Medium" | "Medium-High" | "High",
  "roleReadinessRationale": string,

  "skillAnalysis": {
    "coreSkills": {
      "matched": [{ "skill": string, "proficiencySignal": "Beginner" | "Intermediate" | "Advanced" | "Expert", "evidenceFromResume": string }],
      "missing": [{ "skill": string, "criticality": "Must-Have" | "Important" | "Nice-to-Have", "estimatedLearningDays": number }]
    },
    "toolsAndPlatforms": {
      "matched": string[],
      "missing": [{ "tool": string, "criticality": "Must-Have" | "Important" | "Nice-to-Have" }]
    },
    "softSkills": {
      "detected": string[],
      "gaps": string[]
    }
  },

  "experienceGapAnalysis": {
    "summary": string,
    "criticalGaps": string[],
    "transferableStrengths": string[],
    "yearsGapVsExpected": number
  },

  "strengths": string[],
  "weaknesses": string[],

  "learningPlanFoundation": {
    "totalLearningDays": number,
    "prioritizedLearningAreas": [
      {
        "area": string,
        "why": string,
        "suggestedResources": string[],
        "estimatedDaysNeeded": number,
        "priority": "Critical" | "High" | "Medium" | "Low"
      }
    ],
    "recommendedLearningSequence": string[],
    "milestone_checkpoints": [
      { "week": number, "goalDescription": string, "successCriteria": string }
    ]
  },

  "hiringRecommendation": {
    "verdict": "Strong Hire" | "Hire" | "Hire with Conditions" | "Hold" | "Reject",
    "conditionsIfAny": string,
    "suggestedInterviewFocusAreas": string[]
  },

  "dataConfidence": {
    "score": number,
    "flags": string[]
  },

  "suggestions": string[]
}

---

## Resume Text:
${resumeText}
`.trim();
};