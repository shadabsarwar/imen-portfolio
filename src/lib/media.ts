// Typed access to the generated media manifest.
//
// src/data/media.json is written by scripts/media-build.mjs from the local
// source vault. The JSON is committed; the binaries it points at live in
// public/media, which is gitignored and rsync'd to the host on deploy.
import manifest from "@/data/media.json";

export type VideoCategory = "broadcast" | "dubbing" | "song" | "collabs";
export type AudioCategory = "voice" | "music";

export type Rendition = {
  name: string; // "1080" | "720"
  src: string;
  width: number;
  height: number;
  bytes: number;
};

export type Localized = { en: string; ar: string };

export type VideoItem = {
  slug: string;
  category: VideoCategory;
  title: Localized;
  client: Localized | null;
  role: string | null;
  featured: boolean;
  /** Title/client was inferred from the master, not confirmed by Imene. */
  review: boolean;
  orientation: "portrait" | "landscape";
  duration: number;
  poster: string;
  posterJpg: string;
  preview: string;
  renditions: Rendition[];
  sourceBytes: number;
};

export type AudioItem = {
  slug: string;
  category: AudioCategory;
  title: Localized;
  client: string | null;
  featured: boolean;
  review: boolean;
  duration: number;
  src: string;
  peaks: string;
  bytes: number;
  sourceBytes: number;
};

export type BrandItem = {
  slug: string;
  name: string;
  src: string;
  /** 0 = her own company, 1 = headline client, 2 = everyone else. */
  tier: number;
};

const data = manifest as unknown as {
  generatedAt: string;
  video: VideoItem[];
  audio: AudioItem[];
  brands: BrandItem[];
};

/**
 * Origin serving the heavy media. The binaries are ~690MB and stay out of
 * the repo, so they're hosted separately and referenced absolutely.
 *
 * The default is baked in on purpose: `public/media/` is gitignored, so a
 * deploy that builds straight from the repo (Vercel) has no local copy to
 * fall back on — an unset var would 404 every asset. Override with
 * NEXT_PUBLIC_MEDIA_BASE_URL to point at a different host, or set it to an
 * empty string to serve same-origin from public/media.
 *
 * Read at module scope so Next inlines it at build time — changing it
 * requires a rebuild, not just a restart.
 */
const DEFAULT_MEDIA_BASE = "https://springgreen-rabbit-943290.hostingersite.com";

const MEDIA_BASE = (
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? DEFAULT_MEDIA_BASE
).replace(/\/+$/, "");

const asset = (path: string) => (MEDIA_BASE ? MEDIA_BASE + path : path);

export const allVideos: VideoItem[] = data.video.map((v) => ({
  ...v,
  poster: asset(v.poster),
  posterJpg: asset(v.posterJpg),
  preview: asset(v.preview),
  renditions: v.renditions.map((r) => ({ ...r, src: asset(r.src) })),
}));

export const allAudio: AudioItem[] = data.audio.map((a) => ({
  ...a,
  src: asset(a.src),
  // `peaks` is deliberately NOT rewritten. VoiceSamples fetch()es it, and a
  // cross-origin fetch needs CORS headers the media host does not send. All
  // nine files total 41KB, so they stay in the repo and same-origin.
}));

export const allBrands: BrandItem[] = data.brands.map((b) => ({ ...b, src: asset(b.src) }));

/** Landscape broadcast, commercial and reporting work. */
export const broadcastWork = allVideos.filter((v) => v.category === "broadcast");

/** Vertical social-native work: dubbing, songs, collaborations. */
export const verticalWork = allVideos.filter((v) => v.category !== "broadcast");

export const videosByCategory = (category: VideoCategory) =>
  allVideos.filter((v) => v.category === category);

export const featuredVideos = (list: VideoItem[] = allVideos) =>
  list.filter((v) => v.featured);

export const voiceSamples = allAudio.filter((a) => a.category === "voice");
export const musicSamples = allAudio.filter((a) => a.category === "music");

export const WORK_FILTERS: { id: VideoCategory | "all"; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "broadcast", label: "Broadcast & Commercials" },
  { id: "dubbing", label: "Dubbing" },
  { id: "song", label: "Songs" },
  { id: "collabs", label: "Collaborations" },
];

/**
 * Pick a rendition for the current device. Renditions are ordered
 * highest-first by the build script, so this walks down to the first
 * acceptable rung.
 */
export function pickRendition(item: VideoItem): Rendition {
  const fallback = item.renditions[item.renditions.length - 1] ?? item.renditions[0];
  if (typeof window === "undefined") return fallback;

  type NetworkInfo = { saveData?: boolean; effectiveType?: string };
  const net = (navigator as Navigator & { connection?: NetworkInfo }).connection;
  if (net?.saveData) return fallback;
  if (net?.effectiveType && /^(slow-)?2g$|^3g$/.test(net.effectiveType)) return fallback;

  // A 1080 rung is only worth the bytes on a display that can show it.
  const budget = window.innerWidth * (window.devicePixelRatio || 1);
  const wants1080 = budget >= 1100;
  return (
    item.renditions.find((r) => (wants1080 ? r.name === "1080" : r.name === "720")) ?? fallback
  );
}

/**
 * Rendition a card streams while hovered. Always the lowest rung (720) —
 * a card is at most ~660px wide, so 1080 would only buy bytes, and a
 * hover has to start playing immediately to feel responsive.
 */
export function hoverRendition(item: VideoItem): Rendition {
  return item.renditions[item.renditions.length - 1] ?? item.renditions[0];
}

export function formatDuration(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.round(total % 60);
  return h
    ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    : `${m}:${s.toString().padStart(2, "0")}`;
}
