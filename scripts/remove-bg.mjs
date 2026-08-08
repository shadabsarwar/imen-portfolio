// One-off asset prep: local ML background removal (no third-party upload).
// Usage: node scripts/remove-bg.mjs
import { removeBackground } from "@imgly/background-removal-node";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve everything relative to the project root, independent of CWD.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const jobs = [
  { in: "public/imene/imene-standing.jpg", out: "public/imene/imene-hero.png" },
  { in: "public/imene/imene-seated.jpg", out: "public/imene/imene-seated-cutout.png" },
];

// "medium" is the largest model bundled offline; good edges for fabric.
const config = {
  model: "medium",
  output: { format: "image/png", quality: 0.95 },
};

for (const job of jobs) {
  const inputPath = path.resolve(root, job.in);
  const outputPath = path.resolve(root, job.out);
  console.log(`\n→ Removing background: ${job.in}`);
  const bytes = new Uint8Array(await readFile(inputPath));
  const inputBlob = new Blob([bytes], { type: "image/jpeg" });
  const blob = await removeBackground(inputBlob, config);
  const buffer = Buffer.from(await blob.arrayBuffer());
  await writeFile(outputPath, buffer);
  console.log(`✓ Wrote ${job.out} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

console.log("\nDone.");
