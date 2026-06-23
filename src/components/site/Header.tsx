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
      <div className="max-w-content mx-auto h-16 px-5 sm:px-8 md:h-[78px] flex items-center justify-between gap-4 sm:gap-6">
        <a href="#top" className="flex items-center">
          <img
            src="/assets/eden-logo-gold.png"
            alt="Eden Electrical"
            className="h-6 w-auto block sm:h-[30px]"
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
          className="bg-gold text-primary font-semibold text-[14px] px-4 py-2.5 rounded-[9px] whitespace-nowrap hover:brightness-105 transition sm:text-[15px] sm:px-[22px] sm:py-[12px]"
        >
          <span className="hidden sm:inline">Get a free quote</span>
          <span className="sm:hidden">Quote</span>
        </a>
      </div>
    </header>
  );
}
