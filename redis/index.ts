import IORedis from "ioredis";

export const redis = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 2,       // Reduces retry attempts
  connectTimeout: 5000,          // 5s connection timeout
  commandTimeout: 3000,          // 3s command timeout
  enableAutoPipelining: true,    // Batch commands automatically
  keyPrefix: "app:",             // Organize keys
  lazyConnect: true              // Connect only when needed
});