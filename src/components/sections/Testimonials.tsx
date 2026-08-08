"use client";
import type { Dictionary } from "@/dictionaries/en";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { testimonials } from "@/lib/site";
import { revealOnScroll } from "@/lib/reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Testimonials({ dict }: { dict: Dictionary["testimonials"] }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      revealOnScroll({
        targets: ".tst-head > *",
        trigger: ref.current,
        start: "top 80%",
        y: 24,
        stagger: 0.1,
      });
      revealOnScroll({
        targets: ".tst-card",
        trigger: ".tst-grid",
        start: "top 85%",
        y: 36,
        stagger: 0.1,
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="testimonials"
      className="w-full bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="tst-head max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase">
            <span className="h-px w-8 bg-gold/60" />
            {dict.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] font-light tracking-[-0.02em] text-ink">
            {dict.title}
          </h2>
        </div>

        <div className="tst-grid mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className="tst-card flex flex-col rounded-2xl border border-camel/30 bg-ivory p-7"
            >
              <span aria-hidden className="font-display text-5xl leading-none text-gold/40">
                “
              </span>
              <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-ink">
                {dict.items[i]?.quote ?? t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-camel/30 pt-4">
                <p className="text-sm font-semibold text-ink">{t.name}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{dict.items[i]?.role ?? t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
