import React from "react";
import { Container } from "@/components/ui/container";
import { Target, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { getRoadmapData } from "@/modules/roadmap/server";
import { PageHeader } from "@/components/common";
import Link from "next/link";
import { WeekViewClient } from "@/modules/roadmap/client";

interface PageProps {
    params: Promise<{ weekNumber: string }>;
}

export default async function WeekPage(props: PageProps) {
    const params = await props.params;
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return (
            <Container className="px-0 md:px-4 py-8 max-w-7xl mx-auto">
                <div className="text-center py-20">Please sign in to view your roadmap.</div>
            </Container>
        );
    }

    const { plan } = await getRoadmapData(session.user.id);
    const weekNum = parseInt(params.weekNumber, 10);

    if (!plan || isNaN(weekNum)) {
        return (
            <Container className="px-0">
                <div className="text-center py-20">Plan not found.</div>
            </Container>
        );
    }

    const weekPhase = plan.phases.find(p => p.weekNumber === weekNum);

    if (!weekPhase) {
        return (
            <Container className="px-0">
                <div className="text-center py-20">Week {weekNum} not found in your plan.</div>
            </Container>
        );
    }

    return (
        <Container className="px-0">
            <div className="space-y-6">
                <div>
                    <Link href="/roadmap" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Roadmap
                    </Link>
                    <PageHeader
                        title={`Week ${weekPhase.weekNumber}: ${weekPhase.title}`}
                        description={weekPhase.description}
                    />
                </div>

                <WeekViewClient weekPhase={weekPhase} weekNumber={weekNum} />
            </div>
        </Container>
    );
}
