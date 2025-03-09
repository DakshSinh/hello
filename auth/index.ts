import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema";
import { redis } from "@/redis";

export const auth = betterAuth({
  appName: process.env.APP_NAME! || "QR Menu",
  advanced: {
    process.env.NODE_ENV === 'production',
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      ...schema,
    },
  }),
  window: 60, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 10 : 1000, // More permissive in dev
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
    // Add this for better security
    cookie: {
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  },
  plugins: [nextCookies()],
});
