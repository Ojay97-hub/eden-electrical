type Testimonial = {
  quote: string;
  initial: string;
  name: string;
  meta: string;
  inverted?: boolean;
};

const ITEMS: Testimonial[] = [
  {
    quote:
      "From quote to switch-on the whole thing was effortless. The panels look superb and our bills have dropped right down.",
    initial: "S",
    name: "Sarah M.",
    meta: "Tunbridge Wells · Solar + Battery",
  },
  {
    quote:
      "Genuinely the most professional trades team we've used. Tidy, on time, and they explained everything without the jargon.",
    initial: "J",
    name: "James & Priya",
    meta: "Maidstone · EV Charger",
    inverted: true,
  },
  {
    quote:
      "The calculator gave us a realistic figure up front, and the final price matched. No surprises — exactly what you want.",
    initial: "D",
    name: "David O.",
    meta: "Canterbury · Full system",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-cream">
      <div className="max-w-content mx-auto px-8 py-[110px]">
        <div className="text-center mb-[54px]">
          <div className="font-mono text-[12.5px] tracking-eyebrow uppercase text-gold-ink mb-[18px]">
            Testimonials
          </div>
          <h2 className="font-display font-semibold text-[46px] leading-[1.08] text-primary m-0 tracking-tightish">
            Trusted across Kent
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ITEMS.map((t) => (
            <div
              key={t.name}
              className={`rounded-[16px] p-9 flex flex-col ${
                t.inverted
                  ? "bg-primary"
                  : "bg-white border border-primary/10"
              }`}
            >
              <div className="text-gold text-base tracking-[2px] mb-5">
                ★★★★★
              </div>
              <p
                className={`font-display text-[21px] leading-[1.5] m-0 mb-7 ${
                  t.inverted ? "text-white" : "text-ink"
                }`}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-auto flex items-center gap-[14px]">
                <span
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-display text-[18px] ${
                    t.inverted
                      ? "bg-gold text-primary"
                      : "bg-primary text-gold-light"
                  }`}
                >
                  {t.initial}
                </span>
                <div>
                  <div
                    className={`font-semibold text-[15px] ${
                      t.inverted ? "text-white" : "text-primary"
                    }`}
                  >
                    {t.name}
                  </div>
                  <div
                    className={`text-[13.5px] ${
                      t.inverted ? "text-white/60" : "text-muted-2"
                    }`}
                  >
                    {t.meta}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
