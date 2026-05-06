import { NextResponse } from "next/server";
import { redis, SIGNUP_KEY, SIGNUP_LIMIT } from "@/lib/redis";

export async function GET() {
  const count = (await redis.get<number>(SIGNUP_KEY)) ?? 0;
  return NextResponse.json({ count, limit: SIGNUP_LIMIT, full: count >= SIGNUP_LIMIT });
}
