export const buildWeeklyPathPrompt = (input: {
    // From Preparation Plan output
    weeklyPlan: {
        week: number;
        weekTheme: string;
        focusArea: string;
        weekObjective: string;
        progressionStage: "Foundation" | "Build" | "Simulate" | "Sharpen";
        estimatedDailyHours: number;

        topics: {
            title: string;
            description: string;
            estimatedHours: number;
            difficulty: "Beginner" | "Intermediate" | "Advanced";
            dayAllocation: number;
        }[];

        codingTasks: {
            task: string;
            type: "DSA" | "Implementation" | "Debugging" | "Optimization";
            difficulty: "Easy" | "Medium" | "Hard";
            estimatedHours: number;
        }[];

        systemDesignTasks: {
            task: string;
            scope: "Low-Level Design" | "High-Level Design" | "Full System";
            estimatedHours: number;
        }[];

        behavioralTasks: {
            task: string;
            framework: "STAR" | "CAR" | "SOAR";
            targetCompetency: string;
        }[];

        domainTasks: {
            task: string;
            skillArea: string;
            estimatedHours: number;
        }[];

        dailyBreakdownHint: {
            day: number;
            focus: string;
            primaryTopics: string[];
            estimatedHours: number;
        }[];

        weeklyMilestone: {
            goal: string;
            successCriteria: string;
            selfAssessmentPrompt: string;
        };

        readinessScoreTarget: number;
    };

    // Candidate context
    targetRole: string;
    experienceLevel: string;
    senioritySignal: string;
    activeInterviewTypes: string[];
}): string => {
    return `
You are an elite AI Daily Learning Architect inside an enterprise-grade career coaching platform.

Your task is to convert a structured weekly preparation plan into a precise, 5-day (working days only) daily learning schedule. This schedule must be immediately actionable — a candidate should be able to follow it hour by hour without any ambiguity.

---

## CONTEXT

- Target Role: ${input.targetRole}
- Experience Level: ${input.experienceLevel}
- Seniority Signal: ${input.senioritySignal}
- Week Number: ${input.weeklyPlan.week}
- Week Theme: ${input.weeklyPlan.weekTheme}
- Progression Stage: ${input.weeklyPlan.progressionStage}
- Week Objective: ${input.weeklyPlan.weekObjective}
- Estimated Daily Hours Available: ${input.weeklyPlan.estimatedDailyHours}h
- Active Interview Types: ${input.activeInterviewTypes.join(", ")}

---

## WEEKLY CONTENT TO DISTRIBUTE

Topics:
${JSON.stringify(input.weeklyPlan.topics)}

Coding Tasks:
${JSON.stringify(input.weeklyPlan.codingTasks)}

System Design Tasks:
${JSON.stringify(input.weeklyPlan.systemDesignTasks)}

Behavioral Tasks:
${JSON.stringify(input.weeklyPlan.behavioralTasks)}

Domain Tasks:
${JSON.stringify(input.weeklyPlan.domainTasks)}

AI-Suggested Daily Hints (use as primary distribution guide):
${JSON.stringify(input.weeklyPlan.dailyBreakdownHint)}

Weekly Milestone:
${JSON.stringify(input.weeklyPlan.weeklyMilestone)}

---

## MANDATORY DAY STRUCTURE (follow for ALL weeks)

- Day 1 — WARM-UP & ORIENTATION: Light review of strengths, introduce week theme, set daily targets.
- Day 2 — DEEP LEARNING: Hardest/most critical topic of the week. Maximum focus, minimum distractions.
- Day 3 — APPLIED PRACTICE: Hands-on tasks, coding problems, or domain exercises based on Day 2 learning.
- Day 4 — INTERVIEW SIMULATION: Mock questions, behavioral stories, system design walkthroughs.
- Day 5 — REVIEW & CONSOLIDATION: Spaced repetition of the week, self-assessment, milestone check, prep for next week.

Adapt this arc to the progressionStage:
- Foundation: Heavier on Day 1–2 (learning), lighter simulation.
- Build: Balanced across all 5 days.
- Simulate: Day 2–4 are all mock/simulation-heavy.
- Sharpen: Day 1–3 are gap revision, Day 4–5 are final mock rounds.

---

## STRICT CONTENT RULES

- Generate EXACTLY 5 days. Never 7. Never 6. Always 5 working days.
- EVERY topic, task, and item from the weekly plan MUST appear at least once.
- DO NOT invent new topics, tools, or tasks not present in the input.
- DO NOT assign behavioral tasks every day — spread across Day 1, Day 4, Day 5 only.
- DO NOT assign system design tasks every day — assign only on Day 3 and Day 4.
- Coding/DSA tasks belong on Day 2, Day 3, and Day 4 only.
- Adjust explanation depth and task complexity strictly based on senioritySignal.
- Time blocks must sum to ≤ estimatedDailyHours per day.
- Day 5 MUST always include the weeklyMilestone self-assessment.

---

## REQUIRED JSON OUTPUT FORMAT

Return ONLY valid JSON. No markdown. No explanation. No extra keys. Must start with { and end with }.

{
  "week": number,
  "weekTheme": string,
  "progressionStage": string,
  "targetRole": string,
  "experienceLevel": string,
  "totalEstimatedWeekHours": number,

  "dailyLearningPath": [
    {
      "day": number,
      "dayType": "Warm-Up" | "Deep Learning" | "Applied Practice" | "Interview Simulation" | "Review & Consolidation",
      "dayTitle": string,
      "dayObjective": string,
      "estimatedTotalHours": number,

      "timeBlocks": [
        {
          "slot": "Morning" | "Afternoon" | "Evening",
          "duration": string,
          "activity": string,
          "activityType": "Learning" | "Coding" | "System Design" | "Behavioral Prep" | "Domain Practice" | "Mock Interview" | "Review" | "Self-Assessment",
          "description": string,
          "deliverable": string,
          "estimatedHours": number
        }
      ],

      "topicsCovered": string[],

      "codingTask": {
        "task": string,
        "type": string,
        "difficulty": string,
        "estimatedHours": number,
        "hint": string
      } | null,

      "systemDesignTask": {
        "task": string,
        "scope": string,
        "estimatedHours": number,
        "approach": string
      } | null,

      "behavioralTask": {
        "task": string,
        "framework": string,
        "targetCompetency": string,
        "practicePrompt": string
      } | null,

      "interviewPrepFocus": {
        "type": string,
        "focusArea": string,
        "sampleQuestion": string,
        "tipForToday": string
      },

      "endOfDayChecklist": string[],
      "motivationalCue": string
    }
  ],

  "weeklyMilestoneCheck": {
    "goal": string,
    "successCriteria": string,
    "selfAssessmentPrompt": string,
    "readinessScoreTarget": number
  },

  "weekSummary": {
    "totalTopicsCovered": number,
    "totalCodingTasks": number,
    "totalBehavioralTasks": number,
    "totalSystemDesignTasks": number,
    "keyTakeaway": string,
    "bridgeToNextWeek": string
  }
}
`.trim();
};