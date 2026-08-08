"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef } from "react";
import type Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide buttery smooth scroll (Lenis) kept in sync with GSAP ScrollTrigger.
 * Lenis is driven from GSAP's ticker (single rAF loop, autoRaf off) so scroll
 * position and scroll-linked tweens update in the same frame — two competing
 * loops cause visible jitter. lagSmoothing(0) stops GSAP from pausing after a
 * dropped frame and then "catching up" with a jump.
 *
 * The instance is resolved lazily inside the ticker callback: ReactLenis
 * stores it in state, so the ref is still empty when this effect first runs.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    let attached: Lenis | null = null;
    const update = (time: number) => {
      const lenis = lenisRef.current?.lenis ?? null;
      if (lenis !== attached) {
        attached?.off("scroll", ScrollTrigger.update);
        lenis?.on("scroll", ScrollTrigger.update);
        attached = lenis;
      }
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      attached?.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33); // restore GSAP default
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ lerp: 0.1, smoothWheel: true, autoRaf: false }}
    >
      {children}
    </ReactLenis>
  );
}
