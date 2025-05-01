import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
export declare const UserRefreshAccessTokenProxyAdapterSchema: import("@sinclair/typebox").TObject<{
    bid: import("@sinclair/typebox").TString;
    proxyPath: import("@sinclair/typebox").TString;
    payload: import("@sinclair/typebox").TObject<{
        hasData: import("@sinclair/typebox").TBoolean;
        data: import("@sinclair/typebox").TAny;
    }>;
}>;
/**
 * This glue route acts as both a proxy and an adapter:
 *
 * - It forwards the payload to the specified internal route (`proxyPath`) — proxy behavior.
 * - It reshapes the final response by unwrapping the nested success object and attaching new token cookies — adapter behavior.
 *
 * Its purpose is to reduce frontend round trips by handling token refresh and request forwarding in a single operation.
 *
 * This proxy/adapter is used for both static content loading (e.g. Qwik's `routeLoader$`),
 * and operative actions that optionally require input payload (e.g. Qwik's `routeAction$` or `globalAction$`).
 *
 * One might point out that some destination routes — such as `user-delete` — may not need a payload at all.
 *
 * However, to favor an explicit and consistent design, this route **always** expects a `payload` to be present,
 * regardless of what the internal route at `proxyPath` does.
 *
 * Throughout this app, any `payload` in the request body is expected to follow this unified structure:
 *
 * `{ hasData: boolean; data: any | null; }`
 */
export declare const userRefreshAccessTokenProxyAdapter: (fastify: FastifyInstance) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
