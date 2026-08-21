import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { safeCallbackUrl } from "@/lib/auth/callback";
import type { AppRole } from "@/lib/auth/roles";
import type { Locale } from "@/lib/i18n";

export const verifySession = cache(async () => auth());

export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  return session?.user ?? null;
});

export async function requireAuth(lang: Locale, callbackUrl: string) {
  const user = await getCurrentUser();
  if (!user) {
    const safe = safeCallbackUrl(callbackUrl, lang);
    redirect(`/${lang}/login?callbackUrl=${encodeURIComponent(safe)}`);
  }
  return user;
}

export async function requireRole(lang: Locale, roles: readonly AppRole[], callbackUrl: string) {
  const user = await requireAuth(lang, callbackUrl);
  if (!roles.includes(user.role)) redirect(`/${lang}/login?error=unauthorized`);
  return user;
}
