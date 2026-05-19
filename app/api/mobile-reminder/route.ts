import { NextRequest, NextResponse } from "next/server";

const CHROME_STORE = "https://chromewebstore.google.com/detail/walk-away-guardian/bibfcgaelfchadimoiepnecdlgbjeeef";
const RESEND_API = "https://api.resend.com";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!resendKey) {
      console.warn("RESEND_API_KEY not set — mobile reminder skipped for:", email);
      return NextResponse.json({ success: true });
    }

    // Upsert into Resend audience
    if (audienceId) {
      await fetch(`${RESEND_API}/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
    }

    // Send the reminder email
    const emailRes = await fetch(`${RESEND_API}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "Walk-Away Guardian <onboarding@resend.dev>",
        to: email,
        subject: "Your reminder to install Walk-Away Guardian",
        html: `
          <!DOCTYPE html>
          <html>
          <body style="margin:0;padding:0;background:#07090c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <div style="max-width:520px;margin:0 auto;padding:40px 24px;">

              <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 10px;line-height:1.3;">
                Here's your link to install Walk-Away Guardian
              </h1>
              <p style="color:#b0b0b0;font-size:15px;margin:0 0 28px;line-height:1.6;">
                You requested this reminder on your phone. Open it on your desktop Chrome browser and click below to install.
              </p>

              <!-- Install CTA -->
              <div style="text-align:center;margin:0 0 28px;">
                <a href="${CHROME_STORE}"
                   style="display:inline-block;background:#e84545;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:8px;">
                  Add to Chrome — It's Free
                </a>
              </div>

              <!-- Promo code -->
              <div style="background:#111827;border:1px solid #1e293b;border-radius:12px;padding:24px;text-align:center;margin:0 0 28px;">
                <p style="color:#8892a4;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">Exclusive code — 50% off Pro</p>
                <div style="background:#07090c;border:1px solid #f5a623;border-radius:8px;padding:14px 20px;display:inline-block;">
                  <span style="color:#f5a623;font-family:monospace;font-size:26px;font-weight:700;letter-spacing:0.1em;">FOUNDING50</span>
                </div>
                <p style="color:#5a6478;font-size:12px;margin:10px 0 0;">Enter at checkout after installing the free extension.</p>
              </div>

              <!-- What it does -->
              <div style="background:#0f1318;border:1px solid #1e2530;border-radius:10px;padding:20px;margin:0 0 28px;">
                <p style="color:#8892a4;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 14px;">What it does</p>
                <p style="color:#e8e8e8;font-size:14px;margin:0 0 8px;">🔒 Locks your trading screen after daily loss limits are hit</p>
                <p style="color:#e8e8e8;font-size:14px;margin:0 0 8px;">🏆 Locks you out when daily profit targets are reached</p>
                <p style="color:#e8e8e8;font-size:14px;margin:0;">🤖 AI coach helps you process the emotion during lockouts</p>
              </div>

              <div style="border-top:1px solid #1e2530;padding-top:20px;text-align:center;">
                <p style="color:#3a4455;font-size:12px;margin:0;">Walk-Away Guardian — Stop revenge trading.</p>
              </div>

            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error("Mobile reminder email error:", emailRes.status, err);
      return NextResponse.json({ error: "Failed to send reminder" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mobile reminder error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
