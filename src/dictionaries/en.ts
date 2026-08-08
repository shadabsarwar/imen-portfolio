/**
 * English copy — the source of truth for the dictionary shape.
 *
 * `ar.ts` is typed against `Dictionary`, so a missing or misspelled key there
 * is a compile error rather than a blank space on the Arabic site.
 *
 * Deliberately NOT `as const`: literal types would force every translation to
 * equal the English string.
 */
const en = {
  meta: {
    title: "Imene Adjissi — Journalist, Voice-Over Artist & Content Creator",
    description:
      "Imene Adjissi (إيمان عجيسي) — Algerian journalist, voice-over artist, TV presenter and content creator. Al Jazeera Mubasher, Algerian Public TV, and founder of Kreana Production.",
  },

  nav: {
    links: [
      { key: "work", label: "Work", href: "/work" },
      { key: "voice", label: "Voice", href: "/#voice" },
      { key: "about", label: "About", href: "/#about" },
      { key: "services", label: "Services", href: "/#services" },
      { key: "contact", label: "Contact", href: "/#contact" },
    ],
    cta: "Book a consultation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },

  hero: {
    name: "Imene Adjissi",
    nameArabic: "إيمان عجيسي",
    eyebrow: ["Journalist", "Journaliste", "إعلامية"],
    prefix: "Algerian",
    roles: ["Voice-Over Artist", "TV Presenter", "Content Creator", "Journalist"],
    tagline:
      "Telling stories across three languages — on air, on screen, and in every voice-over.",
    credentials: [
      "Al Jazeera Mubasher",
      "Algerian Public TV",
      "Voice of 11 One Media — Qatar",
      "Founder, Kreana Production",
    ],
    ctaPrimary: "Explore my services",
    ctaSecondary: "Watch showreel",
    scroll: "Scroll",
    portraitAlt: "Imene Adjissi",
  },

  consultationCta: {
    eyebrow: "Work with me",
    title: "Book a paid 1:1 consultation.",
    body: "Voice-over, presenting, content strategy and personal branding — tailored advice in Arabic, French or English.",
    cta: "Book your session",
    note: "Limited slots each week",
  },

  broadcast: {
    eyebrow: "Broadcast & Commercials",
    title: "On air, and on brand.",
    description:
      "TV and radio campaigns, corporate films and field reporting — for Cosider, FNTP, Folla Immobilière, One Two and Al Jazeera Mubasher.",
    cta: "View all work",
    prev: "Previous films",
    next: "Next films",
    showFilms: "Show films",
    panel: {
      titleTop: "A voice that",
      titleAccent: "connects & inspires.",
      body: "Professional voice over for commercials, corporate films, TV, radio and more.",
      contactCta: "Book a commercial",
      micLabel: "Hear the voice",
      micAria: "Hear the voice — jump to the voice samples",
      traits: ["Studio Quality", "Warm", "Versatile", "Expressive"],
    },
    features: [
      { title: "Versatile Range", blurb: "Warm, energetic, calm or powerful" },
      { title: "Clear & Engaging", blurb: "Messages that connect and leave impact" },
      { title: "Professional Studio", blurb: "High-quality recordings, fast turnaround" },
      { title: "Trusted by Brands", blurb: "Delivering results that speak for you" },
    ],
  },

  work: {
    eyebrow: "Dubbing, Songs & Collaborations",
    title: "The work that travels.",
    description:
      "Character dubbing, original vocal recordings and brand collaborations made for the feed — vertical, fast, and built to be shared.",
    cta: "Browse the archive",
  },

  voice: {
    eyebrow: "Voice & Vocals",
    title: "Hear the voice.",
    description:
      "Commercial reads, narration and audiobook work in Arabic, French and English — plus original vocal recordings. Press play, or click a waveform to scrub.",
    tabs: { voice: "Voice-over", music: "Songs" },
    cta: "Request a voice over",
    prev: "Previous samples",
    next: "More samples",
    play: "Play",
    pause: "Pause",
  },

  about: {
    eyebrow: "About me",
    title: "Journalist. Voice. Storyteller.",
    paragraphs: [
      "I'm Imene Adjissi — an Algerian journalist, voice-over artist and content creator. From radio animation in Sétif to reporting for Al Jazeera Mubasher and presenting on Algerian Public Television, my work lives where language meets story.",
      "I hold a Master's in Translation and a TV presentation diploma from the Al Jazeera Media Institute — and as founder of Kreana Production, I help brands and platforms speak to their audience in Arabic, French and English.",
    ],
    badge: "Founder & CEO — Kreana Production",
    portraitAlt: "Imene Adjissi seated portrait",
    skills: [
      "Voice Over",
      "Dubbing",
      "TV Presenting",
      "Script Writing",
      "Translation",
      "Content Creation",
      "Singing",
      "Video Editing",
    ],
    languages: [
      { name: "Arabic", level: "Native" },
      { name: "English", level: "Fluent" },
      { name: "French", level: "Fluent" },
    ],
  },

  achievements: {
    eyebrow: "Track record",
    title: "Numbers & milestones.",
    stats: [
      "Years of experience",
      "Languages — AR · FR · EN",
      "Brands & platforms",
      "Projects delivered",
    ],
    milestones: [
      { title: "Reporter — IATF, Algeria", org: "Al Jazeera Mubasher" },
      { title: "TV Presenter", org: "Algerian Public Television" },
      { title: "Guest of Honor", org: "Arab Media Forum — Kuwait" },
      { title: "Official Voice", org: "11One Media — Qatar" },
    ],
  },

  services: {
    eyebrow: "Services",
    title: "One voice, many ways to work together.",
    intro:
      "Each service has its own page — details, previous work and a request flow built for it. Pick one to see more.",
    soon: "Soon",
    items: [
      {
        slug: "consultation",
        title: "Consultation",
        blurb:
          "Paid 1:1 sessions on voice-over, presenting, content and personal branding — clear, practical guidance you can act on right away.",
        tags: ["AR · FR · EN", "Video call"],
        cta: "Book now",
      },
      {
        slug: "voice-over",
        title: "Voice Over",
        blurb:
          "Commercials, narration, dubbing and ads — delivered in Arabic, French and English with fluency, warmth and broadcast-ready quality.",
        tags: ["Commercial", "Narration", "Dubbing"],
        cta: "Request a quote",
      },
      {
        slug: "video-production",
        title: "Video Production",
        blurb:
          "From concept and scriptwriting to filming and the final edit — full productions handled end-to-end with Kreana Production.",
        tags: ["Concept", "Script", "Edit"],
        cta: "Start a project",
      },
      {
        slug: "brand-promotion",
        title: "Brand Promotion",
        blurb:
          "Sponsored collaborations and product features across my social platforms, crafted to speak in your brand's voice to an engaged audience.",
        tags: ["Reels", "Stories", "Campaigns"],
        cta: "Collaborate",
      },
      {
        slug: "courses",
        title: "Courses",
        blurb:
          "Learn voice-over, presenting and content creation — structured, practical lessons from a working professional, taught in Arabic.",
        tags: ["Self-paced", "Arabic"],
        cta: "Join the waitlist",
      },
      {
        slug: "store",
        title: "Store",
        blurb:
          "Digital products, templates and creator resources to help you sharpen your own voice, content and brand.",
        tags: ["Digital goods"],
        cta: "Preview the store",
      },
    ],
  },

  brands: {
    eyebrow: "Trusted by",
    title: "Broadcasters, brands and institutions.",
    alsoWith: "Also with",
  },

  testimonials: {
    eyebrow: "Kind words",
    title: "What clients say.",
    items: [
      {
        quote:
          "Imene's voice gave our campaign exactly the warmth and authority we were looking for — delivered in three languages, ahead of deadline.",
        role: "Marketing Lead — cosmetics brand, Algiers",
      },
      {
        quote:
          "Professional, fast and effortlessly trilingual. She understood the brief better than we wrote it.",
        role: "Production Manager — media platform, Doha",
      },
      {
        quote:
          "One consultation completely reframed how I present on camera. Worth every dinar.",
        role: "Content creator, Oran",
      },
    ],
  },

  contact: {
    eyebrow: "Contact",
    title: "Let's create something together.",
    body: "A campaign that needs a voice, a video that needs a story, or a brand that needs a face — tell me about it.",
    cards: {
      email: { label: "Email", note: "For briefs & collaborations" },
      whatsapp: { label: "WhatsApp", note: "Fastest way to reach me" },
      location: { label: "Based in", note: "Working worldwide, remotely" },
    },
    cta: "Start a project",
  },

  footer: {
    blurb:
      "Journalist, voice-over artist and content creator — telling stories across three languages, on air and on screen. Founder & CEO of Kreana Production.",
    explore: "Explore",
    services: "Services",
    contact: "Contact",
    rights: "All rights reserved.",
  },

  workPage: {
    back: "← Back to home",
    eyebrow: "Selected work",
    title: "On screen, on air, online.",
    intro:
      "{count} pieces across broadcast reporting, commercials, dubbing, original songs and brand collaborations. Filter by category, then click any piece to watch it in full with sound.",
    groups: {
      landscape: "Broadcast & Commercials",
      portrait: "Dubbing, Songs & Collaborations",
    },
    filters: {
      all: "All work",
      broadcast: "Broadcast & Commercials",
      dubbing: "Dubbing",
      song: "Songs",
      collabs: "Collaborations",
    },
  },

  media: {
    play: "Play",
    close: "Close",
    prev: "Previous",
    next: "Next",
    mute: "Mute",
    unmute: "Unmute",
    scrollLeft: "Scroll left",
    scrollRight: "Scroll right",
    quality: "Quality",
  },

  rail: {
    label: "Page sections",
    sections: {
      intro: "Intro",
      showreel: "Broadcast",
      reel: "Social",
      voice: "Voice",
      about: "About",
      services: "Services",
      contact: "Contact",
    },
  },
};

export type Dictionary = typeof en;
export default en;
