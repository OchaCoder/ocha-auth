export const ioredisOptions = (fastify) => {
    const options = {
        //How long the client will wait before killing a socket due to inactivity during initial connection.
        // Terminal Commands During Dev : Block Redis to simulate the connection loss
        // 🌸🌸🌸 [Block] echo "block drop out proto tcp from any to regular-adder-15244.upstash.io port 6379" | sudo pfctl -ef -
        // 🌸🌸🌸 [Recover] sudo pfctl -F all -f /etc/pf.conf
        url: "rediss://default:ATuMAAIjcDFiMTZiODFhZjdlNjI0MmUyOTQ1M2QwM2VmNjA2MDRmOXAxMA@regular-adder-15244.upstash.io:6379",
        socketTimeout: 2000,
        // Handles command execution phase, and focuses on application-level responsiveness.
        // Throws [Error: Socket timeout] when expired, and reconnect strategy will kick in.
        connectTimeout: 1000,
        // Handles TCP phase, and focused on network-level connection.
        // If timeout happens, [ERROR::ETIMEDOUT] is thrown.
        // How long the client will wait before killing a socket due to inactivity during initial connection
        // Waits this much after retryStrategy time, and triggeres `Error: connect ETIMEDOUT`
        // retryStrategy kicks in emmedietely after [ETIMEDOUT] is thrown.
        retryStrategy: (attempt) => {
            const retryDuration = 1000;
            const retryMessage = `:: 🔄 [REDIS::CONNECTION_RETRY] :: Connection attempt #${attempt} in progress — will retry for ${retryDuration}ms.`;
            console.log(`${new Date().toISOString() + retryMessage}`);
            // let elapsed = 0
            // const interval = setInterval(() => {
            //   elapsed += 1000
            //   const logRetrying = `:: 🔄 [REDIS::CONNECTION_RETRY] :: Still retrying... [${elapsed}/${retryDuration}ms]`
            //   console.log(`${new Date().toISOString() + logRetrying}`)
            //   if (elapsed >= retryDuration) clearInterval(interval)
            // }, 1000)
            return retryDuration;
        },
        enableOfflineQueue: false, // Controls what happens when Redis is completely down.
        //commandTimeout: fastify.redisAvailable ? undefined : 1100, // If a command does not return a reply within a set number of milliseconds, a "Command timed out" error will be thrown.
        //commandTimeout: 4100,
        maxRetriesPerRequest: 1,
        // Deliberate fail-fast choice after the set number of retry.
        // ensures commands don’t linger in a queue.
        // enableReadyCheck: true,
    };
    return options;
};
