import "dotenv/config";
import { Static } from "@sinclair/typebox";
declare const EnvSchema: import("@sinclair/typebox").TObject<{
    FRONTEND_URL: import("@sinclair/typebox").TString;
    PORT: import("@sinclair/typebox").TNumber;
    HOST: import("@sinclair/typebox").TString;
    MESSAGE: import("@sinclair/typebox").TString;
    NODE_ENV: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"development">, import("@sinclair/typebox").TLiteral<"production">, import("@sinclair/typebox").TLiteral<"test">]>;
    dbConfig: import("@sinclair/typebox").TObject<{
        host: import("@sinclair/typebox").TString;
        database: import("@sinclair/typebox").TString;
        user: import("@sinclair/typebox").TString;
        password: import("@sinclair/typebox").TString;
        port: import("@sinclair/typebox").TNumber;
        connectionTimeoutMillis: import("@sinclair/typebox").TNumber;
        ssl: import("@sinclair/typebox").TObject<{
            rejectUnauthorized: import("@sinclair/typebox").TBoolean;
        }>;
    }>;
    resend: import("@sinclair/typebox").TString;
    argon2Config: import("@sinclair/typebox").TObject<{
        type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<2>, import("@sinclair/typebox").TLiteral<1>, import("@sinclair/typebox").TLiteral<0>]>;
        memoryCost: import("@sinclair/typebox").TNumber;
        timeCost: import("@sinclair/typebox").TNumber;
        parallelism: import("@sinclair/typebox").TNumber;
    }>;
    pasetoKeys: import("@sinclair/typebox").TObject<{
        secret: import("@sinclair/typebox").TObject<{
            at: import("@sinclair/typebox").TString;
            rt: import("@sinclair/typebox").TString;
            rpt: import("@sinclair/typebox").TString;
        }>;
        public: import("@sinclair/typebox").TObject<{
            at: import("@sinclair/typebox").TString;
            rt: import("@sinclair/typebox").TString;
            rpt: import("@sinclair/typebox").TString;
        }>;
    }>;
    ttl: import("@sinclair/typebox").TObject<{
        at: import("@sinclair/typebox").TString;
        rt: import("@sinclair/typebox").TString;
        rpt: import("@sinclair/typebox").TString;
    }>;
}>;
type EnvType = Static<typeof EnvSchema>;
export declare const config: EnvType;
export {};
