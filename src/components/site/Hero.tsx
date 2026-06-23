/* eslint-disable @next/next/no-img-element */
"use client";

import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import type { SectionContent } from "@/lib/content";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const HERO_BADGES = ["Clean energy", "Solar", "Battery", "EV charging", "Kent & South East"];

export function Hero({ content }: { content: SectionContent<"hero"> }) {
  const [activeBadge, setActiveBadge] = useState(0);
  const [isHoveringBadge, setIsHoveringBadge] = useState(false);
  const [marker, setMarker] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const badgeRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    function measure() {
      const badge = badgeRef.current;
      const chip = chipRefs.current[activeBadge];
      if (!badge || !chip) return;

      const badgeBox = badge.getBoundingClientRect();
      const chipBox = chip.getBoundingClientRect();
      setMarker({
        x: chipBox.left - badgeBox.left,
        y: chipBox.top - badgeBox.top,
        width: chipBox.width,
        height: chipBox.height,
      });
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeBadge]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || isHoveringBadge) return;

    const timer = window.setInterval(() => {
      setActiveBadge((current) => (current + 1) % HERO_BADGES.length);
    }, 1800);

    return () => window.clearInterval(timer);
  }, [isHoveringBadge]);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const words = title.querySelectorAll("[data-hero-title-word]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) {
      gsap.set(words, { autoAlpha: 1, y: 0, rotateX: 0, filter: "blur(0px)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          autoAlpha: 0,
          y: 36,
          rotateX: -18,
          filter: "blur(10px)",
          transformOrigin: "50% 100%",
        },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 1.05,
          stagger: 0.085,
          ease: "power3.out",
          delay: 0.16,
          clearProps: "transform,filter,opacity,visibility",
        }
      );
    }, title);

    return () => ctx.revert();
  }, [content.headline]);

  return (
    <section id="top" className="bg-primary relative overflow-hidden">
      <div className="absolute -top-[20%] -right-[10%] hidden w-[55%] h-[120%] bg-[radial-gradient(circle_at_60%_40%,rgba(213,176,68,0.16),transparent_60%)] pointer-events-none sm:block" />
      <div className="max-w-content mx-auto px-5 pt-14 pb-16 grid grid-cols-1 gap-10 items-center relative sm:px-8 sm:pt-[96px] sm:pb-[104px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <div
            ref={badgeRef}
            className="relative mb-6 inline-flex max-w-full flex-wrap items-center gap-1.5 overflow-hidden rounded-[15px] border border-gold/25 bg-white/[0.06] p-1.5 text-[13px] font-semibold leading-none text-white/86 shadow-[0_18px_45px_-38px_rgba(0,0,0,0.8)] backdrop-blur-md sm:mb-[30px] sm:rounded-full"
            onMouseEnter={() => setIsHoveringBadge(true)}
            onMouseLeave={() => setIsHoveringBadge(false)}
          >
            <span
              aria-hidden
              className="absolute left-0 top-0 rounded-full bg-gold shadow-[0_12px_28px_-16px_rgba(213,176,68,0.9)] transition-[transform,width,height] duration-500 ease-out after:absolute after:left-3 after:top-1/2 after:h-1.5 after:w-1.5 after:-translate-y-1/2 after:rounded-full after:bg-primary after:content-['']"
              style={{
                width: marker.width,
                height: marker.height,
                transform: `translate3d(${marker.x}px, ${marker.y}px, 0)`,
              }}
            />
            {HERO_BADGES.map((label, index) => {
              const active = activeBadge === index;
              return (
                <button
                  key={label}
                  ref={(node) => {
                    chipRefs.current[index] = node;
                  }}
                  type="button"
                  onMouseEnter={() => setActiveBadge(index)}
                  onFocus={() => setActiveBadge(index)}
                  onClick={() => setActiveBadge(index)}
                  className={`relative z-10 flex items-center gap-2 rounded-full px-3 py-2 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-gold-light/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary ${
                    active
                      ? "pl-6 text-primary"
                      : "text-white/82 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <h1
            ref={titleRef}
            aria-label={content.headline}
            className="m-0 mb-5 font-display text-[40px] font-semibold leading-[1.02] tracking-normal text-white [perspective:900px] min-[420px]:text-[46px] sm:mb-6 sm:text-[62px] sm:leading-[1.05] sm:tracking-tightish text-balance break-words"
          >
            {content.headline.split(" ").map((word, index, words) => (
              <span
                key={`${word}-${index}`}
                aria-hidden="true"
                data-hero-title-word
                className="inline-block will-change-transform"
              >
                {word}
                {index < words.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </h1>
          <p className="text-[17px] sm:text-[19px] leading-[1.58] sm:leading-[1.6] text-white/[0.78] max-w-[480px] m-0 mb-7 sm:mb-9 break-words">
            {content.intro}
          </p>
          <div className="grid gap-3 sm:flex sm:gap-[14px] sm:flex-wrap">
            <a
              href="#calculator"
              className="bg-gold text-primary font-semibold text-base px-5 py-4 rounded-[10px] text-center hover:brightness-105 transition sm:px-7"
            >
              {content.ctaPrimary}
            </a>
            <a
              href="#contact"
              className="bg-transparent text-gold-light font-semibold text-base px-5 py-4 rounded-[10px] border border-gold-light/40 text-center hover:bg-white/5 transition sm:px-7"
            >
              {content.ctaSecondary}
            </a>
          </div>
          <div className="flex items-start gap-3 mt-8 flex-col sm:flex-row sm:items-center sm:gap-6 sm:mt-10 sm:flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-gold text-base tracking-[2px]">★★★★★</span>
              <span className="text-white/70 text-sm">
                Rated by Kent homeowners
              </span>
            </div>
            <div className="hidden w-px h-[18px] bg-white/[0.18] sm:block" />
            <span className="text-white/70 text-sm">MCS · NICEIC · TrustMark</span>
          </div>
        </div>
        {content.image ? (
          <img
            src={content.image}
            alt="Solar installation on a Kent home"
            className="h-[240px] w-full object-cover rounded-[14px] border border-gold/20 sm:h-[360px] sm:rounded-[18px] lg:h-[520px]"
          />
        ) : (
          <PhotoPlaceholder
            variant="dark"
            caption="photo — solar install on a Kent home"
            className="h-[220px] rounded-[14px] p-5 sm:h-[360px] sm:rounded-[18px] sm:p-6 lg:h-[520px]"
          />
        )}
      </div>
    </section>
  );
}
