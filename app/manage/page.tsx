"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const CANCEL_REASONS = [
  "Too expensive",
  "Not using it enough",
  "Found a better tool",
  "Technical issues",
  "Just testing / exploring",
  "Other",
];

function ManageContent() {
  const params = useSearchParams();
  const returned = params.get("returned") === "true";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [portalUrl, setPortalUrl] = useState("");

  const [showSurvey, setShowSurvey] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const lookup = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setPortalUrl(data.url);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!reason) return;
    setSubmitting(true);
    await fetch("/api/cancel-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, reason, details }),
    });
    window.location.href = portalUrl;
  };

  if (returned) {
    return (
      <main className="min-h-screen bg-[#07090c] text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-6">👋</div>
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Sorry to see you go.
        </h1>
        <p className="text-[#b0b0b0] max-w-md">
          Your changes have been saved. If you ever want to come back, the extension will still be there.
        </p>
        <a href="/" className="mt-8 text-[#f5a623] hover:underline">Back to home</a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07090c] text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Manage Subscription
        </h1>
        <p className="text-[#b0b0b0] text-center mb-8">
          Enter the email you used when you signed up.
        </p>

        {!portalUrl ? (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              className="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#f5a623] transition"
            />
            {error && <p className="text-[#e84545] text-sm">{error}</p>}
            <button
              onClick={lookup}
              disabled={loading}
              className="w-full py-3 bg-[#f5a623] text-[#07090c] font-bold rounded-lg hover:bg-[#e09515] transition disabled:opacity-50"
            >
              {loading ? "Looking up…" : "Continue"}
            </button>
          </div>
        ) : !showSurvey ? (
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-8 space-y-4">
            <p className="text-green-400 font-medium">Active subscription found.</p>
            <p className="text-[#b0b0b0] text-sm">You can update your billing, change your plan, or cancel from the Stripe portal.</p>
            <a
              href={portalUrl}
              className="block w-full py-3 bg-[#f5a623] text-[#07090c] font-bold rounded-lg hover:bg-[#e09515] transition text-center"
            >
              Manage Billing
            </a>
            <button
              onClick={() => setShowSurvey(true)}
              className="block w-full py-3 border border-[#e84545] text-[#e84545] font-bold rounded-lg hover:bg-[#e84545] hover:text-white transition text-center"
            >
              Cancel Subscription
            </button>
          </div>
        ) : (
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold mb-1">Before you go — what happened?</h2>
              <p className="text-[#b0b0b0] text-sm">Takes 10 seconds. Genuinely helps.</p>
            </div>
            <div className="space-y-2">
              {CANCEL_REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition text-sm ${
                    reason === r
                      ? "border-[#f5a623] bg-[#f5a623]/10 text-white"
                      : "border-[#1e293b] text-[#b0b0b0] hover:border-[#f5a623]/50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Anything else you want me to know? (optional)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-[#07090c] border border-[#1e293b] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#f5a623] transition text-sm resize-none"
            />
            <button
              onClick={submitFeedback}
              disabled={!reason || submitting}
              className="w-full py-3 bg-[#e84545] hover:bg-[#d13a3a] text-white font-bold rounded-lg transition disabled:opacity-40"
            >
              {submitting ? "Redirecting…" : "Submit & Continue to Cancel"}
            </button>
            <button
              onClick={() => setShowSurvey(false)}
              className="w-full text-[#666] text-sm hover:text-white transition"
            >
              Go back
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ManagePage() {
  return (
    <Suspense>
      <ManageContent />
    </Suspense>
  );
}
