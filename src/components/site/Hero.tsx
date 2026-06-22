/* eslint-disable @next/next/no-img-element */
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import type { SectionContent } from "@/lib/content";

export function Hero({ content }: { content: SectionContent<"hero"> }) {
  return (
    <section id="top" className="bg-primary relative overflow-hidden">
      <div className="absolute -top-[20%] -right-[10%] w-[55%] h-[120%] bg-[radial-gradient(circle_at_60%_40%,rgba(213,176,68,0.16),transparent_60%)] pointer-events-none" />
      <div className="max-w-content mx-auto px-8 pt-[96px] pb-[104px] grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center relative">
        <div>
          <div className="inline-flex items-center gap-[10px] font-mono text-[12.5px] tracking-eyebrow uppercase text-gold border border-gold/35 px-[14px] py-[8px] rounded-full mb-[30px]">
            Solar · Battery · EV — Kent &amp; the South East
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[62px] leading-[1.05] text-white m-0 mb-6 tracking-tightish text-balance">
            {content.headline}
          </h1>
          <p className="text-[19px] leading-[1.6] text-white/[0.78] max-w-[480px] m-0 mb-9">
            {content.intro}
          </p>
          <div className="flex gap-[14px] flex-wrap">
            <a
              href="#calculator"
              className="bg-gold text-primary font-semibold text-base px-7 py-4 rounded-[10px] hover:brightness-105 transition"
            >
              {content.ctaPrimary}
            </a>
            <a
              href="#contact"
              className="bg-transparent text-gold-light font-semibold text-base px-7 py-4 rounded-[10px] border border-gold-light/40 hover:bg-white/5 transition"
            >
              {content.ctaSecondary}
            </a>
          </div>
          <div className="flex items-center gap-6 mt-10 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-gold text-base tracking-[2px]">★★★★★</span>
              <span className="text-white/70 text-sm">
                Rated by Kent homeowners
              </span>
            </div>
            <div className="w-px h-[18px] bg-white/[0.18]" />
            <span className="text-white/70 text-sm">MCS · NICEIC · TrustMark</span>
          </div>
        </div>
        {content.image ? (
          <img
            src={content.image}
            alt="Solar installation on a Kent home"
            className="h-[520px] w-full object-cover rounded-[18px] border border-gold/20"
          />
        ) : (
          <PhotoPlaceholder
            variant="dark"
            caption="photo — solar install on a Kent home"
            className="h-[520px] rounded-[18px] p-6"
          />
        )}
      </div>
    </section>
  );
}
