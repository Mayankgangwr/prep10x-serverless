"use client";

import { useEffect, useState } from "react";

import { PageHeader } from "@/components/common";
import { Card } from "@/components/ui";
import { Container } from "@/components/ui/container";
import UploadResumeForm from "@/modules/resume/client/upload-resume-form";
import ResumeAnalysis from "@/modules/resume/client/resume-analysis";
import type { Analysis as ResumeAnalysisData } from "@/types";

const ResumePageMeta = {
    uploadResume: {
        title: "Upload Resume",
        description: "Upload your latest resume so we can analyze it against your target role and experience level.",
    },
    resumeAnalysis: {
        title: "Resume Analysis",
        description: "View the analysis of your uploaded resume against your target role and experience level.",
    }
};

export default function ResumePage() {
    const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisData | null>(null);

    const getResumeAnalysis = async () => {
        try {
            const response = await fetch("/api/resume/analysis");
            if (!response.ok) {
                throw new Error("Failed to fetch resume analysis.");
            }

            const payload = (await response.json()) as {
                success: true;
                data: {
                    resume: {
                        resumeAnalysis?: ResumeAnalysisData[];
                    } | null;
                };
            };

            const latestAnalysis = payload.data.resume?.resumeAnalysis?.[0] ?? null;

            setResumeAnalysis(latestAnalysis);

            return latestAnalysis;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    useEffect(() => {
        // Fetch existing analysis on mount (if any)
        void getResumeAnalysis();
    }, []);
    return (
        <Container className="px-0">
            <div className="space-y-6">
                <PageHeader
                    title={ResumePageMeta[resumeAnalysis ? "resumeAnalysis" : "uploadResume"].title}
                    description={ResumePageMeta[resumeAnalysis ? "resumeAnalysis" : "uploadResume"].description}
                />
                {resumeAnalysis ? (
                    <ResumeAnalysis analysis={resumeAnalysis} />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="p-6">
                            <UploadResumeForm />
                        </Card>
                    </div>
                )}
            </div>
        </Container>
    );
}
