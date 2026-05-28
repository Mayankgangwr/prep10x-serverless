"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

import { PageHeader } from "@/components/common";
import Heading from "@/components/common/heading";
import { Button } from "@/components/ui";
import { Container } from "@/components/ui/container";
import UploadResumeForm from "@/modules/resume/client/upload-resume-form";

export default function ResumePage() {
    const router = useRouter();

    return (
        <Container className="px-0">
            {/* <PageHeader
                title="Resume"
                description="Upload your resume first. We will analyze it, show your strengths and gaps, and guide you into the roadmap."
                actions={
                    <Button
                        onClick={() => router.push("/roadmap")}
                        className="min-w-30 flex w-auto items-center justify-center gap-2 font-semibold shadow-sm transition-shadow hover:shadow-md"
                    >
                        <LayoutDashboard size={15} />
                        View Roadmap
                    </Button>
                }
            /> */}
            <UploadResumeForm/>
        </Container>
    );
}
