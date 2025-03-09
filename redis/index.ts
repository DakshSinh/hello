import IORedis from "ioredis";

// Create a singleton Redis connection to be reused
const createRedisClient = () => {
  // Don't create Redis client during build time
  if (process.env.NODE_ENV === "production" && !process.env.REDIS_URL) {
    console.warn("REDIS_URL not provided in production environment");
    // Provide fallback for better error handling
    return null;
  }

  try {
    const client = new IORedis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
      commandTimeout: 3000,
      enableAutoPipelining: true,
      keyPrefix: "app:",
      lazyConnect: true,
      // Add reconnect strategy
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    // Add event listeners for better error monitoring
    client.on("error", (err) => {
      console.error("Redis connection error:", err);
    });

    return client;
  } catch (error) {
    console.error("Failed to initialize Redis client:", error);
    return null;
  }
};

export const redis = createRedisClient();
