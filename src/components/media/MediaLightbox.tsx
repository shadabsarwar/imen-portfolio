"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDuration, pickRendition, type VideoItem } from "@/lib/media";

/**
 * Full-size player. This is the only place video bytes are ever requested —
 * cards are poster-only, so nothing streams until a piece is opened here.
 */
export default function MediaLightbox({
  items,
  activeSlug,
  onClose,
  onNavigate,
}: {
  items: VideoItem[];
  activeSlug: string | null;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}) {
  const lenis = useLenis();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [quality, setQuality] = useState<string | null>(null);
  // A new clip should start at its own default quality, not inherit the
  // last one picked. Resetting during render (React's documented pattern for
  // "adjusting state when a prop changes") avoids the extra render pass an
  // effect-based reset would cause.
  const [lastSlug, setLastSlug] = useState(activeSlug);
  if (lastSlug !== activeSlug) {
    setLastSlug(activeSlug);
    setQuality(null);
  }

  const index = items.findIndex((i) => i.slug === activeSlug);
  const active = index > -1 ? items[index] : null;

  const rendition = useMemo(() => {
    if (!active) return null;
    if (quality) return active.renditions.find((r) => r.name === quality) ?? pickRendition(active);
    return pickRendition(active);
  }, [active, quality]);

  const step = (dir: 1 | -1) => {
    if (index < 0) return;
    onNavigate(items[(index + dir + items.length) % items.length].slug);
  };

  // Lenis drives scrolling from the GSAP ticker, so `overflow: hidden` alone
  // does not stop the page moving behind the overlay — the instance has to be
  // told to stop as well.
  useEffect(() => {
    if (!active) return;
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = previous;
    };
  }, [active, lenis]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- step is derived from index
  }, [active, index, items]);

  return (
    <AnimatePresence>
      {active && rendition && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-xl md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={active.title.en}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/10 text-ivory ring-1 ring-ivory/20 backdrop-blur-sm transition-colors hover:bg-ivory hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>

          {items.length > 1 && (
            <>
              {/* Where you are in the set. The arrows imply there's more but
                  not how much more — opening one clip of twenty-five should
                  say so, and it's the only cue that the set wraps. */}
              <div
                className="absolute right-5 bottom-5 z-20 flex items-baseline gap-1.5 rounded-full bg-ivory/10 px-3.5 py-2 ring-1 ring-ivory/20 backdrop-blur-sm"
                aria-live="polite"
              >
                <span className="font-mono text-sm text-ivory tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-xs text-ivory/35">/</span>
                <span className="font-mono text-xs text-ivory/50 tabular-nums">
                  {String(items.length).padStart(2, "0")}
                </span>
              </div>

              <NavButton dir="left" onClick={(e) => { e.stopPropagation(); step(-1); }} />
              <NavButton dir="right" onClick={(e) => { e.stopPropagation(); step(1); }} />
            </>
          )}

          <motion.div
            key={active.slug}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full w-full max-w-6xl flex-col items-center gap-4"
          >
            <video
              ref={videoRef}
              key={rendition.src}
              src={rendition.src}
              poster={active.posterJpg}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className={cn(
                "w-auto rounded-xl bg-black shadow-2xl",
                active.orientation === "portrait"
                  ? "max-h-[76svh] max-w-full"
                  : "max-h-[72svh] max-w-full",
              )}
            />

            <div className="flex w-full max-w-3xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-ivory">
              <div className="min-w-0">
                {active.client && (
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-gold-soft uppercase">
                    {active.client}
                  </p>
                )}
                <h2 className="mt-1 font-display text-xl leading-snug font-light">
                  {active.title.en}
                </h2>
                <p dir="rtl" className="font-arabic mt-0.5 text-sm text-ivory/50">
                  {active.title.ar}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-ivory/50">
                <span className="font-mono tabular-nums">{formatDuration(active.duration)}</span>
                {active.renditions.length > 1 && (
                  <div className="flex items-center gap-1 rounded-full bg-ivory/10 p-0.5">
                    {active.renditions.map((r) => (
                      <button
                        key={r.name}
                        type="button"
                        onClick={() => setQuality(r.name)}
                        className={cn(
                          "rounded-full px-2.5 py-1 font-mono transition-colors",
                          r.name === rendition.name
                            ? "bg-gold text-ink"
                            : "text-ivory/60 hover:text-ivory",
                        )}
                      >
                        {r.name}p
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavButton({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Previous" : "Next"}
      className={cn(
        "absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full",
        "bg-ivory/10 text-ivory ring-1 ring-ivory/20 backdrop-blur-sm transition-colors hover:bg-ivory hover:text-ink",
        dir === "left" ? "left-3 md:left-6" : "right-3 md:right-6",
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
