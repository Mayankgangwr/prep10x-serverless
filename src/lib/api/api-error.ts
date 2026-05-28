export type ApiErrorOptions = {
    code: string;
    message: string;
    status?: number;
    details?: unknown;
};

export class ApiError extends Error {
    readonly code: string;

    readonly status: number;

    readonly details?: unknown;

    constructor({ code, message, status = 500, details }: ApiErrorOptions) {
        super(message);
        this.name = "ApiError";
        this.code = code;
        this.status = status;
        this.details = details;
    }
}
