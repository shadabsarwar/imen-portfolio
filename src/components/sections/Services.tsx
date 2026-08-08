"use client";
import type { Dictionary } from "@/dictionaries/en";
import { localePath, type Locale } from "@/lib/i18n";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { services, type Service } from "@/lib/site";
import { revealOnScroll } from "@/lib/reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ServiceIcon({ icon }: { icon: Service["icon"] }) {
  const cls = "h-6 w-6";
  switch (icon) {
    case "chat":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={cls} aria-hidden>
          <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 11h6M9 14h3" strokeLinecap="round" />
        </svg>
      );
    case "mic":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={cls} aria-hidden>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
        </svg>
      );
    case "clapper":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={cls} aria-hidden>
          <rect x="3" y="8" width="18" height="12" rx="2" />
          <path d="M3 8l2-4h4L7 8m2-4h4l-2 4m2-4h4l-2 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "megaphone":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={cls} aria-hidden>
          <path d="M3 11v2a2 2 0 0 0 2 2h1l2 5h2l-1.5-5H11l8 3V6l-8 3H5a2 2 0 0 0-2 2Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "cap":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={cls} aria-hidden>
          <path d="m12 4 10 5-10 5L2 9l10-5Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" strokeLinecap="round" />
        </svg>
      );
    case "bag":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={cls} aria-hidden>
          <path d="M5 8h14l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 8Z" strokeLinejoin="round" />
          <path d="M9 11V6a3 3 0 0 1 6 0v5" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function Services({
  dict,
  lang,
}: {
  dict: Dictionary["services"];
  lang: Locale;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      revealOnScroll({
        targets: ".svc-head > *",
        trigger: ref.current,
        start: "top 78%",
        y: 24,
        stagger: 0.1,
      });
      revealOnScroll({
        targets: ".svc-card",
        trigger: ".svc-grid",
        start: "top 88%",
        y: 40,
        stagger: 0.07,
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="services" className="w-full bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="svc-head flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase">
              <span className="h-px w-8 bg-gold/60" />
              {dict.eyebrow}
            </p>
            <h2 className="max-w-xl font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.02] font-light tracking-[-0.02em] text-ink">
              {dict.title}
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-soft">
            {dict.intro}
          </p>
        </div>

        <div className="svc-grid mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              href={localePath(lang, s.href)}
              className="svc-card group relative flex flex-col rounded-2xl border border-ink/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_60px_-35px_rgba(60,25,40,0.4)]"
            >
              {s.soon && (
                <span className="absolute top-5 right-5 rounded-full bg-cream px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gold-deep uppercase">
                  {dict.soon}
                </span>
              )}
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cream text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-ivory">
                <ServiceIcon icon={s.icon} />
              </span>
              <h3 className="mt-5 font-display text-xl text-ink">{dict.items[i]?.title ?? s.title}</h3>
              <div className="mt-2 flex-1">
                <p className="text-sm leading-relaxed text-ink-soft">
                  {dict.items[i]?.blurb ?? s.blurb}
                </p>
                {s.tags && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {(dict.items[i]?.tags ?? s.tags).map((t) => (
                      <li
                        key={t}
                        className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-medium text-ink-soft"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gold">
                {dict.items[i]?.cta ?? s.cta}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
