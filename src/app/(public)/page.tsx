import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PublicHomePage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-6 py-16">
      <div className="max-w-3xl space-y-8">
        <div className="inline-flex items-center rounded-full border border-border/70 bg-white/70 px-4 py-1 text-sm shadow-sm backdrop-blur dark:bg-zinc-950/70">
          AI Serverless SaaS Starter
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
            Build the auth layer first, then scale the full product UI on top of it.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            This app is set up for Better Auth, Prisma, Neon, and Vercel so you can
            establish secure sessions and route-gated layouts before implementing the
            rest of the SaaS surface area.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/signup">Create account</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
