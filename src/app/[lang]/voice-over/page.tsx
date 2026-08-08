import type { Metadata } from "next";
import Link from "next/link";
import ServiceHeader from "@/components/services/ServiceHeader";
import { Deliverables, Steps, Faq } from "@/components/services/ServiceBlocks";
import ServiceForm from "@/components/services/ServiceForm";

export const metadata: Metadata = {
  title: "Voice Over — Imene Adjissi",
  description:
    "Professional voice over in Arabic, French and English — commercials, narration, dubbing and brand films, broadcast-ready and fast.",
};

const deliverables = [
  "Broadcast-ready audio — clean WAV & MP3 masters",
  "Native Arabic, fluent French & English reads",
  "Two revision rounds included",
  "Usage & licensing agreed up front",
  "Most scripts delivered within 24–72 hours",
  "Reference reads & live direction welcome",
];

const credits = [
  "Official voice — 11One Media, Qatar",
  "Reporter — Al Jazeera Mubasher",
  "Nasheedio — Dubai",
];

const steps = [
  {
    n: "1",
    t: "Send your script & brief",
    d: "Share the script (or a link to it), the language, and where the audio will run.",
  },
  {
    n: "2",
    t: "Approve the quote & tone",
    d: "You get a clear quote and the style is locked — with a reference read if needed.",
  },
  {
    n: "3",
    t: "Receive your files",
    d: "Final audio delivered in the formats you need, with revisions if something feels off.",
  },
];

const faqs = [
  {
    q: "Which languages do you record in?",
    a: "Native Arabic (MSA and Algerian), fluent French and English — including bilingual versions of the same script.",
  },
  {
    q: "How fast is delivery?",
    a: "Most scripts under two minutes are delivered within 24–72 hours. Rush delivery is possible — mention your deadline in the form.",
  },
  {
    q: "How is pricing set?",
    a: "By length, usage and media (social, TV, radio…). Send the script and you'll get a clear quote — no surprises.",
  },
  {
    q: "What about revisions?",
    a: "Two revision rounds are included. Script changes after recording are quoted separately.",
  },
  {
    q: "How do I send my script?",
    a: "Paste a link in the form, or attach the file directly in WhatsApp once your request opens there.",
  },
];

export default function VoiceOverPage() {
  return (
    <main className="bg-cream pt-24 md:pt-32">
      <ServiceHeader
        eyebrow="Work with me"
        title="Voice Over"
        intro="Commercials, narration, dubbing and brand films — recorded in Arabic, French or English with warmth, fluency and broadcast-ready quality."
        chips={["Commercial", "Narration", "Dubbing", "AR · FR · EN"]}
      />

      <section className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-12 px-6 pb-20 md:grid-cols-12 md:px-12 md:pb-28">
        {/* Left column: deliverables + samples + steps + FAQ. */}
        <div className="md:col-span-6 lg:col-span-7">
          <Deliverables items={deliverables} />

          <div className="mt-12">
            <h2 className="font-display text-2xl font-light text-ink">
              Hear it first
            </h2>
            <div className="mt-5 rounded-2xl border border-camel/40 bg-white p-6">
              <p className="text-sm leading-relaxed text-ink-soft">
                Commercial, narration and dubbing samples are on the home page —
                press play and judge the voice yourself.
              </p>
              <Link
                href="/#voice"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold"
              >
                Listen to the samples →
              </Link>
              <ul className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium tracking-wide text-ink-soft uppercase">
                {credits.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-camel/50 bg-ivory px-2.5 py-1"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Steps items={steps} />
          <Faq items={faqs} />
        </div>

        {/* Right column: request form. */}
        <div className="space-y-8 md:col-span-6 lg:col-span-5">
          <ServiceForm
            title="Request a quote"
            note="Fill this in and it opens a prefilled WhatsApp message — Imene replies with a quote and delivery date. You can attach your script right there."
            waIntro="Hello Imene 👋 I'd like to request a voice over."
            emailSubject="Voice-over request"
            fields={[
              {
                key: "language",
                label: "Language",
                type: "select",
                options: ["Arabic", "French", "English", "More than one"],
              },
              {
                key: "duration",
                label: "Recording length",
                type: "select",
                options: [
                  "Up to 30 seconds",
                  "30–60 seconds",
                  "1–5 minutes",
                  "Longer / long-form",
                ],
              },
              {
                key: "style",
                label: "Voice style",
                type: "select",
                options: [
                  "Warm & friendly",
                  "Corporate & confident",
                  "Energetic promo",
                  "Documentary narration",
                  "Character / dubbing",
                  "Not sure — advise me",
                ],
              },
              { key: "deadline", label: "Delivery deadline", type: "date" },
              {
                key: "script",
                label: "Script link",
                type: "url",
                full: true,
                placeholder: "Google Drive, Dropbox, docs link…",
                hint: "No link yet? You can attach the file in WhatsApp after sending.",
              },
              {
                key: "details",
                label: "Project details",
                type: "textarea",
                required: true,
                placeholder:
                  "What is the audio for — TV, radio, social, an app? Any tone references?",
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
