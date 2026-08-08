import type { Metadata } from "next";
import ServiceHeader from "@/components/services/ServiceHeader";
import ServiceForm from "@/components/services/ServiceForm";

export const metadata: Metadata = {
  title: "Store — Imene Adjissi",
  description:
    "Digital products and creator resources by Imene Adjissi — voice-over kits, practice scripts and content tools. Launching soon.",
};

// Placeholder catalog — becomes Payload CMS products with their own pages
// and instant checkout in Phase 2.
const products = [
  {
    title: "Voice-Over Starter Kit",
    blurb:
      "The complete beginner's toolkit — gear guide for any budget, warm-up routines and a first-demo checklist.",
    format: "Guide + templates",
  },
  {
    title: "Commercial Script Practice Pack",
    blurb:
      "50 practice scripts across commercial, narration and dubbing — in Arabic, French and English, with direction notes.",
    format: "PDF pack",
  },
  {
    title: "Content Planner for Creators",
    blurb:
      "The planning system behind consistent, on-brand publishing — calendar, hooks bank and caption frameworks.",
    format: "Notion + PDF",
  },
];

export default function StorePage() {
  return (
    <main className="bg-cream pt-24 md:pt-32">
      <ServiceHeader
        eyebrow="Digital products"
        title="Store"
        intro="Downloadable tools and resources to sharpen your voice, your content and your brand — built from the same methods Imene uses every day."
        chips={["Digital downloads", "Launching soon"]}
      />

      <section className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-12 px-6 pb-20 md:grid-cols-12 md:px-12 md:pb-28">
        {/* Left column: product previews. */}
        <div className="space-y-6 md:col-span-6 lg:col-span-7">
          {products.map((p) => (
            <article
              key={p.title}
              className="rounded-2xl border border-camel/40 bg-white p-6 md:p-8"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gold uppercase">
                  Coming soon
                </span>
                <span className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-medium text-ink-soft">
                  {p.format}
                </span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-light text-ink">
                {p.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {p.blurb}
              </p>
            </article>
          ))}

          <p className="text-sm leading-relaxed text-ink-soft">
            When the store opens, every product gets its own page with previews
            and instant checkout — local and international payment included.
          </p>
        </div>

        {/* Right column: launch-list form. */}
        <div className="space-y-8 md:col-span-6 lg:col-span-5">
          <ServiceForm
            title="Get launch access"
            note="Leave your contact and you'll be messaged the moment the store opens — launch discounts included. The form opens a prefilled WhatsApp message."
            waIntro="Hello Imene 👋 Please notify me when the store launches."
            emailSubject="Store launch list"
            submitLabel="Notify me via WhatsApp"
            fields={[
              {
                key: "product",
                label: "I'm interested in",
                type: "select",
                options: [
                  "Voice-Over Starter Kit",
                  "Commercial Script Practice Pack",
                  "Content Planner for Creators",
                  "Everything",
                ],
              },
              {
                key: "message",
                label: "Anything specific you're looking for?",
                type: "textarea",
                placeholder:
                  "Optional — product requests shape what gets built first.",
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
