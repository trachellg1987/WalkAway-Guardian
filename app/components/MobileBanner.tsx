"use client";

import { useState, useEffect } from "react";

const DISMISSED_KEY = "wag_mobile_banner_dismissed";

export default function MobileBanner() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const dismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (isMobile && !dismissed) setVisible(true);
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status !== "idle") return;
    setStatus("sending");
    try {
      await fetch("/api/mobile-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (_) {}
    setStatus("sent");
    setTimeout(dismiss, 2500);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
      background: "#0f1318",
      borderBottom: "1px solid #1e2530",
      padding: "14px 16px 16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
    }}>
      {/* Dismiss button */}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          position: "absolute", top: 10, right: 12,
          background: "none", border: "none", cursor: "pointer",
          color: "#5a6478", fontSize: 20, lineHeight: 1, padding: 4,
        }}
      >×</button>

      {/* Headline */}
      <p style={{
        margin: "0 0 4px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 14, fontWeight: 700, color: "#e8e8e8", paddingRight: 28,
        lineHeight: 1.35,
      }}>
        Walk-Away Guardian works on desktop Chrome.
      </p>
      <p style={{
        margin: "0 0 12px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 13, color: "#8892a4", lineHeight: 1.4,
      }}>
        Want a reminder to install it later?
      </p>

      {status === "sent" ? (
        <p style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 13, fontWeight: 600, color: "#22c55e", margin: 0,
        }}>
          ✓ Link sent — check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={{
              flex: 1, background: "#161b22", border: "1px solid #1e2530",
              color: "#e8e8e8", padding: "9px 11px", borderRadius: 7,
              fontSize: 13, fontFamily: "inherit", outline: "none",
              minWidth: 0,
            }}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              background: "#f5a623", color: "#07090c", border: "none",
              padding: "9px 14px", borderRadius: 7, fontSize: 13,
              fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
              fontFamily: "inherit", opacity: status === "sending" ? 0.6 : 1,
            }}
          >
            {status === "sending" ? "Sending…" : "Send me the link"}
          </button>
        </form>
      )}
    </div>
  );
}
