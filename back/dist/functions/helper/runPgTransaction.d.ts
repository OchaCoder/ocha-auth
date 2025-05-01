import { Static, TObject } from "@sinclair/typebox";
import { TypeCheck } from "@sinclair/typebox/compiler";
import { FastifyInstance } from "fastify";
import { PoolClient } from "pg";
export declare const runPgTransaction: <T extends TObject>(fastify: FastifyInstance, callback: (client: PoolClient) => Promise<any>, userIdentifier: string | number, validator: TypeCheck<T> | undefined) => Promise<Static<T> | null>;
