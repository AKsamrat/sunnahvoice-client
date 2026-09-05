import { type FC } from "react";

interface ParticlesProps {
  color: string;
}

const Particles: FC<ParticlesProps> = ({ color }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 14 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full animate-float-particle"
        style={{
          width: 3 + (i % 5) * 3,
          height: 3 + (i % 5) * 3,
          background: color,
          opacity: 0.1 + (i % 4) * 0.07,
          left: `${5 + i * 6.8}%`,
          top: `${10 + (i % 6) * 13}%`,
          animationDelay: `${i * 0.35}s`,
          animationDuration: `${3.5 + (i % 4)}s`,
        }}
      />
    ))}
  </div>
);

export default Particles;