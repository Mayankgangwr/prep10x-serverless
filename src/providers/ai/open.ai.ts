import OpenAI from "openai";
import { env } from "@/config/env";



const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
});

export const callOpenAI = async (prompt: string): Promise<unknown> => {
    try {
        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            temperature: 0.3,
            input: [
                {
                    role: "system",
                    content: "Return valid JSON only.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const outputText = response.output_text?.trim();
        if (!outputText) {
            throw new Error("Empty AI response");
        }

        try {
            return JSON.parse(outputText) as unknown;
        } catch {
            throw new Error("Invalid JSON received from AI service");
        }
    } catch (error) {
        if (error) {
            throw error;
        }
        throw new Error("OpenAI request failed");
    }
};
