"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import MediaCard from "./MediaCard";
import type { VideoItem } from "@/lib/media";

/**
 * Horizontal snap rail of work cards, with edge fades and arrows that fade
 * out at each end. `fadeTo` must match the section background so the masks
 * blend instead of banding.
 */
export default function MediaRail({
  items,
  onOpen,
  orientation,
  fadeTo = "from-ink",
  cardTheme = "onDark",
  className,
}: {
  items: VideoItem[];
  onOpen: (item: VideoItem) => void;
  orientation: "portrait" | "landscape";
  fadeTo?: string;
  /** Passed through to each MediaCard's caption color — match the section bg. */
  cardTheme?: "onDark" | "onLight";
  className?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = useCallback(() => {
    const r = railRef.current;
    if (!r) return;
    setCanLeft(r.scrollLeft > 4);
    setCanRight(r.scrollLeft < r.scrollWidth - r.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const r = railRef.current;
    if (!r) return;
    r.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      r.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, items.length]);

  const scrollRail = useCallback((dir: 1 | -1) => {
    const r = railRef.current;
    if (!r) return;
    const card = r.querySelector<HTMLElement>(".rail-card");
    const gap = parseFloat(getComputedStyle(r).columnGap || "0") || 0;
    r.scrollBy({ left: dir * (card ? card.clientWidth + gap : 360), behavior: "smooth" });
  }, []);

  // Portrait cards are 9:16, so width drives height and the caption adds
  // ~70px under that.
  //
  // 240px on desktop restores the proportions of the original reel (the old
  // `.work-card { width: 15rem }` rule, paired with a 48px gap). Phones keep
  // 224px so one card fills the width with the next peeking in — that peek is
  // what signals the rail scrolls.
  const cardWidth =
    orientation === "landscape"
      ? "w-[300px] sm:w-[420px] lg:w-[520px]"
      : "w-[224px] lg:w-[240px]";

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r to-transparent md:w-20",
          fadeTo,
          canLeft ? "opacity-100" : "opacity-0",
          "transition-opacity duration-300",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l to-transparent md:w-20",
          fadeTo,
          canRight ? "opacity-100" : "opacity-0",
          "transition-opacity duration-300",
        )}
      />

      <RailArrow dir="left" enabled={canLeft} onClick={() => scrollRail(-1)} />
      <RailArrow dir="right" enabled={canRight} onClick={() => scrollRail(1)} />

      <div
        ref={railRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-6 pt-2 pb-4 md:gap-12 md:scroll-px-12 md:px-12"
      >
        {items.map((item) => (
          <MediaCard
            key={item.slug}
            item={item}
            onOpen={onOpen}
            theme={cardTheme}
            className={cn("rail-card snap-start", cardWidth)}
          />
        ))}
      </div>
    </div>
  );
}

function RailArrow({
  dir,
  enabled,
  onClick,
}: {
  dir: "left" | "right";
  enabled: boolean;
  onClick: () => void;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!enabled}
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      className={cn(
        "absolute top-[38%] z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full md:flex",
        "border border-ivory/15 bg-ink/70 text-ivory backdrop-blur-md",
        "transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink",
        dir === "left" ? "left-3 lg:left-5" : "right-3 lg:right-5",
        enabled ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
