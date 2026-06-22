import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import type { SectionContent } from "@/lib/content";

const FEATURES = [
  { title: "Fully certified", body: "MCS, NICEIC & TrustMark accredited work." },
  { title: "Transparent pricing", body: "See indicative costs before you call." },
  { title: "Local to Kent", body: "A team that knows the South East." },
  { title: "Aftercare included", body: "Monitoring & O&M to keep you running." },
];

export function About({ content }: { content: SectionContent<"about"> }) {
  return (
    <section id="about" className="bg-cream">
      <div className="max-w-content mx-auto px-8 py-[120px] grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-[72px] items-center">
        <PhotoPlaceholder
          variant="cream"
          caption="photo — the team / van / completed job"
          className="h-[480px] rounded-[18px] p-6"
        />
        <div>
          <div className="font-mono text-[12.5px] tracking-eyebrow uppercase text-gold-ink mb-[18px]">
            {content.eyebrow}
          </div>
          <h2 className="font-display font-semibold text-[44px] leading-[1.1] text-primary m-0 mb-6 tracking-tightish">
            {content.heading}
          </h2>
          <p className="text-[18px] leading-[1.65] text-body m-0 mb-[18px]">
            {content.body1}
          </p>
          <p className="text-[18px] leading-[1.65] text-body m-0 mb-9">
            {content.body2}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px]">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-[14px] items-start">
                <span className="flex-none w-2 h-2 rounded-full bg-gold mt-2" />
                <div>
                  <div className="font-semibold text-base text-primary mb-[3px]">
                    {f.title}
                  </div>
                  <div className="text-[15px] text-muted leading-[1.5]">
                    {f.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
