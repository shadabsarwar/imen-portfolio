// Cleanup pass for the matted PNGs:
//  - keep only the largest connected alpha region (removes stray specks)
//  - crop to that region's bbox (trims empty transparent margins)
// Uses a downscaled alpha mask for fast connected-component labeling.
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const files = [
  "public/imene/imene-hero.png",
  "public/imene/imene-seated-cutout.png",
];

const SMALL_W = 480; // labeling resolution
const ALPHA_T = 24; // foreground alpha threshold
const PAD = 0.01; // 1% padding around bbox

for (const rel of files) {
  const file = path.resolve(root, rel);
  const src = await readFile(file);
  const meta = await sharp(src).metadata();
  const W = meta.width;
  const H = meta.height;
  const sw = SMALL_W;
  const sh = Math.round((H / W) * sw);

  // Downscaled alpha channel, raw single-channel bytes.
  const alpha = await sharp(src)
    .ensureAlpha()
    .resize(sw, sh, { fit: "fill" })
    .extractChannel(3)
    .raw()
    .toBuffer();

  // Connected components (4-neighbour) via iterative flood fill.
  const n = sw * sh;
  const label = new Int32Array(n).fill(-1);
  const stack = new Int32Array(n);
  let best = { count: 0, minX: 0, minY: 0, maxX: 0, maxY: 0 };

  for (let start = 0; start < n; start++) {
    if (label[start] !== -1 || alpha[start] < ALPHA_T) continue;
    let sp = 0;
    stack[sp++] = start;
    label[start] = start;
    let count = 0,
      minX = sw,
      minY = sh,
      maxX = 0,
      maxY = 0;
    while (sp > 0) {
      const p = stack[--sp];
      const x = p % sw;
      const y = (p / sw) | 0;
      count++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      const nb = [
        x > 0 ? p - 1 : -1,
        x < sw - 1 ? p + 1 : -1,
        y > 0 ? p - sw : -1,
        y < sh - 1 ? p + sw : -1,
      ];
      for (const q of nb) {
        if (q >= 0 && label[q] === -1 && alpha[q] >= ALPHA_T) {
          label[q] = start;
          stack[sp++] = q;
        }
      }
    }
    if (count > best.count) best = { count, minX, minY, maxX, maxY };
  }

  // Map small bbox -> full res, add padding, clamp.
  const scaleX = W / sw;
  const scaleY = H / sh;
  const padX = W * PAD;
  const padY = H * PAD;
  let left = Math.max(0, Math.floor(best.minX * scaleX - padX));
  let top = Math.max(0, Math.floor(best.minY * scaleY - padY));
  let right = Math.min(W, Math.ceil((best.maxX + 1) * scaleX + padX));
  let bottom = Math.min(H, Math.ceil((best.maxY + 1) * scaleY + padY));
  const cw = right - left;
  const ch = bottom - top;

  await sharp(src)
    .extract({ left, top, width: cw, height: ch })
    .png()
    .toFile(file + ".tmp.png");

  // Replace original.
  const cleaned = await readFile(file + ".tmp.png");
  await sharp(cleaned).toFile(file);
  const { unlink } = await import("node:fs/promises");
  await unlink(file + ".tmp.png");

  console.log(`✓ ${rel}: cropped to ${cw}x${ch} (kept largest region of ${best.count} px @${sw}px)`);
}

console.log("Done.");
