import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { env } from "@/config/env";

let modelInstance: GenerativeModel | null = null;

const getModel = (): GenerativeModel => {
    if (!modelInstance) {
        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

        modelInstance = genAI.getGenerativeModel({
            model: env.GEMINI_MODEL || 'gemini-2.5-flash',
        });
    }

    return modelInstance;
};

const cleanJson = (text: string): string => {
    return text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
};

export const callGemini = async (prompt: string): Promise<unknown> => {
    const model = getModel();

    try {
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `You must return ONLY valid JSON.
                     Do not include explanations.
                     Do not include markdown.
                     Do not include text outside JSON.
                    ${prompt}`,
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature: env.GEMINI_TEMPERATURE,
            },
        });

        const outputText = result.response.text()?.trim();

        if (!outputText) {
            throw new Error("Empty AI response");
        }

        const cleaned = cleanJson(outputText);

        try {
            return JSON.parse(cleaned);
        } catch {
            throw new Error("Invalid JSON received from Gemini service");
        }
    } catch (error: any) {
        // Handle quota retry hint (Gemini gives retryDelay)
        if (error?.message?.includes("Too Many Requests")) {
            throw new Error("Gemini rate limit exceeded");
        }

        throw new Error("Gemini request failed");
    }
};
