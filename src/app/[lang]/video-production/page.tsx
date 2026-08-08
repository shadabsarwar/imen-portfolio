import type { Metadata } from "next";
import Link from "next/link";
import ServiceHeader from "@/components/services/ServiceHeader";
import { Deliverables, Steps, Faq } from "@/components/services/ServiceBlocks";
import ServiceForm from "@/components/services/ServiceForm";

export const metadata: Metadata = {
  title: "Video Production — Imene Adjissi",
  description:
    "Full video production with Kreana Production — concept, scriptwriting, filming and editing for commercials, brand films and social content.",
};

const deliverables = [
  "Concept & script development",
  "Filming with a professional crew",
  "Editing, color grading & sound mix",
  "Versions for TV and social — 16:9 & 9:16",
  "Subtitles in Arabic, French or English",
  "One point of contact from brief to delivery",
];

const steps = [
  {
    n: "1",
    t: "Share your brief",
    d: "Tell us what the video is for, roughly how long it should be, and when you need it.",
  },
  {
    n: "2",
    t: "Get a proposal",
    d: "You receive a concept direction, timeline and itemized quote — adjusted together until it fits.",
  },
  {
    n: "3",
    t: "Production & delivery",
    d: "We shoot, edit and deliver in the formats you need — with your feedback built into the edit.",
  },
];

const faqs = [
  {
    q: "What kinds of videos do you produce?",
    a: "TV commercials, social media content, corporate and brand films, documentary-style reports and event coverage.",
  },
  {
    q: "I already have a script — is that okay?",
    a: "Absolutely. We can shoot your script as-is, polish it, or develop a new one from scratch.",
  },
  {
    q: "Where do you film?",
    a: "Kreana Production is based in Bordj Bou Arreridj and films across Algeria. Remote and hybrid productions are possible too.",
  },
  {
    q: "How long does a project take?",
    a: "A simple social video can be ready in about a week; full commercial productions typically take 3–6 weeks depending on scope.",
  },
  {
    q: "How is pricing set?",
    a: "By scope — length, crew, locations and post-production. Your proposal includes a clear itemized quote.",
  },
];

export default function VideoProductionPage() {
  return (
    <main className="bg-cream pt-24 md:pt-32">
      <ServiceHeader
        eyebrow="Kreana Production"
        title="Video Production"
        intro="From concept and scriptwriting to filming and the final edit — full productions handled end-to-end by Imene and the Kreana Production team."
        chips={["Concept", "Script", "Filming", "Edit"]}
      />

      <section className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-12 px-6 pb-20 md:grid-cols-12 md:px-12 md:pb-28">
        {/* Left column: deliverables + showreel + steps + FAQ. */}
        <div className="md:col-span-6 lg:col-span-7">
          <Deliverables items={deliverables} />

          <div className="mt-12">
            <h2 className="font-display text-2xl font-light text-ink">
              Selected work
            </h2>
            <div className="mt-5 rounded-2xl border border-camel/40 bg-white p-6">
              <p className="text-sm leading-relaxed text-ink-soft">
                Recent reels and productions are on the home page — watch how
                Kreana tells a story in thirty seconds.
              </p>
              <Link
                href="/#showreel"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold"
              >
                Watch the showreel →
              </Link>
            </div>
          </div>

          <Steps items={steps} />
          <Faq items={faqs} />
        </div>

        {/* Right column: request form. */}
        <div className="space-y-8 md:col-span-6 lg:col-span-5">
          <ServiceForm
            title="Start a project"
            note="Fill this in and it opens a prefilled WhatsApp message — you'll get a concept direction and a quote from the Kreana team."
            waIntro="Hello Imene 👋 I'd like to start a video production project."
            emailSubject="Video production request"
            fields={[
              {
                key: "type",
                label: "Project type",
                type: "select",
                options: [
                  "TV commercial",
                  "Social media content",
                  "Corporate / brand film",
                  "Documentary / report",
                  "Event coverage",
                  "Other",
                ],
              },
              {
                key: "duration",
                label: "Video duration",
                type: "select",
                options: [
                  "Up to 30 seconds",
                  "30–90 seconds",
                  "2–5 minutes",
                  "Longer / series",
                ],
              },
              {
                key: "script",
                label: "Scriptwriting",
                type: "select",
                options: [
                  "Yes — write it for me",
                  "I have a script ready",
                  "Let's develop it together",
                ],
              },
              { key: "deadline", label: "Target deadline", type: "date" },
              {
                key: "files",
                label: "Files & references",
                type: "url",
                full: true,
                placeholder: "Brand assets, moodboards, examples you like…",
                hint: "Or attach files directly in WhatsApp after sending.",
              },
              {
                key: "concept",
                label: "Concept & goals",
                type: "textarea",
                required: true,
                placeholder:
                  "What story should this video tell — and what should it achieve?",
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
