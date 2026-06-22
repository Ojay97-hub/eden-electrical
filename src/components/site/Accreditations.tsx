const NAMES = ["MCS Certified", "NICEIC Approved", "TrustMark", "RECC", "OZEV"];

/** Toggleable accreditation strip (see `showAccreditations` prop on the site). */
export function Accreditations() {
  return (
    <section className="bg-deep border-b border-white/5">
      <div className="max-w-content mx-auto px-8 py-[30px] flex items-center justify-between gap-8 flex-wrap">
        <span className="font-mono text-[12px] tracking-label uppercase text-gold-light/55">
          Certified &amp; accredited
        </span>
        <div className="flex items-center gap-10 flex-wrap">
          {NAMES.map((n) => (
            <span
              key={n}
              className="font-display text-[22px] text-white/85"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
