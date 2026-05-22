import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  sessionOptions: {
    refetchInterval: 0,
    refetchOnWindowFocus: true,
    refetchWhenOffline: false,
  },
});
