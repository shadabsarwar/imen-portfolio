"use client";

import type { Dictionary } from "@/dictionaries/en";
import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/cn";
import MediaCard from "@/components/media/MediaCard";
import MediaLightbox from "@/components/media/MediaLightbox";
import { revealOnScroll } from "@/lib/reveal";
import {allVideos, type VideoCategory } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Filter = VideoCategory | "all";

/**
 * The full catalogue. Landscape and portrait pieces need different grids, so
 * the "all" view renders them as two labelled groups rather than forcing
 * mismatched aspect ratios into one set of columns.
 */
export default function WorkGallery({
  dict,
}: {
  dict: Dictionary["workPage"];
}) {
  const filters = [
  { id: "all" as const, label: dict.filters.all },
  { id: "broadcast" as const, label: dict.filters.broadcast },
  { id: "dubbing" as const, label: dict.filters.dubbing },
  { id: "song" as const, label: dict.filters.song },
  { id: "collabs" as const, label: dict.filters.collabs },
];
  const [filter, setFilter] = useState<Filter>("all");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => (filter === "all" ? allVideos : allVideos.filter((v) => v.category === filter)),
    [filter],
  );

  const landscape = visible.filter((v) => v.orientation === "landscape");
  const portrait = visible.filter((v) => v.orientation === "portrait");

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["all", allVideos.length]]);
    for (const v of allVideos) map.set(v.category, (map.get(v.category) ?? 0) + 1);
    return map;
  }, []);

  // Re-run on filter change: the grid is rebuilt, so the previous triggers
  // point at detached nodes.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
      revealOnScroll(
        coarse
          ? { targets: gridRef.current, trigger: gridRef.current, start: "top 92%", y: 0, duration: 0.4 }
          : { targets: ".gallery-card", trigger: gridRef.current, start: "top 88%", y: 36, stagger: 0.05 },
      );
    },
    { scope: gridRef, dependencies: [filter] },
  );

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const count = counts.get(f.id) ?? 0;
            if (!count) return null;
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={on}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors duration-300",
                  on
                    ? // Ivory on the pink, not ink: dark-on-pink is 3.8:1 and
                      // the active filter went muddy against the unselected ones.
                      "border-gold bg-gold text-ivory"
                    : "border-ivory/15 text-ivory/60 hover:border-ivory/40 hover:text-ivory",
                )}
              >
                {f.label}
                <span className="ml-2 font-mono text-[11px] tabular-nums opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div ref={gridRef} className="mx-auto mt-12 max-w-7xl space-y-16 px-6 md:px-12">
        {landscape.length > 0 && (
          <section>
            {filter === "all" && <GroupLabel>{dict.groups.landscape}</GroupLabel>
            {/*
              Three across once there's room. At two columns a 16:9 card is
              ~576px wide and you see a screen and a half of a ten-item list;
              the archive is meant to be scanned, not scrolled through one
              piece at a time. The portrait grid below runs four across, so
              three keeps the two groups reading as one page.
            */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {landscape.map((item) => (
                <MediaCard
                  key={item.slug}
                  item={item}
                  onOpen={() => setActiveSlug(item.slug)}
                  className="gallery-card w-full"
                />
              ))}
            </div>
          </section>
        )}

        {portrait.length > 0 && (
          <section>
            {filter === "all" && <GroupLabel>{dict.groups.portrait}</GroupLabel>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {portrait.map((item) => (
                <MediaCard
                  key={item.slug}
                  item={item}
                  onOpen={() => setActiveSlug(item.slug)}
                  className="gallery-card w-full"
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <MediaLightbox
        items={visible}
        activeSlug={activeSlug}
        onClose={() => setActiveSlug(null)}
        onNavigate={setActiveSlug}
      />
    </>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-soft uppercase">
      <span className="h-px w-8 bg-gold-soft/50" />
      {children}
    </h2>
  );
}
