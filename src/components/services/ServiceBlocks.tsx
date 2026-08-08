/**
 * Shared content blocks for service pages — same visual language as
 * the /consultation page (covers grid, numbered steps, FAQ accordion).
 */

export function Deliverables({
  title = "What you receive",
  items,
}: {
  title?: string;
  items: string[];
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-light text-ink">{title}</h2>
      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((c) => (
          <li
            key={c}
            className="flex items-start gap-3 rounded-xl border border-camel/30 bg-white px-4 py-3 text-sm text-ink"
          >
            <span aria-hidden className="mt-0.5 text-gold">
              ✦
            </span>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Steps({
  title = "How it works",
  items,
}: {
  title?: string;
  items: { n: string; t: string; d: string }[];
}) {
  return (
    <div className="mt-12">
      <h2 className="font-display text-2xl font-light text-ink">{title}</h2>
      <ol className="mt-5 space-y-4">
        {items.map((s) => (
          <li key={s.n} className="flex gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm text-cream">
              {s.n}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{s.t}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {s.d}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Faq({
  title = "Questions, answered",
  items,
}: {
  title?: string;
  items: { q: string; a: string }[];
}) {
  return (
    <div className="mt-12">
      <h2 className="font-display text-2xl font-light text-ink">{title}</h2>
      <div className="mt-5 space-y-3">
        {items.map((f) => (
          <details
            key={f.q}
            className="group rounded-xl border border-camel/30 bg-white px-5 py-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink">
              {f.q}
              <span
                aria-hidden
                className="text-gold transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
