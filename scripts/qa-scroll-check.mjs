// Verify Lenis-driven scrolling works (autoRaf:false + gsap.ticker) and the
// mobile reel path reveals the container without per-card staggers.
import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
let failures = 0;

// 1. Desktop: wheel scrolling must actually move the page (Lenis raf driven).
{
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1500);
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1200);
  const y = await page.evaluate(() => Math.round(window.scrollY));
  const ok = y > 800;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} desktop wheel scroll — scrollY=${y}`);
  await page.close();
}

// 2. Mobile: reel container fades in fully, no stuck per-card animation.
{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await page.goto("http://localhost:3000/#showreel", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(3000);
  const res = await page.evaluate(() => {
    const reel = document.querySelector(".no-scrollbar.flex.snap-x");
    const cards = [...document.querySelectorAll(".work-card")];
    return {
      reelOpacity: reel ? getComputedStyle(reel).opacity : "missing",
      cards: cards.length,
      cardsStuck: cards.filter((c) => parseFloat(getComputedStyle(c).opacity) < 0.99).length,
    };
  });
  const ok = res.reelOpacity === "1" && res.cards === 8 && res.cardsStuck === 0;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} mobile reel — ${JSON.stringify(res)}`);
  await page.close();
}

await browser.close();
console.log(failures === 0 ? "ALL PASS" : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
