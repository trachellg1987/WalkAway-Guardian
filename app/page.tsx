"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics/react";

const CHROME_STORE_BASE =
  "https://chromewebstore.google.com/detail/walk-away-guardian/bibfcgaelfchadimoiepnecdlgbjeeef";

const features = [
  { icon: "\u{1F512}", title: "Loss Lockout", desc: "Hit your daily loss threshold and your trading platform is overlaid with a lock screen. The trade button is unreachable. No exceptions." },
  { icon: "\u{1F3C6}", title: "Profit Lock", desc: "Hit your daily profit target and lock in the win. A separate flow designed for the moment you\u2019re most likely to give it all back." },
  { icon: "\u{1F4C9}", title: "Give-Back Guard", desc: "Walk-Away Guardian watches your peak P&L and locks you out when you\u2019ve given back 30% \u2014 while you\u2019re still green. Protect the win before it turns into a loss." },
  { icon: "\u{1F510}", title: "Hard Lock Mode", desc: "For when you can\u2019t trust yourself. The early-unlock option is removed entirely. The timer is the only way out." },
  { icon: "\u23F1\uFE0F", title: "Cooldown Timers", desc: "Force breathing room between entries to break the revenge-trading reflex before it fires." },
  { icon: "\u{1F916}", title: "AI Coaching", desc: "When you\u2019re locked out, an AI coach trained on trading psychology helps you process the emotion \u2014 instead of waiting out the timer to revenge trade." },
];

const steps = [
  { num: "1", title: "Set your limits once.", desc: "Daily loss cap. Daily profit target. Max trades. Cooldown windows. Five minutes in setup, then you forget about it." },
  { num: "2", title: "Trade like normal.", desc: "Walk-Away Guardian watches your P&L across TradingView, ThinkorSwim, Tradovate, and Webull in real time. You don\u2019t change anything about how you trade." },
  { num: "3", title: "When you hit a limit, you\u2019re out.", desc: "A lock screen overlays your platform. You log how you feel. The AI coach checks in. The timer counts down. You walk away \u2014 because the platform makes you." },
];

const freeFeatures = ["Loss-based lockout", "Profit-based lockout", "Time-based cooldowns", "Trading rules display", "Manual loss logging", "Works on all four platforms"];
const proFeatures = ["Everything in Free", "Automatic P&L detection", "Emotion check-in flow", "AI coaching during lockouts", "Hard Lock mode", "Give-Back Guard", "Emergency exit for open positions", "Discipline streak tracking", "Win reflection journal"];

const comparisons = [
  { other: "Set a daily limit and we\u2019ll remind you.", wag: "Set a daily limit and we\u2019ll lock the platform when you hit it." },
  { other: "Journal your trades after the day ends.", wag: "Tell us how you feel right now, in the moment, before you can keep trading." },
  { other: "Manage your risk with our checklist.", wag: "We watch your real P&L on your real platform and act when the number you set is hit. No checklist. No willpower." },
];

const PRICES = {
  monthly: "price_1TRzTrKndva1otC7ghuJGPx7",
  annual: "price_1TRzV1Kndva1otC7tAC86sY4",
};

async function startCheckout(priceId: string, utm: Record<string, string> = {}) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId, utm }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    console.error("[checkout error]", data.error ?? res.status);
    return;
  }
  if (data.url) {
    window.location.href = data.url;
  }
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [signupCount, setSignupCount] = useState(0);
  const [listFull, setListFull] = useState(false);
  const [utm, setUtm] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/signup-count")
      .then((r) => r.json())
      .then((d) => { setSignupCount(d.count); setListFull(d.full); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const source = p.get("utm_source");
    if (source) {
      setUtm({
        utm_source: source,
        utm_medium: p.get("utm_medium") ?? "",
        utm_campaign: p.get("utm_campaign") ?? "",
      });
    }
  }, []);

  const chromeStoreUrl = utm.utm_source
    ? `${CHROME_STORE_BASE}?${new URLSearchParams(utm).toString()}`
    : CHROME_STORE_BASE;

  const handleSignup = async () => {
    if (!email || !email.includes("@")) return;
    setSubmitting(true);
    try {
      await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#07090c] text-white">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Traders blow accounts twice.
          <br />
          <span className="text-[#e84545]">Once after a loss.</span>{" "}
          <span className="text-[#f5a623]">Once after a win.</span>
        </motion.h1>
        <motion.p
          className="mt-6 text-lg md:text-xl text-[#b0b0b0] max-w-2xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Walk-Away Guardian is the Chrome extension that locks you out of your
          trading platform when you&apos;re tilted from losses &mdash; and when
          you&apos;re euphoric from wins. The two moments your willpower fails.
          Handled.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <a
            href={chromeStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("install_click", { location: "hero", ...utm })}
            className="px-8 py-4 bg-[#e84545] text-white font-bold rounded-lg hover:bg-[#d13a3a] transition text-center"
          >
            Install Free — No Credit Card Needed
          </a>
          <a
            href="#email"
            onClick={() => track("promo_click", { location: "hero", ...utm })}
            className="px-8 py-3 border border-[#f5a623] text-[#f5a623] font-semibold rounded-lg hover:bg-[#f5a623]/10 transition text-center text-sm"
          >
            Claim 50% Off Pro
          </a>
        </motion.div>
      </section>

      {/* Promo Video */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <motion.div
          className="relative rounded-2xl overflow-hidden border border-[#1e293b] shadow-2xl bg-[#111827]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* OPTION A: swap src for YouTube embed URL e.g. https://www.youtube.com/embed/VIDEO_ID */}
          {/* OPTION B: self-hosted — place promo.mov in /public and this will work as-is */}
          <video
            src="/promo.mp4"
            className="w-full aspect-video object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        </motion.div>
      </section>

      {/* Problem */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          You Already Know Both Sides of This
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-8">
            <h3 className="text-xl font-bold text-[#e84545] mb-4">The Loss Spiral</h3>
            <p className="text-[#b0b0b0] leading-relaxed">
              You take two losses in a row. You tell yourself you&apos;ll stop. You
              don&apos;t. You take a third trying to &ldquo;win it back.&rdquo; Then a fourth. By
              the close, you&apos;ve blown a week of profits chasing one bad morning.
            </p>
          </div>
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-8">
            <h3 className="text-xl font-bold text-[#f5a623] mb-4">The Profit Giveback</h3>
            <p className="text-[#b0b0b0] leading-relaxed">
              You&apos;re up big by 10am. You feel invincible. You tell yourself
              you&apos;ll stop after one more trade. You don&apos;t. You take three more on
              size, give back the gains, and end the day red on what should have
              been your best session of the month.
            </p>
          </div>
        </div>
        <p className="text-center text-[#b0b0b0] italic mt-8 max-w-2xl mx-auto">
          Discipline isn&apos;t a mindset problem. It&apos;s a system problem. And in the
          moments that matter, your mindset is exactly what&apos;s broken.
        </p>
      </section>

      {/* Solution */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Walk-Away Guardian Removes the Choice
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="bg-[#111827] border border-[#1e293b] rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-[#b0b0b0] text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Three Steps. Then It Runs in the Background.
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-bold text-[#e84545] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.num}</div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-[#b0b0b0] text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section className="px-6 py-20 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Works Where You Trade
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {["TradingView", "ThinkorSwim", "Tradovate / TopStep", "Webull"].map((p, i) => (
            <div key={i} className="bg-[#111827] border border-[#1e293b] rounded-lg px-6 py-4 text-[#b0b0b0] font-medium">
              {p}
            </div>
          ))}
        </div>
        <p className="text-[#b0b0b0]">
          One install. Every platform. Real-time P&amp;L detection. No broker API keys, no setup beyond the Chrome install.
        </p>
      </section>

      {/* Why Different */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Most &ldquo;Discipline Tools&rdquo; Are Just Timers. This Is Different.
        </h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          {comparisons.map((c, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#111827] border border-[#1e293b] rounded-lg p-5">
                <p className="text-xs text-[#666] uppercase tracking-wider mb-2">Other tools say:</p>
                <p className="text-[#666]">&ldquo;{c.other}&rdquo;</p>
              </div>
              <div className="bg-[#111827] border border-[#f5a623]/30 rounded-lg p-5">
                <p className="text-xs text-[#f5a623] uppercase tracking-wider mb-2">Walk-Away Guardian says:</p>
                <p className="text-white font-medium">&ldquo;{c.wag}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Story */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Why I Built This
        </h2>
        <div className="border-l-4 border-[#f5a623] pl-6 space-y-4 text-[#b0b0b0] leading-relaxed">
          <p>
            I followed 1,400 trading accounts on TikTok before I built this. Not
            for marketing &mdash; for research. I watched the same two stories play out
            a hundred times each.
          </p>
          <p>
            Story one: a trader posts a green morning, then a week later
            they&apos;re posting about giving it all back. Story two: a trader posts a
            red day, then a week later they&apos;re posting about blowing the entire
            account chasing it back.
          </p>
          <p>
            Both end the same way. Both happen because in the moment that
            matters, the trader&apos;s brain is the last thing they should be
            trusting.
          </p>
          <p>
            I built Walk-Away Guardian because every existing &ldquo;discipline&rdquo; tool
            relies on willpower. Mindset coaches don&apos;t help when you&apos;re tilted.
            Journaling doesn&apos;t stop the next click. A hard lockout does.
          </p>
          <p>
            This is the tool I wish existed three years ago. It&apos;s live now, and I&apos;m
            growing it with a small group of Founding Creators who&apos;ve lived this
            pain. If that&apos;s you, I&apos;d like to hear from you.
          </p>
          <p className="text-white font-medium">&mdash; Trachell, Founder</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Pricing
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-8">
            <p className="text-sm text-[#b0b0b0] uppercase tracking-wider mb-1">Get the discipline.</p>
            <h3 className="text-2xl font-bold mb-2">FREE</h3>
            <p className="text-4xl font-bold mb-6">$0</p>
            <ul className="space-y-3 text-[#b0b0b0] mb-8">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5 flex-shrink-0">&#10003;</span> {f}
                </li>
              ))}
            </ul>
            <a
              href={chromeStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("install_click", { location: "pricing", ...utm })}
              className="block w-full py-3 border border-white rounded-lg hover:bg-white hover:text-[#07090c] transition font-bold text-center"
            >
              Install Free
            </a>
          </div>
          <div className="bg-[#111827] border-2 border-[#f5a623] rounded-xl p-8 relative">
            <div className="absolute -top-3 right-6 bg-[#f5a623] text-[#07090c] text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <p className="text-sm text-[#f5a623] uppercase tracking-wider mb-1">Get the self-awareness.</p>
            <h3 className="text-2xl font-bold mb-2">PRO</h3>
            <p className="text-4xl font-bold mb-1">$9.99<span className="text-lg text-[#b0b0b0] font-normal">/mo</span></p>
            <p className="text-sm text-[#b0b0b0] mb-6">or $79.99/yr (save 33%)</p>
            <ul className="space-y-3 text-[#b0b0b0] mb-8">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#f5a623] mt-0.5 flex-shrink-0">&#10003;</span> {f}
                </li>
              ))}
            </ul>
            <div className="relative">
              <button
                onClick={() => setShowPlanModal((v) => !v)}
                className="w-full py-3 bg-[#f5a623] text-[#07090c] rounded-lg hover:bg-[#e09515] transition font-bold"
              >
                Start Pro
              </button>
              {showPlanModal && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#1e293b] border border-[#f5a623]/40 rounded-xl overflow-hidden shadow-xl z-10">
                  <button
                    onClick={async () => {
                      track("checkout_start", { plan: "monthly", ...utm });
                      setCheckoutLoading("monthly");
                      await startCheckout(PRICES.monthly, utm);
                      setCheckoutLoading(null);
                    }}
                    disabled={checkoutLoading !== null}
                    className="w-full px-5 py-4 text-left hover:bg-[#f5a623]/10 transition disabled:opacity-50"
                  >
                    <p className="font-bold text-white">Monthly</p>
                    <p className="text-sm text-[#b0b0b0]">$9.99 / month</p>
                    {checkoutLoading === "monthly" && <p className="text-xs text-[#f5a623] mt-1">Redirecting…</p>}
                  </button>
                  <div className="border-t border-[#f5a623]/20" />
                  <button
                    onClick={async () => {
                      track("checkout_start", { plan: "annual", ...utm });
                      setCheckoutLoading("annual");
                      await startCheckout(PRICES.annual, utm);
                      setCheckoutLoading(null);
                    }}
                    disabled={checkoutLoading !== null}
                    className="w-full px-5 py-4 text-left hover:bg-[#f5a623]/10 transition disabled:opacity-50"
                  >
                    <p className="font-bold text-white">Annual <span className="text-xs bg-[#f5a623] text-[#07090c] font-bold px-2 py-0.5 rounded-full ml-1">SAVE 33%</span></p>
                    <p className="text-sm text-[#b0b0b0]">$79.99 / year ($6.67/mo)</p>
                    {checkoutLoading === "annual" && <p className="text-xs text-[#f5a623] mt-1">Redirecting…</p>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Founding Creator */}
      <section id="founders" className="px-6 py-20 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Are You a Trading Creator? Read This.
        </h2>
        <p className="text-[#b0b0b0] mb-6 text-lg">
          The extension is live. I&apos;m looking for <span className="text-white font-bold">25 Founding Creators</span> to
          help grow it. Not 250. Twenty-five.
        </p>
        <div className="text-left bg-[#111827] border border-[#1e293b] rounded-xl p-8 mb-6">
          <ul className="space-y-3 text-[#b0b0b0]">
            <li className="flex items-start gap-3"><span className="text-[#f5a623] flex-shrink-0">&bull;</span> 50% lifetime commission on every customer you refer</li>
            <li className="flex items-start gap-3"><span className="text-[#f5a623] flex-shrink-0">&bull;</span> Free lifetime Pro account</li>
            <li className="flex items-start gap-3"><span className="text-[#f5a623] flex-shrink-0">&bull;</span> Your handle on this page as a founding partner</li>
            <li className="flex items-start gap-3"><span className="text-[#f5a623] flex-shrink-0">&bull;</span> Direct line to me for product feedback and feature requests</li>
            <li className="flex items-start gap-3"><span className="text-[#f5a623] flex-shrink-0">&bull;</span> Founding Creator badge</li>
          </ul>
        </div>
        <p className="text-[#b0b0b0] italic mb-8">Open until filled. Then closed. Forever.</p>
        <a href="/apply" className="inline-block px-8 py-4 bg-[#e84545] text-white font-bold rounded-lg hover:bg-[#d13a3a] transition">
          Apply to Be a Founding Creator
        </a>
      </section>

      {/* Email Capture */}
      <section id="email" className="px-6 py-20 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Get 50% Off Pro
        </h2>
        <p className="text-[#b0b0b0] mb-4 text-lg">
          The extension is live. Join the list and lock in{" "}
          <span className="text-[#f5a623] font-bold">50% off your first year of Pro</span> — available to the first{" "}
          <span className="text-white font-bold">500 subscribers</span>.
        </p>
        {!listFull && signupCount > 0 && (
          <p className="text-sm text-[#666] mb-6">
            <span className="text-white font-bold">{500 - signupCount}</span> spots remaining
          </p>
        )}
        {listFull ? (
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-8">
            <p className="text-xl font-bold text-white">This offer is now closed.</p>
            <p className="text-[#b0b0b0] mt-2">All 500 spots have been claimed. Follow along for future offers.</p>
          </div>
        ) : submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111827] border border-[#f5a623] rounded-xl p-8"
          >
            <p className="text-xl font-bold text-[#f5a623]">You&apos;re in!</p>
            <p className="text-[#b0b0b0] mt-2">Check your inbox — your 50% off code is on its way.</p>
          </motion.div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#f5a623] transition"
            />
            <button
              onClick={handleSignup}
              disabled={submitting}
              className={`px-8 py-3 font-bold rounded-lg transition ${
                submitting
                  ? "bg-[#888] cursor-not-allowed"
                  : "bg-[#e84545] hover:bg-[#d13a3a]"
              } text-white`}
            >
              {submitting ? "Locking in..." : "Lock In 50% Off"}
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 text-center text-[#666] text-sm border-t border-[#1e293b]">
        <p>&copy; 2026 Walk-Away Guardian</p>
        <div className="mt-2 space-x-4">
          <a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Contact</a>
          <a href="/manage" className="hover:text-white transition">Manage Subscription</a>
        </div>
      </footer>
    </main>
  );
}
