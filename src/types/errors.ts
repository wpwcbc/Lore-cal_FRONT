// errors.ts

export type ErrorKind =
    | "NETWORK"
    | "TIMEOUT"
    | "HTTP"
    | "API"
    | "UNKNOWN"
    | "DECODE";

export class AppError extends Error {
    kind: ErrorKind;
    status?: number;
    path?: string;
    method?: string;
    cause?: unknown;
    constructor(params: {
        kind: ErrorKind;
        message?: string; // developer-facing
        safeMessage?: string; // user-facing if you want
        status?: number;
        path?: string;
        method?: string;
        cause?: unknown;
    }) {
        super(params.message ?? params.safeMessage ?? "Error");
        this.name = "AppError";
        this.kind = params.kind;
        this.status = params.status;
        this.path = params.path;
        this.method = params.method;
        this.cause = params.cause;
    }
}
