export type MediaType = "image" | "video" | "audio";

export type MediaItem = {
  id: number;
  slug?: string;
  title: string;
  subtitle: string;
  description: string;
  type: MediaType;
  category: string;
  categoryId?: number;
  cover: string;
  fileUrl: string;
  meta: string;
  publishedAt: string;
  downloads: string;
  status?: "draft" | "published";
  views?: number;
};

export const mediaItems: MediaItem[] = [
  {
    id: 1,
    title: "The Beauty of the Qur'an",
    subtitle: "A quiet reminder for the heart",
    description:
      "A peaceful high-resolution Islamic wallpaper inspired by reflection on the Qur'an and the calm it brings to a believer's heart.",
    type: "image",
    category: "Qur'an",
    cover:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=85",
    fileUrl:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=2400&q=95",
    meta: "4K wallpaper",
    publishedAt: "September 2, 2026",
    downloads: "1.8K",
  },
  {
    id: 2,
    title: "Peace in Salah",
    subtitle: "Return to your Creator",
    description:
      "A short visual reminder about slowing down, leaving the noise behind and finding peace through sincere prayer.",
    type: "video",
    category: "Reminder",
    cover:
      "https://images.unsplash.com/photo-1590076215667-875d9f44d62a?auto=format&fit=crop&w=1200&q=85",
    fileUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    meta: "02:18 min",
    publishedAt: "August 28, 2026",
    downloads: "942",
  },
  {
    id: 3,
    title: "Surah Ar-Rahman",
    subtitle: "Peaceful Qur'an recitation",
    description:
      "A soothing recitation created for attentive listening, reflection and a quiet moment of remembrance.",
    type: "audio",
    category: "Recitation",
    cover:
      "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=85",
    fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    meta: "12:42 min",
    publishedAt: "August 24, 2026",
    downloads: "3.2K",
  },
  {
    id: 4,
    title: "Masjid at Golden Hour",
    subtitle: "Architecture that inspires faith",
    description:
      "A detailed photograph celebrating the serenity of the masjid and its place at the heart of Muslim community life.",
    type: "image",
    category: "Masjid",
    cover:
      "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=85",
    fileUrl:
      "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=2400&q=95",
    meta: "HD photograph",
    publishedAt: "August 19, 2026",
    downloads: "1.1K",
  },
  {
    id: 5,
    title: "Morning Adhkar",
    subtitle: "Begin the day with remembrance",
    description:
      "A gentle morning adhkar audio collection to help begin the day with gratitude, protection and remembrance of Allah.",
    type: "audio",
    category: "Dua",
    cover:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=85",
    fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    meta: "08:16 min",
    publishedAt: "August 15, 2026",
    downloads: "2.6K",
  },
  {
    id: 6,
    title: "Journey to Makkah",
    subtitle: "Scenes from the blessed city",
    description:
      "A cinematic journey through beautiful scenes inspired by Makkah and the shared longing to visit the sacred city.",
    type: "video",
    category: "Makkah",
    cover:
      "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=85",
    fileUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    meta: "04:35 min",
    publishedAt: "August 10, 2026",
    downloads: "1.4K",
  },
  {
    id: 7,
    title: "Light Upon Light",
    subtitle: "A reminder of guidance",
    description:
      "A warm Islamic wallpaper inspired by the beauty of light, guidance and hope.",
    type: "image",
    category: "Reflection",
    cover:
      "https://images.unsplash.com/photo-1597247721954-a1d3b73d3fdb?auto=format&fit=crop&w=1200&q=85",
    fileUrl:
      "https://images.unsplash.com/photo-1597247721954-a1d3b73d3fdb?auto=format&fit=crop&w=2400&q=95",
    meta: "4K wallpaper",
    publishedAt: "August 7, 2026",
    downloads: "876",
  },
  {
    id: 8,
    title: "Minarets at Sunset",
    subtitle: "When the call to prayer rises",
    description:
      "A serene photograph of Islamic architecture meeting the colors of sunset.",
    type: "image",
    category: "Masjid",
    cover:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=85",
    fileUrl:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=2400&q=95",
    meta: "HD photograph",
    publishedAt: "August 4, 2026",
    downloads: "1.3K",
  },
  {
    id: 9,
    title: "The Power of Sabr",
    subtitle: "Patience through every season",
    description:
      "A brief visual reflection on patience, trust and remaining close to Allah through hardship.",
    type: "video",
    category: "Reminder",
    cover:
      "https://images.unsplash.com/photo-1537181534458-45dcee76ae90?auto=format&fit=crop&w=1200&q=85",
    fileUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    meta: "03:24 min",
    publishedAt: "July 30, 2026",
    downloads: "721",
  },
  {
    id: 10,
    title: "Lessons from the Hijrah",
    subtitle: "Trust, courage and new beginnings",
    description:
      "A concise story exploring timeless lessons of faith and reliance from the Hijrah.",
    type: "video",
    category: "Stories",
    cover:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85",
    fileUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    meta: "05:10 min",
    publishedAt: "July 26, 2026",
    downloads: "634",
  },
  {
    id: 11,
    title: "Surah Al-Mulk",
    subtitle: "A recitation for the evening",
    description:
      "A calm evening recitation presented for listening, memorisation and reflection.",
    type: "audio",
    category: "Recitation",
    cover:
      "https://images.unsplash.com/photo-1574246604907-db69e30ddb97?auto=format&fit=crop&w=1200&q=85",
    fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    meta: "09:48 min",
    publishedAt: "July 22, 2026",
    downloads: "2.1K",
  },
  {
    id: 12,
    title: "Dua for Tranquility",
    subtitle: "Words for a peaceful heart",
    description:
      "A gentle collection of supplications for calm, protection and steadfast faith.",
    type: "audio",
    category: "Dua",
    cover:
      "https://images.unsplash.com/photo-1552423314-cf29ab68ad73?auto=format&fit=crop&w=1200&q=85",
    fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    meta: "06:32 min",
    publishedAt: "July 18, 2026",
    downloads: "1.7K",
  },
  {
    id: 13,
    title: "Doors of the Masjid",
    subtitle: "An invitation to peace",
    description:
      "A detailed architectural photograph celebrating the beauty and welcome of the masjid.",
    type: "image",
    category: "Architecture",
    cover:
      "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=1200&q=85",
    fileUrl:
      "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=2400&q=95",
    meta: "HD photograph",
    publishedAt: "July 14, 2026",
    downloads: "984",
  },
  {
    id: 14,
    title: "Night of Reflection",
    subtitle: "Stillness beneath the moon",
    description:
      "A calm night scene designed as a background for reflection, gratitude and remembrance.",
    type: "image",
    category: "Wallpaper",
    cover:
      "https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?auto=format&fit=crop&w=1200&q=85",
    fileUrl:
      "https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?auto=format&fit=crop&w=2400&q=95",
    meta: "4K wallpaper",
    publishedAt: "July 11, 2026",
    downloads: "1.5K",
  },
  {
    id: 15,
    title: "Kindness Is Worship",
    subtitle: "Small deeds with lasting weight",
    description:
      "A short reminder about bringing sincerity and kindness into everyday interactions.",
    type: "video",
    category: "Character",
    cover:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
    fileUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    meta: "02:46 min",
    publishedAt: "July 8, 2026",
    downloads: "589",
  },
  {
    id: 16,
    title: "The Gift of Friday",
    subtitle: "Preparing for Jumu'ah",
    description:
      "A practical and uplifting visual guide to welcoming the most blessed day of the week.",
    type: "video",
    category: "Sunnah",
    cover:
      "https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&w=1200&q=85",
    fileUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    meta: "04:12 min",
    publishedAt: "July 4, 2026",
    downloads: "811",
  },
  {
    id: 17,
    title: "Evening Adhkar",
    subtitle: "End the day in remembrance",
    description:
      "A measured evening adhkar recording for protection, gratitude and a peaceful close to the day.",
    type: "audio",
    category: "Dua",
    cover:
      "https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=1200&q=85",
    fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    meta: "07:18 min",
    publishedAt: "July 1, 2026",
    downloads: "2.3K",
  },
  {
    id: 18,
    title: "Surah Al-Kahf",
    subtitle: "A recitation for Friday",
    description:
      "A clear recitation for focused listening and reflection on the lessons of Surah Al-Kahf.",
    type: "audio",
    category: "Recitation",
    cover:
      "https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?auto=format&fit=crop&w=1200&q=85",
    fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    meta: "18:25 min",
    publishedAt: "June 27, 2026",
    downloads: "3.8K",
  },
];

export const mediaLabels: Record<
  MediaType,
  { title: string; eyebrow: string; description: string }
> = {
  image: {
    title: "Islamic Images",
    eyebrow: "Reflect through beauty",
    description:
      "Wallpapers, calligraphy and sacred places captured with care.",
  },
  video: {
    title: "Beneficial Videos",
    eyebrow: "Watch and remember",
    description:
      "Short reminders and meaningful visual stories for everyday faith.",
  },
  audio: {
    title: "Recitations & Audio",
    eyebrow: "Listen with your heart",
    description:
      "Qur'an recitations, duas and peaceful audio for quiet moments.",
  },
};

export const mediaExtension: Record<MediaType, string> = {
  image: "jpg",
  video: "mp4",
  audio: "mp3",
};
