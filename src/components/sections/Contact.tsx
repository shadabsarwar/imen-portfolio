"use client";
import type { Dictionary } from "@/dictionaries/en";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { contact } from "@/lib/site";
import { revealOnScroll } from "@/lib/reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const buildCards = (d: Dictionary["contact"]) => [
  {
    key: "email" as const,
    label: d.cards.email.label,
    value: contact.email,
    href: `mailto:${contact.email}`,
    hint: d.cards.email.note,
  },
  {
    key: "whatsapp" as const,
    label: d.cards.whatsapp.label,
    value: contact.phoneDisplay,
    href: `https://wa.me/${contact.whatsapp}`,
    hint: d.cards.whatsapp.note,
  },
  {
    key: "location" as const,
    label: d.cards.location.label,
    value: contact.location,
    href: undefined,
    hint: d.cards.location.note,
  },
];

export default function Contact({ dict }: { dict: Dictionary["contact"] }) {
  const ref = useRef<HTMLElement>(null);
  const cards = buildCards(dict);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      revealOnScroll({
        targets: ".ct-in > *",
        trigger: ref.current,
        start: "top 80%",
        y: 26,
        stagger: 0.09,
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="contact" className="w-full bg-cream px-4 pb-16 md:px-8 md:pb-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-cream shadow-[0_40px_90px_-50px_rgba(42,22,30,0.7)] md:px-14 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(207,65,115,0.24),transparent_70%)] blur-2xl"
        />

        <div className="ct-in relative">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-soft uppercase">
            <span className="h-px w-8 bg-gold-soft/60" />
            {dict.eyebrow}
          </p>
          <h2 className="max-w-2xl font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-light tracking-[-0.02em]">
            {dict.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/60">
            {dict.body}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cards.map((c) => {
              const inner = (
                <>
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-cream/40 uppercase">
                    {c.label}
                  </p>
                  <p className="mt-2 text-sm font-medium break-words text-cream">
                    {c.value}
                  </p>
                  <p className="mt-1 text-xs text-cream/45">{c.hint}</p>
                </>
              );
              return c.href ? (
                <a
                  key={c.key}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-gold-soft/40 hover:bg-white/[0.07]"
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={c.key}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  {inner}
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${contact.email}?subject=${encodeURIComponent("Project inquiry — via imene website")}`}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 text-sm font-medium text-ink transition-colors duration-300 hover:bg-cream"
            >
              {dict.cta}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center rounded-full border border-cream/20 px-7 text-sm font-medium text-cream transition-colors hover:bg-cream/10"
            >
              @imen_adjissi
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
