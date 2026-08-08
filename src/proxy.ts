import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/i18n";

/**
 * Locale routing.
 *
 * Every route lives under /[lang], so a bare "/work" has to become
 * "/en/work" or "/ar/work" before it can render. This reads the browser's
 * Accept-Language once and redirects.
 *
 * Next 16 renamed the `middleware` file convention to `proxy` — the old name
 * still resolves but is deprecated, and the exported function is `proxy`,
 * not `middleware`.
 */

/**
 * Pick a locale from Accept-Language without pulling in Negotiator and
 * intl-localematcher. Two locales and a default doesn't justify two
 * dependencies: take the highest-weighted tag whose base language we serve.
 */
function detectLocale(header: string | null) {
  if (!header) return DEFAULT_LOCALE;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { base: tag.trim().toLowerCase().split("-")[0], q: q ? Number(q.split("=")[1]) : 1 };
    })
    .filter((x) => !Number.isNaN(x.q))
    .sort((a, b) => b.q - a.q);

  return ranked.find((x) => isLocale(x.base))?.base ?? DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;

  // A returning visitor's choice outranks their browser header — the switcher
  // writes this cookie so picking Arabic once survives the next visit.
  const saved = request.cookies.get("locale")?.value;
  const locale =
    saved && isLocale(saved) ? saved : detectLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next's internals and anything with a file extension
  // (favicon.ico, the peaks JSON the voice panel fetches, og images…).
  matcher: ["/((?!_next|api|.*\\.).*)"],
};
