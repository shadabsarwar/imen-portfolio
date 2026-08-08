// Verify every scroll-reveal completes (no frozen tweens) when landing
// directly on a section via hash — the timing that used to freeze reveals.
import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CHECKS = [
  ["#showreel", ".work-card"],
  ["#services", ".svc-card"],
  ["#voice", ".voice-row"],
  ["#about", ".about-copy > *"],
  ["#achievements", ".ach-card"],
  ["#testimonials", ".tst-card"],
  ["#contact", ".ct-in > *"],
  ["#consultation", ".consult-in > *"],
];

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
let failures = 0;

for (const [hash, sel] of CHECKS) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.goto("http://localhost:3000/" + hash, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(3000);
  const res = await page.evaluate((s) => {
    const els = [...document.querySelectorAll(s)];
    const bad = els.filter((el) => {
      const cs = getComputedStyle(el);
      return parseFloat(cs.opacity) < 0.99 || cs.visibility === "hidden";
    });
    return { total: els.length, stuck: bad.length };
  }, sel);
  const ok = res.total > 0 && res.stuck === 0;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} ${hash} ${sel} — ${res.total} elements, ${res.stuck} stuck`);
  await page.close();
}

// Count-up numbers should reach their targets.
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await page.goto("http://localhost:3000/#achievements", { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(3500);
const nums = await page.evaluate(() =>
  [...document.querySelectorAll(".stat-num")].map((el) => ({
    got: el.innerText,
    want: el.dataset.target,
  })),
);
const numsOk = nums.length > 0 && nums.every((n) => n.got === n.want);
if (!numsOk) failures++;
console.log(`${numsOk ? "PASS" : "FAIL"} stat count-ups — ${JSON.stringify(nums)}`);

await browser.close();
console.log(failures === 0 ? "ALL PASS" : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
