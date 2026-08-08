// Shared site data (from Imene's CV). Moves to Payload CMS later.
export const contact = {
  email: "Kreana.agency@gmail.com",
  phoneDisplay: "+213 559 214 081",
  whatsapp: "213559214081", // wa.me format
  location: "Bordj Bou Arreridj, Algeria",
  instagram: "https://www.instagram.com/imen_adjissi",
};

export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Voice", href: "/#voice" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/#contact" },
];

export type Service = {
  slug: string;
  title: string;
  blurb: string;
  tags?: string[];
  href: string;
  cta: string;
  soon?: boolean;
  icon: "chat" | "mic" | "clapper" | "megaphone" | "cap" | "bag";
};

export const services: Service[] = [
  {
    slug: "consultation",
    title: "Consultation",
    blurb:
      "Paid 1:1 sessions on voice-over, presenting, content and personal branding — clear, practical guidance you can act on right away.",
    tags: ["AR · FR · EN", "Video call"],
    href: "/consultation",
    cta: "Book now",
    icon: "chat",
  },
  {
    slug: "voice-over",
    title: "Voice Over",
    blurb:
      "Commercials, narration, dubbing and ads — delivered in Arabic, French and English with fluency, warmth and broadcast-ready quality.",
    tags: ["Commercial", "Narration", "Dubbing"],
    href: "/voice-over",
    cta: "Request a quote",
    icon: "mic",
  },
  {
    slug: "video-production",
    title: "Video Production",
    blurb:
      "From concept and scriptwriting to filming and the final edit — full productions handled end-to-end with Kreana Production.",
    tags: ["Concept", "Script", "Edit"],
    href: "/video-production",
    cta: "Start a project",
    icon: "clapper",
  },
  {
    slug: "brand-promotion",
    title: "Brand Promotion",
    blurb:
      "Sponsored collaborations and product features across my social platforms, crafted to speak in your brand's voice to an engaged audience.",
    tags: ["Reels", "Stories", "Campaigns"],
    href: "/brand-promotion",
    cta: "Collaborate",
    icon: "megaphone",
  },
  {
    slug: "courses",
    title: "Courses",
    blurb:
      "Learn voice-over, presenting and content creation — structured, practical lessons from a working professional, taught in Arabic.",
    tags: ["Self-paced", "Arabic"],
    href: "/courses",
    cta: "Join the waitlist",
    soon: true,
    icon: "cap",
  },
  {
    slug: "store",
    title: "Store",
    blurb:
      "Digital products, templates and creator resources to help you sharpen your own voice, content and brand.",
    tags: ["Digital goods"],
    href: "/store",
    cta: "Preview the store",
    soon: true,
    icon: "bag",
  },
];

// Clients named on the CV that have no logo file in the media vault yet.
// Everything with a logo comes from src/data/media.json instead — see the
// `brands` section of scripts/media-map.json.
export const clientsWithoutLogos = [
  "Nasheedio — Dubai",
  "INDIGITAL",
  "SEQAA — Türkiye",
  "Creativity Media",
];

// Stats. The brand count is now real — 31 logos in the media vault plus the
// four CV clients above. "Projects delivered" is still an unverified estimate
// and needs confirming with Imene.
export const stats = [
  { value: 7, suffix: "+", label: "Years of experience" },
  { value: 3, suffix: "", label: "Languages — AR · FR · EN" },
  { value: 35, suffix: "+", label: "Brands & platforms" },
  { value: 200, suffix: "+", label: "Projects delivered" },
];

// Milestones (real, from the CV).
export const milestones = [
  { year: "2025", title: "Reporter — IATF, Algeria", org: "Al Jazeera Mubasher" },
  { year: "2026", title: "TV Presenter", org: "Algerian Public Television" },
  { year: "2024", title: "Guest of Honor", org: "Arab Media Forum — Kuwait" },
  { year: "2026", title: "Official Voice", org: "11One Media — Qatar" },
];

// Demo testimonials (placeholder content).
export const testimonials = [
  {
    quote:
      "Imene's voice gave our campaign exactly the warmth and authority we were looking for — delivered in three languages, ahead of deadline.",
    name: "S. B.",
    role: "Marketing Lead — cosmetics brand, Algiers",
  },
  {
    quote:
      "Professional, fast and effortlessly trilingual. She understood the brief better than we wrote it.",
    name: "R. K.",
    role: "Production Manager — media platform, Doha",
  },
  {
    quote:
      "One consultation completely reframed how I present on camera. Worth every dinar.",
    name: "A. M.",
    role: "Content creator, Oran",
  },
];
