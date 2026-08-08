"use client";
import type { Dictionary } from "@/dictionaries/en";
import { localePath, type Locale } from "@/lib/i18n";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type WaveSurferType from "wavesurfer.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDuration, musicSamples, voiceSamples, type AudioItem } from "@/lib/media";
import { revealOnScroll } from "@/lib/reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function AudioRow({
  sample,
  index,
  activeSlug,
  setActive,
  labels,
  lang,
}: {
  sample: AudioItem;
index: number;
activeSlug: string | null;
setActive: (slug: string | null) => void;
labels: Dictionary["voice"];
lang: Locale;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurferType | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);

  // Build the waveform when the row nears the viewport.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || shouldLoad) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || !waveRef.current) return;
    let destroyed = false;
    (async () => {
      // Peaks are precomputed by the media pipeline, so the waveform draws
      // from a ~6KB JSON instead of downloading and decoding the MP3.
      // MediaElement backend then streams the audio only once play is hit.
      const [{ default: WaveSurfer }, peaks] = await Promise.all([
        import("wavesurfer.js"),
        fetch(sample.peaks)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]);
      if (destroyed || !waveRef.current) return;
      const ws = WaveSurfer.create({
        container: waveRef.current,
        height: 40,
        waveColor: "rgba(246,216,189,0.22)",
        progressColor: "#f39399",
        cursorColor: "rgba(246,216,189,0.4)",
        cursorWidth: 1,
        barWidth: 2,
        barGap: 2,
        barRadius: 3,
        normalize: false,
        backend: "MediaElement",
        url: sample.src,
        ...(Array.isArray(peaks) && peaks.length
          ? { peaks: [peaks as number[]], duration: sample.duration }
          : {}),
      });
      wsRef.current = ws;
      ws.on("ready", () => setReady(true));
      ws.on("play", () => setPlaying(true));
      ws.on("pause", () => setPlaying(false));
      ws.on("finish", () => {
        setPlaying(false);
        setCurrent(0);
      });
      ws.on("timeupdate", (t: number) => setCurrent(t));
      // With peaks supplied there is no decode step, so `ready` may never
      // fire — the waveform is already drawable.
      if (Array.isArray(peaks) && peaks.length) setReady(true);
    })();
    return () => {
      destroyed = true;
      wsRef.current?.destroy();
      wsRef.current = null;
    };
  }, [shouldLoad, sample.src, sample.peaks, sample.duration]);

  // Only one row plays at a time.
  useEffect(() => {
    if (activeSlug !== sample.slug) wsRef.current?.pause();
  }, [activeSlug, sample.slug]);

  function toggle() {
    const ws = wsRef.current;
    if (!ws) {
      setShouldLoad(true);
      return;
    }
    if (ws.isPlaying()) ws.pause();
    else {
      setActive(sample.slug);
      void ws.play();
    }
  }

  const isActive = activeSlug === sample.slug;

  return (
    <div
      ref={rootRef}
      className={cn(
        "voice-row flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors md:gap-5 md:px-5",
        isActive
          ? "border-gold/40 bg-ivory/[0.07]"
          : "border-ivory/10 bg-ivory/[0.03] hover:bg-ivory/[0.06]",
      )}
    >
      <span className="hidden w-7 shrink-0 font-display text-xl text-gold-soft/60 tabular-nums md:block">
        {(index + 1).toString().padStart(2, "0")}
      </span>

      <button
        type="button"
        onClick={toggle}
        aria-label={`${playing ? labels.pause : labels.play} ${sample.title.en}`}
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors",
          playing ? "bg-gold text-ink" : "bg-cream/10 text-cream hover:bg-cream/20",
        )}
      >
        {playing ? (
          <Pause className="h-4 w-4 fill-current" strokeWidth={0} />
        ) : (
          <Play className="ml-0.5 h-4 w-4 fill-current" strokeWidth={0} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-baseline gap-3">
          <span className="truncate text-sm font-medium text-cream">
  {sample.title[lang]}
</span>
          {/* Most titles already lead with the client ("Air Algérie —
              Commercial"), so only badge it when it adds something. */}
          {sample.client && !sample.title.en.toLowerCase().includes(sample.client.toLowerCase()) && (
            <span className="hidden shrink-0 rounded-full border border-cream/15 px-2 py-0.5 text-[10px] font-medium tracking-wide text-cream/55 uppercase sm:inline">
              {lang === "ar" && sample.client === "11 One Media"
  ? "11 وان ميديا"
  : lang === "ar" && sample.client === "Air Algérie"
    ? "الخطوط الجوية الجزائرية"
    : sample.client}
            </span>
          )}
        </div>
        <div ref={waveRef} className="w-full" />
        {!ready && <div className="h-10 w-full animate-pulse rounded bg-ivory/5" />}
      </div>

      <span className="w-14 shrink-0 text-right text-xs text-cream/50 tabular-nums">
        {formatDuration(playing || current > 0 ? current : sample.duration)}
      </span>
    </div>
  );
}

const TABS = [
  { id: "voice" as const, label: "Voice-over", items: voiceSamples },
  { id: "music" as const, label: "Songs", items: musicSamples },
];

/**
 * Rows shown at once.
 *
 * Songs has three samples and Voice-over has six, so an unpaged list made the
 * whole section grow by half a screen the moment you switched tabs. Three is
 * the shorter list's length, which keeps the section a fixed height whichever
 * tab is open.
 */
const PAGE_SIZE = 3;

export default function VoiceSamples({
  dict,
  lang,
}: {
  dict: Dictionary["voice"];
  lang: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<"voice" | "music">("voice");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const tabs = TABS.filter((t) => t.items.length);
  const all = tabs.find((t) => t.id === tab)?.items ?? [];
  const pageCount = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const start = page * PAGE_SIZE;
  const items = all.slice(start, start + PAGE_SIZE);

  /**
   * Paging unmounts the visible rows, and a row's cleanup destroys its
   * WaveSurfer instance — so audio stops on its own. `activeSlug` has to be
   * cleared with it, or paging back to a row that was playing would remount
   * it wearing the active border while silent.
   */
  function goToPage(next: number) {
    setPage(next);
    setActiveSlug(null);
  }

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      revealOnScroll({
        targets: ".voice-head > *",
        trigger: sectionRef.current,
        start: "top 78%",
        y: 24,
        stagger: 0.1,
      });
      revealOnScroll({
        targets: ".voice-row",
        trigger: ".voice-list",
        start: "top 85%",
        y: 30,
        stagger: 0.09,
        duration: 0.6,
      });
    },
    { scope: sectionRef, dependencies: [tab] },
  );

  if (!tabs.length) return null;

  return (
    <section
      ref={sectionRef}
      id="voice"
      className="relative w-full overflow-hidden bg-ink px-4 py-20 text-cream md:px-8 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/25 to-transparent"
      />
      {/* Warm glow + ghost word. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-160 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(207,65,115,0.20),transparent_70%)] blur-2xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 select-none font-arabic text-[18vw] leading-none font-bold text-cream/2.5 md:text-[11vw]"
      >
        صوت
      </span>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-2 md:grid-cols-12 md:px-4">
        <div className="voice-head flex flex-col justify-center md:col-span-6 lg:col-span-5">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-soft uppercase">
            <span className="h-px w-8 bg-gold-soft/60" />
            {dict.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.02] font-light tracking-[-0.02em] text-cream">
            {dict.title}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-cream/55">
            {dict.description}
          </p>

          {tabs.length > 1 && (
            <div className="mt-7 flex w-fit gap-1 rounded-full border border-cream/12 p-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTab(t.id);
                    setPage(0);
                    setActiveSlug(null);
                  }}
                  aria-pressed={tab === t.id}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm transition-colors",
                    tab === t.id ? "bg-gold text-ink" : "text-cream/60 hover:text-cream",
                  )}
                >
                  {dict.tabs[t.id]}
                </button>
              ))}
            </div>
          )}

          <div className="mt-8">
            <Link
              href={localePath(lang, "/voice-over")}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 text-sm font-medium text-ink transition-colors duration-300 hover:bg-cream"
            >
              {dict.cta}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-7">
          <div className="voice-list flex flex-col gap-3">
            {items.map((sample, i) => (
              <AudioRow
                key={sample.slug}
                labels={dict}
                sample={sample}
                lang={lang}
                // Numbering runs across the whole tab, not the page, so the
                // second page reads 04–06 rather than restarting at 01.
                index={start + i}
                activeSlug={activeSlug}
                setActive={setActiveSlug}
              />
            ))}
          </div>

          {/*
            The row is always in the layout, only its contents come and go.
            Songs fits on one page and Voice-over doesn't, so rendering the
            pager conditionally traded the six-row height jump for a 49px one
            — smaller, but the same complaint.
          */}
          <div
            className={cn(
              "mt-6 flex h-10 items-center justify-center gap-4",
              pageCount > 1 ? "visible" : "invisible",
            )}
            aria-hidden={pageCount > 1 ? undefined : true}
          >
            <PagerButton
              labels={dict}
              dir="left"
              disabled={page === 0}
              onClick={() => goToPage(Math.max(0, page - 1))}
            />
            <span className="font-mono text-xs text-cream/45 tabular-nums">
              {String(start + 1).padStart(2, "0")}–
              {String(start + items.length).padStart(2, "0")}
              <span className="text-cream/25"> / {all.length}</span>
            </span>
            <PagerButton
              labels={dict}
              dir="right"
              disabled={page >= pageCount - 1}
              onClick={() => goToPage(Math.min(pageCount - 1, page + 1))}
            />
          </div>
        </div>
      </div>
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
  labels: Dictionary["voice"];
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? labels.prev : labels.next}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
        disabled
          ? "cursor-not-allowed border border-cream/12 text-cream/25"
          : // Matches the section's CTA, which is the only other solid control
            // on this dark ground.
            "bg-gold text-ink hover:-translate-y-0.5 hover:bg-cream",
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={2.5} />
    </button>
  );
}
