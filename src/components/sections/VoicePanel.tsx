"use client";
import type { Dictionary } from "@/dictionaries/en";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";
import { cn } from "@/lib/cn";
import { allAudio } from "@/lib/media";

/**
 * The pitch that lives between the two columns of broadcast work.
 *
 * The section is locked to one screen with height-driven 16:9 tiles, which
 * leaves a channel down the middle that grows as the window gets shorter —
 * ~290px at a 860px-tall window, ~340px at 800px. This fills it.
 *
 * Both controls are signposts, not players. The pill goes to the contact
 * section for commercial enquiries; the microphone goes to the voice section,
 * which already has the samples, the waveforms and its own booking CTA. The
 * panel points at that rather than duplicating it.
 *
 * The waveform is still drawn from the real peaks of her 11 One Media station
 * voice rather than invented bars — it's the shape of the recording the
 * microphone leads you to.
 */
const REEL_SLUG = "11one-media";
const BARS = 72;

const CONTACT_HREF = "#contact";
const VOICE_HREF = "#voice";

export default function VoicePanel({
  className,
  dict,
}: {
  className?: string;
  dict: Dictionary["broadcast"]["panel"];
}) {
  const reel = allAudio.find((a) => a.slug === REEL_SLUG) ?? allAudio[0];
  const [bars, setBars] = useState<number[]>([]);

  /**
   * Peaks are same-origin by design — `allAudio` rewrites `src` to the media
   * host but deliberately leaves `peaks` alone, because fetch() needs CORS
   * headers that host doesn't send while <audio> does not.
   */
  useEffect(() => {
    let dead = false;
    fetch(reel.peaks)
      .then((r) => (r.ok ? r.json() : null))
      .then((peaks: unknown) => {
        if (dead || !Array.isArray(peaks) || !peaks.length) return;
        const step = peaks.length / BARS;
        const out: number[] = [];
        for (let i = 0; i < BARS; i++) {
          let max = 0;
          for (let j = Math.floor(i * step); j < Math.floor((i + 1) * step); j++) {
            max = Math.max(max, Math.abs(Number(peaks[j]) || 0));
          }
          out.push(max);
        }
        const loudest = Math.max(...out, 0.001);
        setBars(out.map((v) => v / loudest));
      })
      .catch(() => {});
    return () => {
      dead = true;
    };
  }, [reel.peaks]);

  // Flat row until the peaks land, so the layout never jumps.
  const shown = bars.length ? bars : Array.from({ length: BARS }, () => 0.12);
  const mid = (shown.length - 1) / 2;

  return (
    <div className={cn("flex min-h-0 flex-col items-center justify-center text-center", className)}>
      <h2 className="font-display text-[clamp(1.6rem,2.5vw,2.6rem)] leading-[1.08] font-light tracking-[-0.02em] text-ink">
        {dict.titleTop}
        <br />
        <span className="text-gold">{dict.titleAccent}</span>
      </h2>

      <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
        {dict.body}
      </p>

      <Link
        href={CONTACT_HREF}
        className={cn(
          "group mt-5 inline-flex h-11 items-center gap-2.5 rounded-full bg-ink px-6",
          "text-[11px] font-semibold tracking-[0.14em] text-cream uppercase",
          "transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold hover:text-ivory",
        )}
      >
        {dict.contactCta}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </Link>

      {/* ------------------------------------------------ waveform + mic */}
      <Link
        href={VOICE_HREF}
        aria-label={dict.micAria}
        className="group relative mt-7 flex w-full items-center justify-center"
      >
        <div
          aria-hidden
          className="flex h-24 w-full items-center justify-center gap-[3px]"
          // Tapers the ends so the row reads as a designed object rather than
          // a clipped audio file.
          style={{
            maskImage: "linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent)",
            WebkitMaskImage: "linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent)",
          }}
        >
          {shown.map((v, i) => (
            <span
              key={i}
              className={cn(
                "w-[2px] shrink-0 rounded-full bg-gold/35",
                "transition-[background-color,transform] duration-300",
                "group-hover:scale-y-110 group-hover:bg-gold",
              )}
              style={{
                height: `${Math.max(6, v * 100)}%`,
                // Ripples outward from the microphone on hover, so the
                // waveform reads as belonging to the button at its centre.
                transitionDelay: `${Math.abs(i - mid) * 7}ms`,
              }}
            />
          ))}
        </div>

        {/* Rings, sized off the button so they stay concentric. */}
        <span
          aria-hidden
          className="pointer-events-none absolute h-[132px] w-[132px] rounded-full border border-gold/15 transition-transform duration-500 group-hover:scale-110"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute h-[112px] w-[112px] rounded-full border border-gold/25 transition-transform duration-500 group-hover:scale-105"
        />

        <span
          className={cn(
            "absolute flex h-[88px] w-[88px] items-center justify-center rounded-full",
            "bg-ivory shadow-[0_18px_45px_-15px_rgba(60,25,40,0.45)]",
            "ring-1 ring-gold/20 transition-all duration-300",
            "group-hover:scale-105 group-hover:ring-gold/50",
          )}
        >
          <Mic className="h-7 w-7 text-gold" strokeWidth={1.75} />
        </span>
      </Link>

      {/* A big circle with no words doesn't say where it goes. */}
      <p className="mt-3 text-[10px] font-semibold tracking-[0.18em] text-gold-deep uppercase">
        {dict.micLabel}
      </p>

      <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-ink-soft">
        {dict.traits.map((t, i) => (
          <span key={t} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-gold" />}
            {t}
          </span>
        ))}
      </p>
    </div>
  );
}
