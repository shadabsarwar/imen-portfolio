"use client";
import type { Dictionary } from "@/dictionaries/en";
import type { Locale } from "@/lib/i18n";

import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import RotatingText from "./RotatingText";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// WebGL background is client-only; a CSS gradient sits behind it as an instant fallback.
const HeroBackground = dynamic(() => import("./HeroBackground"), { ssr: false });

export default function Hero({
  dict,
  lang,
}: {
  dict: Dictionary["hero"];
  lang: Locale;
}) {
  const root = useRef<HTMLElement>(null);

  const latin = lang !== "ar";

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) return;

      /**
       * Arabic is cursive: letters join, and their shape depends on their
       * neighbours. SplitType wraps every character in its own span, which
       * severs those joins and renders the name as disconnected glyphs. So
       * the per-character reveal is Latin-only — Arabic animates as one word.
       */
      const split = latin ? new SplitType(".hero-name", { types: "chars" }) : null;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-canvas", { autoAlpha: 0, duration: 1.3 })
        .from(
          ".hero-portrait",
          {
            autoAlpha: 0,
            y: 40,
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 1.2,
            ease: "power4.out",
          },
          0.15,
        )
        .from(
          ".hero-ghost",
          { autoAlpha: 0, x: 40, duration: 1.6, ease: "power2.out" },
          0.2,
        )
        .from(".hero-eyebrow", { autoAlpha: 0, y: 20, duration: 0.6 }, 0.55)
        .from(
          split?.chars ?? ".hero-name",
          {
            autoAlpha: 0,
            yPercent: 120,
            rotate: 5,
            stagger: 0.028,
            duration: 0.8,
            ease: "power4.out",
          },
          0.55,
        )
        .from(".hero-roleline", { autoAlpha: 0, y: 20, duration: 0.6 }, "-=0.35")
        .from(".hero-tagline", { autoAlpha: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from(
          ".hero-chip",
          { autoAlpha: 0, y: 16, stagger: 0.07, duration: 0.5 },
          "-=0.3",
        )
        .from(
          ".hero-cta",
          { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.5 },
          "-=0.25",
        )
        .from(".hero-scrollcue", { autoAlpha: 0, duration: 0.6 }, "-=0.2");

      // Parallax on scroll.
      gsap.to(".hero-portrait-outer", {
        yPercent: -9,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".hero-ghost", {
        yPercent: -14,
        xPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => {
        split?.revert();
      };
    },
    { scope: root, dependencies: [latin] },
  );

  return (
    <section
      ref={root}
      id="intro"
      className="hero relative min-h-[100svh] w-full overflow-hidden bg-cream"
    >
      {/* Instant CSS gradient base (paints before WebGL mounts / fallback).
          Must track the shader's ivory → cream → sand ramp, or the hero
          flashes the wrong palette for a frame before WebGL takes over. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_72%_25%,#fdf6ee_0%,#f9e3cb_46%,#f0c49f_100%)]"
      />
      {/* Living WebGL background. */}
      <div className="hero-canvas pointer-events-none absolute inset-0 -z-10">
        <HeroBackground />
      </div>

      {/* Giant ghosted Arabic name. */}
      <span
        aria-hidden
        className="hero-ghost pointer-events-none absolute top-1/2 right-[-3%] z-0 -translate-y-1/2 select-none font-arabic text-[26vw] leading-none font-bold text-camel/10 md:text-[17vw]"
      >
        {dict.nameArabic}
      </span>

      {/* Content grid. */}
      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-7xl grid-cols-1 items-center gap-4 px-6 pt-28 pb-16 md:grid-cols-12 md:gap-8 md:px-12 md:pt-0 md:pb-0">
        {/* Text column. */}
        <div className="order-2 md:order-1 md:col-span-6 lg:col-span-7">
          <p className="hero-eyebrow mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase">
            <span className="h-px w-8 bg-gold-deep/50" />
            <RotatingText items={dict.eyebrow} interval={2600} />
          </p>

          <h1
            aria-label={dict.name}
            // The Latin name is split per character for the reveal, and loose
            // spans have no bidi context of their own — without this it
            // renders as "issijdA eneml". Arabic is never split, so it keeps
            // its own direction.
            dir={latin ? "ltr" : "rtl"}
            className="hero-name font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.92] font-light tracking-[-0.02em] text-ink"
          >
            {dict.name}
          </h1>

          <div className="hero-roleline mt-5 flex flex-wrap items-baseline gap-x-2 text-lg text-ink-soft md:text-2xl">
            <span>{dict.prefix}</span>
            <RotatingText
              items={dict.roles}
              interval={2200}
              className="font-medium text-ink"
            />
          </div>

          <p className="hero-tagline mt-6 max-w-md text-base leading-relaxed text-ink-soft">
            {dict.tagline}
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {dict.credentials.map((c) => (
              <li
                key={c}
                className="hero-chip rounded-full border border-camel/40 bg-ivory/60 px-3.5 py-1.5 text-xs font-medium text-ink-soft backdrop-blur-sm"
              >
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="hero-cta">
              <MagneticButton
                href="#services"
                variant="primary"
              >
                {dict.ctaPrimary}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </MagneticButton>
            </div>
            <div className="hero-cta">
              <MagneticButton
                href="#showreel"
                variant="ghost"
              >
                <span aria-hidden>▶</span>
                {dict.ctaSecondary}
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Portrait column. */}
        <div className="relative order-1 flex h-[46svh] items-end justify-center self-end md:order-2 md:col-span-6 md:h-[92svh] md:justify-end lg:col-span-5">
          <div className="hero-portrait-outer relative h-full w-full max-w-[300px] md:max-w-[460px]">
            <div className="hero-portrait relative h-full w-full">
              {/* Soft glow grounding the figure. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 -z-10 mx-auto aspect-square w-[86%] translate-y-[6%] rounded-full bg-[radial-gradient(circle_at_center,rgba(207,65,115,0.26),rgba(243,147,153,0.16)_45%,transparent_70%)] blur-2xl"
              />
              <Image
                src="/imene/imene-hero.png"
                alt="Imene Adjissi"
                fill
                priority
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-contain object-bottom drop-shadow-[0_30px_60px_rgba(60,25,40,0.18)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue. */}
      <div className="hero-scrollcue absolute bottom-6 left-6 z-20 flex items-center gap-3 text-xs tracking-[0.2em] text-ink-soft uppercase md:left-12">
        <span className="inline-block h-8 w-px animate-pulse bg-ink/30" />
        {dict.scroll}
      </div>
    </section>
  );
}
