"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  const [subscriptionId, setSubscriptionId] = useState("");
  const [plan, setPlan] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setError("Invalid session.");
      setLoading(false);
      return;
    }
    fetch(`/api/activate?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return; }
        setSubscriptionId(d.subscriptionId);
        setPlan(d.plan);
      })
      .catch(() => setError("Could not retrieve your subscription. Contact support."))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const copy = () => {
    navigator.clipboard.writeText(subscriptionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#07090c] text-white flex flex-col items-center justify-center px-6">
      {loading ? (
        <p className="text-[#b0b0b0] text-lg">Activating your subscription…</p>
      ) : error ? (
        <div className="max-w-lg text-center">
          <p className="text-[#e84545] text-xl font-bold mb-4">Something went wrong</p>
          <p className="text-[#b0b0b0]">{error}</p>
          <p className="text-[#b0b0b0] mt-4">Email <a href="mailto:support@walkawayguardian.com" className="text-[#f5a623]">support@walkawayguardian.com</a> and we'll sort it out.</p>
        </div>
      ) : (
        <div className="max-w-xl w-full text-center">
          <div className="text-5xl mb-6">🔐</div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            You're in. Welcome to Pro.
          </h1>
          <p className="text-[#b0b0b0] mb-10 text-lg">
            {plan === "annual" ? "Annual plan activated." : "Monthly plan activated."} Follow the steps below to unlock the extension.
          </p>

          <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-8 text-left space-y-6">

            <div>
              <p className="text-xs text-[#666] uppercase tracking-wider mb-3">Step 1 — Install the extension</p>
              <a
                href="https://chromewebstore.google.com/detail/walk-away-guardian/bibfcgaelfchadimoiepnecdlgbjeeef"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#e84545] hover:bg-[#d13a3a] text-white font-bold rounded-lg transition text-sm"
              >
                Add to Chrome — it&apos;s free
              </a>
              <p className="text-xs text-[#666] mt-2">Already installed? Skip to step 2.</p>
            </div>

            <div>
              <p className="text-xs text-[#666] uppercase tracking-wider mb-2">Step 2 — Copy your activation key</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 bg-[#07090c] border border-[#1e293b] rounded-lg px-4 py-3 text-[#f5a623] text-sm font-mono break-all">
                  {subscriptionId}
                </code>
                <button
                  onClick={copy}
                  className="px-4 py-3 bg-[#f5a623] text-[#07090c] font-bold rounded-lg hover:bg-[#e09515] transition text-sm flex-shrink-0"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-[#666] uppercase tracking-wider mb-3">Step 3 — Activate Pro</p>
              <ol className="space-y-2 text-[#b0b0b0] text-sm">
                <li className="flex gap-3"><span className="text-[#f5a623] font-bold flex-shrink-0">1.</span> Click the Walk-Away Guardian icon in your Chrome toolbar</li>
                <li className="flex gap-3"><span className="text-[#f5a623] font-bold flex-shrink-0">2.</span> Open <span className="text-white font-medium">Settings</span></li>
                <li className="flex gap-3"><span className="text-[#f5a623] font-bold flex-shrink-0">3.</span> Find the <span className="text-white font-medium">Activation Key</span> field and paste your key</li>
                <li className="flex gap-3"><span className="text-[#f5a623] font-bold flex-shrink-0">4.</span> Hit <span className="text-white font-medium">Activate</span> — Pro features unlock instantly</li>
              </ol>
            </div>

            <div className="border-t border-[#1e293b] pt-4">
              <p className="text-xs text-[#666]">
                Save this key somewhere safe — you'll need it if you reinstall the extension. Questions? <a href="mailto:support@walkawayguardian.com" className="text-[#f5a623] hover:underline">support@walkawayguardian.com</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
