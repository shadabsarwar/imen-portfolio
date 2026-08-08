import type { Dictionary } from "@/dictionaries/en";
import { allBrands, type BrandItem } from "@/lib/media";
import { clientsWithoutLogos } from "@/lib/site";

/**
 * Client logo wall. Two marquee rows running in opposite directions —
 * headline clients on top, the rest below. The source logos are phone
 * screenshots with inconsistent backgrounds, so each is centre-cropped
 * square by the media pipeline and masked to a circle here; that's what
 * makes 31 mismatched images read as one set.
 */
function Row({
  items,
  reverse,
  duration,
}: {
  items: BrandItem[];
  reverse?: boolean;
  duration: string;
}) {
  if (!items.length) return null;
  const doubled = [...items, ...items]; // duplicated for a seamless loop
  return (
    <ul
      className={`flex w-max items-center gap-8 md:gap-12 ${
        reverse ? "animate-marquee-reverse" : "animate-marquee"
      }`}
      style={{ animationDuration: duration }}
    >
      {doubled.map((b, i) => (
        <li
          key={`${b.slug}-${i}`}
          aria-hidden={i >= items.length}
          className="group flex shrink-0 flex-col items-center gap-3"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- pipeline
              output in a gitignored folder; already sized and WebP. */}
          <img
            src={b.src}
            alt={i >= items.length ? "" : b.name}
            width={360}
            height={360}
            loading="lazy"
            decoding="async"
            className="h-20 w-20 rounded-full object-cover ring-1 ring-ink/10 grayscale transition-[filter,transform,box-shadow] duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:shadow-lg md:h-24 md:w-24"
          />
          <span className="max-w-[7rem] text-center text-[11px] leading-tight text-ink-soft/60 transition-colors group-hover:text-ink">
            {b.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Brands({ dict }: { dict: Dictionary["brands"] }) {
  if (!allBrands.length) return null;
  const headline = allBrands.filter((b) => b.tier <= 1);
  const rest = allBrands.filter((b) => b.tier > 1);

  return (
    <section id="brands" className="w-full overflow-hidden bg-cream py-16 md:py-20">
      <div className="mx-auto mb-12 max-w-7xl px-6 text-center md:px-12">
        <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase">
          {dict.eyebrow}
        </p>
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-light tracking-[-0.02em] text-ink">
          {dict.title}
        </h2>
      </div>

      <div className="marquee relative space-y-10">
        {/* Edge fades. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-cream to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-cream to-transparent md:w-32" />

        <Row items={headline} duration="48s" />
        <Row items={rest} reverse duration="72s" />
      </div>

      {clientsWithoutLogos.length > 0 && (
        <p className="mx-auto mt-12 max-w-3xl px-6 text-center text-sm text-ink-soft/60 md:px-12">
          <span className="text-ink-soft/40">{dict.alsoWith} </span>
          {clientsWithoutLogos.join(" · ")}
        </p>
      )}
    </section>
  );
}
