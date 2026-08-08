"use client";

import { useState } from "react";
import { contact } from "@/lib/site";

export type ServiceField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select" | "date" | "url";
  options?: string[];
  placeholder?: string;
  required?: boolean;
  /** Span the full row on md+ (textareas always do). */
  full?: boolean;
  hint?: string;
};

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";
const labelCls =
  "mb-1.5 block text-xs font-semibold tracking-wide text-ink-soft uppercase";

/**
 * Config-driven request form for service pages. Same flow as the
 * consultation BookingForm: until Phase-2 backend/payments land,
 * submitting opens a prefilled WhatsApp message to Imene.
 */
export default function ServiceForm({
  title,
  note,
  waIntro,
  emailSubject,
  fields,
  submitLabel = "Send via WhatsApp",
}: {
  title: string;
  note: string;
  waIntro: string;
  emailSubject: string;
  fields: ServiceField[];
  submitLabel?: string;
}) {
  const [name, setName] = useState("");
  const [reach, setReach] = useState("");
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((f) => [
        f.key,
        f.type === "select" && f.options ? f.options[0] : "",
      ]),
    ),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function set(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Please enter your name.";
    if (!reach.trim()) errs.reach = "WhatsApp number or email required.";
    for (const f of fields) {
      if (f.required && !values[f.key]?.trim())
        errs[f.key] = "This field is required.";
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const msg = [
      waIntro,
      `Name: ${name}`,
      `Contact: ${reach}`,
      ...fields.map((f) => {
        const v = values[f.key]?.trim();
        return v ? `${f.label}: ${v}` : null;
      }),
      "(sent from the website)",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-[2rem] border border-camel/40 bg-ivory p-6 md:p-10"
    >
      <h2 className="font-display text-2xl font-light text-ink">{title}</h2>
      <p className="mt-2 text-sm text-ink-soft">{note}</p>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="sf-name" className={labelCls}>
            Full name *
          </label>
          <input
            id="sf-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputCls}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-700">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="sf-reach" className={labelCls}>
            WhatsApp or email *
          </label>
          <input
            id="sf-reach"
            type="text"
            value={reach}
            onChange={(e) => setReach(e.target.value)}
            placeholder="+213 … or you@email.com"
            className={inputCls}
          />
          {errors.reach && (
            <p className="mt-1.5 text-xs text-red-700">{errors.reach}</p>
          )}
        </div>

        {fields.map((f) => {
          const id = `sf-${f.key}`;
          const label = f.required ? `${f.label} *` : f.label;
          const fullRow = f.type === "textarea" || f.full;
          return (
            <div key={f.key} className={fullRow ? "md:col-span-2" : undefined}>
              <label htmlFor={id} className={labelCls}>
                {label}
              </label>
              {f.type === "select" ? (
                <select
                  id={id}
                  value={values[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  className={inputCls}
                >
                  {(f.options ?? []).map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea
                  id={id}
                  rows={4}
                  value={values[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={inputCls}
                />
              ) : (
                <input
                  id={id}
                  type={f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
                  value={values[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={inputCls}
                />
              )}
              {f.hint && (
                <p className="mt-1.5 text-xs text-ink-soft/70">{f.hint}</p>
              )}
              {errors[f.key] && (
                <p className="mt-1.5 text-xs text-red-700">{errors[f.key]}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-8 text-sm font-medium text-cream transition-colors duration-300 hover:bg-gold"
        >
          {submitLabel}
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </button>
        <a
          href={`mailto:${contact.email}?subject=${encodeURIComponent(emailSubject)}`}
          className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          Prefer email instead?
        </a>
      </div>

      {sent && (
        <p className="mt-5 rounded-xl bg-gold/15 px-4 py-3 text-sm text-ink">
          ✓ Your request is drafted in WhatsApp — hit send there and Imene will
          get back to you.
        </p>
      )}
    </form>
  );
}
