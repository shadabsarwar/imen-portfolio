"use client";
import type { Dictionary } from "@/dictionaries/en";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { revealOnScroll } from "@/lib/reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Proficiency bar widths — layout, so they stay out of the dictionary. */
const LANG_BAR = ["w-full", "w-[92%]", "w-[88%]"];

export default function About({ dict }: { dict: Dictionary["about"] }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      revealOnScroll({
        targets: ".about-photo",
        trigger: ref.current,
        start: "top 75%",
        y: 40,
        duration: 0.9,
      });
      revealOnScroll({
        targets: ".about-copy > *",
        trigger: ref.current,
        start: "top 72%",
        y: 26,
        stagger: 0.09,
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="about" className="w-full bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 md:gap-10 md:px-12">
        {/* Photo. */}
        <div className="about-photo relative md:col-span-5">
          <div className="relative overflow-hidden rounded-[2rem] bg-cream ring-1 ring-ink/10">
            <Image
              src="/imene/imene-seated.jpg"
              alt={dict.portraitAlt}
              width={860}
              height={1290}
              className="h-auto w-full object-cover"
            />
          </div>
          <span className="absolute bottom-5 left-5 rounded-full bg-ink/80 px-4 py-2 text-xs font-medium text-cream backdrop-blur-sm">
            {dict.badge}
          </span>
          {/* Gold corner accent. */}
          <div
            aria-hidden
            className="absolute -top-3 -right-3 -z-10 h-28 w-28 rounded-[2rem] bg-gold/20"
          />
        </div>

        {/* Copy. */}
        <div className="about-copy md:col-span-7 md:pl-6">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase">
            <span className="h-px w-8 bg-gold/60" />
            {dict.eyebrow}
          </p>
          <h2 className="max-w-xl font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] font-light tracking-[-0.02em] text-ink">
            {dict.title}
          </h2>

          <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-ink-soft">
            {dict.paragraphs.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>

          {/* Skills. */}
          <ul className="mt-8 flex max-w-xl flex-wrap gap-2">
            {dict.skills.map((s) => (
              <li
                key={s}
                className="rounded-full border border-camel/40 bg-ivory px-3.5 py-1.5 text-xs font-medium text-ink-soft"
              >
                {s}
              </li>
            ))}
          </ul>

          {/* Languages. */}
          <div className="mt-8 max-w-md space-y-4">
            {dict.languages.map((l, i) => (
              <div key={l.name}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="font-medium text-ink">{l.name}</span>
                  <span className="text-xs text-ink-soft">{l.level}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/8">
                  <div className={`h-full rounded-full bg-gold ${LANG_BAR[i] ?? "w-full"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
