export type BlogSection = {
  heading?: string;
  paragraphs: string[];
  quote?: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "building-a-daily-relationship-with-the-quran",
    title: "Building a daily relationship with the Qur’an",
    excerpt:
      "A gentle, realistic approach to making Qur’an recitation and reflection part of an ordinary day.",
    category: "Qur’an",
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1600&q=90",
    author: "SunnahVoice Editorial",
    authorRole: "Faith & Reflection",
    publishedAt: "September 4, 2026",
    readTime: "7 min read",
    featured: true,
    sections: [
      {
        paragraphs: [
          "A relationship with the Qur’an is not built in a single intense weekend. It grows through small meetings: a few verses after Fajr, a translation opened during a commute, or one ayah carried quietly through the day.",
          "Consistency matters more than volume. When the goal is closeness rather than completion, even a short daily practice becomes meaningful.",
        ],
      },
      {
        heading: "Begin with a time you can protect",
        paragraphs: [
          "Choose a small window that already exists in your routine. Five minutes after a prayer is easier to protect than an undefined promise to read later.",
          "Keep your mushaf visible and remove unnecessary steps. A practice becomes sustainable when beginning it feels natural.",
        ],
        quote:
          "The most beloved deeds are those that are consistent, even if they are small.",
      },
      {
        heading: "Read for understanding",
        paragraphs: [
          "Recitation nourishes the heart, and understanding gives that nourishment direction. Read a trusted translation and note one idea that speaks to your current life.",
          "Do not pressure yourself to resolve every question immediately. Let curiosity become an invitation to learn from qualified teachers and reliable sources.",
        ],
      },
      {
        heading: "Carry one verse with you",
        paragraphs: [
          "Before closing the Qur’an, choose one verse or meaning to remember. Return to it between tasks, during a walk, or before sleep.",
          "Over time, these small moments turn reading into companionship—and the Qur’an begins to shape how the day is seen and lived.",
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "finding-khushu-in-a-distracted-world",
    title: "Finding khushūʿ in a distracted world",
    excerpt:
      "Practical ways to prepare the heart and protect attention before and during salah.",
    category: "Worship",
    image:
      "https://images.unsplash.com/photo-1590076215667-875d9f44d62a?auto=format&fit=crop&w=1400&q=90",
    author: "Maryam Hasan",
    authorRole: "Contributing Writer",
    publishedAt: "August 29, 2026",
    readTime: "6 min read",
    sections: [
      {
        paragraphs: [
          "Khushūʿ begins before the opening takbīr. The way we transition from noise into prayer shapes the attention we bring into it.",
          "A deliberate pause, a silenced phone and an unhurried wudu can help the heart arrive where the body already stands.",
        ],
      },
      {
        heading: "Create a gentle transition",
        paragraphs: [
          "Give yourself two quiet minutes before prayer. Breathe, remember who you are about to stand before, and leave the unfinished tasks for after the salam.",
        ],
        quote:
          "Prayer is not an interruption to the day; it is what gives the day its direction.",
      },
      {
        heading: "Understand what you recite",
        paragraphs: [
          "Learning the meanings of familiar phrases transforms repetition into conversation. Begin with Al-Fatihah and the words said in bowing and prostration.",
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "the-quiet-power-of-morning-adhkar",
    title: "The quiet power of morning adhkar",
    excerpt:
      "How remembrance at the beginning of the day creates clarity, gratitude and protection.",
    category: "Dhikr",
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=90",
    author: "SunnahVoice Editorial",
    authorRole: "Faith & Reflection",
    publishedAt: "August 21, 2026",
    readTime: "5 min read",
    sections: [
      {
        paragraphs: [
          "Morning adhkar offers a different beginning: one shaped by remembrance before reaction. It turns attention toward gratitude and dependence on Allah.",
        ],
      },
      {
        heading: "A protected beginning",
        paragraphs: [
          "Start with a short, authenticated collection. Read slowly enough to remain present with the meaning instead of racing toward the end.",
        ],
      },
      {
        heading: "Let remembrance continue",
        paragraphs: [
          "The morning words are a beginning, not a boundary. Allow them to return during work, travel and the ordinary pauses of the day.",
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "lessons-in-patience-from-the-prophets",
    title: "Lessons in patience from the Prophets",
    excerpt:
      "Sabr is active trust, courageous effort and a heart that refuses to lose hope.",
    category: "Stories",
    image:
      "https://images.unsplash.com/photo-1537181534458-45dcee76ae90?auto=format&fit=crop&w=1400&q=90",
    author: "Ahmad Rahman",
    authorRole: "History Contributor",
    publishedAt: "August 13, 2026",
    readTime: "9 min read",
    sections: [
      {
        paragraphs: [
          "The stories of the Prophets show patience in motion: speaking truth, taking wise action and continuing to hope when results remain unseen.",
        ],
      },
      {
        heading: "Patience is not passivity",
        paragraphs: [
          "Sabr holds effort and reliance together. We do what is right and possible, then entrust what is beyond us to Allah.",
        ],
        quote:
          "Hope is an act of worship when the road ahead cannot yet be seen.",
      },
      {
        heading: "Practice in ordinary difficulty",
        paragraphs: [
          "Great patience is trained in small moments: an interrupted plan, a difficult conversation, or work that takes longer than expected.",
        ],
      },
    ],
  },
  {
    id: 5,
    slug: "making-your-home-a-place-of-remembrance",
    title: "Making your home a place of remembrance",
    excerpt:
      "Simple choices that can bring more prayer, learning and tranquility into family life.",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=90",
    author: "Aisha Karim",
    authorRole: "Family & Lifestyle",
    publishedAt: "August 5, 2026",
    readTime: "6 min read",
    sections: [
      {
        paragraphs: [
          "A home of remembrance is not defined by decoration. It is shaped by what is heard, practiced and made easy within its rooms.",
        ],
      },
      {
        heading: "Make goodness visible",
        paragraphs: [
          "Keep books accessible, create a small uncluttered prayer space and allow beneficial recitation to become part of the home’s soundscape.",
        ],
      },
      {
        heading: "Build shared rituals",
        paragraphs: [
          "A few minutes of family reading or a shared dua can become an anchor children and adults remember for years.",
        ],
      },
    ],
  },
  {
    id: 6,
    slug: "the-etiquette-of-sharing-islamic-reminders",
    title: "The etiquette of sharing Islamic reminders",
    excerpt:
      "Share with sincerity, verify before forwarding and remember the person behind the screen.",
    category: "Digital Life",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=90",
    author: "SunnahVoice Editorial",
    authorRole: "Digital Wellbeing",
    publishedAt: "July 28, 2026",
    readTime: "5 min read",
    sections: [
      {
        paragraphs: [
          "A reminder can travel to thousands of people in seconds. That reach is a gift and a responsibility.",
        ],
      },
      {
        heading: "Verify before you amplify",
        paragraphs: [
          "Check verses, narrations and attributions through reliable sources. Good intention does not remove the need for accuracy.",
        ],
        quote:
          "The value of a reminder is not measured only by how far it travels, but by the care with which it is shared.",
      },
      {
        heading: "Choose gentleness",
        paragraphs: [
          "Remember that advice arrives in someone’s real and complicated life. Speak with humility, context and mercy.",
        ],
      },
    ],
  },
];

export const blogCategories = [
  "All",
  ...new Set(blogPosts.map((post) => post.category)),
];
