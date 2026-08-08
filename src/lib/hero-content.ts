// Hero content, derived from Imene Adjissi's CV.
// Kept in one place so it can move to Payload CMS later without touching the UI.
export const heroContent = {
  name: "Imene Adjissi",
  nameArabic: "إيمان عجيسي",
  // Trilingual "Journalist" for the rotating eyebrow (EN / FR / AR).
  eyebrow: ["Journalist", "Journaliste", "إعلامية"],
  // Rotating role line.
  roles: ["Voice-Over Artist", "TV Presenter", "Content Creator", "Journalist"],
  tagline:
    "Telling stories across three languages — on air, on screen, and in every voice-over.",
  credentials: [
    "Al Jazeera Mubasher",
    "Algerian Public TV",
    "Voice of 11 One Media — Qatar",
    "Founder, Kreana Production",
  ],
  ctaPrimary: { label: "Explore my services", href: "#services" },
  ctaSecondary: { label: "Watch showreel", href: "#showreel" },
  location: "Bordj Bou Arreridj, Algeria",
} as const;
