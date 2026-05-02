import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Walk-Away Guardian",
  description: "How Walk-Away Guardian collects, uses, and protects your data.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#07090c] text-[#c9d1d9] px-5" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.75 }}>
      <div className="max-w-[720px] mx-auto mt-16 mb-24">

        {/* Back link */}
        <a href="/" className="inline-block mb-10 text-sm text-[#f5a623] hover:underline">
          ← Back to Walk-Away Guardian
        </a>

        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-[#8b949e] text-sm pb-6 mb-12 border-b border-[#1a1e24]">
          Last updated: May 2, 2026
        </p>

        <p className="mb-4">
          Walk-Away Guardian (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;the extension&rdquo;) is a Chrome browser extension
          designed to help traders build discipline by enforcing screen lockouts after consecutive
          losses or time limits. This privacy policy explains what data we collect, how we use it,
          and your rights.
        </p>

        <Section title="1. Data We Collect">
          <Highlight>Data stored locally on your device:</Highlight>
          <p className="mb-4">
            The extension stores the following data in your browser&apos;s local storage
            (<code className="text-[#f5a623]">chrome.storage.local</code>). This data never leaves your
            device unless you use a premium feature that requires server communication:
          </p>
          <p className="mb-4">
            Trading session data (loss count, manual P&amp;L entries), lockout settings (loss limits,
            cooldown duration, time-based lock schedules), custom trading rules you create, emotion
            check-in selections, and daily reset preferences.
          </p>
          <Highlight>Data sent to our servers (premium features only):</Highlight>
          <p className="mb-4">
            If you subscribe to Walk-Away Guardian Premium, the following data is sent to our backend
            server for specific purposes:
          </p>
          <p className="mb-4">
            Your Stripe subscription ID is sent to verify your premium license status. When you use
            the AI Coach feature, your current emotion selection, loss count, P&amp;L amount, and time
            of day are sent to generate a personalized coaching message. No data is stored permanently
            on our servers &mdash; it is used in real time and discarded.
          </p>
        </Section>

        <Section title="2. Website Content We Read">
          <p className="mb-4">
            The extension reads P&amp;L (profit and loss) values displayed on supported trading
            platforms (currently TradingView, with Tradovate, Thinkorswim, and Webull coming soon)
            to provide automatic loss detection. This data is read from the page DOM, processed
            locally in your browser, and is never transmitted to any external server. The extension
            does not read, collect, or store any other website content.
          </p>
        </Section>

        <Section title="3. Permissions We Use">
          <p className="mb-4">
            The extension requests browser permissions solely to deliver its core functionality:
          </p>
          <Permission name="storage">saves your settings and session data locally on your device.</Permission>
          <Permission name="tabs">detects which trading platforms you have open so the lockout overlay can be applied to the correct tabs.</Permission>
          <Permission name="activeTab">reads P&amp;L data from the active trading platform tab.</Permission>
          <Permission name="alarms">powers the cooldown timer and daily reset.</Permission>
          <Permission name="scripting">injects the lockout overlay and loss detection scripts into trading platform pages.</Permission>
          <Permission name="notifications">alerts you when approaching your loss limit, when a lockout starts, and when your cooldown ends.</Permission>
          <Permission name="host permissions (all URLs)">required because trading platforms operate on various domains and subdomains.</Permission>
        </Section>

        <Section title="4. Data Sharing">
          <p className="mb-4">
            We do not sell, trade, or transfer your personal data to third parties. The only external
            services we communicate with are:
          </p>
          <Highlight>Stripe</Highlight>
          <p className="mb-4">
            — for subscription payment processing. Stripe&apos;s privacy policy governs payment data
            they collect. We never see or store your credit card information.
          </p>
          <Highlight>Anthropic API</Highlight>
          <p className="mb-4">
            — to generate AI Coach messages for premium users. Only session context (emotion, loss
            count, P&amp;L, time of day) is sent. No personally identifiable information is
            transmitted.
          </p>
        </Section>

        <Section title="5. Data Retention">
          <p className="mb-4">
            All local data remains on your device until you uninstall the extension or clear your
            browser data. We do not maintain any database of user information on our servers. AI
            Coach requests are processed in real time and are not logged or stored.
          </p>
        </Section>

        <Section title="6. Your Rights">
          <p className="mb-4">
            You can view, export, or delete all locally stored data at any time through your
            browser&apos;s extension storage settings. Uninstalling the extension removes all stored
            data from your device. You can cancel your premium subscription at any time through
            Stripe&apos;s customer portal.
          </p>
        </Section>

        <Section title="7. Children's Privacy">
          <p className="mb-4">
            Walk-Away Guardian is not intended for use by anyone under the age of 18. We do not
            knowingly collect data from minors.
          </p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p className="mb-4">
            We may update this privacy policy from time to time. Changes will be reflected by
            updating the &ldquo;Last updated&rdquo; date at the top of this page. Continued use of the
            extension after changes constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="9. Contact">
          <p className="mb-4">
            If you have questions about this privacy policy, contact us at{" "}
            <a href="mailto:support@walkawayguardian.com" className="text-[#f5a623] hover:underline">
              support@walkawayguardian.com
            </a>.
          </p>
        </Section>

        <div className="mt-16 pt-6 border-t border-[#1a1e24] text-[#8b949e] text-sm">
          &copy; 2026 Walk-Away Guardian. All rights reserved.
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <h2 className="text-[#e84545] text-xl font-bold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <p className="text-[#f5a623] font-medium mb-2">{children}</p>;
}

function Permission({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <p className="mb-3">
      <span className="text-[#f5a623] font-medium">{name}</span> &mdash; {children}
    </p>
  );
}
