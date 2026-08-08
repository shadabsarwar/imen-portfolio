"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import MediaRail from "@/components/media/MediaRail";
import MediaLightbox from "@/components/media/MediaLightbox";
import { revealOnScroll } from "@/lib/reveal";
import type { VideoItem } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A titled rail of work with its own lightbox. Used for both the landscape
 * broadcast reel and the vertical social reel.
 */
export default function WorkSection({
  id,
  eyebrow,
  title,
  description,
  items,
  orientation,
  cta,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  items: VideoItem[];
  orientation: "portrait" | "landscape";
  cta?: { href: string; label: string };
  className?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const railWrapRef = useRef<HTMLDivElement>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      revealOnScroll({
        targets: ".work-head > *",
        trigger: sectionRef.current,
        start: "top 78%",
        y: 24,
        stagger: 0.09,
      });
      // Staggering a row of video cards drops frames on touch hardware, so
      // those get one short fade of the whole rail instead.
      const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
      revealOnScroll(
        coarse
          ? { targets: railWrapRef.current, trigger: railWrapRef.current, start: "top 90%", y: 0, duration: 0.45 }
          : { targets: ".rail-card", trigger: railWrapRef.current, start: "top 85%", y: 44, stagger: 0.07 },
      );
    },
    { scope: sectionRef, dependencies: [items.length] },
  );

  if (!items.length) return null;

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("relative w-full overflow-hidden bg-white py-20 md:py-28", className)}
    >
      {/* Gold hairline separates this section from whatever sits above it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="work-head flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase">
              <span className="h-px w-8 bg-gold-deep/45" />
              {eyebrow}
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.03] font-light tracking-[-0.02em] text-ink">
              {title}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
              {description}
            </p>
          </div>

          {cta && (
            <Link
              href={cta.href}
              className="group inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold"
            >
              {cta.label}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
        </div>
      </div>

      <div ref={railWrapRef} className="mt-12 md:mt-16">
        <MediaRail
          items={items}
          orientation={orientation}
          fadeTo="from-white"
          cardTheme="onLight"
          onOpen={(item) => setActiveSlug(item.slug)}
        />
      </div>

      <MediaLightbox
        items={items}
        activeSlug={activeSlug}
        onClose={() => setActiveSlug(null)}
        onNavigate={setActiveSlug}
      />
    </section>
  );
}
