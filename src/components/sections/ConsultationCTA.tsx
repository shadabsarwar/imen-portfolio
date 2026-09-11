"use client";
import type { Dictionary } from "@/dictionaries/en";
import type { Locale } from "@/lib/i18n";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { revealOnScroll } from "@/lib/reveal";
import { consultationLoginUrl } from "@/lib/auth/callback";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Slim paid-consultation banner shown right after the hero.
 * Links to the dedicated /consultation page.
 */
export default function ConsultationCTA({
  dict,
  lang,
}: {
  dict: Dictionary["consultationCta"];
  lang: Locale;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      revealOnScroll({
        targets: ".consult-in > *",
        trigger: ref.current,
        start: "top 85%",
        y: 22,
        stagger: 0.08,
        duration: 0.6,
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="consultation" className="w-full bg-cream px-4 pb-4 md:px-8">
      <div className="consult-box relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-6 text-cream shadow-[0_40px_90px_-50px_rgba(42,22,30,0.7)] md:px-14">
        {/* Gold wash. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-72 w-96 rounded-full bg-[radial-gradient(circle,rgba(207,65,115,0.26),transparent_70%)] blur-2xl"
        />

        <div className="consult-in relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-soft uppercase">
              <span className="h-px w-8 bg-gold-soft/60" />
              {dict.eyebrow}
            </p>
            <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.5rem)] leading-[1.05] font-light tracking-[-0.01em]">
              {dict.title}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/60">
  {dict.body}
</p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium tracking-wide text-cream/55 uppercase">
              {["30 or 60 min", "Video call", "AR · FR · EN"].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-cream/15 px-2.5 py-1"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
            <Link
              href={consultationLoginUrl(lang)}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 text-sm font-medium text-ink transition-colors duration-300 hover:bg-cream"
            >
              {dict.cta}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <span className="text-xs text-cream/45">
              {dict.note}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
