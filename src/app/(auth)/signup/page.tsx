import Link from "next/link";

import { SignUpForm } from "@/modules/auth/client/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start with email and password, then expand the product surface.
        </p>
      </div>
      <SignUpForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-foreground underline underline-offset-4" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
