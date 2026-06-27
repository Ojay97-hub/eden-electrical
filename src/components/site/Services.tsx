/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";

type Service = {
  title: string;
  tag: string;
  blurb: string;
  points: string[];
  image?: string;
};

const SERVICES: Service[] = [
  {
    title: "Solar Panel Installation",
    tag: "Design → switch-on",
    blurb:
      "We design, supply and install high-efficiency rooftop solar tailored to your roof and your energy use — handling everything from the survey to the DNO paperwork.",
    points: [
      "MCS-certified panels & inverters",
      "Bespoke system design for your roof",
      "Smartphone generation monitoring",
      "All DNO & G99 paperwork handled",
    ],
    image: "/assets/webp-eden-electrical/solar-panels-closeup-sky-reflection-01.webp",
  },
  {
    title: "Battery Storage",
    tag: "Use power on your terms",
    blurb:
      "Store the energy you generate and draw on it when you need it. Charge cheaply on off-peak tariffs and keep the lights on during outages.",
    points: [
      "Store excess solar for the evenings",
      "Optional whole-home back-up",
      "Charge on cheap off-peak tariffs",
      "Scalable, modular capacity",
    ],
    image: "/assets/webp-eden-electrical/foxess-inverter-battery-brick-wall-02.jpg",
  },
  {
    title: "EV Charging",
    tag: "Smart home chargers",
    blurb:
      "OZEV-approved home charge points, neatly fitted and ready for solar-aware smart charging so you fuel your car for less.",
    points: [
      "7 kW & 22 kW charge points",
      "Tethered or untethered units",
      "Solar-aware smart charging",
      "Tidy, certified installation",
    ],
  },
  {
    title: "O&M for Solar",
    tag: "On request",
    blurb:
      "Keep your system performing for decades with proactive monitoring, servicing and rapid fault-finding.",
    points: [
      "Performance monitoring & reporting",
      "Panel cleaning & inspections",
      "Inverter servicing & fault-finding",
      "Priority callouts",
    ],
    image: "/assets/webp-eden-electrical/sunsynk-inverter-battery-system.jpg",
  },
];

export function Services() {
  // Single-open accordion; first service open by default (-1 = all closed).
  const [open, setOpen] = useState(0);

  return (
    <section
      id="services"
      className="bg-white border-t border-primary/[0.08]"
    >
      <div className="max-w-content mx-auto px-8 py-[110px]">
        <div className="flex justify-between items-end gap-8 mb-12 flex-wrap">
          <div>
            <div className="font-mono text-[12.5px] tracking-eyebrow uppercase text-gold-ink mb-[18px]">
              What we do
            </div>
            <h2 className="font-display font-semibold text-[46px] leading-[1.08] text-primary m-0 tracking-tightish">
              Our services
            </h2>
          </div>
          <p className="text-[17px] text-muted max-w-[380px] m-0 leading-[1.6]">
            Tap any service to see what&apos;s included — then jump to the
            calculator for an instant estimate.
          </p>
        </div>

        <div className="border-b border-primary/[0.14]">
          {SERVICES.map((svc, i) => {
            const isOpen = open === i;
            return (
              <div key={svc.title} className="border-t border-primary/[0.14]">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-7 py-[34px] px-2 bg-transparent border-none cursor-pointer text-left"
                >
                  <span className="font-mono text-[15px] text-gold w-9 flex-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-[31px] text-primary leading-[1.1]">
                    {svc.title}
                  </span>
                  <span className="hidden sm:block text-sm text-muted-2 font-mono tracking-[0.04em]">
                    {svc.tag}
                  </span>
                  <span className="flex-none w-11 h-11 rounded-full border border-primary/[0.18] flex items-center justify-center text-2xl text-primary">
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-14 pt-1 pb-[44px] px-2 lg:pl-16">
                      <div>
                        <p className="text-[18px] leading-[1.65] text-body m-0 mb-6 max-w-[520px]">
                          {svc.blurb}
                        </p>
                        <div className="grid gap-[14px] mb-[30px]">
                          {svc.points.map((pt) => (
                            <div key={pt} className="flex gap-3 items-center">
                              <span className="flex-none text-gold font-bold text-[15px]">
                                ✓
                              </span>
                              <span className="text-base text-[#3f3a32]">
                                {pt}
                              </span>
                            </div>
                          ))}
                        </div>
                        <a
                          href="#calculator"
                          className="inline-flex items-center gap-2 text-primary font-semibold text-base no-underline border-b-2 border-gold pb-[3px]"
                        >
                          Estimate the cost →
                        </a>
                      </div>
                      {svc.image ? (
                        <img
                          src={svc.image}
                          alt={svc.title}
                          className="min-h-[240px] w-full object-cover rounded-[14px]"
                        />
                      ) : (
                        <PhotoPlaceholder
                          variant="light"
                          caption={`photo — ${svc.title}`}
                          className="min-h-[240px] rounded-[14px] p-5"
                          captionClassName="!text-[11.5px] tracking-[0.06em] !bg-white/80"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
