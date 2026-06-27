import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSectionContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get a Quote — Eden Electrical",
  description:
    "Build a detailed, itemised solar quote for your home with Eden Electrical's quote tool.",
};

const QUOTE_TOOL_URL = "https://quote.novainstall.com/eden-electrical/solar";

export default async function QuotePage() {
  const contact = await getSectionContent("contact");

  return (
    <main>
      <Header />

      <section className="bg-cream">
        <div className="max-w-content mx-auto px-5 pt-14 pb-10 text-center sm:px-8 sm:pt-[88px] sm:pb-12">
          <div className="mb-[16px] font-mono text-[12.5px] uppercase tracking-eyebrow text-gold-ink">
            Detailed quote
          </div>
          <h1 className="m-0 mb-4 font-display text-[36px] font-semibold leading-[1.08] tracking-tightish text-primary sm:text-[48px]">
            Build your full solar quote
          </h1>
          <p className="mx-auto max-w-[600px] text-[17px] leading-[1.65] text-body m-0 sm:text-[18px]">
            Walk through your property and usage to get an itemised system
            design and price. Prefer a 10-second ballpark first? Try our{" "}
            <a href="/#calculator" className="font-semibold text-primary underline-offset-2 hover:underline">
              instant cost calculator
            </a>
            .
          </p>
        </div>
      </section>

      <section className="bg-deep">
        <div className="max-w-content mx-auto px-5 py-10 sm:px-8 sm:py-14">
          <div className="overflow-hidden rounded-[22px] border border-white/[0.18] bg-white shadow-[0_38px_90px_-52px_rgba(0,0,0,0.75)]">
            <iframe
              src={QUOTE_TOOL_URL}
              title="Eden Electrical solar quote builder"
              className="block w-full h-[720px]"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
          <p className="mt-5 text-center text-[13px] leading-[1.6] text-white/[0.7]">
            This quote builder is provided by our partner NovaInstall. Your
            details are submitted directly to Eden Electrical.
          </p>
        </div>
      </section>

      <Footer content={contact} />
    </main>
  );
}
