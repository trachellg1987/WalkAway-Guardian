"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const platforms = ["TikTok", "Instagram", "YouTube", "X (Twitter)", "Other"];
const followerRanges = ["Under 1,000", "1,000\u20135,000", "5,000\u201310,000", "10,000\u201325,000", "25,000\u201350,000", "50,000\u2013100,000", "100,000+"];
const tradingDurations = ["Less than 6 months", "6\u201312 months", "1\u20132 years", "2\u20135 years", "5+ years"];
const instruments = ["Stocks", "Options", "Futures", "Forex", "Crypto"];
const contentTypes = ["Trade recaps", "Education", "Trading psychology", "Prop firm journey", "Signals & alerts", "Day-in-the-life", "Other"];
const contentCommitments = ["1\u20132", "3\u20135", "6\u201310", "10+"];
const stripeOptions = ["Yes, I have one", "Yes, I\u2019ll set one up", "I need help with this"];

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    primaryPlatform: "",
    handle: "",
    otherHandles: "",
    followerCount: "",
    tradingDuration: "",
    instruments: [] as string[],
    blownAccountStory: "",
    contentFocus: [] as string[],
    whyYou: "",
    pitchAngle: "",
    contentCommitment: "",
    currentAffiliates: "",
    hasStripe: "",
    anythingElse: "",
  });

  const update = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleMulti = (field: string, value: string) => {
    const current = form[field as keyof typeof form] as string[];
    if (current.includes(value)) {
      update(field, current.filter((v) => v !== value));
    } else {
      update(field, [...current, value]);
    }
  };

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) errs.name = "Required";
      if (!form.email.trim() || !form.email.includes("@")) errs.email = "Valid email required";
      if (!form.primaryPlatform) errs.primaryPlatform = "Select a platform";
      if (!form.handle.trim()) errs.handle = "Required";
      if (!form.followerCount) errs.followerCount = "Select a range";
    }
    if (s === 2) {
      if (!form.tradingDuration) errs.tradingDuration = "Required";
      if (form.instruments.length === 0) errs.instruments = "Select at least one";
      if (form.blownAccountStory.trim().length < 100) errs.blownAccountStory = "Tell us more \u2014 at least 100 characters (" + form.blownAccountStory.trim().length + "/100)";
      if (form.contentFocus.length === 0) errs.contentFocus = "Select at least one";
    }
    if (s === 3) {
      if (form.whyYou.trim().length < 150) errs.whyYou = "Tell us more \u2014 at least 150 characters (" + form.whyYou.trim().length + "/150)";
      if (form.pitchAngle.trim().length < 150) errs.pitchAngle = "Tell us more \u2014 at least 150 characters (" + form.pitchAngle.trim().length + "/150)";
      if (!form.contentCommitment) errs.contentCommitment = "Required";
    }
    if (s === 4) {
      if (!form.hasStripe) errs.hasStripe = "Required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep(step + 1);
  };
  const back = () => setStep(step - 1);

  const handleSubmit = () => {
    if (!validateStep(4)) return;
    console.log("Application submitted:", form);
    setSubmitted(true);
  };

  const inputClass = "w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-[#f5a623] transition text-sm";
  const selectClass = "w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-lg text-white focus:outline-none focus:border-[#f5a623] transition text-sm appearance-none cursor-pointer";
  const textareaClass = "w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-[#f5a623] transition text-sm min-h-[120px] resize-y";
  const labelClass = "block text-sm font-medium text-[#b0b0b0] mb-2";
  const errorClass = "text-[#e84545] text-xs mt-1";

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#07090c] text-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg text-center"
        >
          <div className="text-6xl mb-6">&#10003;</div>
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Application Received
          </h1>
          <p className="text-[#b0b0b0] mb-4 leading-relaxed">
            Got it. I review every application personally. You&apos;ll hear back
            within 5 business days whether you&apos;re moving to the next step.
          </p>
          <p className="text-[#b0b0b0] mb-8 leading-relaxed">
            While you wait &mdash; go install the free version of Walk-Away Guardian
            from the Chrome Web Store. The Founding Creators who do that before
            our call are the ones I prioritize.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 border border-white rounded-lg hover:bg-white hover:text-[#07090c] transition font-bold"
          >
            &larr; Back to Home
          </a>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <a href="/" className="text-[#b0b0b0] text-sm hover:text-white transition mb-8 inline-block">
          &larr; Back to home
        </a>
        <h1
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Founding Creator Application
        </h1>
        <p className="text-[#b0b0b0] mb-10 leading-relaxed">
          We&apos;re recruiting 25 Founding Creators before public launch. 50%
          lifetime commission, free lifetime Pro account, and your name on the
          site as a founding partner. This application takes about 5 minutes.
          Every application is reviewed personally.
        </p>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-[#f5a623]" : "bg-[#1e293b]"
                }`}
              />
            </div>
          ))}
          <span className="text-xs text-[#b0b0b0] ml-2 flex-shrink-0">
            Step {step} of 4
          </span>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: The Basics */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-[#f5a623]">The Basics</h2>

              <div>
                <label className={labelClass}>Name <span className="text-[#e84545]">*</span></label>
                <input className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
                {errors.name && <p className={errorClass}>{errors.name}</p>}
              </div>

              <div>
                <label className={labelClass}>Email <span className="text-[#e84545]">*</span></label>
                <input className={inputClass} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>

              <div>
                <label className={labelClass}>Primary social media platform <span className="text-[#e84545]">*</span></label>
                <select className={selectClass} value={form.primaryPlatform} onChange={(e) => update("primaryPlatform", e.target.value)}>
                  <option value="" disabled>Select a platform</option>
                  {platforms.map((p) => (<option key={p} value={p}>{p}</option>))}
                </select>
                {errors.primaryPlatform && <p className={errorClass}>{errors.primaryPlatform}</p>}
              </div>

              <div>
                <label className={labelClass}>Your handle on that platform <span className="text-[#e84545]">*</span></label>
                <input className={inputClass} value={form.handle} onChange={(e) => update("handle", e.target.value)} placeholder="@yourhandle" />
                {errors.handle && <p className={errorClass}>{errors.handle}</p>}
              </div>

              <div>
                <label className={labelClass}>Other platform handles</label>
                <textarea className={textareaClass} value={form.otherHandles} onChange={(e) => update("otherHandles", e.target.value)} placeholder="List any other platforms and handles" style={{ minHeight: "80px" }} />
              </div>

              <div>
                <label className={labelClass}>Follower count on your largest platform <span className="text-[#e84545]">*</span></label>
                <select className={selectClass} value={form.followerCount} onChange={(e) => update("followerCount", e.target.value)}>
                  <option value="" disabled>Select a range</option>
                  {followerRanges.map((r) => (<option key={r} value={r}>{r}</option>))}
                </select>
                {errors.followerCount && <p className={errorClass}>{errors.followerCount}</p>}
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={next} className="px-8 py-3 bg-[#e84545] text-white font-bold rounded-lg hover:bg-[#d13a3a] transition">
                  Next &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Your Trading Story */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-[#f5a623]">Your Trading Story</h2>

              <div>
                <label className={labelClass}>How long have you been trading? <span className="text-[#e84545]">*</span></label>
                <select className={selectClass} value={form.tradingDuration} onChange={(e) => update("tradingDuration", e.target.value)}>
                  <option value="" disabled>Select</option>
                  {tradingDurations.map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
                {errors.tradingDuration && <p className={errorClass}>{errors.tradingDuration}</p>}
              </div>

              <div>
                <label className={labelClass}>What do you trade primarily? <span className="text-[#e84545]">*</span></label>
                <div className="flex flex-wrap gap-3">
                  {instruments.map((inst) => (
                    <button
                      key={inst}
                      onClick={() => toggleMulti("instruments", inst)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                        form.instruments.includes(inst)
                          ? "bg-[#f5a623] text-[#07090c] border-[#f5a623]"
                          : "bg-[#111827] text-[#b0b0b0] border-[#1e293b] hover:border-[#f5a623]"
                      }`}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
                {errors.instruments && <p className={errorClass}>{errors.instruments}</p>}
              </div>

              <div>
                <label className={labelClass}>
                  Have you ever blown an account or had a major loss from overtrading? Tell us what happened. <span className="text-[#e84545]">*</span>
                </label>
                <textarea
                  className={textareaClass}
                  value={form.blownAccountStory}
                  onChange={(e) => update("blownAccountStory", e.target.value)}
                  placeholder="Be specific — the real stories are what connect with your audience and ours."
                />
                <p className="text-xs text-[#555] mt-1">{form.blownAccountStory.trim().length}/100 characters minimum</p>
                {errors.blownAccountStory && <p className={errorClass}>{errors.blownAccountStory}</p>}
              </div>

              <div>
                <label className={labelClass}>What does your content focus on? <span className="text-[#e84545]">*</span></label>
                <div className="flex flex-wrap gap-3">
                  {contentTypes.map((ct) => (
                    <button
                      key={ct}
                      onClick={() => toggleMulti("contentFocus", ct)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                        form.contentFocus.includes(ct)
                          ? "bg-[#f5a623] text-[#07090c] border-[#f5a623]"
                          : "bg-[#111827] text-[#b0b0b0] border-[#1e293b] hover:border-[#f5a623]"
                      }`}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
                {errors.contentFocus && <p className={errorClass}>{errors.contentFocus}</p>}
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={back} className="px-8 py-3 text-white font-bold rounded-lg hover:bg-[#111827] transition">
                  &larr; Back
                </button>
                <button onClick={next} className="px-8 py-3 bg-[#e84545] text-white font-bold rounded-lg hover:bg-[#d13a3a] transition">
                  Next &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Why You */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-[#f5a623]">Why You</h2>

              <div>
                <label className={labelClass}>
                  Why do you want to be a Founding Creator for Walk-Away Guardian? <span className="text-[#e84545]">*</span>
                </label>
                <textarea
                  className={textareaClass}
                  value={form.whyYou}
                  onChange={(e) => update("whyYou", e.target.value)}
                  placeholder="What about this product resonates with you personally?"
                />
                <p className="text-xs text-[#555] mt-1">{form.whyYou.trim().length}/150 characters minimum</p>
                {errors.whyYou && <p className={errorClass}>{errors.whyYou}</p>}
              </div>

              <div>
                <label className={labelClass}>
                  How would you introduce this product to your audience? Describe the angle or hook you&apos;d use. <span className="text-[#e84545]">*</span>
                </label>
                <textarea
                  className={textareaClass}
                  value={form.pitchAngle}
                  onChange={(e) => update("pitchAngle", e.target.value)}
                  placeholder="We want to see how you think about content, not a polished pitch."
                />
                <p className="text-xs text-[#555] mt-1">{form.pitchAngle.trim().length}/150 characters minimum</p>
                {errors.pitchAngle && <p className={errorClass}>{errors.pitchAngle}</p>}
              </div>

              <div>
                <label className={labelClass}>
                  How many pieces of content can you commit to in your first 30 days? <span className="text-[#e84545]">*</span>
                </label>
                <select className={selectClass} value={form.contentCommitment} onChange={(e) => update("contentCommitment", e.target.value)}>
                  <option value="" disabled>Select</option>
                  {contentCommitments.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
                {errors.contentCommitment && <p className={errorClass}>{errors.contentCommitment}</p>}
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={back} className="px-8 py-3 text-white font-bold rounded-lg hover:bg-[#111827] transition">
                  &larr; Back
                </button>
                <button onClick={next} className="px-8 py-3 bg-[#e84545] text-white font-bold rounded-lg hover:bg-[#d13a3a] transition">
                  Next &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Logistics */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-[#f5a623]">Logistics</h2>

              <div>
                <label className={labelClass}>
                  Are you currently promoting any other trading products as an affiliate? If yes, which ones?
                </label>
                <textarea
                  className={textareaClass}
                  value={form.currentAffiliates}
                  onChange={(e) => update("currentAffiliates", e.target.value)}
                  placeholder="Optional"
                  style={{ minHeight: "80px" }}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Do you have a Stripe account or are you willing to set one up to receive commissions? <span className="text-[#e84545]">*</span>
                </label>
                <select className={selectClass} value={form.hasStripe} onChange={(e) => update("hasStripe", e.target.value)}>
                  <option value="" disabled>Select</option>
                  {stripeOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                </select>
                {errors.hasStripe && <p className={errorClass}>{errors.hasStripe}</p>}
              </div>

              <div>
                <label className={labelClass}>Anything else you want us to know?</label>
                <textarea
                  className={textareaClass}
                  value={form.anythingElse}
                  onChange={(e) => update("anythingElse", e.target.value)}
                  placeholder="Optional"
                  style={{ minHeight: "80px" }}
                />
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={back} className="px-8 py-3 text-white font-bold rounded-lg hover:bg-[#111827] transition">
                  &larr; Back
                </button>
                <button onClick={handleSubmit} className="px-8 py-3 bg-[#f5a623] text-[#07090c] font-bold rounded-lg hover:bg-[#e09515] transition">
                  Submit Application
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
