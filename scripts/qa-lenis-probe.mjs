// Probe Lenis state: html classes, wheel response over time.
import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
page.on("console", (m) => console.log("[console]", m.type(), m.text()));
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(1500);

console.log("html class:", await page.evaluate(() => document.documentElement.className));

await page.mouse.move(683, 400);
await page.mouse.wheel(0, 800);
for (let i = 0; i < 6; i++) {
  await page.waitForTimeout(400);
  const s = await page.evaluate(() => ({
    y: Math.round(window.scrollY),
    cls: document.documentElement.className,
  }));
  console.log(`t=${(i + 1) * 400}ms`, JSON.stringify(s));
}

await browser.close();
