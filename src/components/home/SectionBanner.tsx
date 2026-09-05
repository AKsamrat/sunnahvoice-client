type BannerType = "image" | "video";

const banners = {
  image: {
    image:
      "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1800&q=85",
    eyebrow: "A moment to pause",
    title: "Beauty is a sign for those who reflect.",
    text: "Carry a meaningful reminder into your day.",
  },
  video: {
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1800&q=85",
    eyebrow: "Stories that stay",
    title: "Watch. Learn. Share the khayr.",
    text: "Beneficial stories can begin a beautiful conversation.",
  },
};

export default function SectionBanner({ type }: { type: BannerType }) {
  const banner = banners[type];

  return (
    <aside className="relative mt-20 overflow-hidden rounded-[2.25rem] bg-emerald-950 px-7 py-14 text-white shadow-2xl sm:px-12 md:py-20">
      <img
        src={banner.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#03251e] via-[#03251e]/80 to-transparent" />
      <div className="banner-star-pattern absolute inset-0 opacity-70" />
      <div className="relative max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[.24em] text-[#e5c679]">
          {banner.eyebrow}
        </p>
        <h3 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
          {banner.title}
        </h3>
        <p className="mt-4 text-emerald-50/65">{banner.text}</p>
      </div>
    </aside>
  );
}
