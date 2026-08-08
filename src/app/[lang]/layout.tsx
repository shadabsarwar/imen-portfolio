import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Fraunces, Cairo } from "next/font/google";
import "../globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/dictionaries";
import { LOCALES, dirOf, isLocale } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Editorial display serif for the name / big words. Latin only — Arabic
// falls back to Cairo, wired in globals.css off html[lang="ar"].
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

// Arabic display for إيمان عجيسي and, on the Arabic site, all body copy.
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

/** Both locales prerender — nothing here is request-dependent. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = await getDictionary(lang);
  return {
    title: d.meta.title,
    description: d.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  // The proxy only routes known locales, but a hand-typed /de would still
  // reach the segment.
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      dir={dirOf()}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${cairo.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full">
        <SmoothScroll>
          <Navbar lang={lang} dict={dict.nav} />
          {children}
          <Footer lang={lang} dict={dict.footer} nav={dict.nav} services={dict.services} />
        </SmoothScroll>
      </body>
    </html>
  );
}
