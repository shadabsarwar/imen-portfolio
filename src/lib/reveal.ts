import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Refresh-proof scroll reveal.
 *
 * A tween bound via `scrollTrigger:` is reverted + killed by any
 * `ScrollTrigger.refresh()` (window load event, resize, …) that lands
 * while it plays, freezing elements half-hidden — sections looked
 * blank or cropped on first load. Instead: hide with `gsap.set`, then
 * play a plain tween from `onEnter` — refresh can't touch tweens it
 * doesn't own. Call inside a `useGSAP` block.
 */
export function revealOnScroll({
  targets,
  trigger,
  start = "top 80%",
  y = 24,
  stagger = 0,
  duration = 0.7,
  ease = "power3.out",
}: {
  targets: gsap.DOMTarget;
  trigger?: gsap.DOMTarget | null;
  start?: string;
  y?: number;
  stagger?: number;
  duration?: number;
  ease?: string;
}) {
  gsap.set(targets, { y, autoAlpha: 0 });
  ScrollTrigger.create({
    trigger: (trigger ?? targets) as gsap.DOMTarget,
    start,
    once: true,
    onEnter: () =>
      gsap.to(targets, {
        y: 0,
        autoAlpha: 1,
        stagger,
        duration,
        ease,
        overwrite: true,
      }),
  });
}
