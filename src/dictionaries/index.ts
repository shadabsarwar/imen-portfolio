import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "./en";

/**
 * Dictionaries load via dynamic import, so a prerendered page only pulls in
 * the locale it renders rather than both.
 *
 * Call this from server components only and pass the slices a client
 * component needs down as props — importing it into a client component would
 * drag every string of both languages into the browser bundle.
 */
const loaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  en: () => import("./en"),
  ar: () => import("./ar"),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return (await loaders[locale]()).default;
}

export type { Dictionary };
