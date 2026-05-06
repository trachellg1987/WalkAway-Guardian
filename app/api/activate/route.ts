import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
  });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const sub = session.subscription as Stripe.Subscription;
    if (!sub?.id) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const email = session.customer_details?.email ?? "";
    const plan = sub.items.data[0]?.price?.recurring?.interval === "year" ? "annual" : "monthly";
    const subscriptionId = sub.id;

    // Send activation email once — gate on Stripe metadata so page refreshes don't re-send
    const alreadySent = sub.metadata?.activation_email_sent === "true";
    if (!alreadySent && email && process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Walk-Away Guardian <onboarding@resend.dev>",
          to: email,
          subject: "Your Walk-Away Guardian Premium Key",
          html: `
            <h2>You're now a Premium member 🎉</h2>
            <p>Here's your activation key — save this somewhere safe:</p>
            <div style="background:#f4f4f4;padding:16px;border-radius:8px;font-family:monospace;font-size:18px;letter-spacing:1px;">
              ${subscriptionId}
            </div>
            <h3>How to activate:</h3>
            <ol>
              <li>Open Chrome and click the Walk-Away Guardian extension icon</li>
              <li>Click <strong>Activate Premium</strong></li>
              <li>Paste your key above and click <strong>Submit</strong></li>
              <li>Premium features unlock immediately</li>
            </ol>
            <p>Questions? Reply to this email anytime.</p>
          `,
        }),
      });

      // Mark as sent so refreshes don't trigger duplicate emails
      await stripe.subscriptions.update(subscriptionId, {
        metadata: { activation_email_sent: "true" },
      });
    }

    return NextResponse.json({ subscriptionId, plan, email });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
