"use client";

import { useState } from "react";
import { contact } from "@/lib/site";

type Fields = {
  name: string;
  reach: string;
  area: string;
  level: string;
  length: string;
  date: string;
  time: string;
  goal: string;
};

const initial: Fields = {
  name: "",
  reach: "",
  area: "Voice-over career",
  level: "Beginner",
  length: "60 minutes",
  date: "",
  time: "",
  goal: "",
};

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";
const labelCls = "mb-1.5 block text-xs font-semibold tracking-wide text-ink-soft uppercase";

/**
 * Booking request form. Until online payments/booking land (Phase 2),
 * submissions open a prefilled WhatsApp message to Imene to confirm the slot.
 */
export default function BookingForm() {
  const [f, setF] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sent, setSent] = useState(false);

  function set<K extends keyof Fields>(key: K, value: string) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Partial<Record<keyof Fields, string>> = {};
    if (!f.name.trim()) errs.name = "Please enter your name.";
    if (!f.reach.trim()) errs.reach = "WhatsApp number or email required.";
    if (!f.goal.trim()) errs.goal = "Tell me briefly what you want from the session.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const msg = [
      "Hello Imene 👋 I'd like to book a 1:1 consultation.",
      `Name: ${f.name}`,
      `Contact: ${f.reach}`,
      `Area: ${f.area}`,
      `Experience level: ${f.level}`,
      `Session: ${f.length}`,
      f.date && `Preferred date: ${f.date}`,
      f.time && `Preferred time: ${f.time}`,
      `Goal: ${f.goal}`,
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
      <h2 className="font-display text-2xl font-light text-ink">
        Request your session
      </h2>
      <p className="mt-2 text-sm text-ink-soft">
        Fill this in and it opens a prefilled WhatsApp message — Imene confirms
        your slot and payment details there. Online booking & payment are
        coming soon.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="bk-name" className={labelCls}>
            Full name *
          </label>
          <input
            id="bk-name"
            type="text"
            value={f.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your name"
            className={inputCls}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-700">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="bk-reach" className={labelCls}>
            WhatsApp or email *
          </label>
          <input
            id="bk-reach"
            type="text"
            value={f.reach}
            onChange={(e) => set("reach", e.target.value)}
            placeholder="+213 … or you@email.com"
            className={inputCls}
          />
          {errors.reach && (
            <p className="mt-1.5 text-xs text-red-700">{errors.reach}</p>
          )}
        </div>

        <div>
          <label htmlFor="bk-area" className={labelCls}>
            Area of interest
          </label>
          <select
            id="bk-area"
            value={f.area}
            onChange={(e) => set("area", e.target.value)}
            className={inputCls}
          >
            {[
              "Voice-over career",
              "Content creation",
              "Personal branding",
              "TV & presenting",
              "Dubbing",
              "Other",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="bk-level" className={labelCls}>
            Experience level
          </label>
          <select
            id="bk-level"
            value={f.level}
            onChange={(e) => set("level", e.target.value)}
            className={inputCls}
          >
            {["Beginner", "Intermediate", "Professional"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="bk-length" className={labelCls}>
            Session length
          </label>
          <select
            id="bk-length"
            value={f.length}
            onChange={(e) => set("length", e.target.value)}
            className={inputCls}
          >
            {["30 minutes", "60 minutes"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="bk-date" className={labelCls}>
              Preferred date
            </label>
            <input
              id="bk-date"
              type="date"
              value={f.date}
              onChange={(e) => set("date", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="bk-time" className={labelCls}>
              Preferred time
            </label>
            <input
              id="bk-time"
              type="time"
              value={f.time}
              onChange={(e) => set("time", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="bk-goal" className={labelCls}>
            What do you want from this session? *
          </label>
          <textarea
            id="bk-goal"
            rows={4}
            value={f.goal}
            onChange={(e) => set("goal", e.target.value)}
            placeholder="Your goals, questions, or the project you need guidance on…"
            className={inputCls}
          />
          {errors.goal && (
            <p className="mt-1.5 text-xs text-red-700">{errors.goal}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-8 text-sm font-medium text-cream transition-colors duration-300 hover:bg-gold"
        >
          Send via WhatsApp
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
        <a
          href={`mailto:${contact.email}?subject=${encodeURIComponent("Consultation request")}`}
          className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          Prefer email instead?
        </a>
      </div>

      {sent && (
        <p className="mt-5 rounded-xl bg-gold/15 px-4 py-3 text-sm text-ink">
          ✓ Your request is drafted in WhatsApp — hit send there and Imene will
          confirm your slot.
        </p>
      )}
    </form>
  );
}
