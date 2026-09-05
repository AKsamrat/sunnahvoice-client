import { CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Save media to your personal collection",
  "Continue listening across your devices",
  "Receive carefully selected new reminders",
];

export default function AuthVisualPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-[#062c24] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <img
        src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=85"
        alt="The Holy Kaaba in Makkah"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#062c24]/70 via-[#062c24]/90 to-[#031a15]" />
      <div className="islamic-watermark-bg absolute inset-0 opacity-35" />

      <Link to="/" className="relative" aria-label="SunnahVoice home">
        <img src="/sunnahvoice-logo.svg" alt="SunnahVoice" className="h-14 w-auto" />
      </Link>

      <div className="relative max-w-lg">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.24em] text-[#e2bd69]">
          <Sparkles size={15} /> A more personal experience
        </p>
        <h2 className="mt-5 text-4xl font-bold leading-tight xl:text-5xl">
          Keep beneficial media close to your heart.
        </h2>
        <p className="mt-5 leading-7 text-emerald-50/55">
          Create a quiet space for the images, recitations and reminders that
          matter to you.
        </p>

        <div className="mt-8 space-y-4">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="shrink-0 text-[#d6a84b]" size={19} />
              <span className="text-white/75">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="relative text-xs text-white/30">
        Free to join · Created for the global Muslim community
      </p>
    </aside>
  );
}
