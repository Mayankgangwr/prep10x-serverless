import { Card } from "@/components/ui/card";
import UploadResumeForm from "@/modules/resume/client/upload-resume-form";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Auth is live. Build the protected product flows on top of this session layer.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="px-2 py-2">
          <UploadResumeForm/>
        </Card>
      </div>
    </div>
  );
}
