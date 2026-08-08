"use client";
import type { Dictionary } from "@/dictionaries/en";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

/**
 * Right-edge section navigator for the home page.
 *
 * Two states, one set of marks:
 *
 *   On the hero it's a half circle hinged to the right edge, names showing —
 *     an index of the page before you've scrolled any of it.
 *   Past the hero it collapses to a hairline column under 30px wide, names on
 *     hover only.
 *
 * The marks are absolutely positioned in both states rather than laid out by
 * flex in one and absolutely in the other, so the collapse is a transition
 * between two sets of coordinates — the beads slide off the arc into the
 * column instead of the whole thing swapping out.
 *
 * The narrow state has to stay narrow: past the hero the rail crosses the
 * work grid's right-hand column, and anything wider starts landing on video
 * posters where a hairline sized for cream disappears.
 *
 * Below `xl` it doesn't render at all. On a narrower window it would sit on
 * top of the content it indexes, and the navbar already covers those sizes.
 */
const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "showreel", label: "Broadcast" },
  { id: "reel", label: "Social" },
  // The only full-bleed dark section on the page, so the marks have to invert
  // here or they vanish into the wine.
  { id: "voice", label: "Voice", dark: true },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

/**
 * Arc geometry. The circle's centre sits on the box's right edge, so the marks
 * bow left into the page — furthest out at the middle, nearly flush top and
 * bottom.
 *
 * The sweep stops short of a true 180° on purpose: at the poles the marks
 * bunch to within ~10px of each other and the name pills collide. 156° still
 * reads as a half circle and leaves the end pills room to breathe.
 */
const R = 140;
const SWEEP = 156;
const BOX_W = R + 12;
const BOX_H = 2 * R * Math.sin(((SWEEP / 2) * Math.PI) / 180) + 26;
const CY = BOX_H / 2;

/** Collapsed state: a straight column, 26px apart, hugging the right edge. */
const PITCH = 26;
const RAIL_X = 4;

function arcAt(i: number) {
  const t = i / (SECTIONS.length - 1);
  const rad = ((-SWEEP / 2 + t * SWEEP) * Math.PI) / 180;
  return { x: R * Math.cos(rad), y: R * Math.sin(rad) };
}

const FIRST = arcAt(0);
const LAST = arcAt(SECTIONS.length - 1);
const ARC_PATH = [
  `M ${(BOX_W - FIRST.x).toFixed(2)} ${(CY + FIRST.y).toFixed(2)}`,
  `A ${R} ${R} 0 0 0 ${(BOX_W - LAST.x).toFixed(2)} ${(CY + LAST.y).toFixed(2)}`,
].join(" ");

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

/**
 * The id of the section under the reading line.
 *
 * Read through useSyncExternalStore rather than an effect: this is derived
 * state, and setting it from an effect both trips
 * react-hooks/set-state-in-effect and paints one frame of the wrong answer.
 */
function snapshot() {
  const line = window.innerHeight * 0.4;
  let current = SECTIONS[0].id;
  for (const s of SECTIONS) {
    const el = document.getElementById(s.id);
    // Sections are in document order, so the last one to have crossed the
    // line is the one being read.
    if (!el) continue;
    if (el.getBoundingClientRect().top > line) break;
    current = s.id;
  }
  return current;
}

const serverSnapshot = () => SECTIONS[0].id;

export default function SectionRail({ dict }: { dict: Dictionary["rail"] }) {
  const active = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const open = active === SECTIONS[0].id; // hero → the half circle
  const onDark = SECTIONS.find((s) => s.id === active)?.dark ?? false;

  return (
    <nav
      aria-label={dict.label}
      style={{ width: BOX_W, height: BOX_H }}
      className="fixed top-1/2 right-3 z-30 hidden -translate-y-1/2 xl:block"
    >
      <svg
        aria-hidden
        viewBox={`0 0 ${BOX_W} ${BOX_H}`}
        className={cn(
          "absolute inset-0 h-full w-full overflow-visible transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0",
        )}
      >
        <path d={ARC_PATH} fill="none" strokeWidth={1} className="stroke-gold/25" />
      </svg>

      {SECTIONS.map((s, i) => {
        const on = s.id === active;
        const arc = arcAt(i);
        const x = open ? arc.x : RAIL_X;
        const y = open ? arc.y : (i - (SECTIONS.length - 1) / 2) * PITCH;

        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={on ? "true" : undefined}
            style={{
              right: x - 4,
              top: CY + y,
              // A short stagger so the arc folds into the column rather than
              // every mark arriving at once.
              transitionDelay: `${i * 18}ms`,
            }}
            className={cn(
              "group absolute flex h-5 w-7 -translate-y-1/2 items-center justify-end",
              "transition-[right,top] duration-500 ease-out",
            )}
          >
            {/* Always absolute, so the name never contributes width. Left in
                flow it makes every mark ~120px wide, and in the collapsed
                state that invisible strip sits over the work grid's right
                column and eats clicks meant for the video cards. */}
            <span
              className={cn(
                "absolute right-full mr-2 rounded-full px-2 py-0.5 whitespace-nowrap",
                "text-[10px] font-semibold tracking-[0.12em] uppercase backdrop-blur-md",
                "transition-all duration-400",
                open
                  ? "pointer-events-auto translate-x-0 opacity-100"
                  : "pointer-events-none translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                on
                  ? "bg-gold text-ivory ring-1 ring-gold/40"
                  : onDark
                    ? "bg-ivory/12 text-ivory"
                    : "bg-ivory/85 text-ink/65 ring-1 ring-ink/10",
              )}
            >
              {dict.sections[s.id as keyof typeof dict.sections] ?? s.label}
            </span>

            {/* One element for both states: a bead on the arc, a hairline in
                the column. rounded-full at 1px tall reads as a line. */}
            <span
              className={cn(
                "rounded-full transition-all duration-400",
                open
                  ? on
                    ? "h-2 w-2 bg-gold ring-2 ring-gold/30"
                    : "h-1.5 w-1.5 bg-gold/45"
                  : on
                    ? cn("h-px w-5", onDark ? "bg-gold-soft" : "bg-gold")
                    : cn("h-px w-2.5 group-hover:w-4", onDark ? "bg-ivory/25" : "bg-ink/20"),
              )}
            />
          </a>
        );
      })}
    </nav>
  );
}
