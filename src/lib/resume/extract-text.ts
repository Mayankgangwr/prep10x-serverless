import "server-only";

import pdf from "pdf-parse-new";
const MAX_RESUME_TEXT_CHARS = 12_000;

export const extractTextFromPdf = async (buffer: Buffer): Promise<string> => {
  const parsed = await pdf(buffer);

  try {
    return preprocessResumeText(parsed.text) ?? "";
  } finally {
    await parsed.info;
  }
};

export const preprocessResumeText = (text: string): string => {
  return text
    .replace(/[^\x00-\x7F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_RESUME_TEXT_CHARS);
};
