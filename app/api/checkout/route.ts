import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

const ALLOWED_PRICE_IDS = new Set([
  "price_1TRzTrKndva1otC7ghuJGPx7", // Monthly $9.99/mo
  "price_1TRzV1Kndva1otC7tAC86sY4", // Annual $79.99/yr
]);

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();

    if (!priceId || !ALLOWED_PRICE_IDS.has(priceId)) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://walkaway-guardian.vercel.app/?success=true",
      cancel_url: "https://walkaway-guardian.vercel.app/?canceled=true",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
