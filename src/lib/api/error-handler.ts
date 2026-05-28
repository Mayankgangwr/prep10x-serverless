import { ZodError } from "zod";

import { ApiError } from "./api-error";
import { failedResponse } from "./response";

type ErrorHandlerOptions = {
    fallbackCode?: string;
    fallbackMessage: string;
};

export const handleApiError = (
    error: unknown,
    { fallbackCode = "INTERNAL_SERVER_ERROR", fallbackMessage }: ErrorHandlerOptions
) => {
    if (error instanceof ApiError) {
        return failedResponse(error.code, error.message, error.status, error.details);
    }

    if (error instanceof ZodError) {
        return failedResponse(
            "VALIDATION_ERROR",
            "Invalid request data.",
            400,
            error.flatten()
        );
    }

    const message = error instanceof Error ? error.message : fallbackMessage;

    return failedResponse(fallbackCode, message || fallbackMessage, 500);
};
