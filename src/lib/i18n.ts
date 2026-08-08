/**
 * Locale configuration.
 *
 * Two locales, not three. The media manifest stores titles as `{ en, ar }` —
 * all 34 films and audio samples have English and Arabic and no French, so a
 * French route would show English titles on every piece of work. The FR
 * button stays hidden until that copy exists; adding it later means adding
 * "fr" here, a `fr` dictionary, and an `fr` title on every manifest entry.
 */
export const LOCALES = ["en", "ar"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_META: Record<Locale, { label: string; name: string }> = {
  en: { label: "EN", name: "English" },
  ar: { label: "AR", name: "العربية" },
};

/** Locales the switcher shows but cannot route to yet. */
export const PENDING_LOCALES = [] as const;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Layout direction — always LTR, including Arabic.
 *
 * Arabic is normally RTL and `dir="rtl"` would be the textbook answer, but
 * that mirrors the whole composition: the portrait crosses the hero, the nav
 * flips, the rail jumps to the left edge, the reel scrolls the other way.
 * The design is deliberately asymmetric and holding it fixed across both
 * languages is a product decision, not an oversight.
 *
 * `lang` still switches, which is what drives the Cairo font swap, screen
 * reader pronunciation and hreflang. Only the box layout is pinned.
 */
export function dirOf(): "ltr" {
  return "ltr";
}

/**
 * Prefix an app-relative href with the active locale.
 *
 * Every route lives under /[lang], so a bare "/work" would 404. Hash-only
 * links ("#voice") are left alone — they resolve against the current page.
 */
export function localePath(locale: Locale, href: string): string {
  if (!href.startsWith("/")) return href;
  const [path, hash] = href.split("#");
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  return `/${locale}${clean}${hash ? `#${hash}` : ""}`;
}

/**
 * Swap the locale on the current pathname, keeping the rest of the route.
 * Used by the switcher so changing language holds your place in the site.
 */
export function swapLocale(pathname: string, next: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && isLocale(parts[0])) parts[0] = next;
  else parts.unshift(next);
  return `/${parts.join("/")}`;
}
