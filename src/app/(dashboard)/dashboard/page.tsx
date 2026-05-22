import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Auth is live. Build the protected product flows on top of this session layer.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session</CardTitle>
            <CardDescription>Better Auth server-side session payload.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">User:</span> {session?.user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {session?.user.email}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
            <CardDescription>Use this layout to gate the rest of the SaaS.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Add Prisma migrations to Neon.</p>
            <p>2. Build protected dashboard modules under route groups.</p>
            <p>3. Add roadmap, resume, interview, and billing sections later.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
