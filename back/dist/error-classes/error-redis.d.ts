export declare class ErrorRedis extends Error {
    readonly description: string;
    constructor(originalError: Error & any, description?: string);
}
