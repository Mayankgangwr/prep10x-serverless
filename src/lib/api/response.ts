import { NextResponse } from "next/server";

type SuccessResponse<T> = {
    success: true;
    data: T;
};

type FailedResponse = {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
};

export const successResponse = <T>(data: T, status = 200) =>
    NextResponse.json<SuccessResponse<T>>(
        {
            success: true,
            data,
        },
        { status }
    );

export const failedResponse = (
    code: string,
    message: string,
    status = 400,
    details?: unknown
) =>
    NextResponse.json<FailedResponse>(
        {
            success: false,
            error: {
                code,
                message,
                details,
            },
        },
        { status }
    );
