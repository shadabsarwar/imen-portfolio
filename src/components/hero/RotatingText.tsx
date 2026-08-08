"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const isArabic = (s: string) => /[؀-ۿ]/.test(s);

/**
 * Cycles through a list of words with a soft vertical blur transition.
 * Detects Arabic entries and switches font + direction automatically.
 */
export default function RotatingText({
  items,
  interval = 2400,
  className = "",
}: {
  items: readonly string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || items.length <= 1) return;
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % items.length),
      interval,
    );
    return () => clearInterval(id);
  }, [items.length, interval, reduce]);

  const current = items[index];

  return (
    <span className={`relative inline-grid ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={reduce ? false : { y: "0.55em", opacity: 0, filter: "blur(5px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={reduce ? undefined : { y: "-0.55em", opacity: 0, filter: "blur(5px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          dir={isArabic(current) ? "rtl" : "ltr"}
          className={`col-start-1 row-start-1 whitespace-nowrap ${
            isArabic(current) ? "font-arabic" : ""
          }`}
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
