import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema";
import { max } from "drizzle-orm";
import { redis } from "@/redis";

export const auth = betterAuth({
  appName: "Hello",
  advanced: {
    // useSecureCookies: true, // Consider revisiting this setting later: https://www.better-auth.com/docs/concepts/cookies
  },
  secondaryStorage: {
    get: async (key) => {
      const value = await redis.get(key);
      // Simply return the value as is - it's already a string from Redis
      return value;
    },
    set: async (key, value, ttl) => {
      // Ensure value is stringified if it's not already a string
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      if (ttl) await redis.set(key, stringValue, "EX", ttl);
      else await redis.set(key, stringValue);
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      ...schema,
    },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 * 3, // 3 days
    freshAge: 60 * 60 * 24 * 5, // 5 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  rateLimit: {
    window: 60, // 1 minute
    max: 10, // 10 requests
  },
  plugins: [nextCookies()],
});
