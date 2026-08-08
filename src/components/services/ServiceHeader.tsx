import Link from "next/link";

/** Shared page header for service pages — mirrors the /consultation header. */
export default function ServiceHeader({
  eyebrow,
  title,
  intro,
  chips,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  chips?: string[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-12">
      <Link
        href="/"
        className="text-sm text-ink-soft transition-colors hover:text-ink"
      >
        ← Back to home
      </Link>
      <div className="mt-6 max-w-2xl">
        <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold uppercase">
          <span className="h-px w-8 bg-gold/60" />
          {eyebrow}
        </p>
        <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.0] font-light tracking-[-0.02em] text-ink">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
          {intro}
        </p>
        {chips && chips.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium tracking-wide text-ink-soft uppercase">
            {chips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-camel/50 bg-ivory px-2.5 py-1"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
