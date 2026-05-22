import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import DashboardShell from "@/components/layout/dashboard/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
    >
      {children}
    </DashboardShell>
  );
}
