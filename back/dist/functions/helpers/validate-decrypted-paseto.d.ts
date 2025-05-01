import { TypeCheck } from "@sinclair/typebox/compiler";
import { TObject } from "@sinclair/typebox";
/**
 * This helper function takes a JSON string as its argument
 * which is the 'sub' property of the decrypted paseto object,
 * and performs three tasks:
 * 1. Attempts to parse given JSON string.
 * 2. Validates the parsed paseto sub object.
 * 3. Returns the validated sub object.
 */
export declare const parseAndValidatePasetoSub: <T>(sub: string, Validator: TypeCheck<TObject>) => T;
