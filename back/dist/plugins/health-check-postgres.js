import chalk from "chalk";
import fp from "fastify-plugin";
import { errLogPgFailedHealthCheck } from "../functions/loggers/log-pg-errors.js";
import { sseHealth } from "../functions/helpers/sse-broadcaster.js";
export const healthCheckPostgres = fp(async (fastify) => {
    // Store the timeout ID to manage recurring health checks
    fastify.decorate("postgresAvailable", true);
    fastify.decorate("healthIdPostgres", null);
    fastify.addHook("onClose", (instance, done) => {
        if (fastify.healthIdPostgres)
            clearTimeout(fastify.healthIdPostgres);
        console.log(chalk.green(`${new Date().toISOString()} :: ✅ healthCheckPostgres :: timeout was cleared up.`));
        done();
    });
    /**
     * Runs a Postgres health check and schedules the next check.
     * Depending on the result, it either:
     * - Continues with routine checks if Postgres is stable.
     * - Switches to emergency mode if Postgres is unresponsive.
     */
    const healthCheckPostgres = (checkType) => {
        // Clear any existing scheduled health check before setting a new one
        if (fastify.healthIdPostgres)
            clearTimeout(fastify.healthIdPostgres);
        let stableMessage, downMessage;
        let addInterval = 0; // Optinally, add more interval on top of node-pg's own timeout feature (connectionTimeoutMillis).
        const routineInterval = 1000 * 60;
        switch (checkType) {
            case "STARTUP":
                stableMessage = `:: ✅ [POSTGRES::HEALTH::STARTUP_CHECK] :: Passed with latency of `;
                downMessage = `:: ⛔️ [POSTGRES::HEALTH::STARTUP_CHECK] :: Connection is DOWN!`;
                break;
            case "ROUTINE":
                stableMessage = `:: ✅ [POSTGRES::HEALTH::ROUTINE_CHECK] :: Passed with latency of `;
                downMessage = `:: ⛔️ [POSTGRES::HEALTH::ROUTINE_CHECK] :: Connection is DOWN!`;
                break;
            case "SPECIAL":
                stableMessage = `:: ✅ [POSTGRES::HEALTH::SPECIAL_CHECK] :: Suspicious flag triggered. Check passed with latency of `;
                downMessage = `:: ⛔️ [POSTGRES::HEALTH::SPECIAL_CHECK] :: Suspicious flag triggered. Connection is DOWN!`;
                break;
            case "EMERGENCY":
                stableMessage = `:: ✅ [POSTGRES::HEALTH::EMERGENCY_CHECK] :: Connection restored. Latency: `;
                downMessage = `:: ⛔️ [POSTGRES::HEALTH::EMERGENCY_CHECK] :: Connection is DOWN!`;
                break;
        }
        // Perform the Postgres health check asynchronously and schedule the next check
        ;
        (async () => {
            try {
                // Measure Postgres ping latency
                const before = Date.now();
                const client = await fastify.pg.connect();
                client.release();
                const after = Date.now();
                const latency = `${after - before}ms.`;
                // Mark Postgres as available
                fastify.postgresAvailable = true;
                // Decide whether push needs to be sent
                sseHealth(fastify);
                // 🌻🌸🌷Maybe update fastify.realtimeHealth.redis here??🌻🌸🌷
                console.log(chalk.green(`${new Date().toISOString()}${stableMessage}${chalk.bold(`${latency}`)}`));
                // If the check was "ROUTINE" and Postgres is stable, extend the interval
                if (checkType === "ROUTINE")
                    addInterval = routineInterval; // Increase routine interval to reduce unnecessary pings
                // Schedule the next routine check
                fastify.healthIdPostgres = setTimeout(() => healthCheckPostgres("ROUTINE"), addInterval);
            }
            catch {
                // If Postgres is down, log the failure and switch to emergency checks
                // Detailed log only the first time.
                if (fastify.postgresAvailable)
                    errLogPgFailedHealthCheck(fastify);
                // Simpler log for the continuous down detection.
                else
                    console.error(chalk.red(`${new Date().toISOString()}${downMessage}`));
                // Mark Postgres as unavailable
                fastify.postgresAvailable = false;
                // Decide whether push needs to be sent
                sseHealth(fastify);
                // 🌻🌸🌷Maybe update fastify.realtimeHealth.redis here??🌻🌸🌷
                // Schedule an emergency health check
                fastify.healthIdPostgres = setTimeout(() => healthCheckPostgres("EMERGENCY"), addInterval);
            }
        })();
    };
    // Expose the health check function via Fastify's decorator system
    // Use it is as healthPostgres("STARTUP") or healthPostgres("SPECIAL").
    fastify.decorate("healthPostgres", healthCheckPostgres);
});
