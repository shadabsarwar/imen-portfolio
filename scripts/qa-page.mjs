// Headless QA: full-page screenshot of any route. Usage: node scripts/qa-page.mjs /voice-over [mobile]
import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PATHNAME = process.argv[2] || "/";
const SCRATCH = process.env.QA_OUT_DIR || process.cwd();
const slug = PATHNAME === "/" ? "home" : PATHNAME.replace(/[/#]/g, "-").replace(/^-/, "");
const OUT = SCRATCH + "\\qa-page-" + slug + ".png";

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const isMobile = process.argv.includes("mobile");
const page = await browser.newPage({
  viewport: isMobile ? { width: 390, height: 844 } : { width: 1366, height: 768 },
  isMobile,
  hasTouch: isMobile,
});
await page.goto("http://localhost:3000" + PATHNAME, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(2200);

await page.screenshot({ path: OUT, fullPage: true });
console.log("Screenshot:", OUT);
await browser.close();
