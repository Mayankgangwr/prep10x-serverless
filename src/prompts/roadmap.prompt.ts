// =============================================================================
// Roadmap Prompt — Enterprise Production Build
// Version: 2.0.0
// Description: Generates a personalized, week-by-week interview preparation
//              plan from resume analysis data. Output is consumed directly by
//              the Plan model (planData JSON column) and rendered on the
//              roadmap dashboard.
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export const INTERVIEW_TYPES = [
  "DSA/Coding",
  "System Design",
  "Behavioral/HR",
  "Domain/Technical",
  "Case Study",
  "Take-Home Assignment",
] as const;

export type InterviewType = (typeof INTERVIEW_TYPES)[number];

export interface CandidateSnapshot {
  currentTitle: string;
  totalYearsExperience: number;
  primaryTechStack: string[];
  senioritySignal: string;
}

export interface SkillGap {
  skill: string;
  criticality: string;
  estimatedLearningDays: number;
}

export interface ToolGap {
  tool: string;
  criticality: string;
}

export interface MatchedSkill {
  skill: string;
  proficiencySignal: string;
}

export interface SkillAnalysis {
  coreSkills: {
    matched: MatchedSkill[];
    missing: SkillGap[];
  };
  toolsAndPlatforms: {
    missing: ToolGap[];
  };
  softSkills: {
    gaps: string[];
  };
}

export interface ExperienceGapAnalysis {
  criticalGaps: string[];
  transferableStrengths: string[];
}

export interface PreparationPlanInput {
  // From resume analysis
  resumeScore: number;
  roleFitScore: number;
  roleReadinessLevel: string;
  candidateSnapshot: CandidateSnapshot;
  strengths: string[];
  weaknesses: string[];
  skillAnalysis: SkillAnalysis;
  experienceGapAnalysis: ExperienceGapAnalysis;

  // User-provided context
  targetRole: string;
  experienceLevel: string;
  durationWeeks: number; // 2–8
  interviewTypes: InterviewType[];
}

// Prompt version for audit trails and A/B testing
export const ROADMAP_PROMPT_VERSION = "2.1.0";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Formats an array of objects into a numbered, human-readable list that is
 * easier for LLMs to parse than raw JSON.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatNumberedList = <T extends { [key: string]: any }>(
  items: T[],
  labelKey: keyof T & string,
  detailKeys: (keyof T & string)[] = []
): string => {
  if (!items.length) return "  (none)";
  return items
    .map((item, i) => {
      const label = String(item[labelKey] ?? "Unknown");
      const details = detailKeys
        .filter((k) => item[k] !== undefined && item[k] !== null)
        .map((k) => `${k}: ${String(item[k])}`)
        .join(" | ");
      return `  ${i + 1}. ${label}${details ? ` — ${details}` : ""}`;
    })
    .join("\n");
};

const formatStringList = (items: string[]): string => {
  if (!items.length) return "  (none identified)";
  return items.map((s, i) => `  ${i + 1}. ${s}`).join("\n");
};

/**
 * Maps seniority to the minimum difficulty floor the LLM should use.
 * Prevents Senior/Lead candidates from receiving beginner-level content.
 */
const getDifficultyFloor = (seniority: string): string => {
  const map: Record<string, string> = {
    Principal: "Advanced",
    Lead: "Advanced",
    Senior: "Intermediate",
    Mid: "Intermediate",
    Junior: "Beginner",
    Unclear: "Beginner",
  };
  return map[seniority] ?? "Beginner";
};

// ---------------------------------------------------------------------------
// Prompt Builder
// ---------------------------------------------------------------------------

export const buildPreparationPlanPrompt = (
  input: PreparationPlanInput
): string => {
  const totalDays = input.durationWeeks * 5; // working days only
  const difficultyFloor = getDifficultyFloor(
    input.candidateSnapshot.senioritySignal
  );

  // Pre-compute which task sections are enabled
  const hasCoding = input.interviewTypes.includes("DSA/Coding");
  const hasSystemDesign = input.interviewTypes.includes("System Design");
  const hasBehavioral = input.interviewTypes.includes("Behavioral/HR");
  const hasDomain = input.interviewTypes.includes("Domain/Technical");
  const hasCaseStudy = input.interviewTypes.includes("Case Study");
  const hasTakeHome = input.interviewTypes.includes("Take-Home Assignment");

  // Build the conditional interview-type rules
  const interviewTypeRules: string[] = [];
  if (!hasCoding)
    interviewTypeRules.push(
      '- "codingTasks" array MUST be empty ([]) — DSA/Coding is NOT in scope.'
    );
  if (!hasSystemDesign)
    interviewTypeRules.push(
      '- "systemDesignTasks" array MUST be empty ([]) — System Design is NOT in scope.'
    );
  if (!hasBehavioral)
    interviewTypeRules.push(
      '- "behavioralTasks" array MUST be empty ([]) — Behavioral/HR is NOT in scope.'
    );
  if (!hasDomain)
    interviewTypeRules.push(
      '- "domainTasks" array MUST be empty ([]) — Domain/Technical is NOT in scope.'
    );
  if (!hasCaseStudy)
    interviewTypeRules.push(
      '- "caseStudyTasks" array MUST be empty ([]) — Case Study is NOT in scope.'
    );
  if (!hasTakeHome)
    interviewTypeRules.push(
      '- "takeHomeTasks" array MUST be empty ([]) — Take-Home Assignment is NOT in scope.'
    );

  // Positive rules for enabled types
  if (hasCoding)
    interviewTypeRules.push(
      '- "codingTasks": Include 2–4 tasks per week, progressing from Easy → Hard. Mix DSA, implementation, debugging, and optimization.'
    );
  if (hasSystemDesign)
    interviewTypeRules.push(
      '- "systemDesignTasks": Include 1–2 tasks per week. Start with Low-Level Design, progress to Full System by simulation weeks.'
    );
  if (hasBehavioral)
    interviewTypeRules.push(
      '- "behavioralTasks": Include 1–2 STAR/CAR/SOAR stories per week. Cover leadership, conflict, failure, and impact competencies.'
    );
  if (hasDomain)
    interviewTypeRules.push(
      '- "domainTasks": Include 1–2 domain-specific deep dives per week aligned to the target role requirements.'
    );
  if (hasCaseStudy)
    interviewTypeRules.push(
      '- "caseStudyTasks": Include 1 case study per week from middle weeks onward. Include both analysis and presentation components.'
    );
  if (hasTakeHome)
    interviewTypeRules.push(
      '- "takeHomeTasks": Include 1 realistic take-home assignment per week from middle weeks onward. Simulate real company assignments with time constraints.'
    );

  return `
You are an elite AI Career Coaching Engine powering an enterprise-grade job preparation platform used by thousands of candidates.

YOUR SINGLE TASK: Generate a HIGHLY PERSONALIZED, WEEK-BY-WEEK interview preparation roadmap for the candidate described below. This roadmap will be stored as structured data and later expanded into daily schedules, so precision and completeness are critical.

================================================================================
SECTION 1 — CANDIDATE PROFILE (source of truth — do NOT contradict these facts)
================================================================================
Current Title          : ${input.candidateSnapshot.currentTitle}
Total Experience       : ${input.candidateSnapshot.totalYearsExperience} years
Seniority Signal       : ${input.candidateSnapshot.senioritySignal}
Primary Tech Stack     : ${input.candidateSnapshot.primaryTechStack.join(", ") || "Not specified"}
Resume Score           : ${input.resumeScore}/100
Role Fit Score         : ${input.roleFitScore}/100
Current Readiness Level: ${input.roleReadinessLevel}

================================================================================
SECTION 2 — TARGET PARAMETERS
================================================================================
Target Role            : ${input.targetRole}
Expected Experience    : ${input.experienceLevel}
Preparation Duration   : ${input.durationWeeks} weeks (${totalDays} working days)
Interview Types        : ${input.interviewTypes.join(", ")}

================================================================================
SECTION 3 — SKILL INTELLIGENCE (derived from resume analysis)
================================================================================

### 3a. Strengths (use for warm-up/confidence building in Week 1 ONLY):
${formatStringList(input.strengths)}

### 3b. Weaknesses (MUST be addressed — allocate dedicated time):
${formatStringList(input.weaknesses)}

### 3c. Critical Skill Gaps (MUST address — sorted by criticality descending):
${formatNumberedList(input.skillAnalysis.coreSkills.missing, "skill", ["criticality", "estimatedLearningDays"])}

### 3d. Matched Skills (do NOT re-teach — reference for contextual depth only):
${formatNumberedList(input.skillAnalysis.coreSkills.matched, "skill", ["proficiencySignal"])}

### 3e. Missing Tools & Platforms:
${formatNumberedList(input.skillAnalysis.toolsAndPlatforms.missing, "tool", ["criticality"])}

### 3f. Soft Skill Gaps:
${formatStringList(input.skillAnalysis.softSkills.gaps)}

### 3g. Experience Gaps:
${formatStringList(input.experienceGapAnalysis.criticalGaps)}

### 3h. Transferable Strengths (can fast-track related areas):
${formatStringList(input.experienceGapAnalysis.transferableStrengths)}

================================================================================
SECTION 4 — MANDATORY GENERATION RULES
================================================================================

### 4.1 Personalization Constraints
- ONLY address skills, tools, and topics that appear in Sections 1–3 above.
- DO NOT invent topics, skills, or tools not grounded in the candidate profile.
- DO NOT reference technologies outside the candidate's stack unless they are listed in the missing skills/tools.
- Strengths may appear ONLY in Week 1 as warm-up/confidence revision — NEVER as a primary focus area afterward.
- "Must-Have" missing skills MUST appear before "Nice-to-Have" gaps in the schedule.
- Each topic MUST trace back to a specific item from Section 3.

### 4.2 Difficulty Calibration
- Candidate seniority is "${input.candidateSnapshot.senioritySignal}".
- Minimum difficulty floor: "${difficultyFloor}".
- NEVER include beginner explanations for Senior/Lead/Principal candidates.
- NEVER include Advanced-only content for Junior candidates without progressive scaffolding.

### 4.3 Mandatory Progression Arc
The plan MUST follow this arc (adapt for ${input.durationWeeks}-week duration):
${
  input.durationWeeks === 2
    ? `- Week 1: FOUNDATION + BUILD — Rapid gap assessment, consolidate strengths, begin tackling critical gaps.
- Week 2: SIMULATE + SHARPEN — Mock interviews, weak area revision, final readiness calibration.`
    : input.durationWeeks === 3
      ? `- Week 1: FOUNDATION — Consolidate strengths, diagnose gaps, establish learning rhythm.
- Week 2: BUILD — Tackle critical skill gaps, deepen domain knowledge, hands-on practice.
- Week 3: SIMULATE + SHARPEN — Full mock interviews, weak area revision, final readiness calibration.`
      : `- Week 1: FOUNDATION — Consolidate strengths, diagnose gaps, establish learning rhythm.
- Weeks 2–${input.durationWeeks - 2}: BUILD — Tackle critical skill gaps, deepen domain knowledge, hands-on practice. Each week targets a distinct gap area.
- Week ${input.durationWeeks - 1}: SIMULATE — Full mock interviews, timed problem solving, behavioral story rehearsal.
- Week ${input.durationWeeks}: SHARPEN — Weak area revision, final mock rounds, confidence and readiness calibration.`
}

### 4.4 Topic Distribution
- NO topic may repeat as a primary focus across weeks.
- Each week MUST have ONE clear primary focus theme (e.g., "Backend Scalability & API Design").
- Each week MUST have a concrete, measurable readiness milestone.
- Each week's content MUST map to exactly 5 working days — distribute load accordingly in the dailyBreakdownHint.

### 4.5 Interview Type Rules
Enabled interview types: ${input.interviewTypes.join(", ")}
${interviewTypeRules.join("\n")}

### 4.6 Anti-Hallucination Rules
- DO NOT generate fictional company names, book titles, or specific course URLs.
- DO NOT reference specific LeetCode problem numbers unless the task title is self-evident.
- DO NOT add keys not present in the schema below.
- If the candidate has zero items in a category (e.g., no soft skill gaps), set the corresponding task array to [].

### 4.7 Spaced Repetition & Revision Rules
- From Week 2 onward, each week MUST include a "revisionTopics" array referencing 2–4 key topics from PREVIOUS weeks.
- Revision topics should prioritize items the candidate found hardest (weaknesses, critical gaps).
- Revision should consume no more than 15–20% of the week's total hours.

### 4.8 Priority & Resource Rules
- Every topic MUST have a "priorityWeight" (1–10) indicating interview impact. 10 = guaranteed to be asked, 1 = nice to know.
- Every topic MUST have a "resourceType" indicating the recommended study method.
- DSA coding tasks MUST specify a "dsaPattern" (e.g., "Two Pointer", "Sliding Window", "Dynamic Programming") so candidates learn pattern recognition, not just problem-solving.

### 4.9 Risk & Readiness Rules
- Generate a "riskAssessment" section identifying the top 3–5 risks if the candidate deviates from the plan.
- Generate "interviewReadinessSignals" — concrete, testable "you are ready when..." statements per interview type.
- Generate a "quickWins" array of 3–5 actions the candidate can complete in under 1 hour on Day 1 for an immediate confidence boost.

================================================================================
SECTION 5 — REQUIRED JSON OUTPUT SCHEMA
================================================================================

Return ONLY valid JSON. No markdown fences. No comments. No trailing commas. No explanation before or after. Response MUST start with { and end with }.

{
  "promptVersion": "${ROADMAP_PROMPT_VERSION}",

  "planMeta": {
    "targetRole": string,                    // echo back the target role
    "experienceLevel": string,               // echo back the experience level
    "durationWeeks": number,                 // echo back the duration
    "totalWorkingDays": number,              // must equal durationWeeks × 5
    "planTheme": string,                     // a concise 5–10 word theme for the entire plan, e.g. "Full-Stack Mastery for Senior Backend Transition"
    "overallStrategy": string                // 2–3 sentence high-level strategy summary
  },

  "weeklyPlan": [
    {
      "week": number,                        // 1-indexed
      "weekTheme": string,                   // concise theme, e.g. "Data Structures & Algorithm Foundations"
      "focusArea": string,                   // primary skill/gap being addressed this week
      "weekObjective": string,               // specific, measurable objective for this week
      "progressionStage": "Foundation" | "Build" | "Simulate" | "Sharpen",
      "estimatedDailyHours": number,         // 2–6 hours depending on intensity

      "topics": [
        {
          "title": string,                   // specific topic title
          "description": string,             // what the candidate will learn/practice (2–3 sentences)
          "estimatedHours": number,          // time to complete
          "difficulty": "Beginner" | "Intermediate" | "Advanced",
          "dayAllocation": number,           // which day (1–5) this maps to
          "sourceGap": string,               // which gap from Section 3 this addresses — REQUIRED for traceability
          "priorityWeight": number,          // 1–10: interview impact score. 10 = guaranteed to be asked, 1 = nice to know
          "resourceType": "Official Docs" | "Video Tutorial" | "Interactive Exercise" | "Practice Platform" | "Article/Blog" | "Hands-On Project" | "Peer Discussion"
        }
      ],

      "codingTasks": [                       // EMPTY [] if DSA/Coding not in interviewTypes
        {
          "task": string,                    // specific problem description
          "type": "DSA" | "Implementation" | "Debugging" | "Optimization",
          "difficulty": "Easy" | "Medium" | "Hard",
          "estimatedHours": number,
          "dayAllocation": number,           // which day (1–5) this maps to
          "dsaPattern": "Array/String" | "Two Pointer" | "Sliding Window" | "Binary Search" | "Stack/Queue" | "Linked List" | "Tree/BST" | "Graph/BFS/DFS" | "Dynamic Programming" | "Greedy" | "Backtracking" | "Heap/Priority Queue" | "Trie" | "Union Find" | "Bit Manipulation" | "Math" | "Sorting" | "Hashing" | "Recursion" | "Implementation" | "Other"
        }
      ],

      "systemDesignTasks": [                 // EMPTY [] if System Design not in interviewTypes
        {
          "task": string,                    // e.g. "Design a URL shortener"
          "scope": "Low-Level Design" | "High-Level Design" | "Full System",
          "estimatedHours": number,
          "dayAllocation": number
        }
      ],

      "behavioralTasks": [                   // EMPTY [] if Behavioral/HR not in interviewTypes
        {
          "task": string,                    // e.g. "Prepare a STAR story about a time you resolved a team conflict"
          "framework": "STAR" | "CAR" | "SOAR",
          "targetCompetency": string,        // e.g. "Conflict Resolution", "Leadership"
          "dayAllocation": number
        }
      ],

      "domainTasks": [                       // EMPTY [] if Domain/Technical not in interviewTypes
        {
          "task": string,
          "skillArea": string,
          "estimatedHours": number,
          "dayAllocation": number
        }
      ],

      "caseStudyTasks": [                    // EMPTY [] if Case Study not in interviewTypes
        {
          "task": string,                    // e.g. "Analyze a failing e-commerce checkout funnel"
          "deliverable": string,             // what the candidate should produce
          "estimatedHours": number,
          "dayAllocation": number
        }
      ],

      "takeHomeTasks": [                     // EMPTY [] if Take-Home Assignment not in interviewTypes
        {
          "task": string,                    // e.g. "Build a REST API for a task management app"
          "techStack": string[],             // technologies to use
          "timeBoxHours": number,            // simulated time constraint
          "dayAllocation": number
        }
      ],

      "dailyBreakdownHint": [                // MUST contain exactly 5 entries (Mon–Fri)
        {
          "day": number,                     // 1–5
          "focus": string,                   // primary focus for this day
          "primaryTopics": string[],         // topic titles from the topics array
          "estimatedHours": number           // total hours for this day
        }
      ],

      "revisionTopics": [                    // EMPTY [] for Week 1. From Week 2+: 2–4 topics from previous weeks for spaced repetition
        {
          "topic": string,                   // topic title from a previous week
          "fromWeek": number,                // which week this was originally taught
          "revisionMethod": "Quick Quiz" | "Practice Problem" | "Flashcards" | "Teach-Back" | "Mini Project",
          "estimatedMinutes": number         // 15–45 minutes max per revision item
        }
      ],

      "weeklyReviewQuestions": [              // 3–5 self-test questions to validate week's learning
        {
          "question": string,                // technical or behavioral question
          "expectedAnswer": string,          // concise expected answer (2–3 sentences)
          "difficulty": "Easy" | "Medium" | "Hard",
          "relatedTopic": string             // which topic from this week it tests
        }
      ],

      "weeklyMilestone": {
        "goal": string,                      // what the candidate should achieve by end of week
        "successCriteria": string,           // how to objectively measure success
        "selfAssessmentPrompt": string       // question for the candidate to self-evaluate
      },

      "readinessScoreTarget": number         // 0–100, expected readiness after this week
    }
  ],

  "habitStack": {
    "daily": string[],                       // 3–5 daily habits, e.g. "Solve 1 medium DSA problem"
    "weekly": string[]                       // 2–3 weekly habits, e.g. "Complete 1 full mock interview"
  },

  "mockInterviewSchedule": [                 // at least 1 per week from mid-plan onward
    {
      "week": number,
      "day": number,                         // which day of that week (1–5)
      "type": string,                        // e.g. "Technical", "Behavioral", "System Design"
      "format": string,                      // e.g. "45-min timed session", "Peer mock", "Self-recorded"
      "focus": string                        // specific focus area for this mock
    }
  ],

  "quickWins": [                              // 3–5 actions completable in <1 hour on Day 1
    {
      "action": string,                      // e.g. "Review your top 3 matched skills and write a 2-sentence pitch for each"
      "estimatedMinutes": number,            // 10–60 minutes
      "impact": string,                      // why this matters, e.g. "Builds immediate confidence for behavioral questions"
      "category": "Confidence" | "Knowledge" | "Practice" | "Mindset"
    }
  ],

  "riskAssessment": [                         // 3–5 top risks if candidate deviates from the plan
    {
      "risk": string,                        // e.g. "Skipping System Design practice"
      "impact": "Critical" | "High" | "Medium" | "Low",
      "consequence": string,                 // what happens, e.g. "40% of senior interviews include system design — skipping guarantees failure"
      "mitigation": string                   // how to recover, e.g. "Allocate at least 2 hours/week to HLD practice"
    }
  ],

  "interviewReadinessSignals": [              // concrete "you are ready when..." per interview type
    {
      "interviewType": string,               // e.g. "DSA/Coding", "System Design"
      "readyWhen": string[],                 // 2–4 testable signals, e.g. "You can solve a medium graph problem in under 25 minutes"
      "notReadyIf": string[]                 // 1–2 red flags, e.g. "You still struggle with basic tree traversal"
    }
  ],

  "finalReadinessChecklist": [               // 5–10 items covering all critical areas
    {
      "area": string,                        // e.g. "DSA", "System Design", "Behavioral"
      "checkpointQuestion": string,          // yes/no self-check, e.g. "Can I design a distributed cache from scratch?"
      "targetCompletionWeek": number         // when this should be achieved
    }
  ],

  "planConfidenceScore": number,             // 0–100: how confident the AI is that this plan addresses all gaps
  "planConfidenceRationale": string          // 2–3 sentence explanation of confidence score
}

================================================================================
SECTION 6 — OUTPUT VALIDATION CHECKLIST (verify before responding)
================================================================================
Before returning, silently verify:
✅ JSON is valid — no trailing commas, no comments, no markdown fences.
✅ "weeklyPlan" array has exactly ${input.durationWeeks} entries.
✅ Each "dailyBreakdownHint" has exactly 5 entries (days 1–5).
✅ No topic repeats as primary focus across different weeks.
✅ All disabled interview type arrays are empty ([]).
✅ All enabled interview type arrays have at least 1 entry per week.
✅ Difficulty levels respect the "${difficultyFloor}" floor.
✅ "readinessScoreTarget" increases monotonically across weeks.
✅ Every topic has a non-empty "sourceGap" tracing to Section 3 data.
✅ Every topic has a "priorityWeight" (1–10) and a valid "resourceType".
✅ Every codingTask (if enabled) has a valid "dsaPattern".
✅ From Week 2+, "revisionTopics" has 2–4 entries referencing prior weeks.
✅ Each week has 3–5 "weeklyReviewQuestions" with expected answers.
✅ "quickWins" has 3–5 entries with estimatedMinutes ≤ 60.
✅ "riskAssessment" has 3–5 entries.
✅ "interviewReadinessSignals" has 1 entry per enabled interview type.
✅ "totalWorkingDays" equals ${totalDays}.
✅ "promptVersion" is "${ROADMAP_PROMPT_VERSION}".

Generate the JSON now.
`.trim();
};