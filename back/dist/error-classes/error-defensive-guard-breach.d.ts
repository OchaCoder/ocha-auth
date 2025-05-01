/**
 * This class is meant to catch impossible scenarios during runtime,
 * and provide observable and traceable assertion.
 * Its goal is not to improve UX by triggering frontend actions,
 * but to alert the developer that something has gone fundamentally wrong,
 * suggesting a possible bug scenario.
 */
export declare class ErrorDefensiveGuardBreach extends Error {
    readonly code: string;
    readonly context: {
        file?: string;
        functionName?: string;
        specialJson?: string;
        debug?: unknown;
    };
    readonly timestamp: Date;
    constructor(code?: string, message?: string, context?: {
        file?: string;
        functionName?: string;
        specialJson?: string;
        debug?: unknown;
    });
    /**
     * Prepares a clean JSON version of the error for logging or storage.
     */
    toJSON(): {
        name: string;
        code: string;
        message: string;
        context: {
            file?: string;
            functionName?: string;
            specialJson?: string;
            debug?: unknown;
        };
        timestamp: string;
    };
}
