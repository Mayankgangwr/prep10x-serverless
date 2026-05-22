"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { AUTH_ROUTES } from "@/modules/auth/constants/routes";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(AUTH_ROUTES.login);
          router.refresh();
        },
      },
    });
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Sign out
    </Button>
  );
}
