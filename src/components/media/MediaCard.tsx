"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDuration, hoverRendition, type VideoItem } from "@/lib/media";

/**
 * Poster-first work card.
 *
 * Nothing loads until the pointer arrives — then the card streams the real
 * rendition, not a low-quality preview cut. Every master is written with the
 * moov atom up front (faststart), so playback begins on the first chunks
 * instead of waiting for the whole file.
 *
 * Browsers only allow unmuted autoplay once the page has seen a user gesture,
 * so playback falls back to muted and the card shows an unmute affordance.
 * Touch devices never hover-play — tapping opens the full player instead.
 */

function getRoleLabel(role: string | null, lang: "en" | "ar") {
  if (!role) return "";

  if (lang === "en") return role;

  const roles: Record<string, string> = {
    "Voice-over": "تعليق صوتي",
    Dubbing: "دوبلاج",
    Vocals: "غناء",
    Presenting: "تقديم",
    "Campaign film": "فيلم حملة",
  };

  return roles[role] ?? role;
}

export default function MediaCard({
  item,
  onOpen,
  className,
  showMeta = true,
  theme = "onDark",
  reserveClientLine = false,
  fit = "width",
  metaPlacement = "below",
}: {
  item: VideoItem;
  onOpen: (item: VideoItem) => void;
  className?: string;
  showMeta?: boolean;
  /**
   * What drives the tile's size.
   *
   * "width" (default) fills the container and derives height from the aspect
   * ratio — right for rails and grids that scroll. "height" fills the
   * available height and derives width instead, which is what a section
   * locked to one viewport needs: there the height is the fixed budget and
   * a width-driven tile would overflow it.
   */
  fit?: "width" | "height";
  /**
   * Where the caption sits.
   *
   * "below" (default) stacks it under the tile. "overlay" lays it over the
   * bottom of the frame instead, which buys back ~70px of vertical space per
   * row — the difference between a readable card and a thumbnail when a grid
   * has to fit inside a single viewport.
   */
  metaPlacement?: "below" | "overlay";
  /** Caption text color — match whatever the card sits on. The tile itself
   * (poster/video) stays dark either way. */
  theme?: "onDark" | "onLight";
  /**
   * Hold the client line's height even when there is no client. In a grid,
   * neighbouring captions have to start on the same baseline — without this
   * a card with no client pulls its title up level with the eyebrow beside
   * it. Rails don't need it, so it's off by default.
   */
  reserveClientLine?: boolean;
}) {
    const pathname = usePathname();
  const lang = pathname.startsWith("/ar") ? "ar" : "en";

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [armed, setArmed] = useState(false); // video src attached yet?
  const portrait = item.orientation === "portrait";
  const overlay = metaPlacement === "overlay";

  const canHover = useCallback(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    [],
  );

  function startPlayback() {
    if (!canHover()) return;
    setArmed(true);
    const v = videoRef.current;
    if (!v) return; // first hover only arms it; the effect below starts it
    void play(v);
  }

  function play(v: HTMLVideoElement) {
    v.volume = 0.85;
    v.muted = muted;
    return v
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Unmuted autoplay refused — no user gesture on the page yet.
        v.muted = true;
        setMuted(true);
        return v
          .play()
          .then(() => setPlaying(true))
          .catch(() => {});
      });
  }

  function stopPlayback() {
    const v = videoRef.current;
    setPlaying(false);
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  }

  // The <video> only exists after the first hover arms it, so that hover's
  // play() call has no element to act on. Start it as soon as it mounts.
  useEffect(() => {
    const v = videoRef.current;
    if (armed && v && v.paused && !playing) void play(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run on arm only
  }, [armed]);

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    const v = videoRef.current;
    setMuted((prev) => {
      const next = !prev;
      if (v) {
        v.muted = next;
        if (!next) {
          v.volume = 0.85;
          void v.play().catch(() => {});
        }
      }
      return next;
    });
  }

  // Never leave audio playing behind a backgrounded tab.
  useEffect(() => {
    const onHide = () => {
      if (document.hidden) stopPlayback();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  return (
    <figure
      className={cn(
        "group relative isolate flex shrink-0 flex-col",
        fit === "height" && "h-full min-h-0",
        className,
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(item)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(item);
          }
        }}
        onMouseEnter={startPlayback}
        onMouseLeave={stopPlayback}
        onFocus={startPlayback}
        onBlur={stopPlayback}
        aria-label={`Play ${item.title[lang]}${item.client ? ` for ${item.client}` : ""}, ${formatDuration(item.duration)}`}
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-xl bg-ink ring-1 ring-ivory/10",
          "transition-[transform,box-shadow,ring-color] duration-500 ease-out",
          "hover:-translate-y-1 hover:shadow-[0_30px_70px_-24px_rgba(0,0,0,0.75)] hover:ring-gold/40",
          "focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none",
          portrait ? "aspect-9/16" : "aspect-video",
          fit === "height"
            ? "min-h-0 w-auto max-w-full flex-1 self-center"
            : "w-full",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- posters are
            pre-sized WebP from the media pipeline and live in a gitignored
            folder, so next/image adds cost without benefit here. */}
        <img
          src={item.poster}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700",
            playing ? "scale-105 opacity-0" : "scale-100 opacity-100",
          )}
        />

        {armed && (
          <video
            ref={videoRef}
            src={hoverRendition(item).src}
            loop
            playsInline
            preload="none"
            aria-hidden
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
              playing ? "opacity-100" : "opacity-0",
            )}
          />
        )}

        {/* Legibility scrim. */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/80 via-ink/5 to-ink/20" />

        {/* An overlaid caption needs far more than the standard scrim: it sits
            around 20% up the frame, exactly where that gradient is at its
            weakest, so a bright poster swallowed the gold client line. */}
        {overlay && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-ink via-ink/75 to-transparent" />
        )}

        {/* Play affordance (hidden once the card is playing). */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300",
            playing ? "opacity-0" : "opacity-100",
          )}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-xl backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
            <Play className="ml-0.5 h-5 w-5 fill-current" strokeWidth={0} />
          </span>
        </div>

        <span className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[11px] text-cream tabular-nums backdrop-blur-sm">
          {formatDuration(item.duration)}
        </span>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className={cn(
            "absolute right-3 bottom-3 z-10 flex h-8 w-8 items-center justify-center rounded-full",
            "bg-ink/60 text-cream backdrop-blur-sm transition-all duration-300 hover:bg-gold hover:text-ink",
            playing ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {/* Overlaid caption. Sits inside the frame, above the scrim, and
            clears the duration badge and mute button along the bottom edge. */}
        {showMeta && overlay && (
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pt-10 pb-12">
            {item.client && (
              <p className="text-[10px] font-semibold tracking-[0.18em] text-gold-soft uppercase drop-shadow">
                {item.client}
              </p>
            )}
            <h3 className="mt-1 font-display text-xl leading-snug font-light text-ivory drop-shadow-lg xl:text-2xl">
  {item.title[lang]}
</h3>
            {item.role && (
  <p className="mt-0.5 text-xs text-ivory/70 drop-shadow">
    {getRoleLabel(item.role, lang)}
  </p>
)}
          </figcaption>
        )}
      </div>

      {showMeta && !overlay && (
        <figcaption className={cn("mt-4 px-0.5", fit === "height" && "shrink-0")}>
          {item.client ? (
            // The accent has to flip with the ground: the deep rose clears AA
            // on the light home page but collapses to 2.2:1 on the dark
            // /work page, where the coral is what reads.
            <p
              className={cn(
                "text-[11px] font-semibold tracking-[0.18em] uppercase",
                theme === "onLight" ? "text-gold-deep" : "text-gold-soft",
              )}
            >
              {item.client}
            </p>
          ) : (
            reserveClientLine && <p aria-hidden className="text-[11px] leading-normal">&nbsp;</p>
          )}
          <h3
            className={cn(
              "mt-1.5 font-display text-lg leading-snug font-light",
              theme === "onLight" ? "text-ink" : "text-ivory",
            )}
          >
            {item.title[lang]}
          </h3>
          {item.role && (
  <p className={cn("mt-1 text-sm", theme === "onLight" ? "text-ink-soft" : "text-ivory/45")}>
    {getRoleLabel(item.role, lang)}
  </p>
)}
        </figcaption>
      )}
    </figure>
  );
}
