import path from "path";
import { fileURLToPath } from "url";
const shortenFilePath = (input) => {
    const filePath = fileURLToPath(input);
    const relative = path.relative(path.resolve(), filePath);
    const parts = relative.split(path.sep).slice(1); // Trim the top-level folder
    const adjusted = path.join(...parts).replace(/\.js$/, ".ts");
    return `./${adjusted}`;
};
/**
 * Extracts a concise file path from the given error stack.
 * Returns an object with a single 'file' property pointing to the caller's source file,
 * formatted relative to the project root and adjusted to match the original .ts source.
 */
export function extractFilepathFromStack(stack) {
    if (!stack)
        return {};
    const lines = stack.split("\n");
    const targetLine = lines[2]; // Usually the caller of the constructor.
    const regExpRule = {
        named: /at\s+(.*)\s+\((.*):(\d+):(\d+)\)/,
        anonymous: /at\s+(.*):(\d+):(\d+)/,
    };
    // Example line: "    at someFunction (/path/to/file.ts:42:13)"
    // 'match()' returns 'null' or 'RegExpMatchArray'.
    // A 'RegExpMatchArray' will look like:
    //   [
    //     group1,            // entire match: "at someFunction (/path/to/file.ts:42:13)"
    //     group2,            // function name: "someFunction"
    //     group3,            // file path: "/path/to/file.ts"
    //     group4,            // line number: "42"
    //     group5             // column number: "13"
    //   ]
    const match = targetLine?.match(regExpRule.named) || targetLine?.match(regExpRule.anonymous);
    if (!match)
        return {};
    let filePath;
    if (match.length === 5)
        filePath = match[2];
    if (match.length === 4)
        filePath = match[1];
    if (typeof filePath === "string") {
        const shortUrl = shortenFilePath(filePath);
        return { file: shortUrl };
    }
    return {};
}
