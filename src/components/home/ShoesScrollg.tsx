import { useEffect, useRef, useState, type FC } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Vec2 { x: number; y: number; }

// ─── Shoe SVG (reusable, colour-swappable) ───────────────────────────────────
const ShoeSVG: FC<{ color: string; trim?: string; style?: React.CSSProperties; className?: string }> = ({
    color, trim = "#ffffff", style, className = "",
}) => (
    <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" style={style} className={className}>
        <defs>
            <linearGradient id={`sg-${color.replace("#", "")}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="1" />
                <stop offset="100%" stopColor={color} stopOpacity="0.6" />
            </linearGradient>
            <filter id="shoe-glow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        {/* ground shadow */}
        <ellipse cx="295" cy="322" rx="215" ry="14" fill="rgba(0,0,0,0.35)" />

        {/* outsole */}
        <path d="M62 228 Q48 264 92 274 L478 274 Q532 274 536 248 Q536 228 502 224 Z" fill="#0a0a0a" />
        {/* midsole */}
        <path d="M72 226 L500 226 Q526 226 526 244 Q526 260 498 264 L82 264 Q56 264 62 246 Z" fill="#141414" />
        {/* midsole stripe */}
        <path d="M76 235 L497 235 L497 242 L76 242 Z" fill={color} opacity="0.8" />
        {/* traction lugs */}
        {[110, 160, 210, 260, 310, 360, 410, 460].map((x, i) => (
            <rect key={i} x={x} y={258} width={30} height={6} rx={3} fill="#1e1e1e" />
        ))}

        {/* main upper */}
        <path d={`M66 222 Q52 168 96 132 Q130 100 186 92 L376 88 Q436 88 470 122 Q502 154 508 222 Z`}
            fill={`url(#sg-${color.replace("#", "")})`} filter="url(#shoe-glow)" />
        {/* sheen */}
        <path d="M96 218 Q88 170 114 138 Q140 110 190 102 L368 96 Q416 96 444 128 Q470 158 474 218 Z"
            fill="rgba(255,255,255,0.08)" />

        {/* toe cap */}
        <path d="M66 222 Q52 168 96 132 Q112 116 140 108 L146 222 Z" fill="rgba(0,0,0,0.22)" />
        {/* heel counter */}
        <path d="M464 218 Q500 210 508 222 Q510 162 476 124 Q460 106 432 96 L438 218 Z" fill="rgba(0,0,0,0.2)" />

        {/* lace window */}
        <path d="M182 98 Q268 89 348 92 L348 158 Q268 150 182 160 Z" fill="rgba(255,255,255,0.14)" rx="4" />
        {/* laces */}
        {[112, 122, 132, 142, 152].map((y, i) => (
            <g key={i}>
                <line x1="186" y1={y} x2="342" y2={y - 2} stroke={trim} strokeWidth="2.8" strokeLinecap="round" opacity="0.65" />
                <circle cx="186" cy={y} r="4" fill="rgba(0,0,0,0.55)" />
                <circle cx="342" cy={y - 2} r="4" fill="rgba(0,0,0,0.55)" />
            </g>
        ))}

        {/* tongue */}
        <path d="M204 94 Q268 84 332 94 L326 42 Q268 32 210 42 Z" fill={color} />
        <path d="M208 91 Q268 81 328 91 L322 46 Q268 36 214 46 Z" fill="rgba(255,255,255,0.13)" />
        <rect x="248" y="56" width="36" height="18" rx="4" fill="rgba(255,255,255,0.22)" />
        <text x="266" y="69" textAnchor="middle" fontSize="9" fill={color} fontWeight="900" fontFamily="sans-serif">STRD</text>

        {/* swoosh */}
        <path d="M348 172 Q400 156 454 170 Q422 188 374 192 Q338 188 348 172 Z" fill="rgba(255,255,255,0.2)" />

        {/* heel tab */}
        <rect x="476" y="116" width="24" height="68" rx="9" fill={color} />
        <rect x="480" y="120" width="16" height="12" rx="3" fill="rgba(255,255,255,0.35)" />

        {/* toe stitch */}
        <path d="M100 146 Q112 124 146 114" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="5,4" />
    </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const SHOES = [
    {
        id: "strider",
        name: "STRIDER X",
        sub: "Born for the streets.",
        price: "$189",
        color: "#FF4D00",
        trim: "#fff",
        accent: "from-orange-600 to-red-500",
        glow: "rgba(255,77,0,0.45)",
        tag: "NEW DROP",
        desc: "Foam React 3.0 midsole. Breathable flyknit upper. Every step is a statement.",
        specs: [["Weight", "182g"], ["Drop", "8mm"], ["Stack", "28mm"], ["Category", "Street"]],
    },
    {
        id: "phantom",
        name: "PHANTOM AIR",
        sub: "Zero gravity. Max speed.",
        price: "$219",
        color: "#7C3AED",
        trim: "#e0d4ff",
        accent: "from-violet-600 to-purple-500",
        glow: "rgba(124,58,237,0.45)",
        tag: "BESTSELLER",
        desc: "Air Cushion XR absorbs impact before you feel it. Race-ready carbon plate.",
        specs: [["Weight", "164g"], ["Drop", "6mm"], ["Stack", "32mm"], ["Category", "Race"]],
    },
    {
        id: "nova",
        name: "NOVA RUNNER",
        sub: "Every mile, rewritten.",
        price: "$159",
        color: "#0EA5E9",
        trim: "#bae6fd",
        accent: "from-sky-500 to-cyan-400",
        glow: "rgba(14,165,233,0.45)",
        tag: "LIMITED",
        desc: "Gel Cushion Pro meets a featherlight ripstop upper. Your new daily trainer.",
        specs: [["Weight", "196g"], ["Drop", "10mm"], ["Stack", "26mm"], ["Category", "Daily"]],
    },
    {
        id: "apex",
        name: "APEX FORCE",
        sub: "Grip the earth. Own the city.",
        price: "$239",
        color: "#10B981",
        trim: "#a7f3d0",
        accent: "from-emerald-500 to-teal-400",
        glow: "rgba(16,185,129,0.45)",
        tag: "COLLAB",
        desc: "Terragrip outsole bites every surface. Kevlar weave cage. Built for chaos.",
        specs: [["Weight", "210g"], ["Drop", "4mm"], ["Stack", "24mm"], ["Category", "Trail"]],
    },
];

// ─── Hook: scroll progress 0→1 inside an element ─────────────────────────────
function useScrollProgress(ref: React.RefObject<HTMLElement | null>): number {
    const [p, setP] = useState(0);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const update = () => {
            const { top, height } = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const progress = Math.max(0, Math.min(1, (-top) / (height - vh)));
            setP(progress);
        };
        window.addEventListener("scroll", update, { passive: true });
        update();
        return () => window.removeEventListener("scroll", update);
    }, [ref]);
    return p;
}

// ─── Hook: element in-view ────────────────────────────────────────────────────
function useInView(ref: React.RefObject<HTMLElement | null>, t = 0.2): boolean {
    const [v, setV] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref, t]);
    return v;
}

// ─── Magnetic cursor ──────────────────────────────────────────────────────────
const Cursor: FC = () => {
    const [pos, setPos] = useState<Vec2>({ x: -100, y: -100 });
    const [big, setBig] = useState(false);
    useEffect(() => {
        const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
        const over = (e: MouseEvent) => setBig((e.target as HTMLElement).closest("button,a,[data-cursor]") != null);
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseover", over);
        return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
    }, []);
    return (
        <>
            <div className="fixed z-[999] pointer-events-none mix-blend-difference transition-transform duration-75"
                style={{ left: pos.x - 6, top: pos.y - 6, width: 12, height: 12, borderRadius: "50%", background: "#fff" }} />
            <div className="fixed z-[998] pointer-events-none mix-blend-difference transition-all duration-300"
                style={{
                    left: pos.x - (big ? 24 : 16), top: pos.y - (big ? 24 : 16),
                    width: big ? 48 : 32, height: big ? 48 : 32,
                    borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.6)",
                    opacity: big ? 0.6 : 0.3,
                }} />
        </>
    );
};

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
const Reveal: FC<{ children: React.ReactNode; delay?: number; dir?: "up" | "left" | "right"; className?: string }> = ({
    children, delay = 0, dir = "up", className = "",
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const v = useInView(ref as React.RefObject<HTMLElement | null>);
    const t: Record<string, string> = {
        up: v ? "translateY(0)" : "translateY(56px)",
        left: v ? "translateX(0)" : "translateX(-56px)",
        right: v ? "translateX(0)" : "translateX(56px)",
    };
    return (
        <div ref={ref} className={className}
            style={{ opacity: v ? 1 : 0, transform: t[dir], transition: `opacity 0.8s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.8s cubic-bezier(.22,1,.36,1) ${delay}ms` }}>
            {children}
        </div>
    );
};

// ─── SECTION 1 · Pinned hero with scroll-driven shoe animation ────────────────
const PinnedHero: FC = () => {
    const wrap = useRef<HTMLDivElement>(null);
    const p = useScrollProgress(wrap as React.RefObject<HTMLElement | null>);

    // Phases (p 0→1 mapped over the 400vh pin)
    const shoeScale = 0.6 + p * 0.7;           // 0.6 → 1.3
    const shoeY = 80 - p * 160;             // drops then rises
    const shoeRot = -18 + p * 36;             // -18° → +18°
    const titleY = -p * 120;
    const titleOp = 1 - p * 2;
    const subOp = Math.max(0, Math.min(1, p * 3 - 0.5));
    const subY = 40 - Math.min(1, p * 3) * 40;
    const glowSize = 200 + p * 400;

    const shoe = SHOES[0];

    return (
        <div ref={wrap} style={{ height: "500vh" }} className="relative">
            <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
                style={{ background: "#050505" }}>

                {/* Animated grid */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,77,0,${0.03 + p * 0.04}) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,${0.03 + p * 0.04}) 1px, transparent 1px)`,
                        backgroundSize: "72px 72px",
                        transform: `translateY(${p * 40}px)`,
                    }} />

                {/* Radial glow */}
                <div className="absolute pointer-events-none rounded-full transition-all duration-100"
                    style={{
                        width: glowSize, height: glowSize,
                        background: `radial-gradient(circle, ${shoe.glow} 0%, transparent 70%)`,
                        filter: "blur(40px)", opacity: 0.7,
                    }} />

                {/* BIG ghost text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <span className="font-display font-black text-[22vw] leading-none"
                        style={{ color: "rgba(255,255,255,0.025)", transform: `scale(${0.8 + p * 0.4}) translateY(${p * 60}px)`, letterSpacing: "-0.05em" }}>
                        STRD
                    </span>
                </div>

                {/* Title — fades out as you scroll */}
                <div className="absolute top-[18%] left-0 right-0 text-center pointer-events-none"
                    style={{ transform: `translateY(${titleY}px)`, opacity: Math.max(0, titleOp) }}>
                    <p className="font-body text-[10px] tracking-[0.4em] text-orange-400/60 uppercase mb-3">New Season · 2025</p>
                    <h1 className="font-display font-black leading-[0.88]"
                        style={{ fontSize: "clamp(52px,10vw,130px)", color: "#fff", letterSpacing: "-0.04em" }}>
                        RUN THE<br />
                        <span style={{ WebkitTextStroke: "2px #FF4D00", color: "transparent" }}>FUTURE</span>
                    </h1>
                </div>

                {/* Shoe — center stage, transforms with scroll */}
                <div className="relative z-10 w-full max-w-2xl px-8 pointer-events-none"
                    style={{ transform: `translateY(${shoeY}px) scale(${shoeScale}) rotate(${shoeRot}deg)`, transition: "transform 0.05s linear" }}>
                    <ShoeSVG color={shoe.color} trim={shoe.trim} />
                </div>

                {/* Sub content — fades in mid-scroll */}
                <div className="absolute bottom-[14%] left-0 right-0 flex flex-col items-center gap-4 pointer-events-none"
                    style={{ opacity: subOp, transform: `translateY(${subY}px)` }}>
                    <p className="font-body text-slate-400 text-sm tracking-wider">
                        {shoe.name} — {shoe.price}
                    </p>
                    <div className="flex gap-2">
                        {[shoe.color, SHOES[1].color, SHOES[2].color, SHOES[3].color].map((c, i) => (
                            <div key={i} className="w-3 h-3 rounded-full border border-white/20"
                                style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
                        ))}
                    </div>
                    <div className="flex items-center gap-1 animate-bounce mt-2">
                        <span className="text-slate-600 text-[10px] tracking-widest uppercase">Scroll to explore</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── SECTION 2 · Horizontal scroll collection ─────────────────────────────────
const HorizontalCollection: FC = () => {
    const wrap = useRef<HTMLDivElement>(null);
    const p = useScrollProgress(wrap as React.RefObject<HTMLElement | null>);
    const [hov, setHov] = useState<number | null>(null);

    // translate the inner strip
    const N = SHOES.length;
    const tx = -p * (N - 1) * 100; // vw units conceptually

    return (
        <div ref={wrap} style={{ height: `${(N + 1) * 100}vh` }} className="relative">
            <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "#060606" }}>

                {/* Section label */}
                <div className="absolute top-10 left-10 z-20">
                    <p className="font-body text-[10px] tracking-[0.35em] text-slate-600 uppercase">Collection 2025</p>
                    <p className="font-display font-black text-2xl text-white mt-1">Scroll →</p>
                </div>

                {/* Progress dots */}
                <div className="absolute top-10 right-10 z-20 flex gap-2">
                    {SHOES.map((s, i) => {
                        const active = p * N;
                        const dist = Math.abs(active - i);
                        return (
                            <div key={i} className="rounded-full transition-all duration-300"
                                style={{ width: dist < 0.5 ? 24 : 8, height: 8, background: dist < 0.8 ? s.color : "rgba(255,255,255,0.1)" }} />
                        );
                    })}
                </div>

                {/* Horizontal strip */}
                <div className="absolute inset-0 flex"
                    style={{ transform: `translateX(${tx}vw)`, transition: "transform 0.1s linear", width: `${N * 100}vw` }}>
                    {SHOES.map((shoe, i) => {
                        const inView = Math.abs(p * N - i) < 1.2;
                        const isCurrent = Math.abs(p * N - i) < 0.5;
                        return (
                            <div key={shoe.id}
                                className="relative flex-none w-screen h-screen flex items-center overflow-hidden"
                                style={{ background: isCurrent ? `radial-gradient(ellipse at 60% 50%, ${shoe.glow.replace("0.45", "0.12")} 0%, #060606 60%)` : "#060606" }}
                                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>

                                {/* Big number */}
                                <span className="absolute right-8 bottom-8 font-display font-black text-[20vw] leading-none select-none pointer-events-none"
                                    style={{ color: `${shoe.color}12`, letterSpacing: "-0.05em" }}>
                                    0{i + 1}
                                </span>

                                {/* Shoe */}
                                <div className="absolute right-0 w-[55%] h-full flex items-center justify-center pr-8"
                                    style={{ transform: `translateX(${inView ? 0 : 80}px) scale(${isCurrent ? 1 : 0.85})`, opacity: inView ? 1 : 0, transition: "all 0.6s cubic-bezier(.22,1,.36,1)" }}>
                                    <div style={{ transform: hov === i ? "translateY(-12px) rotate(-4deg)" : "translateY(0) rotate(0)", transition: "transform 0.5s cubic-bezier(.22,1,.36,1)" }}>
                                        <ShoeSVG color={shoe.color} trim={shoe.trim} className="drop-shadow-2xl" />
                                    </div>
                                    {/* Glow under shoe */}
                                    <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-64 h-16 rounded-full blur-2xl pointer-events-none"
                                        style={{ background: shoe.glow, opacity: hov === i ? 0.5 : 0.25, transition: "opacity 0.4s" }} />
                                </div>

                                {/* Text */}
                                <div className="relative z-10 pl-16 max-w-sm"
                                    style={{ transform: `translateX(${inView ? 0 : -60}px)`, opacity: inView ? 1 : 0, transition: "all 0.7s cubic-bezier(.22,1,.36,1) 0.1s" }}>
                                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-5"
                                        style={{ background: `${shoe.color}20`, color: shoe.color, border: `1px solid ${shoe.color}40` }}>
                                        {shoe.tag}
                                    </span>
                                    <h2 className="font-display font-black leading-[0.88] mb-4"
                                        style={{ fontSize: "clamp(48px,7vw,96px)", color: "#fff", letterSpacing: "-0.04em" }}>
                                        {shoe.name.split(" ").map((w, wi) => (
                                            <span key={wi} className="block"
                                                style={wi === 1 ? { color: shoe.color } : {}}>{w}</span>
                                        ))}
                                    </h2>
                                    <p className="font-body text-slate-400 text-sm leading-relaxed mb-6 max-w-[240px]">{shoe.desc}</p>

                                    {/* Specs */}
                                    <div className="grid grid-cols-2 gap-2 mb-8">
                                        {shoe.specs.map(([k, v]) => (
                                            <div key={k} className="rounded-xl px-3 py-2.5 border" style={{ background: `${shoe.color}08`, borderColor: `${shoe.color}25` }}>
                                                <p className="text-[9px] tracking-widest uppercase font-semibold font-body" style={{ color: `${shoe.color}aa` }}>{k}</p>
                                                <p className="text-white font-bold text-sm font-body mt-0.5">{v}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="font-display font-black text-4xl" style={{ color: shoe.color }}>{shoe.price}</span>
                                        <button data-cursor className="px-6 py-3 rounded-full text-sm font-bold font-body text-black hover:scale-105 transition-all"
                                            style={{ background: `linear-gradient(135deg, ${shoe.color}, #fff4)`, boxShadow: `0 8px 24px ${shoe.glow}` }}>
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ─── SECTION 3 · 3-up feature tiles with parallax ─────────────────────────────
const FeatureTiles: FC = () => {
    const tiles = [
        { emoji: "⚡", head: "React 3.0 Foam", body: "Energy return you can feel from the first rep. Doesn't pack out.", color: "#FF4D00" },
        { emoji: "🪶", head: "Under 180g", body: "We cut every gram that didn't earn its place on the shoe.", color: "#7C3AED" },
        { emoji: "♾️", head: "5-Year Warranty", body: "We stand behind every sole. If it fails, we replace it. No questions.", color: "#0EA5E9" },
    ];
    return (
        <section className="py-32 px-6 relative overflow-hidden" style={{ background: "#040404" }}>
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,77,0,0.05) 0%, transparent 60%)" }} />

            <div className="max-w-6xl mx-auto">
                <Reveal>
                    <p className="font-body text-[10px] tracking-[0.4em] text-slate-600 uppercase text-center mb-3">Why STRD</p>
                    <h2 className="font-display font-black text-center leading-[0.9] mb-20"
                        style={{ fontSize: "clamp(44px,7vw,88px)", color: "#fff", letterSpacing: "-0.04em" }}>
                        ENGINEERED<br />
                        <span style={{ WebkitTextStroke: "2px #FF4D00", color: "transparent" }}>RELENTLESS</span>
                    </h2>
                </Reveal>

                <div className="grid md:grid-cols-3 gap-5">
                    {tiles.map((t, i) => (
                        <Reveal key={i} delay={i * 120} dir={i === 0 ? "left" : i === 2 ? "right" : "up"}>
                            <div className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 overflow-hidden hover:border-white/15 hover:-translate-y-2 transition-all duration-500">
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ background: `radial-gradient(ellipse at 20% 20%, ${t.color}10, transparent 60%)` }} />
                                <div className="text-5xl mb-6">{t.emoji}</div>
                                <h3 className="font-display font-black text-2xl text-white tracking-wide mb-3">{t.head}</h3>
                                <p className="font-body text-slate-500 text-sm leading-relaxed">{t.body}</p>
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                                    style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }} />
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ─── SECTION 4 · Scroll-parallax split (text left, shoe right) ────────────────
const SplitParallax: FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const p = useScrollProgress(ref as React.RefObject<HTMLElement | null>);
    const shoe = SHOES[1];

    return (
        <div ref={ref} style={{ height: "300vh" }} className="relative">
            <div className="sticky top-0 h-screen overflow-hidden flex items-center" style={{ background: "#030303" }}>
                <div className="max-w-7xl mx-auto px-8 w-full grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left text — parallax up */}
                    <div style={{ transform: `translateY(${-p * 80}px)`, opacity: Math.max(0, 1 - p * 1.5) }}>
                        <Reveal dir="left">
                            <span className="font-body text-[10px] tracking-[0.4em] text-violet-400/70 uppercase">Featured</span>
                            <h2 className="font-display font-black leading-[0.88] mt-3 mb-6"
                                style={{ fontSize: "clamp(52px,8vw,110px)", letterSpacing: "-0.04em" }}>
                                <span className="text-white">PHANTOM</span><br />
                                <span style={{ color: shoe.color }}>AIR</span>
                            </h2>
                            <p className="font-body text-slate-400 text-base leading-relaxed max-w-sm mb-8">{shoe.desc}</p>

                            <div className="flex items-baseline gap-4 mb-8">
                                <span className="font-display font-black text-5xl text-white">{shoe.price}</span>
                                <span className="font-body text-slate-600 text-sm line-through">$299</span>
                            </div>

                            <div className="flex gap-3 flex-wrap">
                                {["7", "8", "9", "9.5", "10", "11"].map(s => (
                                    <button key={s} data-cursor className="w-12 h-10 rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 text-sm font-semibold font-body hover:border-violet-500/50 hover:text-white transition-all">
                                        {s}
                                    </button>
                                ))}
                            </div>

                            <button data-cursor className="mt-8 flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold font-body text-black transition-all hover:scale-105"
                                style={{ background: `linear-gradient(135deg, ${shoe.color}, #a78bfa)`, boxShadow: `0 12px 32px ${shoe.glow}` }}>
                                Add to Cart
                                <span className="text-lg">→</span>
                            </button>
                        </Reveal>
                    </div>

                    {/* Right shoe — parallax down + float */}
                    <div className="relative flex items-center justify-center h-[520px]"
                        style={{ transform: `translateY(${p * 60}px)` }}>
                        <div className="absolute w-80 h-80 rounded-full blur-3xl pointer-events-none"
                            style={{ background: shoe.glow, opacity: 0.3 }} />
                        <div className="absolute w-52 h-52 rounded-full border pointer-events-none"
                            style={{ borderColor: `${shoe.color}30`, animation: "spin 18s linear infinite" }} />

                        <div style={{ animation: "float 4s ease-in-out infinite" }} className="w-full max-w-lg">
                            <ShoeSVG color={shoe.color} trim={shoe.trim} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── SECTION 5 · Full-width testimonial strip ────────────────────────────────
const Testimonials: FC = () => {
    const reviews = [
        { name: "Marcus T.", tag: "Marathon Runner", stars: 5, q: "My PR dropped by 4 minutes. The stack height is exactly what I needed for late-race efficiency." },
        { name: "Aisha K.", tag: "Sneaker Collector", stars: 5, q: "Got stopped twice in the first hour wearing the Phantom Air. Never had that happen with any other shoe." },
        { name: "Luca D.", tag: "Personal Trainer", stars: 5, q: "Best investment of the year. My whole class wants them now." },
    ];
    return (
        <section className="py-28 px-6 relative" style={{ background: "#050505" }}>
            <div className="max-w-6xl mx-auto">
                <Reveal>
                    <p className="font-body text-[10px] tracking-[0.4em] text-slate-600 uppercase text-center mb-2">On the ground</p>
                    <h2 className="font-display font-black text-center leading-[0.9] mb-16"
                        style={{ fontSize: "clamp(40px,6vw,72px)", color: "#fff", letterSpacing: "-0.04em" }}>REAL TALK</h2>
                </Reveal>
                <div className="grid md:grid-cols-3 gap-6">
                    {reviews.map((r, i) => (
                        <Reveal key={i} delay={i * 100}>
                            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-400 group">
                                <div className="flex gap-1 mb-5">
                                    {[...Array(r.stars)].map((_, j) => <span key={j} className="text-orange-400 text-sm">★</span>)}
                                </div>
                                <p className="font-body text-slate-300 text-base leading-relaxed mb-6">"{r.q}"</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-body text-white text-sm font-semibold">{r.name}</p>
                                        <p className="font-body text-slate-600 text-xs">{r.tag}</p>
                                    </div>
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-black group-hover:scale-110 transition-transform"
                                        style={{ background: "linear-gradient(135deg, #FF4D00, #ff8040)" }}>
                                        {r.name[0]}
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ─── SECTION 6 · Email CTA ────────────────────────────────────────────────────
const CTA: FC = () => (
    <section className="py-32 px-6 relative overflow-hidden" style={{ background: "#030303" }}>
        <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(255,77,0,0.08) 0%, transparent 60%)" }} />

        <Reveal>
            <div className="max-w-3xl mx-auto text-center">
                <p className="font-body text-[10px] tracking-[0.4em] text-orange-400/60 uppercase mb-4">Drop Access</p>
                <h2 className="font-display font-black leading-[0.88] mb-6"
                    style={{ fontSize: "clamp(56px,9vw,120px)", letterSpacing: "-0.05em" }}>
                    <span className="text-white">GET </span>
                    <span style={{ WebkitTextStroke: "2px #FF4D00", color: "transparent" }}>EARLY</span><br />
                    <span className="text-white">ACCESS</span>
                </h2>
                <p className="font-body text-slate-500 text-base mb-10 max-w-sm mx-auto">
                    New drops sell out in minutes. Be first — or miss out.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input type="email" placeholder="your@email.com"
                        className="flex-1 px-5 py-3.5 rounded-full text-sm font-body text-white placeholder:text-slate-700 focus:outline-none transition-all"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <button data-cursor className="px-8 py-3.5 rounded-full text-sm font-bold font-body text-black hover:scale-105 transition-all shrink-0"
                        style={{ background: "linear-gradient(135deg,#FF4D00,#ff8040)", boxShadow: "0 8px 32px rgba(255,77,0,0.3)" }}>
                        Join the List
                    </button>
                </div>
            </div>
        </Reveal>
    </section>
);

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Nav: FC<{ scrollY: number }> = ({ scrollY }) => (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-8 h-16 flex items-center justify-between"
        style={{ background: scrollY > 80 ? "rgba(5,5,5,0.95)" : "transparent", backdropFilter: scrollY > 80 ? "blur(20px)" : "none", borderBottom: scrollY > 80 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
        <span className="font-display font-black text-2xl text-white tracking-[0.2em]">STRD</span>
        <div className="hidden md:flex gap-8 font-body text-sm text-slate-400">
            {["Collection", "About", "Stores", "Journal"].map(l => (
                <a key={l} href="#" data-cursor className="hover:text-white transition-colors">{l}</a>
            ))}
        </div>
        <button data-cursor className="px-5 py-2 rounded-full text-sm font-bold font-body text-black hover:scale-105 transition-all"
            style={{ background: "linear-gradient(135deg,#FF4D00,#ff8040)" }}>
            Shop
        </button>
    </nav>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer: FC = () => (
    <footer className="border-t border-white/[0.05] py-10 px-8" style={{ background: "#030303" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-display font-black text-2xl text-white tracking-[0.2em]">STRD</span>
            <p className="font-body text-slate-700 text-xs">© 2025 STRD Inc. Engineered for the relentless.</p>
            <div className="flex gap-6 font-body text-sm text-slate-600">
                {["Privacy", "Terms", "Contact"].map(l => <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>)}
            </div>
        </div>
    </footer>
);

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const ShoesScrollLanding: FC = () => {
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const fn = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <div className="bg-[#050505] text-white" style={{ fontFamily: "sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Barlow Condensed', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        * { cursor: none !important; }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-16px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition-duration: 0.01ms !important; }
          * { cursor: auto !important; }
        }
      `}</style>

            <Cursor />
            <Nav scrollY={scrollY} />
            <PinnedHero />
            <HorizontalCollection />
            <FeatureTiles />
            <SplitParallax />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
};

export default ShoesScrollLanding;
