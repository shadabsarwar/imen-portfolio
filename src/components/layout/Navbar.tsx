"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { LOCALES, LOCALE_META, localePath, swapLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries/en";
import { consultationLoginUrl } from "@/lib/auth/callback";

export default function Navbar({ lang, dict }: { lang: Locale; dict: Dictionary["nav"] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // The translucent state only makes sense floating over the home hero, which
  // is light. On /work and /consultation the page underneath is dark wine, and
  // 40% ivory over it resolves to a mid mauve that swallows the wordmark. Those
  // routes get the solid bar from the first pixel.
  const home = pathname === `/${lang}` || pathname === `/${lang}/`;
  const solid = scrolled || !home;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile panel when a link is chosen.
  function close() {
    setOpen(false);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-500 ${
        solid
          ? "border-ink/10 bg-ivory/85 shadow-[0_8px_30px_-18px_rgba(42,22,30,0.35)] backdrop-blur-xl"
          : "border-transparent bg-ivory/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-[4.5rem] md:px-12">
        {/* Brand. Latin either way — the wordmark is the wordmark. */}
        <Link
          href={localePath(lang, "/")}
          onClick={close}
          className="font-display text-lg tracking-tight text-ink"
        >
          Imene<span className="text-gold"> Adjissi</span>
        </Link>

        {/* Desktop links. Small, letterspaced and uppercase — the same
            register as the section eyebrows, so the bar reads as a caption
            over the page rather than a second heading. */}
        <nav className="hidden items-center gap-8 text-[11px] font-semibold tracking-[0.18em] text-ink-soft uppercase lg:flex">
          {dict.links.map((l) => (
            <Link
              key={l.key}
              href={localePath(lang, l.href)}
              className="transition-colors hover:text-gold-deep"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="hidden items-center gap-1 text-xs font-medium md:flex"
            role="group"
            aria-label={dict.language}
          >
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={swapLocale(pathname, l)}
                hrefLang={l}
                lang={l}
                aria-current={l === lang ? "true" : undefined}
                // Remember the choice so the proxy doesn't send a returning
                // visitor back to their browser's language next time.
                onClick={() => {
                  document.cookie = `locale=${l}; path=/; max-age=31536000; samesite=lax`;
                  close();
                }}
                className={cn(
                  "rounded-full px-2.5 py-1 transition-colors",
                  l === lang ? "bg-ink text-cream" : "text-ink-soft hover:text-ink",
                )}
              >
                {LOCALE_META[l].label}
              </Link>
            ))}
          </div>

          <Link
            href={consultationLoginUrl(lang)}
            onClick={close}
            className="hidden h-10 items-center rounded-full bg-ink px-5 text-[11px] font-semibold tracking-[0.14em] text-cream uppercase transition-colors hover:bg-gold sm:inline-flex"
          >
            {dict.cta}
          </Link>

          {/* Mobile burger. */}
          <button
            type="button"
            aria-label={open ? dict.closeMenu : dict.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink lg:hidden"
          >
            <div className="relative h-3.5 w-4">
              <span
                className={`absolute start-0 top-0 h-0.5 w-full rounded bg-current transition-transform duration-300 ${
                  open ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute start-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-current transition-opacity duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 start-0 h-0.5 w-full rounded bg-current transition-transform duration-300 ${
                  open ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile panel. */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink/10 bg-ivory/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {dict.links.map((l) => (
                <Link
                  key={l.key}
                  href={localePath(lang, l.href)}
                  onClick={close}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-ink transition-colors hover:bg-ink/5"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href={consultationLoginUrl(lang)}
                onClick={close}
                className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-cream"
              >
                {dict.cta}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
