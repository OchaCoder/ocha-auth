/**
 * This class gives special attention to suspicious user behavior,
 * providing semantically clear communication within the codebase,
 * and ensuring future extensibility—such as integration
 * with Prometheus/Grafana or WAF (Web Application Firewall) logs—
 * by serving as a convenient adapter layer.
 *
 * It can also be used as a centralized audit and
 * tracing layer to describe suspicious user activity.
 *
 * @property {string} code - Custom application-level error code.
 * @property {string} [description] - Optional human-readable description for logs or future developers.
 * @property {SuspiciousActorInfo} [actorInfo] - Optional details about the user, device, or request source.
 */
export declare class ErrorSuspiciousActivity extends Error {
    readonly code: string;
    readonly suspiciousActor: {
        ip?: string;
        userAgent?: string;
        browserId?: string;
        identity?: string;
        geoLocation?: {
            country?: string;
            city?: string;
            region?: string;
            lat?: number;
            lon?: number;
        };
    };
    readonly context: {
        file?: string;
        functionName?: string;
        specialJson?: string;
        debug?: unknown;
    };
    readonly timestamp: Date;
    constructor(code?: string, message?: string, suspiciousActor?: {
        ip?: string;
        userAgent?: string;
        browserId?: string;
        identity?: string;
        geoLocation?: {
            country?: string;
            city?: string;
            region?: string;
            lat?: number;
            lon?: number;
        };
    }, context?: {
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
        suspiciousActor: {
            ip?: string;
            userAgent?: string;
            browserId?: string;
            identity?: string;
            geoLocation?: {
                country?: string;
                city?: string;
                region?: string;
                lat?: number;
                lon?: number;
            };
        };
        context: {
            file?: string;
            functionName?: string;
            specialJson?: string;
            debug?: unknown;
        };
        timestamp: string;
    };
}
