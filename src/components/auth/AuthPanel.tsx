"use client";

import { useActionState, useState } from "react";
import type { Dictionary } from "@/dictionaries/en";
import type { Locale } from "@/lib/i18n";
import { googleAction, loginAction, registerAction } from "@/app/[lang]/login/actions";

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25";

export default function AuthPanel({
  lang,
  callbackUrl,
  dict,
}: {
  lang: Locale;
  callbackUrl: string;
  dict: Dictionary["auth"];
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, login, loginPending] = useActionState(loginAction, undefined);
  const [registerState, register, registerPending] = useActionState(registerAction, undefined);
  const state = mode === "login" ? loginState : registerState;
  const pending = loginPending || registerPending;

  return (
    <div className="rounded-[2rem] border border-camel/40 bg-ivory p-6 shadow-[0_30px_80px_-45px_rgba(42,22,30,0.45)] md:p-9">
      <div className="grid grid-cols-2 rounded-full bg-cream p-1 text-sm">
        <button type="button" onClick={() => setMode("login")} className={`rounded-full px-4 py-2.5 transition ${mode === "login" ? "bg-ink text-cream" : "text-ink-soft"}`}>
          {dict.tabs.login}
        </button>
        <button type="button" onClick={() => setMode("register")} className={`rounded-full px-4 py-2.5 transition ${mode === "register" ? "bg-ink text-cream" : "text-ink-soft"}`}>
          {dict.tabs.register}
        </button>
      </div>

      <form action={googleAction} className="mt-6">
        <input type="hidden" name="lang" value={lang} />
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <button type="submit" className="flex h-12 w-full items-center justify-center rounded-full border border-ink/15 bg-white text-sm font-medium text-ink transition hover:border-gold">
          {dict.google}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-ink-soft/60">
        <span className="h-px flex-1 bg-ink/10" />{dict.or}<span className="h-px flex-1 bg-ink/10" />
      </div>

      <form action={mode === "login" ? login : register} className="space-y-4">
        <input type="hidden" name="lang" value={lang} />
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        {mode === "register" && (
          <>
            <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">
              {dict.name}
              <input name="name" autoComplete="name" required className={`${inputClass} mt-1.5`} />
            </label>
            <fieldset>
              <legend className="text-xs font-semibold tracking-wide text-ink-soft uppercase">{dict.role}</legend>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {(["STUDENT", "DEVELOPER"] as const).map((role, index) => (
                  <label key={role} className="cursor-pointer rounded-xl border border-ink/15 bg-white p-3 text-sm text-ink has-[:checked]:border-gold has-[:checked]:bg-gold/10">
                    <input type="radio" name="role" value={role} defaultChecked={index === 0} className="me-2 accent-[var(--color-gold)]" />
                    {dict.roles[role]}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}

        <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">
          {dict.email}
          <input name="email" type="email" autoComplete="email" required className={`${inputClass} mt-1.5`} />
        </label>
        <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">
          {dict.password}
          <input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={10} required className={`${inputClass} mt-1.5`} />
          {mode === "register" && <span className="mt-1.5 block text-[11px] font-normal normal-case tracking-normal text-ink-soft/70">{dict.passwordHint}</span>}
        </label>

        {state?.error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{dict.errors[state.error]}</p>
        )}

        <button disabled={pending} type="submit" className="h-12 w-full rounded-full bg-gold px-6 text-sm font-semibold text-ink transition hover:bg-ink hover:text-cream disabled:cursor-wait disabled:opacity-60">
          {pending ? dict.loading : mode === "login" ? dict.submitLogin : dict.submitRegister}
        </button>
      </form>

      <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-5 w-full text-center text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline">
        {mode === "login" ? dict.switchToRegister : dict.switchToLogin}
      </button>
    </div>
  );
}
