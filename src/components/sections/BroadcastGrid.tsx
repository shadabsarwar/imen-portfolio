"use client";
import type { Dictionary } from "@/dictionaries/en";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowUpRight,
  AudioLines,
  ChevronLeft,
  ChevronRight,
  Headphones,
  MessageCircle,
  Star,
} from "lucide-react";
import { cn } from "@/lib/cn";
import MediaCard from "@/components/media/MediaCard";
import MediaRail from "@/components/media/MediaRail";
import MediaLightbox from "@/components/media/MediaLightbox";
import VoicePanel from "@/components/sections/VoicePanel";
import { revealOnScroll } from "@/lib/reveal";
import type { VideoItem } from "@/lib/media";

const TRAITS = [
  { Icon: AudioLines, title: "Versatile Range", blurb: "Warm, energetic, calm or powerful" },
  { Icon: MessageCircle, title: "Clear & Engaging", blurb: "Messages that connect and leave impact" },
  { Icon: Headphones, title: "Professional Studio", blurb: "High-quality recordings, fast turnaround" },
  { Icon: Star, title: "Trusted by Brands", blurb: "Delivering results that speak for you" },
];

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Cards per page. 4 + 4 + 2 = 10. */
const PAGE_SIZE = 4;

/**
 * Broadcast work as a single-screen, paged 2x2 grid.
 *
 * The section is locked to exactly one viewport and never grows: the button
 * swaps the four cards for the next four rather than appending to them. That
 * keeps this a fixed slot in the page instead of something that pushes the
 * rest of the site down as you explore it.
 *
 * Because the height is the fixed budget, the cards are sized by height
 * (`fit="height"`) and derive their width from it. A width-driven card would
 * compute a 16:9 height from the column and overflow the screen.
 *
 * Desktop only. Below `lg` this falls back to the horizontal rail — a 2x2
 * grid of landscape video on a phone is four postage stamps. The split is
 * pure CSS, not a JS media query, so server and client markup stay identical.
 */
export default function BroadcastGrid({
  id,
  eyebrow,
  title,
  description,
  items,
  cta,
  className,
  dict,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  items: VideoItem[];
  cta?: { href: string; label: string };
  className?: string;
  dict: Dictionary["broadcast"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const pages = useMemo(() => {
    const out: VideoItem[][] = [];
    for (let i = 0; i < items.length; i += PAGE_SIZE) out.push(items.slice(i, i + PAGE_SIZE));
    return out;
  }, [items]);

  const current = pages[page] ?? [];
  const canPrev = page > 0;
  const canNext = page < pages.length - 1;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      revealOnScroll({
        targets: ".work-head > *",
        trigger: sectionRef.current,
        start: "top 72%",
        y: 22,
        stagger: 0.08,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      /* Opts out of the global 6rem scroll-margin — see globals.css. This
         section is exactly one viewport tall and already carries pt-20 to
         clear the navbar, so the extra offset pushed its trait row and pager
         below the fold whenever you arrived via #showreel. */
      data-viewport=""
      className={cn("relative w-full overflow-hidden bg-white", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent"
      />

      {/* ------------------------------------------- desktop: one full screen */}
      <div className="hidden h-svh flex-col px-6 pt-20 pb-6 md:px-12 lg:flex">
        {/*
          The eyebrow and CTA ride a single thin line. The section's real
          heading now lives in the centre panel, where it fills what used to
          be dead space — every pixel of chrome up here comes straight out of
          the cards, because two rows of 16:9 in one viewport trade ~1px of
          card height for every 2px of header.
        */}
        <div className="work-head mx-auto flex w-full max-w-[1600px] shrink-0 items-baseline justify-between gap-8">
          <p className="flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.25em] text-gold-deep uppercase">
            <span className="h-px w-6 bg-gold-deep/45" />
            {eyebrow}
          </p>

          {cta && (
            <Link
              href={cta.href}
              className="group inline-flex items-center gap-2 border-b border-ink/20 pb-0.5 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold"
            >
              {cta.label}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
        </div>

        {/*
          Three columns: work, pitch, work. The centre is a fixed band rather
          than a fraction — as a `fr` it would swell on wide screens and starve
          on narrow ones, and its contents (a headline, a waveform, a row of
          traits) only read well within a fairly narrow range.
        */}
        <div
          ref={gridRef}
          className="mx-auto mt-4 grid w-full max-w-[1600px] min-h-0 flex-1 grid-cols-[1fr_clamp(300px,26vw,420px)_1fr] grid-rows-2 gap-x-8 gap-y-6 xl:gap-x-10"
        >
          <VoicePanel className="col-start-2 row-span-2 row-start-1" dict={dict.panel} />

          <AnimatePresence mode="wait">
            {current.map((item, i) => (
              <motion.div
                key={item.slug}
                // Fill the two outer columns top-to-bottom: 1 and 3 on the
                // first row, 1 and 3 again on the second.
                style={{
                  gridColumn: i % 2 === 0 ? 1 : 3,
                  gridRow: i < 2 ? 1 : 2,
                }}
                className="flex min-h-0 flex-col"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <MediaCard
                  item={item}
                  onOpen={() => setActiveSlug(item.slug)}
                  theme="onLight"
                  fit="height"
                  metaPlacement="overlay"
                  className="w-full"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ------------------------------------------------ trait row */}
        <div className="mx-auto mt-5 flex w-full max-w-[1600px] shrink-0 divide-x divide-ink/8">
          {TRAITS.map(({ Icon }, i) => (
            <div key={dict.features[i]?.title ?? i} className="flex flex-1 items-start gap-3 px-6 first:pl-0 last:pr-0">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.75} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{dict.features[i]?.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{dict.features[i]?.blurb}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------------------------------------------- pager */}
        <div className="mx-auto mt-4 flex w-full max-w-[1600px] shrink-0 items-center justify-center gap-5">
          <PagerButton
            labels={dict}
            dir="left"
            disabled={!canPrev}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          />

          <div className="flex items-center gap-2.5">
            {pages.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`${dict.showFilms} ${i * PAGE_SIZE + 1}–${i * PAGE_SIZE + p.length}`}
                aria-current={i === page ? "true" : undefined}
                className={cn(
                  "h-2 rounded-full transition-all duration-400",
                  i === page
                    ? "w-10 bg-gold shadow-[0_2px_10px_rgba(207,65,115,0.55)]"
                    : "w-2 bg-ink/25 hover:bg-ink/50",
                )}
              />
            ))}
          </div>

          <PagerButton
            labels={dict}
            dir="right"
            disabled={!canNext}
            onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))}
          />

          <span className="ml-2 font-mono text-xs font-semibold text-ink tabular-nums">
            {String(page * PAGE_SIZE + 1).padStart(2, "0")}–
            {String(page * PAGE_SIZE + current.length).padStart(2, "0")}
            <span className="font-normal text-ink-soft/40"> / {items.length}</span>
          </span>
        </div>
      </div>

      {/* ------------------------------------------------- mobile: the rail */}
      <div className="py-20 lg:hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase">
              <span className="h-px w-8 bg-gold-deep/45" />
              {eyebrow}
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.03] font-light tracking-[-0.02em] text-ink">
              {title}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">{description}</p>
          </div>
        </div>
        <div className="mt-12">
          <MediaRail
            items={items}
            orientation="landscape"
            fadeTo="from-white"
            cardTheme="onLight"
            onOpen={(item) => setActiveSlug(item.slug)}
          />
        </div>
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

function PagerButton({
  dir,
  disabled,
  onClick,
  labels,
}: {
  dir: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  labels: Dictionary["broadcast"];
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? labels.prev : labels.next}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
        disabled
          ? "cursor-not-allowed border border-ink/12 text-ink/25"
          : // Solid rather than outlined: this is the section's primary
            // control, and a hairline circle read as decoration next to
            // 570px-wide video.
            "bg-ink text-cream shadow-[0_14px_30px_-12px_rgba(60,25,40,0.7)] hover:-translate-y-0.5 hover:bg-gold hover:text-ink hover:shadow-[0_18px_40px_-14px_rgba(207,65,115,0.7)] active:translate-y-0",
      )}
    >
      <Icon className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
}
