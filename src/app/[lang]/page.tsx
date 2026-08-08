import { notFound } from "next/navigation";
import Hero from "@/components/hero/Hero";
import SectionRail from "@/components/layout/SectionRail";
import BroadcastGrid from "@/components/sections/BroadcastGrid";
import WorkSection from "@/components/sections/WorkSection";
import VoiceSamples from "@/components/sections/VoiceSamples";
import ConsultationCTA from "@/components/sections/ConsultationCTA";
import About from "@/components/sections/About";
import Achievements from "@/components/sections/Achievements";
import Services from "@/components/sections/Services";
import Brands from "@/components/sections/Brands";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import { broadcastWork, verticalWork } from "@/lib/media";
import { getDictionary } from "@/dictionaries";
import { isLocale, localePath } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = await getDictionary(lang);

  return (
    <main>
      {/* Home only — the rail indexes these sections by id. */}
      <SectionRail dict={d.rail} />

      <Hero dict={d.hero} lang={lang} />
      <ConsultationCTA dict={d.consultationCta} lang={lang} />

      {/*
        Broadcast reel, then the vertical social reel, then the audio —
        WorkSection is white, VoiceSamples stays dark to set the audio
        listening section apart from the video work above it.
      */}
      <BroadcastGrid
        id="showreel"
        eyebrow={d.broadcast.eyebrow}
        title={d.broadcast.title}
        description={d.broadcast.description}
        items={broadcastWork}
        cta={{ href: localePath(lang, "/work"), label: d.broadcast.cta }}
        dict={d.broadcast}
      />

      <WorkSection
        id="reel"
        eyebrow={d.work.eyebrow}
        title={d.work.title}
        description={d.work.description}
        items={verticalWork}
        orientation="portrait"
        cta={{ href: localePath(lang, "/work"), label: d.work.cta }}
      />

      <VoiceSamples dict={d.voice} lang={lang} />

      <About dict={d.about} />
      <Achievements dict={d.achievements} />
      <Services dict={d.services} lang={lang} />
      <Brands dict={d.brands} />
      <Testimonials dict={d.testimonials} />
      <Contact dict={d.contact} />
    </main>
  );
}
