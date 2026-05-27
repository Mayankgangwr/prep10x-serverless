"use client";

import { usePathname, useRouter } from "next/navigation";
import { BookOpen, FileText, LayoutDashboard, Map } from "lucide-react";

import { cn } from "@/lib/utils";

type NavTabId = "dashboard" | "resume" | "roadmap" | "learningPath";

type NavTab = {
  id: NavTabId;
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
};

const tabs: NavTab[] = [
  { id: "dashboard", label: "Home", path: "/dashboard", icon: LayoutDashboard },
  { id: "resume", label: "Resume", path: "/resume", icon: FileText },
  { id: "roadmap", label: "Roadmap", path: "/roadmap", icon: Map },
  { id: "learningPath", label: "Learning", path: "/learning-path", icon: BookOpen },
];

const getActiveTab = (pathname: string): NavTabId => {
  if (pathname.startsWith("/resume")) return "resume";
  if (pathname.startsWith("/roadmap")) return "roadmap";
  if (pathname.startsWith("/learning-path")) return "learningPath";
  return "dashboard";
};

export default function DashboardBottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-[9999] border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        transform: "translateZ(0)",
      }}
    >
      <div className="flex h-16 w-full items-stretch justify-around px-2 shadow-[0_-8px_30px_rgb(0,0,0,0.1)]">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => router.push(tab.path)}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-1 rounded-lg transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive ? "text-primary" : "text-muted-foreground/70"
              )}
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={cn(
                    "transition-transform duration-300",
                    isActive && "scale-110"
                  )}
                />
                {tab.badge ? (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground ring-2 ring-background">
                    {tab.badge > 9 ? "9+" : tab.badge}
                  </span>
                ) : null}
              </div>

              <span
                className={cn(
                  "text-[10px] font-bold tracking-tight",
                  isActive ? "text-primary" : "text-muted-foreground/80"
                )}
              >
                {tab.label}
              </span>

              {isActive ? (
                <div className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary" />
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
