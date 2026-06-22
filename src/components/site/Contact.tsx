"use client";

import { useEffect, useState } from "react";
import { Toast } from "@/components/Toast";
import type { SectionContent } from "@/lib/content";
import {
  CALCULATOR_LEAD_EVENT,
  CALCULATOR_LEAD_STORAGE_KEY,
  CONTACT_SERVICE_OPTIONS,
  parseCalculatorLead,
  serviceToContactOption,
  type CalculatorLeadDetail,
} from "@/lib/calculatorLead";

const SERVICES = CONTACT_SERVICE_OPTIONS;

const inputClass =
  "w-full p-[14px] rounded-[10px] border border-primary/[0.18] bg-white text-[15px] outline-none focus:border-gold";

export function Contact({ content }: { content: SectionContent<"contact"> }) {
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [service, setService] = useState<string>(SERVICES[0]);
  const [estimate, setEstimate] = useState("");

  // Pick up an estimate handed over from the pricing calculator. The calculator
  // both stores the lead in sessionStorage (survives the #contact jump / a
  // reload) and fires a live event (when it's already on screen). Either way we
  // pre-select the service and attach the breakdown to the enquiry.
  useEffect(() => {
    function applyLead(lead: CalculatorLeadDetail) {
      setService(serviceToContactOption(lead.service));
      setEstimate(lead.estimate);
    }

    try {
      const raw = window.sessionStorage.getItem(CALCULATOR_LEAD_STORAGE_KEY);
      const lead = parseCalculatorLead(raw ? JSON.parse(raw) : null);
      if (lead) {
        applyLead(lead);
        // Consume it so a later unrelated visit doesn't re-attach a stale price.
        window.sessionStorage.removeItem(CALCULATOR_LEAD_STORAGE_KEY);
      }
    } catch {
      // Ignore unavailable/malformed storage — the form still works manually.
    }

    function onLead(e: Event) {
      const lead = parseCalculatorLead((e as CustomEvent).detail);
      if (lead) applyLead(lead);
    }
    window.addEventListener(CALCULATOR_LEAD_EVENT, onLead);
    return () => window.removeEventListener(CALCULATOR_LEAD_EVENT, onLead);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (estimate) data.estimate = estimate;

    // Validation: name required + at least one of phone / valid email.
    if (!data.name?.trim()) {
      setError("Please tell us your name.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "");
    if (!data.phone?.trim() && !emailOk) {
      setError("Please leave a phone number or a valid email so we can reply.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setService(SERVICES[0]);
      setEstimate("");
      setToast("Thanks — we'll be in touch within one working day.");
    } catch {
      setError("Something went wrong. Please call us or try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const rows = [
    { icon: "☎", label: "Phone", value: content.phone },
    { icon: "✉", label: "Email", value: content.email },
    { icon: "◉", label: "Covering", value: content.coverage },
  ];

  return (
    <section id="contact" className="bg-white border-t border-primary/[0.08]">
      <div className="max-w-content mx-auto px-8 py-[110px] grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <div className="font-mono text-[12.5px] tracking-eyebrow uppercase text-gold-ink mb-[18px]">
            Get in touch
          </div>
          <h2 className="font-display font-semibold text-[46px] leading-[1.08] text-primary m-0 mb-5 tracking-tightish">
            Let&apos;s talk about your project
          </h2>
          <p className="text-[18px] leading-[1.65] text-body m-0 mb-10 max-w-[440px]">
            Tell us a little about your home or business and we&apos;ll arrange a
            free, no-obligation survey.
          </p>
          <div className="grid gap-6">
            {rows.map((r) => (
              <div key={r.label} className="flex gap-4 items-center">
                <span className="flex-none w-12 h-12 rounded-[12px] bg-cream border border-primary/10 flex items-center justify-center text-xl">
                  {r.icon}
                </span>
                <div>
                  <div className="text-[13px] text-muted-2 uppercase tracking-[0.08em] font-mono">
                    {r.label}
                  </div>
                  <div className="text-[18px] font-semibold text-primary">
                    {r.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-cream border border-primary/10 rounded-[18px] p-10 grid gap-[18px]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Name
              </label>
              <input name="name" type="text" placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Phone
              </label>
              <input name="phone" type="tel" placeholder="Your number" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Email
            </label>
            <input name="email" type="email" placeholder="you@email.com" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Interested in
            </label>
            <div className="relative">
              <select
                name="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className={`${inputClass} text-ink appearance-none pr-12 cursor-pointer`}
              >
                {SERVICES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              {/* Custom brand chevron — replaces the default browser arrow */}
              <svg
                aria-hidden="true"
                viewBox="0 0 12 8"
                className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 w-3 h-2 text-primary/70"
              >
                <path
                  d="M1 1.5 6 6.5 11 1.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {estimate && (
            <div className="rounded-[12px] border border-gold/40 bg-gold/[0.1] p-4">
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-gold-ink">
                  Your calculator estimate
                </span>
                <button
                  type="button"
                  onClick={() => setEstimate("")}
                  className="text-[12px] font-semibold text-primary/60 hover:text-primary underline-offset-2 hover:underline"
                >
                  Remove
                </button>
              </div>
              <pre className="m-0 whitespace-pre-wrap font-mono text-[12.5px] leading-[1.6] text-primary">
                {estimate}
              </pre>
              <p className="m-0 mt-2 text-[12px] text-body/80">
                We&apos;ll include this with your enquiry so we can pick up right
                where you left off.
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Message
            </label>
            <textarea
              name="message"
              rows={4}
              placeholder="Tell us about your property..."
              className={`${inputClass} resize-y`}
            />
          </div>
          {error && (
            <p className="text-[14px] text-[#a23b2d] m-0" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-gold-light border-none font-semibold text-base p-4 rounded-[10px] cursor-pointer disabled:opacity-60 hover:brightness-110 transition"
          >
            {submitting ? "Sending…" : "Request my free survey"}
          </button>
        </form>
      </div>
      <Toast message={toast} onDismiss={() => setToast("")} />
    </section>
  );
}
