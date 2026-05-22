"use client";

import { useState, type ReactNode } from "react";

import { Container } from "@/components/ui/container";

import DashboardBottomBar from "./dashboard-bottom-bar";
import DashboardHeader from "./dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";

type DashboardShellProps = {
  children: ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <DashboardSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed((current) => !current)}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        data-collapsed={collapsed}
        className="flex min-h-screen flex-col lg:ml-60 lg:transition-all lg:duration-300 lg:ease-in-out lg:data-[collapsed=true]:ml-[4.5rem]"
      >
        <DashboardHeader
          onOpenMobileMenu={() => setMobileOpen(true)}
          user={user}
        />

        <main className="flex-1 pb-18.5 pt-3 md:pb-6">
          <Container padding="sm">{children}</Container>
        </main>
      </div>

      <DashboardBottomBar />
    </div>
  );
}
