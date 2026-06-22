/* eslint-disable @next/next/no-img-element */
const NAV = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#calculator", label: "Cost calculator" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[rgba(25,55,45,0.92)] backdrop-blur-[12px] border-b border-gold/[0.22]">
      <div className="max-w-content mx-auto px-8 h-[78px] flex items-center justify-between gap-6">
        <a href="#top" className="flex items-center">
          <img
            src="/assets/eden-logo-gold.png"
            alt="Eden Electrical"
            className="h-[30px] w-auto block"
          />
        </a>
        <nav className="hidden md:flex items-center gap-[34px]">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-white/80 hover:text-white text-[15px] font-medium transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="bg-gold text-primary font-semibold text-[15px] px-[22px] py-[12px] rounded-[9px] whitespace-nowrap hover:brightness-105 transition"
        >
          Get a free quote
        </a>
      </div>
    </header>
  );
}
