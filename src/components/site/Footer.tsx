/* eslint-disable @next/next/no-img-element */
import type { SectionContent } from "@/lib/content";

const EXPLORE = [
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#calculator", label: "Cost calculator" },
  { href: "/quote", label: "Get a quote" },
  { href: "/#contact", label: "Contact" },
];

export function Footer({ content }: { content: SectionContent<"contact"> }) {
  return (
    <footer className="bg-deep">
      <div className="max-w-content mx-auto px-8 pt-16 pb-10">
        <div className="flex justify-between items-start gap-10 flex-wrap border-b border-white/10 pb-10">
          <div className="max-w-[300px]">
            <img
              src="/assets/eden-logo-gold.png"
              alt="Eden Electrical"
              className="h-[30px] w-auto block mb-[18px]"
            />
            <p className="text-[15px] leading-[1.6] text-white/60 m-0">
              Solar, battery storage &amp; EV charging across Kent &amp; the
              South East. MCS, NICEIC &amp; TrustMark accredited.
            </p>
          </div>
          <div className="flex gap-16 flex-wrap">
            <div>
              <div className="font-mono text-[12px] tracking-[0.1em] uppercase text-gold-light/60 mb-4">
                Explore
              </div>
              <div className="grid gap-[11px]">
                {EXPLORE.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="text-white/75 hover:text-white text-[15px] transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[12px] tracking-[0.1em] uppercase text-gold-light/60 mb-4">
                Contact
              </div>
              <div className="grid gap-[11px] text-white/75 text-[15px]">
                <span>{content.phone}</span>
                <span>{content.email}</span>
                <span>{content.coverage}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center gap-5 pt-6 flex-wrap">
          <span className="text-[13.5px] text-white/45">
            © 2026 Eden Electrical. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
