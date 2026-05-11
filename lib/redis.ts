import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: (process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL)!,
  token: (process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN)!,
});

export const SIGNUP_KEY = "signup_count";
export const SIGNUP_LIMIT = 500;
