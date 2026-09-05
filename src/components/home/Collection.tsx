import { type FC } from "react";
import { ArrowRight } from "lucide-react";

import Reveal from "../ui/Reveal";
import { SHOES } from "../../data";
import ShoeIllustration from "./ShoeIllustration";

const Collection: FC = () => (
    <section className="py-24 px-6 bg-[#090909]">
        <div className="max-w-7xl mx-auto">
            <Reveal>
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="font-body text-xs text-slate-600 uppercase tracking-[0.3em] mb-2">2025 Drop</p>
                        <h2
                            className="font-display font-black text-white leading-none"
                            style={{ fontSize: "clamp(40px, 5vw, 70px)" }}
                        >
                            FULL<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-400">
                                COLLECTION
                            </span>
                        </h2>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-sm font-semibold font-body text-slate-400 hover:text-white transition-colors">
                        See All <ArrowRight size={16} />
                    </button>
                </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {SHOES.map((shoe, i) => (
                    <Reveal
                        key={shoe.id}
                        delay={i * 90}
                        direction={i === 0 ? "left" : i === SHOES.length - 1 ? "right" : "up"}
                    >
                        <div
                            className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/[0.06] hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
                            style={{ background: `linear-gradient(145deg, ${shoe.color}10, #0a0a0a)` }}
                        >
                            {/* Badge */}
                            <div
                                className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase"
                                style={{ background: shoe.color, color: "#000" }}
                            >
                                {shoe.badge}
                            </div>

                            {/* Shoe */}
                            <div className="h-48 flex items-center justify-center px-6 pt-6 pb-2 transition-transform duration-500 group-hover:-translate-y-2">
                                <ShoeIllustration color={shoe.color} />
                            </div>

                            {/* Info */}
                            <div className="p-5 border-t border-white/[0.05]">
                                <div className="flex items-end justify-between mb-3">
                                    <div>
                                        <p className="font-display font-black text-lg text-white tracking-wide">{shoe.name}</p>
                                        <p className="font-body text-slate-500 text-xs mt-0.5 truncate">{shoe.tagline}</p>
                                    </div>
                                    <span className="font-display font-black text-xl shrink-0 ml-2" style={{ color: shoe.color }}>
                                        {shoe.price}
                                    </span>
                                </div>
                                <button
                                    className="w-full py-2 rounded-xl text-xs font-semibold font-body border transition-all duration-200 group-hover:scale-[1.02]"
                                    style={{
                                        borderColor: `${shoe.color}40`,
                                        color: shoe.color,
                                        background: `${shoe.color}0e`,
                                    }}
                                >
                                    Quick Add
                                </button>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default Collection;