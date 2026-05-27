import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma/client";
import { env } from "@/config/env";

const baseURL = {
  allowedHosts: ["localhost:3000", "*.vercel.app"] as string[],
  fallback: env.BETTER_AUTH_URL,
  protocol: "auto" as const,
};

export const auth = betterAuth({
  appName: "prep10x-serverless",
  baseURL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 300,
    },
  },
});
