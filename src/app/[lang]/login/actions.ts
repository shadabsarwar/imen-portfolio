"use server";

import { hash } from "argon2";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { safeCallbackUrl } from "@/lib/auth/callback";
import { loginSchema, registrationSchema } from "@/lib/auth/validation";
import { isLocale, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export type AuthActionState = { error?: "invalid" | "exists" | "server" } | undefined;

function formContext(formData: FormData) {
  const value = formData.get("lang");
  const lang: Locale = typeof value === "string" && isLocale(value) ? value : "en";
  return { lang, callbackUrl: safeCallbackUrl(formData.get("callbackUrl"), lang) };
}

export async function loginAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "invalid" };

  const { callbackUrl } = formContext(formData);
  try {
    await signIn("credentials", { ...parsed.data, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) return { error: "invalid" };
    throw error;
  }
}

export async function registerAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registrationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: "invalid" };

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "exists" };

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: await hash(parsed.data.password),
        role: parsed.data.role,
      },
    });
  } catch {
    return { error: "server" };
  }

  const { callbackUrl } = formContext(formData);
  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: callbackUrl,
  });
}

export async function googleAction(formData: FormData) {
  const { callbackUrl } = formContext(formData);
  await signIn("google", { redirectTo: callbackUrl });
}

export async function leaveLogin(lang: Locale, callbackUrl: string) {
  redirect(safeCallbackUrl(callbackUrl, lang));
}
