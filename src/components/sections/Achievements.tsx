"use client";
import type { Dictionary } from "@/dictionaries/en";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { stats, milestones } from "@/lib/site";
import { revealOnScroll } from "@/lib/reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Achievements({ dict }: { dict: Dictionary["achievements"] }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!reduce) {
        revealOnScroll({
          targets: ".ach-head > *",
          trigger: ref.current,
          start: "top 78%",
          y: 24,
          stagger: 0.1,
        });
        revealOnScroll({
          targets: ".ach-card",
          trigger: ".ach-grid",
          start: "top 85%",
          y: 34,
          stagger: 0.08,
        });
      }

      // Count-up numbers (jump straight to target when reduced motion).
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const target = Number(el.dataset.target || "0");
        if (reduce) {
          el.innerText = String(target);
          return;
        }
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.fromTo(
              el,
              { innerText: 0 },
              {
                innerText: target,
                duration: 1.6,
                ease: "power2.out",
                snap: { innerText: 1 },
                overwrite: true,
              },
            ),
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="achievements"
      className="w-full bg-cream py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="ach-head max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase">
            <span className="h-px w-8 bg-gold/60" />
            {dict.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] font-light tracking-[-0.02em] text-ink">
            {dict.title}
          </h2>
        </div>

        {/* Stats. */}
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((s, i) => (
            <div key={s.label} className="ach-card">
              <p className="font-display text-5xl font-light text-ink md:text-6xl">
                <span className="stat-num tabular-nums" data-target={s.value}>
                  0
                </span>
                <span className="text-gold">{s.suffix}</span>
              </p>
              <p className="mt-2 text-sm text-ink-soft">{dict.stats[i] ?? s.label}</p>
            </div>
          ))}
        </div>

        {/* Milestones. */}
        <div className="ach-grid mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m, i) => (
            <div
              key={m.title + m.org}
              className="ach-card rounded-2xl border border-camel/30 bg-ivory p-6 transition-shadow duration-300 hover:shadow-[0_24px_50px_-30px_rgba(60,25,40,0.35)]"
            >
              <p className="font-display text-xl text-gold">{m.year}</p>
              <p className="mt-3 text-sm font-semibold text-ink">
                {dict.milestones[i]?.title ?? m.title}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{dict.milestones[i]?.org ?? m.org}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
