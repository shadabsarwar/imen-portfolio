import type { Metadata } from "next";
import ServiceHeader from "@/components/services/ServiceHeader";
import ServiceForm from "@/components/services/ServiceForm";

export const metadata: Metadata = {
  title: "Courses — Imene Adjissi",
  description:
    "Practical courses in voice-over, on-camera presenting and content creation, taught by Imene Adjissi. Join the waitlist for launch access.",
};

// Placeholder catalog — becomes Payload CMS content with real course pages
// (curriculum, pricing, enrollment) in Phase 2.
const courses = [
  {
    status: "In production",
    title: "Voice-Over Fundamentals",
    blurb:
      "From your first recording to a client-ready demo — the complete foundation, taught in Arabic.",
    tags: ["Arabic", "Beginner–Intermediate", "Self-paced"],
    curriculum: [
      "Breathing, diction & articulation",
      "Setting up a home studio on a budget",
      "Commercial, narration & dubbing reads",
      "Recording & cleaning your audio",
      "Building a demo reel that sells",
      "Finding your first paying clients",
    ],
  },
  {
    status: "Coming next",
    title: "On-Camera Presence & Presenting",
    blurb:
      "TV-grade presence for creators and presenters — how to look, sound and feel confident on camera.",
    tags: ["Arabic", "All levels"],
    curriculum: [
      "Voice & body language on camera",
      "Teleprompter & improvised delivery",
      "Interview technique",
      "Building your presenter reel",
    ],
  },
  {
    status: "Planned",
    title: "Content & Personal Branding",
    blurb:
      "Turn your skills into a personal brand that earns — positioning, content systems and monetization.",
    tags: ["Arabic"],
    curriculum: [
      "Positioning & finding your niche",
      "Content systems that last",
      "Growing across platforms",
      "Monetization paths",
    ],
  },
];

export default function CoursesPage() {
  return (
    <main className="bg-cream pt-24 md:pt-32">
      <ServiceHeader
        eyebrow="Learn with Imene"
        title="Courses"
        intro="Structured, practical training in voice-over, presenting and content creation — from real working experience, not theory. All courses are taught in Arabic. The first ones are in production now."
        chips={["Self-paced", "Taught in Arabic", "Launching soon"]}
      />

      <section className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-12 px-6 pb-20 md:grid-cols-12 md:px-12 md:pb-28">
        {/* Left column: course catalog. */}
        <div className="space-y-6 md:col-span-6 lg:col-span-7">
          {courses.map((c) => (
            <article
              key={c.title}
              className="rounded-2xl border border-camel/40 bg-white p-6 md:p-8"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gold uppercase">
                  {c.status}
                </span>
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-medium text-ink-soft"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="mt-4 font-display text-2xl font-light text-ink">
                {c.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {c.blurb}
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {c.curriculum.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-ink-soft"
                  >
                    <span aria-hidden className="mt-0.5 text-gold">
                      ✦
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <p className="text-sm leading-relaxed text-ink-soft">
            When enrollment opens, each course gets its own page with the full
            curriculum, pricing and secure video access.
          </p>
        </div>

        {/* Right column: waitlist form. */}
        <div className="space-y-8 md:col-span-6 lg:col-span-5">
          <ServiceForm
            title="Join the waitlist"
            note="Be first to know when enrollment opens — waitlist members get the launch price. The form opens a prefilled WhatsApp message."
            waIntro="Hello Imene 👋 I'd like to join the course waitlist."
            emailSubject="Course waitlist"
            submitLabel="Join via WhatsApp"
            fields={[
              {
                key: "course",
                label: "Course",
                type: "select",
                options: [
                  "Voice-Over Fundamentals",
                  "On-Camera Presence & Presenting",
                  "Content & Personal Branding",
                  "All courses",
                ],
              },
              {
                key: "level",
                label: "Your level",
                type: "select",
                options: ["Beginner", "Intermediate", "Professional"],
              },
              {
                key: "goal",
                label: "What do you want to learn?",
                type: "textarea",
                placeholder:
                  "Optional — helps shape the course around real goals.",
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
