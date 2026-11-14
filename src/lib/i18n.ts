export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { label: string; long: string; dir: "ltr" | "rtl" }> = {
  en: { label: "EN", long: "English", dir: "ltr" },
  ar: { label: "AR", long: "العربية", dir: "rtl" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function dirFor(locale: Locale): "ltr" | "rtl" {
  return localeMeta[locale].dir;
}

/* Note: the base dictionary is intentionally NOT `as const`. A const-asserted
   base narrows every field to its literal type, which makes any translated
   dictionary a type error and forced `ignoreBuildErrors` in the past. */

/* Copy rule: the game style lives in the visuals only. Every string below is
   plain portfolio language, traced to the original site's content. No player,
   quest, achievement, or game-mode vocabulary may enter this file. */

const en = {
  skip: "Skip to content",
  loader: "Loading the portfolio",
  brand: "HAMMI",
  name: "Hammi Abou Houraira",
  nav: {
    about: "About",
    projects: "Projects",
    skills: "Skills",
    contact: "Contact",
    menu: "Menu",
  },
  actions: {
    language: "Change language",
    theme: "Switch theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
  },
  hud: {
    top: "Back to top",
  },
  toast: {
    title: "Achievement unlocked",
    text: "You found the secret code. The fog approves.",
  },
  hero: {
    badge: "Publisher on Google Play",
    role: "App Designer and Developer with modern full-stack skills",
    intro:
      "I design and build mobile apps with React Native and ship them to Google Play, backed by Python and Django services.",
    ctaPrimary: "View projects",
    ctaSecondary: "GitHub",
    meta: [
      { k: "Mobile", v: "React Native" },
      { k: "Backend", v: "Python and Django" },
      { k: "Daily driver", v: "Linux, 4+ years" },
    ],
  },
  about: {
    label: "01",
    kicker: "Introduction",
    title: "About Me",
    p1: "I am Hammi Abou Houraira, a Petroleum and Gas Production Engineering student with a deep passion for app design and development. I work as a mobile app developer using React Native, with published apps on Google Play.",
    p2: "Beyond mobile, I build web backends with Python, Django, and REST APIs, and I have experience with KivyMD and Qt5 plus the basics of Java, C#, Dart, and Flutter. I am interested in AI, and I have used Linux as my daily system for more than four years.",
    highlightsTitle: "Highlights",
    highlights: [
      "Petroleum and Gas Production Engineering student with 4+ years using Linux.",
      "Experience with React Native, Python, Django, KivyMD, Qt5 and more.",
      "Interested in AI and modern, user-centered app design.",
    ],
  },
  projects: {
    label: "02",
    kicker: "Selected work",
    title: "Projects",
    sub: "Selected apps and projects from GitHub and Google Play.",
    storePlay: "Google Play",
    storeCode: "Open source",
    items: [
      {
        name: "Fasty",
        desc: "A delivery app for fast and easy order requests.",
        tags: "Mobile / Delivery",
        href: "https://play.google.com/store/apps/details?id=app.ehjez.com",
        store: "play",
      },
      {
        name: "Player",
        desc: "A simple and practical media player.",
        tags: "Mobile / Media",
        href: "https://github.com/abouhoraira2006/Player",
        store: "code",
      },
      {
        name: "VitalFlow",
        desc: "An app to manage and track healthy habits.",
        tags: "Health / Habits",
        href: "https://github.com/hammi2/VitalFlow",
        store: "code",
      },
      {
        name: "learn-python",
        desc: "A project for learning Python fundamentals.",
        tags: "Python / Learning",
        href: "https://github.com/hammi2/learn-python",
        store: "code",
      },
      {
        name: "HabitsReminder",
        desc: "An app that reminds you of positive daily habits.",
        tags: "Habits / Reminders",
        href: "https://github.com/hammi2/HabitsReminder",
        store: "code",
      },
    ],
  },
  skills: {
    label: "03",
    kicker: "Stack",
    title: "Skills",
    sub: "A snapshot of tools and technologies I work with.",
    groups: [
      { title: "Mobile App Development", items: ["React Native", "Android", "UI Design"] },
      { title: "Web and Backend", items: ["Python", "Django", "REST APIs"] },
      { title: "Frameworks and Tools", items: ["KivyMD", "Qt5", "Git and GitHub"] },
      { title: "Other Languages", items: ["Java (basics)", "C# (basics)", "Dart and Flutter (basics)"] },
    ],
  },
  contact: {
    label: "04",
    kicker: "Get in touch",
    title: "Contact",
    heading: "Let's work together",
    text: "Have an idea, app concept, or collaboration in mind? Reach out and let's talk.",
    cta: "Start a project on LinkedIn",
    channelsTitle: "Connect with me",
    channels: [
      { name: "GitHub", handle: "@hammi2", href: "https://github.com/hammi2", icon: "github" },
      { name: "GitHub", handle: "@abouhoraira2006", href: "https://github.com/abouhoraira2006", icon: "github" },
      { name: "LinkedIn", handle: "in/abou-horaira", href: "https://www.linkedin.com/in/abou-horaira-75bb93377", icon: "linkedin" },
      { name: "Instagram", handle: "@x_abou_hou_raira", href: "https://www.instagram.com/x_abou_hou_raira", icon: "instagram" },
      { name: "Facebook", handle: "abouhoraira.hammi", href: "https://www.facebook.com/abouhoraira.hammi", icon: "facebook" },
      { name: "Discord", handle: "@different.py", href: "https://discordapp.com/users/different.py", icon: "discord" },
    ],
  },
  footer: {
    thanks: "Thanks for visiting",
    built: "Built with Next.js and Tailwind CSS",
    rights: "All rights reserved.",
  },
};

export type Dictionary = typeof en;

const ar: Dictionary = {
  skip: "تخطَّ إلى المحتوى",
  loader: "جارٍ تحميل الملف الشخصي",
  brand: "حامي",
  name: "أبو هريرة حامي",
  nav: {
    about: "نبذة",
    projects: "المشاريع",
    skills: "المهارات",
    contact: "تواصل",
    menu: "القائمة",
  },
  actions: {
    language: "تغيير اللغة",
    theme: "تبديل السمة",
    themeLight: "فاتح",
    themeDark: "داكن",
    themeSystem: "النظام",
  },
  hud: {
    top: "العودة إلى الأعلى",
  },
  toast: {
    title: "تم فتح إنجاز",
    text: "اكتشفت الشيفرة السرية، والضباب يمنحك مباركته.",
  },
  hero: {
    badge: "ناشر على Google Play",
    role: "مصمم ومطور تطبيقات بمهارات حديثة متكاملة",
    intro:
      "أصمم وأبني تطبيقات الجوال باستخدام React Native وأنشرها على Google Play، مع خدمات خلفية بـ Python وDjango.",
    ctaPrimary: "استعرض المشاريع",
    ctaSecondary: "GitHub",
    meta: [
      { k: "الجوال", v: "React Native" },
      { k: "الخدمات الخلفية", v: "Python و Django" },
      { k: "النظام اليومي", v: "منذ أكثر من 4 سنوات" },
    ],
  },
  about: {
    label: "01",
    kicker: "مقدمة",
    title: "نبذة عني",
    p1: "أنا أبو هريرة حامي، طالب في هندسة إنتاج النفط والغاز، شغوف بتصميم التطبيقات وتطويرها. أعمل مطورا لتطبيقات الجوال باستخدام React Native، ولدي تطبيقات منشورة على Google Play.",
    p2: "إلى جانب الجوال، أطوّر خدمات ويب خلفية بـ Python وDjango وواجهات REST، ولدي خبرة مع KivyMD وQt5 وأساسيات Java وC# وDart وFlutter. أهتم بالذكاء الاصطناعي، وأستخدم Linux نظاما رئيسيا لي منذ أكثر من أربع سنوات.",
    highlightsTitle: "أبرز النقاط",
    highlights: [
      "طالب في هندسة إنتاج النفط والغاز، وأستخدم Linux منذ أكثر من أربع سنوات.",
      "خبرة في React Native وPython وDjango وKivyMD وQt5 وغيرها.",
      "اهتمام بالذكاء الاصطناعي وبالتصميم الحديث الذي يركز على المستخدم.",
    ],
  },
  projects: {
    label: "02",
    kicker: "أعمال مختارة",
    title: "المشاريع",
    sub: "تطبيقات ومشاريع مختارة من GitHub و Google Play.",
    storePlay: "Google Play",
    storeCode: "مفتوح المصدر",
    items: [
      {
        name: "فاستي",
        desc: "تطبيق توصيل لطلبات سريعة وسهلة.",
        tags: "جوال / توصيل",
        href: "https://play.google.com/store/apps/details?id=app.ehjez.com",
        store: "play",
      },
      {
        name: "Player",
        desc: "مشغل وسائط بسيط وعملي.",
        tags: "جوال / وسائط",
        href: "https://github.com/abouhoraira2006/Player",
        store: "code",
      },
      {
        name: "VitalFlow",
        desc: "تطبيق لإدارة العادات الصحية وتتبعها.",
        tags: "صحة / عادات",
        href: "https://github.com/hammi2/VitalFlow",
        store: "code",
      },
      {
        name: "learn-python",
        desc: "مشروع لتعلم أساسيات لغة Python.",
        tags: "Python / تعلم",
        href: "https://github.com/hammi2/learn-python",
        store: "code",
      },
      {
        name: "HabitsReminder",
        desc: "تطبيق يذكرك بالعادات اليومية الإيجابية.",
        tags: "عادات / تذكير",
        href: "https://github.com/hammi2/HabitsReminder",
        store: "code",
      },
    ],
  },
  skills: {
    label: "03",
    kicker: "التقنيات",
    title: "المهارات",
    sub: "لمحة عن الأدوات والتقنيات التي أعمل بها.",
    groups: [
      { title: "تطوير تطبيقات الجوال", items: ["React Native", "Android", "تصميم الواجهات"] },
      { title: "الويب والخدمات الخلفية", items: ["Python", "Django", "واجهات REST"] },
      { title: "الأطر والأدوات", items: ["KivyMD", "Qt5", "Git و GitHub"] },
      { title: "لغات أخرى", items: ["Java (أساسيات)", "C# (أساسيات)", "Dart و Flutter (أساسيات)"] },
    ],
  },
  contact: {
    label: "04",
    kicker: "ابقَ على تواصل",
    title: "تواصل",
    heading: "لنعمل معا",
    text: "لديك فكرة أو مفهوم لتطبيق أو رغبة في التعاون؟ تواصل معي ولنتحدث.",
    cta: "ابدأ مشروعا على LinkedIn",
    channelsTitle: "تواصل معي عبر",
    channels: [
      { name: "GitHub", handle: "@hammi2", href: "https://github.com/hammi2", icon: "github" },
      { name: "GitHub", handle: "@abouhoraira2006", href: "https://github.com/abouhoraira2006", icon: "github" },
      { name: "LinkedIn", handle: "in/abou-horaira", href: "https://www.linkedin.com/in/abou-horaira-75bb93377", icon: "linkedin" },
      { name: "Instagram", handle: "@x_abou_hou_raira", href: "https://www.instagram.com/x_abou_hou_raira", icon: "instagram" },
      { name: "Facebook", handle: "abouhoraira.hammi", href: "https://www.facebook.com/abouhoraira.hammi", icon: "facebook" },
      { name: "Discord", handle: "@different.py", href: "https://discordapp.com/users/different.py", icon: "discord" },
    ],
  },
  footer: {
    thanks: "شكرا لزيارتك",
    built: "مبني بـ Next.js و Tailwind CSS",
    rights: "جميع الحقوق محفوظة.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function dictionaryFor(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
