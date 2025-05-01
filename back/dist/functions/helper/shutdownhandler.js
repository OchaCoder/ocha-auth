// 🧼 Listen for Ctrl+C or system termination
export const shutdownHandler = async (fastify) => {
    console.log("\n🔌 Shutdown signal received. Cleaning up...");
    await fastify.close(); // 🧹 Triggers onClose hooks!
    console.log(`
            🌙🌌🌿🍃✨🌙🌌🌿🍃✨🌙🌌🌿🍃✨🌙🌌🌿🍃✨🌙🌌🌿🍃✨🌙🌌🌿🍃✨

            ✨${new Date().toISOString()}✨
            [FASTIFY] :: Server has gone to sleep.

            Thank you for visiting. 💫

            🌙🌌🌿🍃✨🌙🌌🌿🍃✨🌙🌌🌿🍃✨🌙🌌🌿🍃✨🌙🌌🌿🍃✨🌙🌌🌿🍃✨
`);
    process.exit(0);
};
