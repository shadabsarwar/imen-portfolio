import type { Metadata } from "next";
import Link from "next/link";
import WorkGallery from "@/components/work/WorkGallery";
import { allVideos } from "@/lib/media";
import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Work — Imene Adjissi",
  description:
    "Broadcast reporting, TV and radio commercials, dubbing, songs and brand collaborations by Imene Adjissi — journalist, voice-over artist and presenter.",
};

export default async function WorkPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const d = await getDictionary(lang);
  return (
    <main className="min-h-screen bg-ink pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Link
  href="/"
  className="text-sm text-ivory/50 transition-colors hover:text-ivory"
>
  {d.workPage.back}
</Link>
        <div className="mt-6 max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-soft uppercase">
            <span className="h-px w-8 bg-gold-soft/60" />
            {d.workPage.eyebrow}
          </p>
          <h1 className="font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.0] font-light tracking-[-0.02em] text-ivory">
            {d.workPage.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/50">
            {d.workPage.intro.replace("{count}", String(allVideos.length))}
          </p>
        </div>
      </div>

      <div className="mt-14">
        <WorkGallery dict={d.workPage} />
      </div>
    </main>
  );
}
