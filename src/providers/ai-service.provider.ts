
import { env } from "../config/env";
import { callGemini } from "./ai/gemini.ai";
import { callOpenAI } from "./ai/open.ai";

export type AiProvider = "gemini" | "openai";

export interface ConfiguredAiResult {
  data: unknown;
  providerUsed: AiProvider;
  modelUsed: string;
}

export const resolveProvider = (): AiProvider => {
  return "gemini";
};

export const callConfiguredProvider = async (prompt: string): Promise<ConfiguredAiResult> => {
  const provider = resolveProvider();

  try {
    if (provider === "openai") {
      return {
        data: await callOpenAI(prompt),
        providerUsed: "openai",
        modelUsed: env.OPENAI_MODEL || "gpt-4.1-mini",
      };
    }

    return {
      data: await callGemini(prompt),
      providerUsed: "gemini",
      modelUsed: env.GEMINI_MODEL || "gemini-2.5-flash",
    };
  } catch (error) {
    console.error("ai_provider_failure", {
      provider,
      model: provider === "openai" ? env.OPENAI_MODEL : env.GEMINI_MODEL,
      promptLength: prompt.length,
      message: error instanceof Error ? error.message : "Unknown AI error",
    });
    throw error;
  }
};
