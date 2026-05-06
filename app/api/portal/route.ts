import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-08-16" });

  const customers = await stripe.customers.list({ email, limit: 1 });
  if (!customers.data.length) {
    return NextResponse.json({ error: "No account found for that email." }, { status: 404 });
  }

  const customer = customers.data[0];

  // Check they have an active subscription
  const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: "active", limit: 1 });
  if (!subscriptions.data.length) {
    return NextResponse.json({ error: "No active subscription found for that email." }, { status: 404 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: "https://walkaway-guardian.vercel.app/manage?returned=true",
  });

  return NextResponse.json({ url: session.url });
}
