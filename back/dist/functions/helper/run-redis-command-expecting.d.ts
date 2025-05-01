import { FastifyInstance } from "fastify";
import { TypeCheck } from "@sinclair/typebox/compiler";
import { StaticDecode, TObject } from "@sinclair/typebox";
/**
 * This helper is designed for Redis commands that return data.
 *
 * It parses and validates the returned data against a provided TypeBox schema.
 *
 * @returns The decoded and validated data, or `null` if the key was not found.
 */
export declare const runRedisGetExpecting: <T extends TObject>(fastify: FastifyInstance, callback: () => Promise<string | number>, userIdentifier: string | number | undefined, validator: TypeCheck<T>) => Promise<StaticDecode<T, []> | null>;
