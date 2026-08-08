import type { Metadata } from "next";
import ServiceHeader from "@/components/services/ServiceHeader";
import { Deliverables, Steps, Faq } from "@/components/services/ServiceBlocks";
import ServiceForm from "@/components/services/ServiceForm";
import { contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Brand Promotion — Imene Adjissi",
  description:
    "Sponsored collaborations and product features on Imene Adjissi's social platforms — authentic content that speaks in your brand's voice.",
};

const deliverables = [
  "A concept tailored to your product & audience",
  "Professionally produced reel, story — or both",
  "Your key message, in an authentic voice",
  "Publishing timed for peak engagement",
  "Links, tags & promo codes included",
  "A performance recap after the campaign",
];

const steps = [
  {
    n: "1",
    t: "Introduce your brand",
    d: "Tell Imene what you're promoting, on which platform, and what the campaign should achieve.",
  },
  {
    n: "2",
    t: "Align on the concept",
    d: "Format, message, timing and budget are agreed before anything is filmed — you approve the direction.",
  },
  {
    n: "3",
    t: "Go live & get the recap",
    d: "The content is produced and published, followed by a short recap of how it performed.",
  },
];

const faqs = [
  {
    q: "Which platforms can we collaborate on?",
    a: "Primarily Instagram — reels and stories — with cross-posting to other platforms on request.",
  },
  {
    q: "Does every product fit?",
    a: "Only collaborations that genuinely fit Imene's audience and values are accepted — that's what keeps the endorsement credible for your brand too.",
  },
  {
    q: "Who writes the content?",
    a: "Imene and the Kreana team develop the concept and script around your key messages — you approve before publishing.",
  },
  {
    q: "How is pricing set?",
    a: "By format and scope — a single reel, a story series, or a multi-post campaign. Share your budget and you'll get a tailored proposal.",
  },
  {
    q: "Can we run a long-term partnership?",
    a: "Yes — ambassador-style partnerships over several months are welcome and priced accordingly.",
  },
];

export default function BrandPromotionPage() {
  return (
    <main className="bg-cream pt-24 md:pt-32">
      <ServiceHeader
        eyebrow="Collaborate"
        title="Brand Promotion"
        intro="Sponsored collaborations and product features across Imene's platforms — content crafted in her voice, for an audience that trusts it."
        chips={["Reels", "Stories", "Campaigns"]}
      />

      <section className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-12 px-6 pb-20 md:grid-cols-12 md:px-12 md:pb-28">
        {/* Left column: deliverables + audience + steps + FAQ. */}
        <div className="md:col-span-6 lg:col-span-7">
          <Deliverables items={deliverables} />

          <div className="mt-12">
            <h2 className="font-display text-2xl font-light text-ink">
              The audience
            </h2>
            <div className="mt-5 rounded-2xl border border-camel/40 bg-white p-6">
              <p className="text-sm leading-relaxed text-ink-soft">
                An engaged, Arabic-speaking audience that follows Imene for
                voice, media and content — see recent collaborations and daily
                content on Instagram.
              </p>
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold"
              >
                @imen_adjissi on Instagram →
              </a>
            </div>
          </div>

          <Steps items={steps} />
          <Faq items={faqs} />
        </div>

        {/* Right column: proposal form. */}
        <div className="space-y-8 md:col-span-6 lg:col-span-5">
          <ServiceForm
            title="Propose a collaboration"
            note="Fill this in and it opens a prefilled WhatsApp message — Imene reviews every proposal personally."
            waIntro="Hello Imene 👋 I'd like to propose a brand collaboration."
            emailSubject="Brand collaboration proposal"
            fields={[
              {
                key: "brand",
                label: "Brand name",
                type: "text",
                required: true,
                placeholder: "Your brand",
              },
              {
                key: "product",
                label: "Product or service",
                type: "text",
                required: true,
                placeholder: "What are we promoting?",
              },
              {
                key: "platform",
                label: "Preferred platform",
                type: "select",
                options: [
                  "Instagram",
                  "TikTok",
                  "YouTube",
                  "Facebook",
                  "Multiple platforms",
                ],
              },
              {
                key: "budget",
                label: "Budget",
                type: "text",
                placeholder: "e.g. 150,000 DZD or $1,000",
              },
              {
                key: "links",
                label: "Supporting files or links",
                type: "url",
                full: true,
                placeholder: "Website, product page, brand assets…",
                hint: "Or attach files directly in WhatsApp after sending.",
              },
              {
                key: "details",
                label: "Campaign details",
                type: "textarea",
                required: true,
                placeholder:
                  "Goals, timing, key messages — and anything else we should know.",
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
