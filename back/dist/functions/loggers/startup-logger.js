import { config } from "../../config.js";
import chalk from "chalk";
export const startupLogger = (fastify) => {
    console.log(`
            🌷🌸🌻✨🌷🌸🌻✨🌷🌸🌻✨🌷🌸🌻✨🌷🌸🌻✨🌷🌸🌻✨🌷🌸🌻✨🌷🌸🌻✨
    
            ✨${new Date().toISOString()}✨
            ${config.MESSAGE} [${config.PORT}]
    
            ${fastify.redisAvailable ? chalk.green(`💚 Redis is UP!`) : chalk.red(`🚨🚨🚨 Redis is DOWN!`)}
            ${fastify.postgresAvailable ? chalk.green(`💚 Postgres is UP!`) : chalk.red(`🚨🚨🚨 Postgres is DOWN!`)}
    
            🌷🌸🌻✨🌷🌸🌻✨🌷🌸🌻✨🌷🌸🌻✨🌷🌸🌻✨🌷🌸🌻✨🌷🌸🌻✨🌷🌸🌻✨
            `);
};
