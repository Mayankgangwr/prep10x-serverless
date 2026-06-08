"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PreparationPhase } from "../../types";
import {
    Loader2,
    Sparkles,
    Clock,
    CheckSquare,
    Zap,
    Target,
    CheckCircle2,
    Circle,
    Flame,
    Trophy,
    PartyPopper,
} from "lucide-react";

interface DayProgress {
    dayNumber: number;
    status: string;
}

interface ProgressData {
    completedDays: number;
    totalDays: number;
    percentage: number;
    currentStreak: number;
    longestStreak: number;
}

interface WeekViewClientProps {
    weekPhase: PreparationPhase;
    weekNumber: number;
}

export const WeekViewClient: React.FC<WeekViewClientProps> = ({ weekPhase, weekNumber }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [dailyPlan, setDailyPlan] = useState<any>(weekPhase.generatedDailyPlan);
    const [activeDay, setActiveDay] = useState<number>(1);
    const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
    const [isCompleting, setIsCompleting] = useState(false);
    const [progress, setProgress] = useState<ProgressData | null>(null);

    // Fetch existing progress on mount
    const fetchProgress = useCallback(async () => {
        try {
            const res = await fetch(`/api/roadmap/week/${weekNumber}/progress`);
            const data = await res.json();
            if (res.ok && data.success) {
                const completed = new Set<number>(
                    data.data.days
                        .filter((d: DayProgress) => d.status === "completed")
                        .map((d: DayProgress) => d.dayNumber)
                );
                setCompletedDays(completed);
                setProgress(data.data.progress);
            }
        } catch (error) {
            console.error("Failed to fetch progress:", error);
        }
    }, [weekNumber]);

    useEffect(() => {
        if (dailyPlan) {
            fetchProgress();
        }
    }, [dailyPlan, fetchProgress]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch(`/api/roadmap/week/${weekNumber}/generate`, {
                method: "POST",
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setDailyPlan(data.data);
            } else {
                alert("Error generating daily plan: " + data.error?.message);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleMarkComplete = async (dayNumber: number) => {
        setIsCompleting(true);
        try {
            const res = await fetch(`/api/roadmap/week/${weekNumber}/progress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dayNumber }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setCompletedDays((prev) => new Set([...prev, dayNumber]));
                setProgress(data.data.progress);
            } else {
                alert("Error: " + data.error?.message);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsCompleting(false);
        }
    };

    // ── Empty State ─────────────────────────────────────────────────────
    if (!dailyPlan) {
        return (
            <div className="bg-surface/50 border border-border backdrop-blur-xl rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-text mb-3">
                    Ready to start Week {weekNumber}?
                </h2>
                <p className="text-muted max-w-lg mb-8">
                    Generate your hour-by-hour daily schedule optimized for your target role. The AI
                    will construct a 5-day structured plan based on the topics of this week.
                </p>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                    {isGenerating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Zap className="w-5 h-5 fill-current" />
                    )}
                    {isGenerating ? "Generating Plan..." : "Generate Daily Schedule"}
                </button>
            </div>
        );
    }

    // ── Days Data ───────────────────────────────────────────────────────
    const days = dailyPlan.dailyLearningPath || [];
    const weekCompletedCount = completedDays.size;
    const weekTotalDays = days.length || 5;
    const weekPercentage = Math.round((weekCompletedCount / weekTotalDays) * 100);

    return (
        <div className="space-y-8">
            {/* ── Progress Bar ────────────────────────────────────────── */}
            <div className="bg-surface/50 border border-border backdrop-blur-xl rounded-3xl p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Stats */}
                    <div className="flex items-center gap-6 flex-1">
                        <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16">
                                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="var(--color-border)"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="var(--color-primary)"
                                        strokeWidth="3"
                                        strokeDasharray={`${weekPercentage}, 100`}
                                        strokeLinecap="round"
                                        className="transition-all duration-700"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-text">
                                    {weekPercentage}%
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text">Week {weekNumber} Progress</p>
                                <p className="text-xs text-muted">
                                    {weekCompletedCount}/{weekTotalDays} days completed
                                </p>
                            </div>
                        </div>

                        {progress && (
                            <>
                                <div className="hidden md:block h-10 w-px bg-border" />
                                <div className="flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-warning" />
                                    <div>
                                        <p className="text-sm font-bold text-text">{progress.currentStreak}</p>
                                        <p className="text-xs text-muted">Streak</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-accent" />
                                    <div>
                                        <p className="text-sm font-bold text-text">{progress.longestStreak}</p>
                                        <p className="text-xs text-muted">Best</p>
                                    </div>
                                </div>
                                <div className="hidden md:block h-10 w-px bg-border" />
                                <div>
                                    <p className="text-sm font-bold text-text">
                                        {progress.completedDays}/{progress.totalDays}
                                    </p>
                                    <p className="text-xs text-muted">Overall</p>
                                </div>
                            </>
                        )}
                    </div>

                    {weekCompletedCount === weekTotalDays && (
                        <div className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-bold">
                            <PartyPopper className="w-5 h-5" />
                            Week Complete!
                        </div>
                    )}
                </div>
            </div>

            {/* ── Day Selector + Content ──────────────────────────────── */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar for Days */}
                <div className="w-full lg:w-1/4 space-y-3">
                    <h3 className="font-bold text-text mb-4 uppercase tracking-widest text-xs">
                        5-Day Schedule
                    </h3>
                    {days.map((day: any) => {
                        const isDayCompleted = completedDays.has(day.day);
                        return (
                            <button
                                key={day.day}
                                onClick={() => setActiveDay(day.day)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                    activeDay === day.day
                                        ? "bg-primary/10 border-primary text-primary shadow-sm"
                                        : isDayCompleted
                                        ? "bg-primary/5 border-primary/30 text-text/80"
                                        : "bg-surface border-border hover:border-primary/50 text-text/80"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold mb-1">Day {day.day}</div>
                                        <div className="text-xs opacity-80">{day.dayType}</div>
                                    </div>
                                    {isDayCompleted ? (
                                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-muted/30 flex-shrink-0" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Main Content for Active Day */}
                <div className="w-full lg:w-3/4">
                    {days
                        .filter((d: any) => d.day === activeDay)
                        .map((day: any) => {
                            const isDayCompleted = completedDays.has(day.day);
                            return (
                                <div
                                    key={day.day}
                                    className="bg-surface/50 border border-border backdrop-blur-xl rounded-3xl p-6 md:p-10"
                                >
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between flex-wrap gap-3">
                                            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                                                {day.dayType}
                                            </span>
                                            {isDayCompleted && (
                                                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-3xl font-extrabold text-text mt-4 tracking-tight">
                                            {day.dayTitle}
                                        </h2>
                                        <p className="text-muted mt-2">{day.dayObjective}</p>
                                        <div className="flex items-center gap-2 mt-4 text-sm font-medium text-text/80 bg-elevated/50 border border-border/50 inline-flex px-4 py-2 rounded-lg">
                                            <Clock className="w-4 h-4 text-warning" />
                                            Estimated Total Hours: {day.estimatedTotalHours}h
                                        </div>
                                    </div>

                                    {/* Time Blocks */}
                                    <div className="space-y-6">
                                        <h3 className="font-bold text-xl text-text border-b border-border pb-3">
                                            Time Blocks
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {day.timeBlocks?.map((block: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="bg-elevated/30 border border-border/50 p-5 rounded-2xl flex flex-col md:flex-row gap-6"
                                                >
                                                    <div className="md:w-32 flex-shrink-0">
                                                        <div className="text-sm font-bold text-text mb-1">
                                                            {block.slot}
                                                        </div>
                                                        <div className="text-xs text-muted flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> {block.duration}
                                                        </div>
                                                        <div className="text-xs font-semibold text-primary mt-2">
                                                            {block.activityType}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-text mb-2">
                                                            {block.activity}
                                                        </h4>
                                                        <p className="text-sm text-muted mb-3">
                                                            {block.description}
                                                        </p>
                                                        {block.deliverable && (
                                                            <div className="text-xs font-medium text-warning bg-warning/10 border border-warning/20 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                                                                <Target className="w-3 h-3" />
                                                                Goal: {block.deliverable}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* End of day checklist */}
                                    {day.endOfDayChecklist && day.endOfDayChecklist.length > 0 && (
                                        <div className="mt-10 bg-accent/5 border border-accent/20 p-6 rounded-2xl">
                                            <h3 className="font-bold text-text flex items-center gap-2 mb-4">
                                                <CheckSquare className="w-5 h-5 text-accent" />
                                                End of Day Checklist
                                            </h3>
                                            <ul className="space-y-3">
                                                {day.endOfDayChecklist.map(
                                                    (item: string, idx: number) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-3 text-sm text-muted font-medium"
                                                        >
                                                            <div className="mt-1 w-2 h-2 rounded-full bg-accent" />
                                                            {item}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Motivational Cue */}
                                    {day.motivationalCue && (
                                        <div className="mt-6 text-center italic text-sm text-muted font-medium">
                                            &ldquo;{day.motivationalCue}&rdquo;
                                        </div>
                                    )}

                                    {/* ── Mark as Complete Button ─────────────────────── */}
                                    <div className="mt-8 pt-6 border-t border-border">
                                        {isDayCompleted ? (
                                            <div className="flex items-center justify-center gap-3 bg-primary/5 border border-primary/20 py-4 rounded-2xl">
                                                <CheckCircle2 className="w-6 h-6 text-primary" />
                                                <span className="font-bold text-primary text-lg">
                                                    Day {day.day} Completed
                                                </span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleMarkComplete(day.day)}
                                                disabled={isCompleting}
                                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg"
                                            >
                                                {isCompleting ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <CheckCircle2 className="w-5 h-5" />
                                                )}
                                                {isCompleting
                                                    ? "Saving..."
                                                    : `Mark Day ${day.day} as Complete`}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};
