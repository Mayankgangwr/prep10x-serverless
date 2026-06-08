export interface ResumeAnalysisResponse {
    success: boolean;
    data: {
        resume: Resume;
    };
}

export interface Resume {
    id: string;
    userId: string;
    originalFileUrl: string | null;
    extractedText: string;
    targetRole: string;
    experienceLevel: string;
    checksum: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    resourceType: string;
    storageProvider: string;
    publicId: string;
    secureUrl: string;
    aiStatus: string;
    aiLastProcessedAt: string;
    aiFailureReason: string | null;
    softDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    analyses: Analysis[];
}

export interface Analysis {
    id: string;
    resumeId: string;
    roadmapId: string;
    preparationPlanId: string | null;
    providerUsed: string;
    modelUsed: string;
    resumeScore: number;
    roleFitScore: number;
    summary: string;

    resumeScoreBreakdown: ResumeScoreBreakdown;
    roleFitBreakdown: RoleFitBreakdown;

    candidateSnapshot: CandidateSnapshot;

    strengths: string[];
    weaknesses: string[];
    matchedSkills: string[];
    missingSkills: string[];

    skillAnalysis: SkillAnalysis;
    experienceGapAnalysis: ExperienceGapAnalysis;

    roleReadinessLevel: string;
    roleReadinessRationale: string;

    learningPlanFoundation: LearningPlanFoundation;

    hiringRecommendation: HiringRecommendation;
    dataConfidence: DataConfidence;

    suggestions: string[];
    extractedTextSummary: string;
    insights: Record<string, any>;

    inputTokens: number;
    outputTokens: number;

    createdAt: string;
    updatedAt: string;
}

export interface ResumeScoreBreakdown {
    technicalDepth: number;
    quantifiedImpact: number;
    careerProgression: number;
    achievementClarity: number;
    formattingAndClarity: number;
}

export interface RoleFitBreakdown {
    domainKnowledge: number;
    experienceRelevance: number;
    technicalSkillMatch: number;
    softSkillsAndLeadership: number;
}

export interface CandidateSnapshot {
    currentTitle: string;
    industryDomains: string[];
    senioritySignal: string;
    primaryTechStack: string[];
    totalYearsExperience: number;
}

export interface SkillAnalysis {
    coreSkills: {
        matched: SkillMatch[];
        missing: MissingSkill[];
    };
    softSkills: {
        gaps: string[];
        detected: string[];
    };
    toolsAndPlatforms: {
        matched: string[];
        missing: MissingTool[];
    };
}

export interface SkillMatch {
    skill: string;
    proficiencySignal: string;
    evidenceFromResume: string;
}

export interface MissingSkill {
    skill: string;
    criticality: string;
    estimatedLearningDays: number;
}

export interface MissingTool {
    tool: string;
    criticality: string;
}

export interface ExperienceGapAnalysis {
    summary: string;
    criticalGaps: string[];
    yearsGapVsExpected: number;
    transferableStrengths: string[];
}

export interface LearningPlanFoundation {
    totalLearningDays: number;
    milestone_checkpoints: MilestoneCheckpoint[];
    prioritizedLearningAreas: LearningArea[];
    recommendedLearningSequence: string[];
}

export interface MilestoneCheckpoint {
    week: number;
    goalDescription: string;
    successCriteria: string;
}

export interface LearningArea {
    area: string;
    priority: string;
    why: string;
    suggestedResources: string[];
    estimatedDaysNeeded: number;
}

export interface HiringRecommendation {
    verdict: string;
    conditionsIfAny: string;
    suggestedInterviewFocusAreas: string[];
}

export interface DataConfidence {
    flags: string[];
    score: number;
}