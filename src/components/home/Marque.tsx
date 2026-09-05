import { type FC } from "react";

const Marquee: FC = () => (
    <div className="border-y border-white/[0.05] py-4 overflow-hidden bg-[#0b0b0b]">
        <div className="animate-marquee font-display font-black text-4xl tracking-[0.15em] text-white/[0.05]">
            {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="mr-10">
                    STRIDER X &nbsp;·&nbsp; PHANTOM AIR &nbsp;·&nbsp; NOVA RUNNER &nbsp;·&nbsp; APEX FORCE &nbsp;·&nbsp;
                </span>
            ))}
        </div>
    </div>
);

export default Marquee;