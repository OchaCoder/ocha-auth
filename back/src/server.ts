import Fastify from "fastify"
import fastifyCors from "@fastify/cors"
import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import { config } from "./config.js"

// import plugins
import fastifyPostgres from "@fastify/postgres"
import fastifyRedis from "@fastify/redis"
import { errorHandlerPlugin } from "./plugins/error-handler.js"
import { healthCheckRedis } from "./plugins/health-check-redis.js"

// import route handlers
import { userRegister, UserRegisterPayloadSchema } from "./route-handlers/auth/user-register.js"
import { userSignin, UserSignInPayloadSchema } from "./route-handlers/auth/user-signin.js"

import { userRefreshAccessTokenProxyAdapter, UserRefreshAccessTokenProxyAdapterSchema } from "./route-handlers/auth/user-refresh-access-token-proxy-adapter.js"
import { userDashboard } from "./route-handlers/protected/user-dashboard.js"
import { authUserMiddleware } from "./middleware/auth-user-middleware.js"
import { authUserPluginDry, authUserPluginModular } from "./plugins/auth-user-plugin.js"
import { userDelete } from "./route-handlers/protected/user-delete.js"
import { RequestBodyUserUpdateSchema, userUpdate } from "./route-handlers/protected/user-update.js"
import { userEdit } from "./route-handlers/protected/user-edit.js"
import { RequestBodyUserSignOutFromOneSchema, userSignOutFromOne } from "./route-handlers/protected/user-signout-from-one.js"
import { userSignOutFromAll } from "./route-handlers/protected/user-signout-from-all.js"
import { ioredisOptions } from "./plugins/ioredis/ioredis-options.js"
import { ioredisAfterHandler } from "./plugins/ioredis/ioredis-after-handler.js"
import { ioredisErrorDumper } from "./plugins/ioredis/ioredis-error-dumper.js"
import { healthCheckRedisAPI } from "./route-handlers/health-check/redis.js"
import { healthCheckPostgres } from "./plugins/health-check-postgres.js"
import { postgresStartupCheck } from "./functions/helpers/postgres-startup-check.js"
import { shutdownHandler } from "./functions/helpers/shutdown-handler.js"

import { healthCheckPostgresAPI } from "./route-handlers/health-check/postgres.js"
import { UserResetPasswordSchemaPreEmailSchema, userResetPasswordPreEmail } from "./route-handlers/auth/user-reset-password-pre-email.js"
import { UserResetPasswordPostEmailSchema, userResetPasswordPostEmail } from "./route-handlers/auth/user-reset-password-post-email.js"
import { healthEvents } from "./route-handlers/health-events/health-events.js"
import { logStartupMessage } from "./functions/loggers/log-startup-message.js"
import { userResetPasswordVerifyToken, UserResetPasswordVerifyTokenSchema } from "./route-handlers/auth/user-reset-password-verify-token.js"
import { headerCheckerPlugin } from "./plugins/header-checker-plugin.js"

// Create fastify instance
const fastify = Fastify({
  pluginTimeout: 6000, // default is 10000.
}).withTypeProvider<TypeBoxTypeProvider>()

//Register CORS
fastify.register(fastifyCors, {
  origin: ["https://6813b9e7b3562700085de766--incomparable-marigold-3f81ff.netlify.app"],
  credentials: true, // only if cookies is used.
})

// Register Plugins
fastify.register(errorHandlerPlugin)

// Register header checker
fastify.register(headerCheckerPlugin)

// Health checkers
fastify.register(healthCheckRedis)
fastify.register(healthCheckPostgres)

// Register redis plugin
fastify.register(fastifyRedis, ioredisOptions()).after(ioredisAfterHandler(fastify))
fastify.after(() => fastify.redis.on("error", ioredisErrorDumper(fastify)))

// Register postgres plugin
fastify.register(fastifyPostgres, config.dbConfig)

// Request body has only access token (`at`). `payload.hasData` is `false`, and `payload.data` is `null`.
export const ProtectedPayloadHasDataFalseSchema = Type.Object({
  at: Type.String(),
  payload: Type.Object({
    hasData: Type.Literal(false),
    data: Type.Null(),
  }),
})

// Register protected route.
// A [DRY Approach] was implemented to favor a more exposed route structure style, and understandable code view at a glance.
// A more modular approach (see `authUserPluginModular`), or more traditional middleware style (see `authUserMiddleware`) are available.
fastify.register(
  async (protectedFastify) => {
    protectedFastify.register(authUserPluginDry)
    // For loading static data
    protectedFastify.post("/load/dashboard", { schema: { body: ProtectedPayloadHasDataFalseSchema } }, userDashboard(protectedFastify))
    protectedFastify.post("/load/edit", { schema: { body: ProtectedPayloadHasDataFalseSchema } }, userEdit(protectedFastify))
    // For operational action
    protectedFastify.post("/action/delete", { schema: { body: ProtectedPayloadHasDataFalseSchema } }, userDelete(protectedFastify))
    protectedFastify.post("/action/update", { schema: { body: RequestBodyUserUpdateSchema } }, userUpdate(protectedFastify))
    protectedFastify.post("/action/sign-out-from-all", { schema: { body: ProtectedPayloadHasDataFalseSchema } }, userSignOutFromAll(protectedFastify))
    protectedFastify.post("/action/sign-out-from-one", { schema: { body: RequestBodyUserSignOutFromOneSchema } }, userSignOutFromOne(protectedFastify))
  },
  { prefix: "/protected" }
)

// Regular routes
fastify.post("/general/auth/user-register", { schema: UserRegisterPayloadSchema }, userRegister(fastify))
fastify.post("/general/auth/user-signin", { schema: UserSignInPayloadSchema }, userSignin(fastify))
fastify.post("/general/auth/reset-password/pre-email", { schema: UserResetPasswordSchemaPreEmailSchema }, userResetPasswordPreEmail(fastify))
fastify.post("/general/auth/reset-password/verify-token", { schema: UserResetPasswordVerifyTokenSchema }, userResetPasswordVerifyToken(fastify))
fastify.post("/general/auth/reset-password/post-email", { schema: UserResetPasswordPostEmailSchema }, userResetPasswordPostEmail(fastify))
fastify.post("/general/auth/proxy-adapter/refresh-access-token", { schema: UserRefreshAccessTokenProxyAdapterSchema }, userRefreshAccessTokenProxyAdapter(fastify))

// Health Check API
fastify.get("/health-check/postgres", healthCheckPostgresAPI(fastify))
fastify.get("/health-check/redis", healthCheckRedisAPI(fastify))

// Health Event
fastify.get("/health-events", healthEvents(fastify))

// Fatal synchronous errors anywhere in the app.
// Catches Global Errors (even outside Fastify).
process.on("uncaughtException", (err) => {
  console.error("🚨 Uncaught Exception :: Preventing server crash:", err)
  process.exit(1)
})

// Async promise errors that weren’t caught.
// Catches Global Errors (even outside Fastify).
process.on("unhandledRejection", (reason) => {
  console.error("🔥 Unhandled Rejection :: Reason:", reason)
  process.exit(1)
})

// Start the server
const startServer = async () => {
  try {
    fastify.listen({ port: config.PORT })
    await fastify.ready()

    // Start health check for Postgres
    await postgresStartupCheck(fastify)

    // Start health check for Redis
    fastify.healthRedis("STARTUP")

    // Friendly start up log💚🌻
    console.log("⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️")
    logStartupMessage(fastify)

    // Listen for Ctrl+C or system termination
    process.on("SIGINT", () => shutdownHandler(fastify))
    process.on("SIGTERM", () => shutdownHandler(fastify))
  } catch (err) {
    console.error("💥Server failed to start:", err)
    process.exit(1)
  }
}

startServer()
