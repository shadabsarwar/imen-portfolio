import { redirect } from "next/navigation";
import AuthPanel from "@/components/auth/AuthPanel";
import { getDictionary } from "@/dictionaries";
import { getCurrentUser } from "@/lib/auth/dal";
import { safeCallbackUrl } from "@/lib/auth/callback";
import { isLocale } from "@/lib/i18n";

export default async function LoginPage({
  params,
  searchParams,
}: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!isLocale(lang)) redirect("/en/login");
  const query = await searchParams;
  const callbackUrl = safeCallbackUrl(query.callbackUrl, lang);
  if (await getCurrentUser()) redirect(callbackUrl);

  const dict = (await getDictionary(lang)).auth;
  return (
    <main className="min-h-screen bg-cream px-6 pb-20 pt-28 md:pt-36">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <section>
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-gold-deep uppercase"><span className="h-px w-8 bg-gold/60" />{dict.eyebrow}</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-none tracking-[-0.02em] text-ink">{dict.title}</h1>
          <p className="mt-5 max-w-md leading-relaxed text-ink-soft">{dict.description}</p>
          <p className="mt-6 text-sm text-ink-soft/75">{dict.securityNote}</p>
        </section>
        <AuthPanel lang={lang} callbackUrl={callbackUrl} dict={dict} />
      </div>
    </main>
  );
}
