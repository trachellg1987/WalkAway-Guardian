import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      primaryPlatform,
      handle,
      otherHandles,
      followerCount,
      tradingDuration,
      instruments,
      blownAccountStory,
      contentFocus,
      whyYou,
      pitchAngle,
      contentCommitment,
      currentAffiliates,
      hasStripe,
      anythingElse,
    } = body;

    if (!name || !email || !primaryPlatform || !handle || !followerCount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const founderEmail = process.env.FOUNDER_EMAIL || "founder@walkawayguardian.com";
    const resendKey = process.env.RESEND_API_KEY;

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "full",
      timeStyle: "short",
    });

    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #07090c; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #f5a623; margin: 0; font-size: 22px;">New Founding Creator Application</h1>
          <p style="color: #b0b0b0; margin: 8px 0 0; font-size: 14px;">Received ${timestamp}</p>
        </div>

        <div style="background: #111827; padding: 24px; border-left: 4px solid #f5a623;">
          <h2 style="color: #f5a623; font-size: 16px; margin: 0 0 16px;">Step 1: The Basics</h2>
          <table style="width: 100%; font-size: 14px; color: #e0e0e0;">
            <tr><td style="padding: 6px 0; color: #888; width: 160px;">Name</td><td style="padding: 6px 0;">${name}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Email</td><td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #f5a623;">${email}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Platform</td><td style="padding: 6px 0;">${primaryPlatform}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Handle</td><td style="padding: 6px 0;">${handle}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Other handles</td><td style="padding: 6px 0;">${otherHandles || "—"}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Followers</td><td style="padding: 6px 0;">${followerCount}</td></tr>
          </table>
        </div>

        <div style="background: #111827; padding: 24px; border-left: 4px solid #e84545; margin-top: 2px;">
          <h2 style="color: #e84545; font-size: 16px; margin: 0 0 16px;">Step 2: Trading Story</h2>
          <table style="width: 100%; font-size: 14px; color: #e0e0e0;">
            <tr><td style="padding: 6px 0; color: #888; width: 160px;">Trading duration</td><td style="padding: 6px 0;">${tradingDuration}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Instruments</td><td style="padding: 6px 0;">${Array.isArray(instruments) ? instruments.join(", ") : instruments}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Content focus</td><td style="padding: 6px 0;">${Array.isArray(contentFocus) ? contentFocus.join(", ") : contentFocus}</td></tr>
          </table>
          <div style="margin-top: 12px;">
            <p style="color: #888; font-size: 12px; margin: 0 0 4px;">Blown account story:</p>
            <p style="color: #e0e0e0; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${blownAccountStory}</p>
          </div>
        </div>

        <div style="background: #111827; padding: 24px; border-left: 4px solid #f5a623; margin-top: 2px;">
          <h2 style="color: #f5a623; font-size: 16px; margin: 0 0 16px;">Step 3: Why You</h2>
          <div style="margin-bottom: 12px;">
            <p style="color: #888; font-size: 12px; margin: 0 0 4px;">Why they want to be a Founding Creator:</p>
            <p style="color: #e0e0e0; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${whyYou}</p>
          </div>
          <div style="margin-bottom: 12px;">
            <p style="color: #888; font-size: 12px; margin: 0 0 4px;">Their pitch angle:</p>
            <p style="color: #e0e0e0; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${pitchAngle}</p>
          </div>
          <table style="width: 100%; font-size: 14px; color: #e0e0e0;">
            <tr><td style="padding: 6px 0; color: #888; width: 160px;">Content commitment</td><td style="padding: 6px 0;">${contentCommitment} pieces in first 30 days</td></tr>
          </table>
        </div>

        <div style="background: #111827; padding: 24px; border-left: 4px solid #888; margin-top: 2px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #888; font-size: 16px; margin: 0 0 16px;">Step 4: Logistics</h2>
          <table style="width: 100%; font-size: 14px; color: #e0e0e0;">
            <tr><td style="padding: 6px 0; color: #888; width: 160px;">Current affiliates</td><td style="padding: 6px 0;">${currentAffiliates || "None"}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Stripe account</td><td style="padding: 6px 0;">${hasStripe}</td></tr>
            <tr><td style="padding: 6px 0; color: #888;">Additional notes</td><td style="padding: 6px 0;">${anythingElse || "—"}</td></tr>
          </table>
        </div>

        <div style="background: #07090c; padding: 16px 24px; margin-top: 2px; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="color: #666; font-size: 12px; margin: 0;">Walk-Away Guardian — Founding Creator Application</p>
        </div>
      </div>
    `;

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "Walk-Away Guardian <onboarding@resend.dev>",
          to: founderEmail,
          subject: `Founding Creator Application: ${name} (${handle} on ${primaryPlatform})`,
          html: htmlBody,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Resend error:", errData);
        return NextResponse.json(
          { error: "Failed to send email", details: errData },
          { status: 500 }
        );
      }
    } else {
      console.log("No RESEND_API_KEY set. Application data:", JSON.stringify(body, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
