import { ValidatorPasetoSubRPT } from "../../validators.js";
/**
 * This helper function takes a JSON string as its argument
 * which is the 'sub' property of the decrypted paseto object,
 * and performs three tasks:
 * 1. Attempts to parse given JSON string.
 * 2. Validates the parsed paseto sub object.
 * 3. Returns the validated sub object.
 */
export const parseAndValidatePasetoSub = (sub, Validator) => {
    // 2. Attempt to parse 'sub'
    //
    //     From: '{"email":"abc@email.com","token":"abcdefg12345"}'
    //     To: { email: "abc@email.com", token: "abcdefg12345" }
    //
    let parsedSub;
    try {
        parsedSub = JSON.parse(sub);
    }
    catch {
        // 'JSON.parse()' parses JSON strings, but also parses
        // number, boolean, and also number/boolean in strings.
        // It only throws error against regular strings and objects.
        throw new Error("");
    }
    // 3. Validate the shape of parsed sub property.
    //   {
    //     email: string;
    //     token: string;
    //    }
    if (!ValidatorPasetoSubRPT.Check(parsedSub))
        throw new Error("⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️⚙️"); // bug in schema??
    const validatedSub = parsedSub;
    // 4. Return validated sub property.
    return validatedSub;
};
