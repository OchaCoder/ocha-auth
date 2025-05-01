import "dotenv/config"
import { Value } from "@sinclair/typebox/value"
import { Type, Static } from "@sinclair/typebox"
import { argon2id, argon2i, argon2d } from "argon2"

// Define environment variable schema
const EnvSchema = Type.Object({
  // Frontend
  FRONTEND_URL: Type.String(),
  // Fastify
  PORT: Type.Number({ default: 3002 }), // Will convert string to number
  MESSAGE: Type.String(),
  NODE_ENV: Type.Union([Type.Literal("development"), Type.Literal("production"), Type.Literal("test")]),
  // Neon Postgres
  dbConfig: Type.Object({
    host: Type.String(),
    database: Type.String(),
    user: Type.String(),
    password: Type.String(),
    port: Type.Number({ default: 5432 }),
    connectionTimeoutMillis: Type.Number(),
    ssl: Type.Object({
      rejectUnauthorized: Type.Boolean(),
    }),
  }),
  resend: Type.String(),
  // Argon2
  argon2Config: Type.Object({
    type: Type.Union([Type.Literal(argon2id), Type.Literal(argon2i), Type.Literal(argon2d)]),
    memoryCost: Type.Number(),
    timeCost: Type.Number(),
    parallelism: Type.Number(),
  }),
  // Paseto
  pasetoKeys: Type.Object({
    secret: Type.Object({
      at: Type.String(),
      rt: Type.String(),
      rpt: Type.String(),
    }),
    public: Type.Object({
      at: Type.String(),
      rt: Type.String(),
      rpt: Type.String(),
    }),
  }),
  ttl: Type.Object({
    at: Type.String(), // e.g., "5 seconds"
    rt: Type.String(), // e.g., "72 hours"
    rpt: Type.String(), // e.g., "180 seconds"
  }),
})

// Infer TypeScript type from schema
type EnvType = Static<typeof EnvSchema>

// Some extra work for Argon2
type Argon2TypeKey = "argon2id" | "argon2i" | "argon2d"
const argon2TypeMap: Record<Argon2TypeKey, number> = {
  argon2id: argon2id,
  argon2i: argon2i,
  argon2d: argon2d,
}
const envArgon2Type = process.env.ARGON2_TYPE as Argon2TypeKey

// Why are we providing the default value??
// This is not safe. We want to see errors here if env file is bad!!
const rawEnv = {
  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL,
  // Fastify
  PORT: Number(process.env.PORT),
  MESSAGE: process.env.MESSAGE,
  NODE_ENV: process.env.NODE_ENV,
  // Neon Postgres
  dbConfig: {
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT), // ✅ Postgres port is normally 5432
    connectionTimeoutMillis: process.env.PGCONNECTIONTIMEOUT ? Number(process.env.PGCONNECTIONTIMEOUT) : 5000,
    ssl: { rejectUnauthorized: process.env.PGSSL_REJECT_UNAUTHORIZED === "true" },
  },
  resend: process.env.RESEND, // Connection string.
  argon2Config: {
    type: argon2TypeMap[envArgon2Type], // argon2id | argon2i | argon2d
    memoryCost: Number(process.env.ARGON2_MEMORY_COST),
    timeCost: Number(process.env.ARGON2_TIME_COST),
    parallelism: Number(process.env.ARGON2_PARALLELISM),
  },
  pasetoKeys: {
    public: { at: process.env.PASETO_PUBLIC_KEY_AT, rt: process.env.PASETO_PUBLIC_KEY_RT, rpt: process.env.PASETO_PUBLIC_KEY_RPT },
    secret: { at: process.env.PASETO_SECRET_KEY_AT, rt: process.env.PASETO_SECRET_KEY_RT, rpt: process.env.PASETO_SECRET_KEY_RPT },
  },
  ttl: { at: process.env.AT_TTL, rt: process.env.RT_TTL, rpt: process.env.RPT_TTL },
}

const parsedEnv = (() => {
  // Use TypeBox to validate and ensure correctness
  const result = Value.Decode(EnvSchema, rawEnv)
  return result
})()

// Export the validated, strongly-typed config
export const config: EnvType = parsedEnv
