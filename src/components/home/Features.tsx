import { type FC } from "react";
import { Zap, Shield, Truck } from "lucide-react";
import Reveal from "../ui/Reveal";

const FEATURES = [
    { icon: Zap, title: "Ultra Light", desc: "Under 180g. You'll forget you have them on." },
    { icon: Shield, title: "5-Year Warranty", desc: "We stand behind every stitch and sole." },
    { icon: Truck, title: "Free Next-Day", desc: "Order before 8pm — at your door tomorrow." },
];

const Features: FC = () => (
    <section className="py-28 px-6 max-w-7xl mx-auto">
        <Reveal>
            <p className="font-body text-xs text-slate-600 uppercase tracking-[0.3em] text-center mb-2">Why STRD</p>
            <h2
                className="font-display font-black text-center text-white leading-none mb-20"
                style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
            >
                ENGINEERED{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-400">
                    DIFFERENT
                </span>
            </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                    <Reveal key={i} delay={i * 120}>
                        <div className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 hover:border-orange-500/25 hover:bg-white/[0.04] transition-all duration-400 overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                                style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(255,77,0,0.06), transparent 65%)" }} />
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 transition-all duration-400 group-hover:scale-110 group-hover:-rotate-6">
                                <Icon size={22} className="text-orange-400" />
                            </div>
                            <h3 className="font-display font-black text-xl text-white mb-2 tracking-wide">{f.title}</h3>
                            <p className="font-body text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    </Reveal>
                );
            })}
        </div>
    </section>
);

export default Features;