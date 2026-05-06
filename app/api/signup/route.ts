import { NextRequest, NextResponse } from "next/server";
import { redis, SIGNUP_KEY, SIGNUP_LIMIT } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const count = await redis.incr(SIGNUP_KEY);

    if (count > SIGNUP_LIMIT) {
      await redis.decr(SIGNUP_KEY);
      return NextResponse.json({ error: "List is full" }, { status: 409 });
    }

    const founderEmail = process.env.FOUNDER_EMAIL || "founder@walkawayguardian.com";
    const resendKey = process.env.RESEND_API_KEY;

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "full",
      timeStyle: "short",
    });

    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "Walk-Away Guardian <onboarding@resend.dev>",
          to: founderEmail,
          subject: `New Signup #${count}: ${email}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <div style="background: #07090c; padding: 20px; border-radius: 12px;">
                <h2 style="color: #f5a623; margin: 0 0 12px;">New Signup #${count} of ${SIGNUP_LIMIT}</h2>
                <p style="color: #b0b0b0; margin: 0 0 4px; font-size: 13px;">Email:</p>
                <p style="color: #ffffff; margin: 0 0 16px; font-size: 16px;"><a href="mailto:${email}" style="color: #f5a623;">${email}</a></p>
                <p style="color: #666; margin: 0; font-size: 12px;">${timestamp}</p>
              </div>
            </div>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
