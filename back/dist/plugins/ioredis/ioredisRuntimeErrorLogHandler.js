import chalk from "chalk";
export const ioredisRuntimeErrorLogHandler = (fastify) => {
    return console.error(`
        ----------------------------------------------------
        ${chalk.red("💥 [ERROR]".padEnd(20))}${chalk.red(`Runtime Redis Failure`)}
        ${chalk.hex("#ff5733")("⏱️  [TIMESTAMP]".padEnd(20))} ${new Date().toISOString()}
        ${chalk.hex("#ff5733")("✉️  [MESSAGE]".padEnd(20))} ioredis became unavailable during runtime.
        ----------------------------------------------------
        ${chalk.yellow("ℹ️  [CAUSE]".padEnd(20))} Health check has detected Redis down.
        ${chalk.yellow("ℹ️  [IMPACT]".padEnd(20))} ${chalk.red("REDIS IS CURRENTLY UNAVAILABLE.")} Functionality may be degraded.
        ${chalk.yellow("ℹ️  [PROCESS PID]".padEnd(20))} ${process.pid}
        ${chalk.yellow("ℹ️  [REDIS HOST]".padEnd(20))} ${fastify.redis.options.host || "Unknown"}
        ${chalk.yellow("ℹ️  [REDIS PORT]".padEnd(20))} ${fastify.redis.options.port || "Unknown"}
        ----------------------------------------------------
        
    `);
};
