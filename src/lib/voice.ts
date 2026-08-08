// Voice-over samples for the home page. Will move to Payload CMS later.
export type VoiceSample = {
  id: number;
  src: string;
  duration: number; // seconds
  title: string;
  tags: string[]; // e.g. [language, style] — demo values for now
};

// NOTE: titles/tags below are placeholders for the demo — swap for the real ones.
export const voiceSamples: VoiceSample[] = [
  { id: 1, src: "/audio/voice-1.mp3", duration: 63, title: "Brand Commercial", tags: ["Arabic", "Commercial"] },
  { id: 2, src: "/audio/voice-2.mp3", duration: 35, title: "Documentary Narration", tags: ["French", "Narration"] },
  { id: 3, src: "/audio/voice-3.mp3", duration: 79, title: "Corporate Explainer", tags: ["English", "Corporate"] },
  { id: 4, src: "/audio/voice-4.mp3", duration: 79, title: "Character Dubbing", tags: ["Arabic", "Dubbing"] },
  { id: 5, src: "/audio/voice-5.mp3", duration: 39, title: "Radio Promo", tags: ["English", "Imaging"] },
];

export function formatTime(total: number): string {
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
