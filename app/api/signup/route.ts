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
      // Notify founder
      const notifyPromise = fetch("https://api.resend.com/emails", {
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

      // Welcome email to subscriber
      const welcomePromise = fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "Walk-Away Guardian <onboarding@resend.dev>",
          to: email,
          subject: "Your 50% off code is inside",
          html: `
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:0;background:#07090c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
              <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

                <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 8px;line-height:1.3;">
                  You're in. Here's your 50% off code.
                </h1>
                <p style="color:#b0b0b0;font-size:16px;margin:0 0 32px;line-height:1.6;">
                  Use this code at checkout to lock in 50% off your first year of Walk-Away Guardian Pro.
                </p>

                <!-- Promo code block -->
                <div style="background:#111827;border:1px solid #1e293b;border-radius:12px;padding:28px;text-align:center;margin:0 0 32px;">
                  <p style="color:#b0b0b0;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Your promo code</p>
                  <div style="background:#07090c;border:1px solid #f5a623;border-radius:8px;padding:16px 24px;display:inline-block;">
                    <span style="color:#f5a623;font-family:monospace;font-size:28px;font-weight:700;letter-spacing:0.1em;">FOUNDING50</span>
                  </div>
                  <p style="color:#666;font-size:12px;margin:12px 0 0;">50% off your first year of Pro. Enter at checkout.</p>
                </div>

                <!-- Steps -->
                <div style="background:#111827;border:1px solid #1e293b;border-radius:12px;padding:28px;margin:0 0 32px;">
                  <p style="color:#b0b0b0;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px;">How to redeem</p>

                  <div style="display:flex;gap:14px;margin:0 0 16px;align-items:flex-start;">
                    <span style="color:#e84545;font-weight:700;font-size:16px;min-width:20px;">1.</span>
                    <div>
                      <p style="color:#ffffff;margin:0 0 4px;font-size:15px;font-weight:600;">Install the extension — it's free</p>
                      <a href="https://chromewebstore.google.com/detail/walk-away-guardian/bibfcgaelfchadimoiepnecdlgbjeeef"
                         style="color:#f5a623;font-size:13px;word-break:break-all;">
                        Add Walk-Away Guardian to Chrome →
                      </a>
                    </div>
                  </div>

                  <div style="display:flex;gap:14px;margin:0 0 16px;align-items:flex-start;">
                    <span style="color:#e84545;font-weight:700;font-size:16px;min-width:20px;">2.</span>
                    <div>
                      <p style="color:#ffffff;margin:0 0 4px;font-size:15px;font-weight:600;">Go to the Pro upgrade page</p>
                      <a href="https://walkaway-guardian.vercel.app/#email"
                         style="color:#f5a623;font-size:13px;">
                        walkaway-guardian.vercel.app →
                      </a>
                    </div>
                  </div>

                  <div style="display:flex;gap:14px;align-items:flex-start;">
                    <span style="color:#e84545;font-weight:700;font-size:16px;min-width:20px;">3.</span>
                    <div>
                      <p style="color:#ffffff;margin:0 0 4px;font-size:15px;font-weight:600;">Enter <span style="color:#f5a623;font-family:monospace;">FOUNDING50</span> at checkout</p>
                      <p style="color:#b0b0b0;font-size:13px;margin:0;">50% off applies to your first year automatically.</p>
                    </div>
                  </div>
                </div>

                <!-- CTA -->
                <div style="text-align:center;margin:0 0 32px;">
                  <a href="https://chromewebstore.google.com/detail/walk-away-guardian/bibfcgaelfchadimoiepnecdlgbjeeef"
                     style="display:inline-block;background:#e84545;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:8px;">
                    Install Free — No Credit Card Needed
                  </a>
                </div>

                <!-- Footer -->
                <div style="border-top:1px solid #1e293b;padding-top:24px;text-align:center;">
                  <p style="color:#444;font-size:12px;margin:0 0 4px;">Walk-Away Guardian — Stop revenge trading.</p>
                  <p style="color:#444;font-size:12px;margin:0;">
                    Questions? Reply to this email anytime.
                  </p>
                </div>

              </div>
            </body>
            </html>
          `,
        }),
      });

      // Add contact to Resend contacts list
      const contactPromise = fetch("https://api.resend.com/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
        }),
      });

      // Trigger user.signed_up event to fire Resend Automation
      const eventPromise = fetch("https://api.resend.com/events/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          event: "user.signed_up",
          email,
          payload: {
            signup_number: count,
          },
        }),
      });

      await Promise.all([notifyPromise, welcomePromise, contactPromise, eventPromise]);
    }

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
