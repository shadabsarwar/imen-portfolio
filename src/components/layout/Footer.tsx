import Link from "next/link";
import { contact } from "@/lib/site";
import { localePath, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries/en";

export default function Footer({
  lang,
  dict,
  nav,
  services,
}: {
  lang: Locale;
  dict: Dictionary["footer"];
  nav: Dictionary["nav"];
  services: Dictionary["services"];
}) {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand. */}
          <div className="md:col-span-5">
            <p className="font-display text-2xl tracking-tight">
              Imene<span className="text-gold-soft"> Adjissi</span>
            </p>
            <p className="mt-1 font-arabic text-lg text-cream/50" dir="rtl">
              إيمان عجيسي
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/55">
              {dict.blurb}
            </p>
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-gold-soft"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .49 1.4.9.4.4.7.9.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.9.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.4-.2-.4-.4-1.1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.9-.7 1.4-.9.4-.2 1.1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.8.07-1.1.05-1.7.24-2.1.4-.5.2-.9.44-1.2.83-.4.38-.6.74-.8 1.27-.2.4-.4 1-.4 2.1C2.6 8.5 2.6 8.9 2.6 12s0 3.5.07 4.8c.05 1.1.24 1.7.4 2.1.2.5.44.9.83 1.2.38.4.74.6 1.27.8.4.2 1 .4 2.1.4 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.1 0 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.3.6-.7.8-1.2.2-.4.4-1 .4-2.1.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c0-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.3-.4-.7-.6-1.2-.8-.4-.2-1-.4-2.1-.4-1.3-.1-1.7-.1-4.8-.1Zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 1.8a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Zm5.1-2.9a1.1 1.1 0 1 1 0 2.3 1.1 1.1 0 0 1 0-2.3Z" />
              </svg>
              @imen_adjissi
            </a>
          </div>

          {/* Explore. */}
          <div className="md:col-span-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-cream/40 uppercase">
              {dict.explore}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {nav.links.map((l) => (
                <li key={l.key}>
                  <Link
                    href={localePath(lang, l.href)}
                    className="text-cream/70 transition-colors hover:text-gold-soft"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services. */}
          <div className="md:col-span-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-cream/40 uppercase">
              {dict.services}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.items.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={localePath(lang, `/${s.slug}`)}
                    className="text-cream/70 transition-colors hover:text-gold-soft"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact. */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-cream/40 uppercase">
              {dict.contact}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="transition-colors hover:text-gold-soft"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-soft"
                >
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>{contact.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-cream/40 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Imene Adjissi — Kreana Production.{" "}
            {dict.rights}
          </p>
          <p className="font-arabic" dir="rtl">
            صناعة المحتوى · تعليق صوتي · إعلام
          </p>
        </div>
      </div>
    </footer>
  );
}
