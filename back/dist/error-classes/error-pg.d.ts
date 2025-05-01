export declare class ErrorPostgres extends Error {
    readonly description: string;
    constructor(originalError: Error & any, description?: string);
}
