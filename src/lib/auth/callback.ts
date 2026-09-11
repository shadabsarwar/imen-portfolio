import { isLocale, type Locale } from "@/lib/i18n";

/** Only permit a local, locale-prefixed path as an authentication destination. */
export function safeCallbackUrl(value: unknown, fallbackLocale: Locale): string {
  const fallback = `/${fallbackLocale}/consultation`;
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(value, "http://local.invalid");
    const locale = url.pathname.split("/").filter(Boolean)[0];
    if (url.origin !== "http://local.invalid" || !locale || !isLocale(locale)) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function consultationLoginUrl(lang: Locale): string {
  const destination = `/${lang}/consultation`;
  return `/${lang}/login?callbackUrl=${encodeURIComponent(destination)}`;
}
