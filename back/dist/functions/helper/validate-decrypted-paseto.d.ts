import { TypeCheck } from "@sinclair/typebox/compiler";
import { DecryptedPasetoObj } from "../../validators.js";
import { TObject } from "@sinclair/typebox";
/**
 * This function takes the returned object of V4.verify() as its argument,
 * and returns the validated object.
 */
export declare const validateDecryptedPasetoObj: (obj: unknown) => DecryptedPasetoObj;
/**
 * This helper function takes a JSON string as its argument
 * which is the 'sub' property of the decrypted paseto object,
 * and performs three tasks:
 * 1. Attempts to parse given JSON string.
 * 2. Validates the parsed paseto sub object.
 * 3. Returns the validated sub object.
 */
export declare const parseAndValidatePasetoSub: <T>(sub: string, Validator: TypeCheck<TObject>) => T;
