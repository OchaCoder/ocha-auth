import chalk from "chalk";
// Preserve clean log state by dumping unnecessary error logs.
export const ioredisErrorDumper = (fastify) => {
    return function (err) {
        if (err instanceof Error) {
            switch (true) {
                case err.message.includes("ECONNRESET"):
                case err.message.includes("maxRetriesPerRequest"):
                case err.message.includes("ETIMEDOUT"): // TCP connection failed to establish within the `connectTimeout` after `retryStrategy`.
                case err.message.includes("Socket timeout"): // `socketTimeout` passed during command execution on application level. Entering retryStrategy.
                case err.message.includes("Command timed out"): // Only thrown when `commandTimeout` is set to true.
                    break;
            }
        }
    };
};
// Useful logging templates
export const errLogIoredisETIMEDOUT = (fastify, err) => {
    return console.error(`
  ----------------------------------------------------
  ${chalk.red("💥 [ERROR]".padEnd(20))}${chalk.red(`ioredis (@fastify/redis)`)}
  ${chalk.hex("#ff5733")("⏱️  [TIMESTAMP]".padEnd(20))} ${new Date().toISOString()}
  ${chalk.hex("#ff5733")("✉️  [MESSAGE]".padEnd(20))} Connection attempt timed out (ETIMEDOUT).
  ----------------------------------------------------
  ${chalk.yellow("ℹ️  [CAUSE]".padEnd(20))} TCP connection failed to establish within the timeout period.
  ${chalk.yellow("ℹ️  [IMPACT]".padEnd(20))} Connection aborted. ioredis will attempt to retry.
  ${chalk.yellow("ℹ️  [PROCESS PID]".padEnd(20))} ${process.pid}
  ${chalk.yellow("ℹ️  [REDIS HOST]".padEnd(20))} ${fastify.redis.options.host || "Unknown"}
  ${chalk.yellow("ℹ️  [REDIS PORT]".padEnd(20))} ${fastify.redis.options.port || "Unknown"}
  ${chalk.yellow("ℹ️  [CODE & SYSCALL]".padEnd(20))} code:${err.code ?? "N/A"}, syscall:${err.syscall ?? "N/A"}
  ----------------------------------------------------
  ${chalk.gray("ℹ️  [REDIS OPTIONS]".padEnd(20))} connectTimeout = ${fastify.redis.options.connectTimeout ?? "N/A"}
  ${chalk.gray("ℹ️  [REDIS OPTIONS]".padEnd(20))} retryStrategy = 1000
  ----------------------------------------------------
  `);
};
export const errLogIoredisSocketTimeout = (fastify) => {
    return console.error(`
    ----------------------------------------------------
    ${chalk.red("💥 [ERROR]".padEnd(20))}${chalk.red(`ioredis (@fastify/redis)`)}
    ${chalk.hex("#ff5733")("⏱️  [TIMESTAMP]".padEnd(20))} ${new Date().toISOString()}
    ${chalk.hex("#ff5733")("✉️  [MESSAGE]".padEnd(20))} TCP socket timeout: No data received within ${fastify.redis.options.socketTimeout}.
    ----------------------------------------------------
    ${chalk.yellow("ℹ️  [CAUSE]".padEnd(20))} Connection assumed established, but socket expired. 
    ${chalk.yellow("ℹ️  [IMPACT]".padEnd(20))} Network marked as broken. ioredis entering reconnection loop.
    ${chalk.yellow("ℹ️  [PROCESS PID]".padEnd(20))} ${process.pid}
    ${chalk.yellow("ℹ️  [REDIS HOST]".padEnd(20))} ${fastify.redis.options.host || "Unknown"}
    ${chalk.yellow("ℹ️  [REDIS PORT]".padEnd(20))} ${fastify.redis.options.port || "Unknown"}
    ----------------------------------------------------
    ${chalk.gray("ℹ️  [REDIS OPTIONS]".padEnd(20))} socketTimeout = ${fastify.redis.options.socketTimeout ?? "N/A"}
    ----------------------------------------------------
    `);
};
