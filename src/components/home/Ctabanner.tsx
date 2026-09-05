import { type FC } from "react";
import Reveal from "../ui/Reveal";

const CTABanner: FC = () => (
    <section className="py-24 px-6">
        <Reveal>
            <div className="max-w-4xl mx-auto text-center relative">
                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div
                        className="w-96 h-80 rounded-full blur-3xl"
                        style={{ background: "rgba(255,77,0,0.07)" }}
                    />
                </div>

                <p className="font-body text-xs text-slate-600 uppercase tracking-[0.3em] mb-4">
                    Limited time
                </p>
                <h2
                    className="font-display font-black text-white leading-none mb-6"
                    style={{ fontSize: "clamp(52px, 8vw, 110px)" }}
                >
                    20% OFF<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-400 to-orange-300">
                        FIRST ORDER
                    </span>
                </h2>
                <p className="font-body text-slate-400 text-base mb-10 max-w-sm mx-auto">
                    Drop your email. Get the code. Wear something iconic.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="your@email.com"
                        className="flex-1 px-5 py-3.5 rounded-full bg-white/[0.05] border border-white/15 text-white text-sm font-body placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                    />
                    <button
                        className="px-7 py-3.5 rounded-full text-sm font-bold font-body text-black hover:scale-105 transition-all"
                        style={{
                            background: "linear-gradient(135deg, #FF4D00, #ff8040)",
                            boxShadow: "0 8px 32px rgba(255,77,0,0.28)",
                        }}
                    >
                        Claim 20% Off
                    </button>
                </div>
            </div>
        </Reveal>
    </section>
);

export default CTABanner;