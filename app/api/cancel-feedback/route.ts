import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, reason, details } = await req.json();

  const resendKey = process.env.RESEND_API_KEY;
  const founderEmail = process.env.FOUNDER_EMAIL || "founder@walkawayguardian.com";

  if (resendKey) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Walk-Away Guardian <onboarding@resend.dev>",
        to: founderEmail,
        subject: `Cancellation feedback: ${reason}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px;">
            <h2 style="color: #e84545;">Cancellation Feedback</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Reason:</strong> ${reason}</p>
            ${details ? `<p><strong>Details:</strong> ${details}</p>` : ""}
            <p style="color: #666; font-size: 12px;">Submitted before redirecting to Stripe portal.</p>
          </div>
        `,
      }),
    });
  }

  return NextResponse.json({ success: true });
}
