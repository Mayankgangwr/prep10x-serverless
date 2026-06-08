import React from "react";
import { Container } from "@/components/ui/container";
import { Target } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { getRoadmapData } from "@/modules/roadmap/server";
import { RoadmapView } from "@/modules/roadmap/client";
import { PageHeader } from "@/components/common";

const RoadmapPage: React.FC = async () => {
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

    // Fetch the roadmap and analysis from the modularized server function
    const { plan, analysisSummary } = await getRoadmapData(session.user.id);

    return (
        <Container className="px-0">
            <div className="space-y-6">
                <PageHeader
                    title={`Roadmap`}
                    description={plan ? `Your personalized learning roadmap for ${plan.targetRole}` : `Your personalized learning roadmap`}
                />
                {plan && analysisSummary ? (
                    <RoadmapView plan={plan} analysisSummary={analysisSummary} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Target className="w-16 h-16 text-muted" />
                        <h2 className="text-2xl font-bold text-text">No Roadmap Found</h2>
                        <p className="text-muted max-w-md text-center">
                            You need to generate a roadmap from your resume analysis first.
                            Go to the Resume tab and generate your plan.
                        </p>
                    </div>
                )}
            </div>
        </Container>
    )
};

export default RoadmapPage;