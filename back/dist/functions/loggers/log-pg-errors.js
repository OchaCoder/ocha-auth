import chalk from "chalk";
import { config } from "../../config.js";
export const errLogPgFailedHealthCheck = (fastify) => {
    return console.error(`
                ----------------------------------------------------
                ${chalk.red("💥 [ERROR]".padEnd(20))}${chalk.red(`Runtime Postgres Failure`)}
                ${chalk.hex("#ff5733")("⏱️  [TIMESTAMP]".padEnd(20))} ${new Date().toISOString()}
                ${chalk.hex("#ff5733")("✉️  [MESSAGE]".padEnd(20))} Postgres became unavailable during runtime.
                ----------------------------------------------------
                ${chalk.yellow("ℹ️  [CAUSE]".padEnd(20))} Postgres health check failed.
                ${chalk.yellow("ℹ️  [IMPACT]".padEnd(20))} ${chalk.red("POSTGRES IS CURRENTLY UNAVAILABLE.")} Some features may be degraded.
                ${chalk.yellow("ℹ️  [PROCESS PID]".padEnd(20))} ${process.pid}
                ${chalk.yellow("ℹ️  [POSTGRES HOST]".padEnd(24))} ${config.dbConfig.host || "Unknown"}
                ${chalk.yellow("ℹ️  [POSTGRES PORT]".padEnd(24))} ${config.dbConfig.port || "Unknown"}
                ----------------------------------------------------
`);
};
export const errLogPgFailedOnStartUp = (fastify, maxRetries) => {
    return console.error(`
                ----------------------------------------------------
                ${chalk.red("💥 [ERROR]".padEnd(24))}${chalk.red(`node-pg (@fastify-postgres)`)}
                ${chalk.hex("#ff5733")("⏱️  [TIMESTAMP]".padEnd(24))} ${new Date().toISOString()}
                ${chalk.hex("#ff5733")("✉️  [MESSAGE]".padEnd(24))} pg failed to connect to Postgres.
                ${chalk.gray("✉️  [RETRY COUNT]".padEnd(24))} ${chalk.hex("#FFA500")(maxRetries)} - Defined in ${chalk.hex("#FFA500")(`postgresStartupCheck`)}
                ----------------------------------------------------
                ${chalk.yellow("ℹ️  [CAUSE]".padEnd(24))} Reconnection strategy failed during Fastify startup.
                ${chalk.yellow("ℹ️  [IMPACT]".padEnd(24))} ${chalk.red("FASTIFY IS RUNNING WITHOUT POSTGRES.")} node-pg will continue the health-check in the background.
                ${chalk.yellow("ℹ️  [PROCESS PID]".padEnd(24))} ${process.pid}
                ${chalk.yellow("ℹ️  [POSTGRES HOST]".padEnd(24))} ${config.dbConfig.host || "Unknown"}
                ${chalk.yellow("ℹ️  [POSTGRES PORT]".padEnd(24))} ${config.dbConfig.port || "Unknown"}
                ----------------------------------------------------
                ${chalk.gray("ℹ️  [original message]".padEnd(24))} Connection terminated due to connection timeout
                ${chalk.gray("ℹ️  [original cause]".padEnd(24))} Connection terminated unexpectedly  
                ----------------------------------------------------
`);
};
export const errLogPgWrongCredential = (fastify) => {
    return console.error(`
                ----------------------------------------------------
                ${chalk.red("💥 [ERROR]".padEnd(24))}${chalk.red(`node-pg (@fastify-postgres)`)}
                ${chalk.hex("#ff5733")("⏱️  [TIMESTAMP]".padEnd(24))} ${new Date().toISOString()}
                ${chalk.hex("#ff5733")("✉️  [MESSAGE]".padEnd(24))} Password authentication failed for user 'neondb_owner'.
                ----------------------------------------------------
                ${chalk.yellow("ℹ️  [CAUSE]".padEnd(24))} Credentials were likely incorrect and rejected by Postgres.
                ${chalk.yellow("ℹ️  [IMPACT]".padEnd(24))} ${chalk.red("DO NOT START FASTIFY!")} This is likely a human error. Please check the ${chalk.hex("#FFA500")("pg options")} again!
                ${chalk.yellow("ℹ️  [PROCESS PID]".padEnd(24))} ${process.pid}
                ${chalk.yellow("ℹ️  [POSTGRES HOST]".padEnd(24))} ${config.dbConfig.host || "Unknown"}
                ${chalk.yellow("ℹ️  [POSTGRES PORT]".padEnd(24))} ${config.dbConfig.port || "Unknown"}
                ----------------------------------------------------
                ${chalk.gray("ℹ️  [CODE]".padEnd(24))} XX000
                ----------------------------------------------------
`);
};
export const errLogPgUserRequestNotFulfilled = (fastify, userIdentifier, userWait) => {
    console.error(`
              ----------------------------------------------------
              ${chalk.red("💥 [ERROR]".padEnd(20))}${chalk.red(`node-postgres (@fastify/postgres)`)}
              ${chalk.hex("#ff5733")("⏱️  [TIMESTAMP]".padEnd(20))} ${new Date().toISOString()}
              ${chalk.hex("#ff5733")("✉️  [MESSAGE]".padEnd(20))} The user's request could not be fulfilled.
              ----------------------------------------------------
              ${chalk.yellow("ℹ️  [CAUSE]".padEnd(20))} Postgres was unavailable during the request.
              ${chalk.yellow("ℹ️  [IMPACT]".padEnd(20))} A user request has failed.
              ${chalk.yellow("ℹ️  [PROCESS PID]".padEnd(20))} ${process.pid}
              ${chalk.yellow("ℹ️  [POSTGRES HOST]".padEnd(20))} ${config.dbConfig.host || "Unknown"}
              ${chalk.yellow("ℹ️  [POSTGRES PORT]".padEnd(20))} ${config.dbConfig.port || "Unknown"}
              ----------------------------------------------------
              ${chalk.gray("ℹ️  [USER]".padEnd(20))} ${userIdentifier ?? "N/A"}
              ${chalk.gray("ℹ️  [USER WAIT TIME]".padEnd(20))} ${userWait ? `${userWait}ms` : `N/A`}
              ${chalk.gray("ℹ️  [ACTION]".padEnd(20))} User redirected to '/oops'.
              ----------------------------------------------------
`);
};
