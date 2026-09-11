import type { Metadata } from "next";
import Link from "next/link";
import BookingForm from "@/components/consultation/BookingForm";
import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: "Book a 1:1 Consultation — Imene Adjissi",
  description:
    "Paid 1:1 consultation with Imene Adjissi: voice-over, TV presenting, content strategy and personal branding — in Arabic, French or English.",
};

const covers = [
  "Starting or growing a voice-over career",
  "Content strategy for your platforms",
  "Personal branding & positioning",
  "On-camera presence & TV presenting",
  "Dubbing & performance direction",
  "Turning your voice into an income",
];

const steps = [
  {
    n: "1",
    t: "Send your request",
    d: "Fill the form — it reaches Imene directly on WhatsApp.",
  },
  {
    n: "2",
    t: "Confirm slot & payment",
    d: "You'll agree on the time and payment method (CIB/EDAHABIA & international options coming online soon).",
  },
  {
    n: "3",
    t: "Meet on video call",
    d: "A focused session in Arabic, French or English — with clear next steps to apply right away.",
  },
];

// Placeholder pricing for the demo — final pricing set by Imene.
const plans = [
  {
    name: "Discovery",
    length: "30 minutes",
    price: "4,500 DZD",
    intl: "≈ $35",
    features: ["One focused topic", "Direct feedback", "Action checklist"],
    highlight: false,
  },
  {
    name: "Deep Dive",
    length: "60 minutes",
    price: "8,000 DZD",
    intl: "≈ $59",
    features: [
      "Full session on your goals",
      "Portfolio / demo review",
      "Personalized roadmap",
      "1 week of follow-up questions",
    ],
    highlight: true,
  },
];

const faqs = [
  {
    q: "Which languages can the session be in?",
    a: "Arabic, French or English — whichever you're most comfortable with.",
  },
  {
    q: "How do I pay?",
    a: "For now, payment is confirmed person-to-person after you request a slot (CIB/EDAHABIA locally, or international options). Full online booking and payment are coming soon.",
  },
  {
    q: "Can I reschedule?",
    a: "Yes — up to 24 hours before your session, at no cost.",
  },
  {
    q: "Is this for beginners only?",
    a: "Not at all. Sessions are tailored — from first steps in voice-over to refining a professional demo or brand.",
  },
];

export default async function ConsultationPage({
  params,
}: PageProps<"/[lang]/consultation">) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  await requireAuth(lang, `/${lang}/consultation`);

  const d = await getDictionary(lang);

  return (
    <main className="bg-cream pt-24 md:pt-32">
      {/* Header */}
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
            Work with me
          </p>

          <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.0] font-light tracking-[-0.02em] text-ink">
            1:1 Consultation
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
            A private session with Imene Adjissi — journalist, voice-over
            artist and founder of Kreana Production. Bring your questions;
            leave with a plan.
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium tracking-wide text-ink-soft uppercase">
            {["Paid session", "Video call", "AR · FR · EN"].map((c) => (
              <span
                key={c}
                className="rounded-full border border-camel/50 bg-ivory px-2.5 py-1"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content grid */}
      <section className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-12 px-6 pb-20 md:grid-cols-12 md:px-12 md:pb-28">
        {/* Left column: covers + steps + FAQ */}
        <div className="md:col-span-6 lg:col-span-7">
          <h2 className="font-display text-2xl font-light text-ink">
            What we can cover
          </h2>

          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {covers.map((c) => (
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

          <h2 className="mt-12 font-display text-2xl font-light text-ink">
            How it works
          </h2>

          <ol className="mt-5 space-y-4">
            {steps.map((s) => (
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

          <h2 className="mt-12 font-display text-2xl font-light text-ink">
            Questions, answered
          </h2>

          <div className="mt-5 space-y-3">
            {faqs.map((f) => (
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

                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Right column: pricing + form */}
        <div className="space-y-8 md:col-span-6 lg:col-span-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-6 ${
                  p.highlight
                    ? "border-gold bg-ink text-cream shadow-[0_30px_60px_-35px_rgba(42,22,30,0.6)]"
                    : "border-camel/40 bg-white text-ink"
                }`}
              >
                {p.highlight && (
                  <span className="mb-3 inline-block rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold tracking-wide text-ink uppercase">
                    Most popular
                  </span>
                )}

                <p className="font-display text-lg">{p.name}</p>

                <p
                  className={`text-xs ${
                    p.highlight ? "text-cream/60" : "text-ink-soft"
                  }`}
                >
                  {p.length}
                </p>

                <p className="mt-4 font-display text-3xl font-light">
                  {p.price}
                </p>

                <p
                  className={`text-xs ${
                    p.highlight ? "text-cream/60" : "text-ink-soft"
                  }`}
                >
                  {p.intl} · intro pricing
                </p>

                <ul
                  className={`mt-5 space-y-2 text-sm ${
                    p.highlight ? "text-cream/80" : "text-ink-soft"
                  }`}
                >
                  {p.features.map((ft) => (
                    <li key={ft} className="flex items-start gap-2">
                      <span aria-hidden className="mt-0.5 text-gold">
                        ✓
                      </span>
                      {ft}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <BookingForm />
        </div>
      </section>
    </main>
  );
}