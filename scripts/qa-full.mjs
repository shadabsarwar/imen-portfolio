// Full-site QA: computed-style spot checks + screenshots for / and /consultation.
import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH =
  "C:\\Users\\user\\AppData\\Local\\Temp\\claude\\c--Users-user-OneDrive-Desktop-work-Imen-port\\fbbeabe9-e5c0-4c67-b8bc-6e63b56924df\\scratchpad\\";

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 90000 });
await page.waitForTimeout(2500);

const home = await page.evaluate(() => {
  const cs = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      bg: s.backgroundColor,
      blur: s.backdropFilter || s.webkitBackdropFilter || "",
      radius: s.borderRadius,
    };
  };
  return {
    navbar: cs("header.fixed"),
    consultBox: cs("#consultation > div"),
    about: cs("#about"),
    achievements: cs("#achievements"),
    services: cs("#services"),
    brands: cs("#brands"),
    testimonials: cs("#testimonials"),
    contactBox: cs("#contact > div"),
    footer: cs("footer"),
    marqueeAnim: (() => {
      const el = document.querySelector(".animate-marquee");
      return el ? getComputedStyle(el).animationName : null;
    })(),
    statNums: [...document.querySelectorAll(".stat-num")].map((n) => n.dataset.target),
    svcCards: document.querySelectorAll(".svc-card").length,
  };
});
console.log("HOME:", JSON.stringify(home, null, 2));

// Full-page screenshot (scroll through first so lazy/GSAP content settles).
await page.evaluate(async () => {
  await new Promise((res) => {
    let y = 0;
    const step = () => {
      y += 600;
      window.scrollTo(0, y);
      if (y < document.body.scrollHeight) setTimeout(step, 120);
      else res(null);
    };
    step();
  });
});
await page.waitForTimeout(1500);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: SCRATCH + "qa-home-full.png", fullPage: true });
console.log("home full-page saved");

// Consultation page.
const resp = await page.goto("http://localhost:3000/consultation", {
  waitUntil: "load",
  timeout: 90000,
});
await page.waitForTimeout(1500);
console.log("CONSULTATION status:", resp.status());
const consult = await page.evaluate(() => ({
  h1: document.querySelector("h1")?.textContent,
  planCards: document.querySelectorAll("main .grid > div .font-display").length,
  formInputs: document.querySelectorAll("form input, form select, form textarea").length,
}));
console.log("CONSULTATION:", JSON.stringify(consult));
await page.screenshot({ path: SCRATCH + "qa-consultation.png", fullPage: true });
console.log("consultation full-page saved");

await browser.close();
