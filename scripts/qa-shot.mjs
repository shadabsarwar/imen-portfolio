// Headless QA: measure the Selected Work section's computed styles + screenshot it.
import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SELECTOR = process.argv[2] || "#showreel";
const SCRATCH =
  "C:\\Users\\user\\AppData\\Local\\Temp\\claude\\c--Users-user-OneDrive-Desktop-work-Imen-port\\fbbeabe9-e5c0-4c67-b8bc-6e63b56924df\\scratchpad\\";
const OUT = SCRATCH + "qa-" + SELECTOR.replace("#", "") + ".png";

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
// Emulate a laptop by default, or a phone when "mobile" is passed.
const isMobile = process.argv.includes("mobile");
const page = await browser.newPage({
  viewport: isMobile ? { width: 390, height: 844 } : { width: 1366, height: 768 },
  isMobile,
  hasTouch: isMobile,
});
await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 60000 });

await page.evaluate((sel) =>
  document.querySelector(sel)?.scrollIntoView({ behavior: "instant", block: "start" }),
  SELECTOR,
);
await page.waitForTimeout(2600);

const info = await page.evaluate((sel) => {
  const sec = document.querySelector(sel);
  const secCs = sec ? getComputedStyle(sec) : null;
  return {
    selector: sel,
    sectionBg: secCs?.backgroundColor,
    color: secCs?.color,
    workCards: sec ? sec.querySelectorAll(".work-card").length : 0,
    voiceRows: sec ? sec.querySelectorAll(".voice-row").length : 0,
    waveCanvases: sec ? sec.querySelectorAll("canvas").length : 0,
  };
}, SELECTOR);

console.log(JSON.stringify(info, null, 2));

const sec = await page.$(SELECTOR);
await sec.screenshot({ path: OUT });
// Viewport screenshot (what actually fits on a laptop screen).
const OUT_VP = OUT.replace(".png", "-viewport.png");
await page.screenshot({ path: OUT_VP });
console.log("Screenshot:", OUT);
console.log("Viewport:", OUT_VP);

if (process.argv.includes("click")) {
  await page.click(SELECTOR + " .work-card");
  await page.waitForTimeout(1200);
  const OUT_LB = OUT.replace(".png", "-lightbox.png");
  await page.screenshot({ path: OUT_LB });
  console.log("Lightbox:", OUT_LB);
}

await browser.close();
