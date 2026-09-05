import { useState, type FC } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight, Star } from "lucide-react";

import Particles from "../ui/Particles";
import { useInterval, useScrollY } from "../../hooks";
import { HERO_SLIDES } from "../../data";
import ShoeIllustration from "./ShoeIllustration";


type TransitionType = "slide" | "fade" | "zoom" | "flip";

const TRANSITIONS: TransitionType[] = ["slide", "fade", "zoom", "flip"];

const HeroSlider: FC = () => {
    const scrollY = useScrollY();
    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState<number | null>(null);
    const [dir, setDir] = useState<"next" | "prev">("next");
    const [transitioning, setTransitioning] = useState(false);
    const [transitionType, setTransitionType] = useState<TransitionType>("slide");
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [added, setAdded] = useState(false);
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const slide = HERO_SLIDES[current];
    const shoe = slide.shoe;



    // Progress bar
    useInterval(() => {
        if (!paused && !transitioning) setProgress((p) => Math.min(p + 2, 100));
    }, paused ? null : 100);

    const goTo = (direction: "next" | "prev") => {
        if (transitioning) return;
        const nextIdx =
            direction === "next"
                ? (current + 1) % HERO_SLIDES.length
                : (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;

        setDir(direction);
        setTransitionType(TRANSITIONS[nextIdx % TRANSITIONS.length]);
        setPrev(current);
        setTransitioning(true);
        setProgress(0);
        setSelectedSize(null);

        setTimeout(() => {
            setCurrent(nextIdx);
            setTransitioning(false);
            setPrev(null);
        }, 650);
    };
    // Auto-advance every 5s
    useInterval(() => {
        if (!paused && !transitioning) goTo("next");
    }, paused ? null : 5000);

    const jumpTo = (idx: number) => {
        if (idx === current || transitioning) return;
        setDir(idx > current ? "next" : "prev");
        setTransitionType(TRANSITIONS[idx % TRANSITIONS.length]);
        setPrev(current);
        setTransitioning(true);
        setProgress(0);
        setSelectedSize(null);
        setTimeout(() => { setCurrent(idx); setTransitioning(false); setPrev(null); }, 650);
    };

    const handleAdd = () => {
        if (!selectedSize) return;
        setAdded(true);
        setTimeout(() => setAdded(false), 2200);
    };

    // Parallax values
    const shoeLift = Math.min(scrollY * 0.14, 35);
    const shoeRot = Math.min(scrollY * 0.018, 8);

    // ── Transition styles ────────────────────────────────────────────────────
    const getTextStyle = (isLeaving: boolean): React.CSSProperties => {
        const base: React.CSSProperties = {
            transition: "all 0.65s cubic-bezier(.22,1,.36,1)",
            position: "absolute" as const,
            inset: 0,
        };

        if (transitionType === "slide") {
            return {
                ...base,
                opacity: isLeaving ? 0 : 1,
                transform: isLeaving
                    ? dir === "next" ? "translateX(-80px)" : "translateX(80px)"
                    : transitioning
                        ? dir === "next" ? "translateX(80px)" : "translateX(-80px)"
                        : "translateX(0)",
            };
        }
        if (transitionType === "fade") {
            return { ...base, opacity: isLeaving ? 0 : transitioning ? 0 : 1 };
        }
        if (transitionType === "zoom") {
            return {
                ...base,
                opacity: isLeaving ? 0 : transitioning ? 0 : 1,
                transform: isLeaving
                    ? "scale(0.9)"
                    : transitioning ? "scale(1.05)" : "scale(1)",
            };
        }
        if (transitionType === "flip") {
            return {
                ...base,
                opacity: isLeaving ? 0 : transitioning ? 0 : 1,
                transform: isLeaving
                    ? "translateY(-60px) rotateX(15deg)"
                    : transitioning
                        ? "translateY(60px) rotateX(-15deg)"
                        : "translateY(0) rotateX(0)",
            };
        }
        return base;
    };

    const getShoeStyle = (isLeaving: boolean): React.CSSProperties => {
        const base: React.CSSProperties = {
            transition: "all 0.7s cubic-bezier(.22,1,.36,1)",
            position: "absolute" as const,
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        };
        if (transitionType === "slide") {
            return {
                ...base,
                opacity: isLeaving ? 0 : transitioning ? 0 : 1,
                transform: isLeaving
                    ? dir === "next" ? "translateX(100px) rotate(12deg)" : "translateX(-100px) rotate(-12deg)"
                    : transitioning
                        ? dir === "next" ? "translateX(-100px) rotate(-12deg)" : "translateX(100px) rotate(12deg)"
                        : `translateY(${-shoeLift}px) rotate(${-shoeRot}deg)`,
            };
        }
        if (transitionType === "fade") {
            return { ...base, opacity: isLeaving ? 0 : transitioning ? 0 : 1, transform: `translateY(${-shoeLift}px)` };
        }
        if (transitionType === "zoom") {
            return {
                ...base,
                opacity: isLeaving ? 0 : transitioning ? 0 : 1,
                transform: isLeaving
                    ? "scale(0.6) translateY(40px)"
                    : transitioning ? "scale(1.2) translateY(-20px)" : `scale(1) translateY(${-shoeLift}px)`,
            };
        }
        if (transitionType === "flip") {
            return {
                ...base,
                opacity: isLeaving ? 0 : transitioning ? 0 : 1,
                transform: isLeaving
                    ? "perspective(800px) rotateY(90deg)"
                    : transitioning
                        ? "perspective(800px) rotateY(-90deg)"
                        : `perspective(800px) rotateY(0deg) translateY(${-shoeLift}px)`,
            };
        }
        return base;
    };

    return (
        <section
            className="relative min-h-screen overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Dynamic background */}
            <div
                className="absolute inset-0 transition-all duration-700"
                style={{
                    background: `radial-gradient(ellipse at 65% 45%, ${shoe.color}1a 0%, transparent 60%), radial-gradient(ellipse at 15% 85%, ${shoe.color}0d 0%, transparent 55%), #080808`,
                }}
            />

            {/* Rotating rings */}
            <div
                className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border hidden lg:block pointer-events-none"
                style={{
                    borderColor: `${shoe.color}12`,
                    animation: "spin-slow 20s linear infinite",
                }}
            />
            <div
                className="absolute right-[40px] top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border hidden lg:block pointer-events-none"
                style={{
                    borderColor: `${shoe.color}08`,
                    animation: "spin-slow 14s linear infinite reverse",
                }}
            />

            <Particles color={shoe.color} />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 grid lg:grid-cols-2 gap-8 items-center min-h-screen">

                {/* ── Left text ─────────────────────────────────────────── */}
                <div className="relative h-[520px] lg:h-[580px]">

                    {/* Prev slide (leaving) */}
                    {prev !== null && (
                        <div style={getTextStyle(true)}>
                            <SlideText slide={HERO_SLIDES[prev]} selectedSize={null} setSelectedSize={() => { }} onAdd={() => { }} added={false} />
                        </div>
                    )}

                    {/* Current slide */}
                    <div style={getTextStyle(false)}>
                        <SlideText
                            slide={slide}
                            selectedSize={selectedSize}
                            setSelectedSize={setSelectedSize}
                            onAdd={handleAdd}
                            added={added}
                        />
                    </div>
                </div>

                {/* ── Right shoe ────────────────────────────────────────── */}
                <div className="relative h-[320px] lg:h-[580px]">
                    {/* Glow orb */}
                    <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div
                            className="w-72 h-72 rounded-full blur-3xl transition-all duration-700"
                            style={{ background: `${shoe.color}28` }}
                        />
                    </div>

                    {/* Pulse ring */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="w-52 h-52 rounded-full border-2"
                            style={{
                                borderColor: `${shoe.color}45`,
                                animation: "pulse-ring 2.2s ease-out infinite",
                            }}
                        />
                    </div>

                    {/* Leaving shoe */}
                    {prev !== null && (
                        <div style={getShoeStyle(true)}>
                            <div className="w-full max-w-lg px-6">
                                <ShoeIllustration color={HERO_SLIDES[prev].shoe.color} />
                            </div>
                        </div>
                    )}

                    {/* Current shoe */}
                    <div style={getShoeStyle(false)}>
                        <div className="w-full max-w-lg px-6">
                            <ShoeIllustration color={shoe.color} />
                        </div>
                    </div>

                    {/* Floating spec chips */}
                    {shoe.specs.slice(0, 2).map((spec, i) => (
                        <div
                            key={i}
                            className="absolute hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.06] backdrop-blur-md border border-white/10 text-xs font-semibold font-body transition-all duration-700"
                            style={{
                                top: i === 0 ? "12%" : undefined,
                                bottom: i === 1 ? "18%" : undefined,
                                left: i === 0 ? "0%" : undefined,
                                right: i === 1 ? "2%" : undefined,
                                color: shoe.color,
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: shoe.color }} />
                            {spec}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Controls ──────────────────────────────────────────────── */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pb-10">
                <div className="flex items-center justify-between">

                    {/* Slide dots + thumbnails */}
                    <div className="flex items-center gap-3">
                        {HERO_SLIDES.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => jumpTo(i)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300"
                                style={{
                                    background: current === i ? `${s.shoe.color}18` : "rgba(255,255,255,0.03)",
                                    borderColor: current === i ? `${s.shoe.color}50` : "rgba(255,255,255,0.07)",
                                }}
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-all"
                                    style={{
                                        background: s.shoe.color,
                                        transform: current === i ? "scale(1.3)" : "scale(1)",
                                        boxShadow: current === i ? `0 0 8px ${s.shoe.color}` : "none",
                                    }}
                                />
                                <span
                                    className="font-display font-bold text-xs tracking-wider hidden sm:block"
                                    style={{ color: current === i ? s.shoe.color : "#475569" }}
                                >
                                    {s.shoe.name.split(" ")[0]}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Arrows */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goTo("prev")}
                            disabled={transitioning}
                            className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => goTo("next")}
                            disabled={transitioning}
                            className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-none"
                        style={{
                            width: `${progress}%`,
                            background: shoe.color,
                            boxShadow: `0 0 8px ${shoe.color}`,
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

// ── Slide Text Content (extracted to avoid duplication) ────────────────────
interface SlideTextProps {
    slide: typeof HERO_SLIDES[0];
    selectedSize: number | null;
    setSelectedSize: (s: number) => void;
    onAdd: () => void;
    added: boolean;
}

const SlideText: FC<SlideTextProps> = ({ slide, selectedSize, setSelectedSize, onAdd, added }) => {
    const shoe = slide.shoe;
    return (
        <div className="flex flex-col justify-center h-full space-y-5 py-24 lg:py-0">
            {/* Badge */}
            <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase border w-fit"
                style={{ color: shoe.color, borderColor: `${shoe.color}40`, background: `${shoe.color}12` }}
            >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: shoe.color }} />
                {shoe.badge}
            </div>

            {/* Headline */}
            <h1
                className="font-display font-black leading-[0.88] tracking-tight"
                style={{ fontSize: "clamp(64px, 9vw, 118px)" }}
            >
                <span className="block text-white">{slide.headline[0]}</span>
                <span
                    className="block"
                    style={{
                        background: `linear-gradient(135deg, ${shoe.color}, #fff)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {slide.headline[1]}
                </span>
            </h1>

            <p className="font-body text-slate-400 text-base leading-relaxed max-w-xs">{slide.sub}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
                <span className="font-display font-black text-5xl text-white">{shoe.price}</span>
                <span className="font-body text-slate-600 text-sm line-through">{shoe.oldPrice}</span>
            </div>

            {/* Sizes */}
            <div>
                <p className="font-body text-[11px] text-slate-600 uppercase tracking-widest mb-2.5">
                    US Size {selectedSize && <span style={{ color: shoe.color }}>· {selectedSize}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                    {shoe.sizes.map((s) => (
                        <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className="w-11 h-9 rounded-lg text-xs font-semibold font-body border transition-all duration-200 hover:scale-105"
                            style={{
                                background: selectedSize === s ? shoe.color : "rgba(255,255,255,0.04)",
                                borderColor: selectedSize === s ? shoe.color : "rgba(255,255,255,0.1)",
                                color: selectedSize === s ? "#000" : "#64748b",
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-1">
                <button
                    onClick={onAdd}
                    disabled={!selectedSize}
                    className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold font-body transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                    style={{
                        background: selectedSize ? `linear-gradient(135deg, ${shoe.color}, #ff8040)` : "#1e293b",
                        color: selectedSize ? "#000" : "#475569",
                        boxShadow: selectedSize ? `0 8px 28px ${shoe.color}40` : "none",
                    }}
                >
                    <ShoppingBag size={15} />
                    {added ? "Added ✓" : "Add to Cart"}
                </button>
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold font-body border border-white/15 text-slate-300 hover:text-white hover:border-white/30 transition-all">
                    Explore <ArrowRight size={14} />
                </button>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2 pt-1">
                <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-orange-400 text-orange-400" />)}
                </div>
                <span className="font-body text-slate-500 text-xs">4.9 · 2,841 reviews</span>
            </div>
        </div>
    );
};

export default HeroSlider;