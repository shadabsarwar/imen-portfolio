// Debug: load with a hash (like real nav), inspect .svc-card opacity states.
import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.argv[2] || "http://localhost:3000/#services";
const OUT = (process.env.QA_OUT_DIR || process.cwd()) + "\\qa-svc-debug.png";

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
page.on("console", (m) => {
  if (m.type() === "error") console.log("[console.error]", m.text());
});
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
await page.goto(URL, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(3500);

const info = await page.evaluate(() => {
  const cards = [...document.querySelectorAll(".svc-card")];
  return {
    scrollY: Math.round(window.scrollY),
    gridTop: Math.round(
      document.querySelector(".svc-grid")?.getBoundingClientRect().top ?? -1,
    ),
    cards: cards.map((c) => {
      const cs = getComputedStyle(c);
      return { opacity: cs.opacity, visibility: cs.visibility };
    }),
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: OUT });
console.log("Screenshot:", OUT);
await browser.close();
