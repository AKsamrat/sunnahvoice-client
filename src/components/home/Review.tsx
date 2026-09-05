import { type FC } from "react";
import { Star } from "lucide-react";
import { REVIEWS } from "../../data";
import Reveal from "../ui/Reveal";

const Reviews: FC = () => (
    <section className="py-28 px-6 max-w-7xl mx-auto">
        <Reveal>
            <p className="font-body text-xs text-slate-600 uppercase tracking-[0.3em] text-center mb-2">
                Heard on the street
            </p>
            <h2
                className="font-display font-black text-center text-white mb-16"
                style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
            >
                REAL TALK
            </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
                <Reveal key={i} delay={i * 110}>
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-400 group">
                        <div className="flex gap-1 mb-5">
                            {[...Array(r.rating)].map((_, j) => (
                                <Star key={j} size={14} className="fill-orange-400 text-orange-400" />
                            ))}
                        </div>
                        <p className="font-body text-slate-300 text-base leading-relaxed mb-6">
                            "{r.text}"
                        </p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-body text-white text-sm font-semibold">{r.name}</p>
                                <p className="font-body text-slate-600 text-xs">{r.tag}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xs font-black text-black group-hover:scale-110 transition-transform">
                                {r.name[0]}
                            </div>
                        </div>
                    </div>
                </Reveal>
            ))}
        </div>
    </section>
);

export default Reviews;
