import Link from "next/link";

import { SignInForm } from "@/modules/auth/client/sign-in-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Access your dashboard and protected routes.
        </p>
      </div>
      <SignInForm />
      <p className="text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link className="font-medium text-foreground underline underline-offset-4" href="/signup">
          Create one
        </Link>
      </p>
    </div>
  );
}
