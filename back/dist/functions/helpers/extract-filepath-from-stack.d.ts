type CodeContext = {
    file?: string;
};
/**
 * Extracts a concise file path from the given error stack.
 * Returns an object with a single 'file' property pointing to the caller's source file,
 * formatted relative to the project root and adjusted to match the original .ts source.
 */
export declare function extractFilepathFromStack(stack?: string): CodeContext;
export {};
