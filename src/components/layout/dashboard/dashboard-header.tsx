"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/client";
import { AUTH_ROUTES } from "@/modules/auth/constants/routes";
import Logo from "@/components/ui/logo";

type DashboardHeaderProps = {
    onOpenMobileMenu: () => void;
    user?: {
        name?: string | null;
        email?: string | null;
    } | null;
};

export default function DashboardHeader({
    onOpenMobileMenu,
    user,
}: DashboardHeaderProps) {
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const fullName = user?.name?.trim() || "User";
    const initials = fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

    useEffect(() => {
        if (!isMenuOpen) {
            return undefined;
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isMenuOpen]);

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    setIsMenuOpen(false);
                    router.push(AUTH_ROUTES.login);
                    router.refresh();
                },
            },
        });
    };

    return (
        <header className="sticky top-0 z-30 h-16 border-b border-border/70 bg-background/85 px-3 backdrop-blur-md sm:px-4 lg:px-6">
            <div className="flex h-full items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <Logo size={42} fontSize={24} className="lg:hidden" onClick={onOpenMobileMenu} />
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Button asChild variant="ghost" className="hidden lg:inline-flex">
                        <Link href="/">Public site</Link>
                    </Button>

                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            id="avatar-menu-btn"
                            onClick={() => setIsMenuOpen((current) => !current)}
                            aria-expanded={isMenuOpen}
                            aria-haspopup="menu"
                            aria-controls={isMenuOpen ? "avatar-menu" : undefined}
                            aria-label="Open account menu"
                            className="group flex items-center gap-1 rounded-xl py-1 pl-1 pr-2 transition-all duration-200 hover:bg-surface/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-2 sm:pl-2 sm:pr-3"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-rose-500 text-xs font-bold text-primary-foreground shadow-md">
                                {initials || "U"}
                            </div>
                            <div className="hidden text-left md:block">
                                <p className="text-sm font-medium leading-none text-foreground/90">
                                    {fullName}
                                </p>
                                <p className="mt-0.5 truncate text-xs leading-none text-foreground/45">
                                    {user?.email ?? ""}
                                </p>
                            </div>
                            <span className="hidden lg:inline">
                                <ChevronDown
                                    size={14}
                                    className={cn(
                                        "text-foreground/35 transition-transform duration-200",
                                        isMenuOpen && "rotate-180"
                                    )}
                                />
                            </span>
                        </button>

                        {isMenuOpen ? (
                            <div
                                id="avatar-menu"
                                role="menu"
                                aria-labelledby="avatar-menu-btn"
                                className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-black/25"
                            >
                                <div className="border-b border-border px-4 py-3">
                                    <p className="text-sm font-medium text-foreground/90">
                                        {fullName}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-foreground/45">
                                        {user?.email ?? ""}
                                    </p>
                                </div>

                                <div className="py-1">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-foreground/65 transition-colors hover:bg-surface hover:text-foreground focus-visible:bg-surface focus-visible:text-foreground focus-visible:outline-none"
                                        role="menuitem"
                                    >
                                        <UserCircle2 size={16} />
                                        Profile
                                    </Link>

                                    <div className="mt-1 border-t border-border pt-1">
                                        <button
                                            type="button"
                                            onClick={handleSignOut}
                                            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-error transition-colors hover:bg-error/5 hover:text-error/80 focus-visible:bg-error/5 focus-visible:text-error/80 focus-visible:outline-none"
                                            role="menuitem"
                                        >
                                            <LogOut size={16} />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </header>
    );
}
