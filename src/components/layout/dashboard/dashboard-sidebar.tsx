"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    FileText,
    LayoutDashboard,
    LogOut,
    Map,
    Settings,
    X,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/client";
import { AUTH_ROUTES } from "@/modules/auth/constants/routes";
import Logo from "@/components/ui/logo";
type DashboardSidebarProps = {
    collapsed: boolean;
    mobileOpen: boolean;
    onToggle: () => void;
    onMobileClose: () => void;
};

type SidebarLink = {
    label: string;
    path: string;
    icon: ReactNode;
};

const navLinks: SidebarLink[] = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Resume", path: "/resume", icon: <FileText size={18} /> },
    { label: "Plan", path: "/plan", icon: <CreditCard size={18} /> },
    { label: "Roadmap", path: "/roadmap", icon: <Map size={18} /> },
    { label: "Learning Path", path: "/learning-path", icon: <BookOpen size={18} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={18} /> },
];

export default function DashboardSidebar({
    collapsed,
    mobileOpen,
    onToggle,
    onMobileClose,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path: string) =>
        pathname === path || pathname.startsWith(`${path}/`);

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    onMobileClose();
                    router.push(AUTH_ROUTES.login);
                    router.refresh();
                },
            },
        });
    };

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/45 backdrop-blur-[1px] transition-opacity duration-200 lg:hidden",
                    mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                onClick={onMobileClose}
            />

            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 flex h-dvh w-70 flex-col border-r border-border bg-background",
                    "transition-all duration-300 ease-in-out lg:z-40 lg:w-auto",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    collapsed ? "lg:w-18" : "lg:w-60"
                )}
            >
                <div
                    className={cn(
                        "flex h-16 items-center border-b border-border px-4",
                        collapsed ? "lg:justify-center" : "gap-3"
                    )}
                >
                    {collapsed ? (
                        <Logo showIcon={true} showText={false} size={42} fontSize={24} />
                    ) : (
                        <Logo size={42} fontSize={24} />
                    )}

                    <button
                        type="button"
                        onClick={onMobileClose}
                        className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
                        aria-label="Close menu"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
                    {navLinks.map((link) => {
                        const active = isActive(link.path);

                        return (
                            <Link
                                key={link.path}
                                href={link.path}
                                title={collapsed ? link.label : undefined}
                                onClick={onMobileClose}
                                className={cn(
                                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                                    "transition-all duration-200",
                                    collapsed && "lg:justify-center",
                                    active
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                {active && (
                                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                                )}
                                <span
                                    className={cn(
                                        "transition-colors",
                                        active
                                            ? "text-primary"
                                            : "text-muted-foreground/70 group-hover:text-foreground/80"
                                    )}
                                >
                                    {link.icon}
                                </span>
                                <span className={cn("lg:block", collapsed && "lg:hidden")}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="space-y-2 border-t border-border p-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleSignOut}
                        title={collapsed ? "Sign out" : undefined}
                        className={cn(
                            "w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                            "text-muted-foreground hover:bg-destructive/5 hover:text-destructive",
                            "focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            collapsed ? "lg:justify-center" : "justify-start"
                        )}
                    >
                        <LogOut size={18} />
                        <span className={cn("lg:block", collapsed && "lg:hidden")}>
                            Sign out
                        </span>
                    </Button>

                    <button
                        type="button"
                        onClick={onToggle}
                        className={cn(
                            "hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium lg:flex",
                            "text-muted-foreground/70 transition-all duration-200 hover:bg-accent hover:text-foreground",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            collapsed ? "justify-center" : "justify-between"
                        )}
                    >
                        <span className={cn("text-xs uppercase tracking-wider", collapsed && "hidden")}>
                            Collapse
                        </span>
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>
            </aside>
        </>
    );
}
