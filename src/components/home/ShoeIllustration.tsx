import { type FC } from "react";

interface Props {
    color: string;
    className?: string;
}

const ShoeIllustration: FC<Props> = ({ color, className = "" }) => (
    <svg
        viewBox="0 0 520 290"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-2xl ${className}`}
    >
        {/* Ground shadow */}
        <ellipse cx="258" cy="275" rx="185" ry="11" fill="rgba(0,0,0,0.4)" />

        {/* Outsole */}
        <path
            d="M58 218 Q46 250 88 258 L408 258 Q458 258 458 232 Q458 212 426 209 Z"
            fill="#0d0d0d"
        />
        {/* Midsole */}
        <path
            d="M68 216 L424 216 Q450 216 450 230 Q450 244 424 247 L78 247 Q54 247 58 230 Z"
            fill="#181818"
        />
        {/* Midsole accent stripe */}
        <path d="M72 222 L420 222 L420 228 L72 228 Z" fill={color} opacity="0.75" />

        {/* Main upper */}
        <path
            d="M78 212 Q66 164 98 132 Q128 100 178 94 L342 90 Q394 90 424 122 Q450 152 446 212 Z"
            fill={color}
        />
        {/* Sheen overlay */}
        <path
            d="M98 208 Q92 162 120 134 Q146 108 188 100 L334 96 Q376 96 400 128 Q420 156 418 208 Z"
            fill="rgba(255,255,255,0.09)"
        />

        {/* Toe reinforcement */}
        <path
            d="M78 212 Q66 164 98 132 Q112 116 138 108 L143 208 Z"
            fill="rgba(0,0,0,0.22)"
        />

        {/* Heel cup */}
        <path
            d="M392 208 Q424 202 446 212 Q450 160 420 122 Q406 106 378 98 L382 208 Z"
            fill="rgba(0,0,0,0.18)"
        />

        {/* Lace window */}
        <path
            d="M172 100 Q232 93 298 96 L298 150 Q232 144 172 152 Z"
            fill="rgba(255,255,255,0.13)"
            rx="4"
        />

        {/* Laces */}
        {[108, 117, 126, 135, 144].map((y, i) => (
            <line
                key={i}
                x1="177"
                y1={y}
                x2="292"
                y2={y - 2}
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.65"
            />
        ))}
        {/* Lace eyelets */}
        {[108, 117, 126, 135, 144].map((y, i) => (
            <>
                <circle key={`l${i}`} cx="177" cy={y} r="3" fill="rgba(0,0,0,0.5)" />
                <circle key={`r${i}`} cx="292" cy={y - 2} r="3" fill="rgba(0,0,0,0.5)" />
            </>
        ))}

        {/* Tongue */}
        <path
            d="M198 96 Q232 88 268 96 L263 46 Q232 38 202 46 Z"
            fill={color}
        />
        <path
            d="M202 93 Q232 85 264 93 L260 50 Q232 42 205 50 Z"
            fill="rgba(255,255,255,0.12)"
        />
        {/* Tongue logo mark */}
        <rect x="222" y="62" width="20" height="14" rx="2" fill="rgba(255,255,255,0.25)" />

        {/* Side logo swoosh */}
        <path
            d="M308 162 Q352 148 396 160 Q368 176 326 179 Q294 175 308 162 Z"
            fill="rgba(255,255,255,0.22)"
        />

        {/* Pull tab */}
        <rect x="406" y="112" width="20" height="58" rx="7" fill={color} />
        <rect x="410" y="115" width="12" height="10" rx="3" fill="rgba(255,255,255,0.38)" />

        {/* Toe stitch line */}
        <path
            d="M100 140 Q110 120 140 112"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
            strokeDasharray="4 3"
        />
    </svg>
);

export default ShoeIllustration;