// Store interval reference
export let activeInterval = null;
// Starter function
export const startHelthRedis = (fastify) => {
    const healthCheckRedis = async (stable, down) => {
        const now = new Date().toISOString();
        try {
            // Health check
            await fastify.redis.ping();
            // Redis is stable
            fastify.redisAvailable = true;
            fastify.redisSuspiciousCondition = false;
            console.log(`${now}${stable}`);
            if (activeInterval)
                clearInterval(activeInterval);
            runRedisHealthRoutine();
        }
        catch (err) {
            // Redis is down
            fastify.redisAvailable = false;
            console.error(`${now}${down}`);
            if (activeInterval)
                clearInterval(activeInterval);
            runRedisHealthEmergency();
        }
    };
    // Health check for server start-up time
    const redisHealthStartUp = async () => {
        const stable = `:: ✅ [REDIS::HEALTH::STARTUP] :: Server start-up check. Connection is stable.`;
        const down = `:: ⛔️ [REDIS::HEALTH::STARTUP] :: Server start-up check. Connection is DOWN!`;
        healthCheckRedis(stable, down);
    };
    const redisHealthRoutine = async () => {
        const stable = `:: ✅ [REDIS::HEALTH::ROUTINE] :: Periodic health check. Connection is stable.`;
        const down = `:: ⛔️ [REDIS::HEALTH::ROUTINE] :: Periodic health check. Connection is DOWN!`;
        await healthCheckRedis(stable, down);
    };
    // Regular health check for steady condition
    const runRedisHealthRoutine = () => {
        const routine = 1000 * 60 * 10; // Normal interval when Redis is stable
        redisHealthRoutine(); // Run immediatelly
        activeInterval = setInterval(async () => {
            redisHealthRoutine();
        }, routine);
    };
    const redisHealthEmergency = async () => {
        const stable = `:: ✅ [REDIS::HEALTH::EMERGENCY] :: EMERGENCY CHECK! Connection is back up!`;
        const down = `:: ⛔️ [REDIS::HEALTH::EMERGENCY] :: EMERGENCY CHECK! Connection is still DOWN!`;
        await healthCheckRedis(stable, down);
    };
    // Fast health check for when Redis is down
    const runRedisHealthEmergency = () => {
        const emergency = 1000 * 2; // Fast check when Redis is down
        redisHealthEmergency(); // Run immediatelly
        activeInterval = setInterval(async () => redisHealthEmergency(), emergency);
    };
};
