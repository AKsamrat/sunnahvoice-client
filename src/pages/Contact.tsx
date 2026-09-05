import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";
import { api, apiErrorMessage } from "../lib/api";

const topics = [
  "General question",
  "Suggest media",
  "Report an issue",
  "Partnership",
];

const contactCards = [
  {
    icon: Mail,
    title: "Email us",
    detail: "hello@sunnahvoice.com",
    note: "For general questions",
  },
  {
    icon: MessageCircle,
    title: "Contribute",
    detail: "media@sunnahvoice.com",
    note: "Suggest beneficial media",
  },
  {
    icon: Clock3,
    title: "Response time",
    detail: "Within 1–2 days",
    note: "Sunday through Thursday",
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    setError("");
    setLoading(true);
    try {
      await api.post("/contact", payload);
      setSubmitted(true);
      form.reset();
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f3e9] pb-24 pt-20 text-emerald-950 dark:bg-[#061914] dark:text-emerald-50">
      <section className="relative overflow-hidden bg-[#062c24] px-6 py-20 text-white">
        <div className="islamic-watermark-bg absolute inset-0 opacity-50" />
        <div className="banner-star-pattern absolute inset-0 opacity-65" />
        <div className="absolute right-[-8rem] top-[-10rem] h-96 w-96 rounded-full border border-[#d6a84b]/20" />
        <div className="relative mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1fr_.6fr]">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#e2bd69]">
              <MessageCircle size={15} />
              Get in touch
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-[1.04] sm:text-7xl">
              Let’s start a{" "}
              <span className="font-serif italic text-[#e2bd69]">
                meaningful conversation.
              </span>
            </h1>
          </div>
          <p className="max-w-lg text-lg leading-8 text-emerald-50/60">
            Have a question, a media suggestion or an idea for collaboration? We
            would be glad to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-1 max-w-7xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="rounded-[1.75rem] border border-emerald-950/10 bg-white p-6 shadow-[0_15px_40px_rgba(4,47,39,.06)] dark:border-white/10 dark:bg-white/5"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#efe3c6] text-[#976c1f] dark:bg-[#d6a84b] dark:text-emerald-950">
                  <Icon size={21} />
                </span>
                <h2 className="mt-5 text-lg font-bold">{card.title}</h2>
                <p className="mt-1 font-semibold text-[#a67928]">
                  {card.detail}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-emerald-100/40">
                  {card.note}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[.72fr_1.28fr]">
        <aside className="relative overflow-hidden rounded-[2rem] bg-[#0a352c] p-8 text-white sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(214,168,75,.25),transparent_30%)]" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#e2bd69]">
              Before you write
            </p>
            <h2 className="mt-4 text-3xl font-bold">How can we help?</h2>
            <p className="mt-4 leading-7 text-white/55">
              Choose the closest topic in the form. It helps your message reach
              the right person quickly.
            </p>
            <div className="mt-9 space-y-5">
              {[
                "Suggest a recitation, video or image",
                "Ask about usage and download rights",
                "Report incorrect or broken media",
                "Discuss a beneficial collaboration",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-[#d6a84b]"
                    size={19}
                  />
                  <span className="text-sm text-white/75">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 border-t border-white/10 pt-7">
              <p className="flex items-center gap-2 text-sm font-bold">
                <MapPin size={17} className="text-[#d6a84b]" />
                Serving the global Muslim community
              </p>
              <p className="mt-2 text-sm text-white/40">
                Dhaka, Bangladesh · Available worldwide
              </p>
            </div>
          </div>
        </aside>

        <div className="rounded-[2rem] border border-emerald-950/10 bg-white p-7 shadow-xl dark:border-white/10 dark:bg-white/5 sm:p-10">
          {submitted ? (
            <div className="grid min-h-[540px] place-content-center text-center">
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#d6a84b] dark:text-emerald-950">
                <CheckCircle2 size={38} />
              </span>
              <h2 className="mt-6 text-3xl font-bold">Message received</h2>
              <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-500">
                JazakAllahu khayran for reaching out. We’ll respond as soon as
                possible.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mx-auto mt-7 font-bold text-[#a67928]"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.22em] text-[#a67928]">
                  Send a message
                </p>
                <h2 className="mt-2 text-3xl font-bold">
                  Tell us what’s on your mind.
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="mt-9 space-y-6">
                {error && (
                  <div role="alert" className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">
                      Your name
                    </span>
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder="Full name"
                      className="contact-input"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">
                      Email address
                    </span>
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="contact-input"
                    />
                  </label>
                </div>
                <fieldset>
                  <legend className="mb-3 text-sm font-bold">
                    What can we help with?
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {topics.map((topic, index) => (
                      <label
                        key={topic}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-emerald-950/10 p-4 transition has-[:checked]:border-[#b38735] has-[:checked]:bg-[#f4ead3] dark:border-white/10 dark:has-[:checked]:bg-[#d6a84b]/10"
                      >
                        <input
                          required
                          defaultChecked={index === 0}
                          type="radio"
                          name="topic"
                          value={topic}
                          className="accent-[#9c7124]"
                        />
                        <span className="text-sm font-semibold">{topic}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold">Subject</span>
                  <input
                    required
                    name="subject"
                    type="text"
                    placeholder="A short summary"
                    className="contact-input"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold">
                    Your message
                  </span>
                  <textarea
                    required
                    name="message"
                    rows={6}
                    placeholder="Share the details with us..."
                    className="contact-input resize-none"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-7 py-4 font-bold text-white transition hover:bg-[#b38735] dark:bg-[#d6a84b] dark:text-emerald-950"
                >
                  <Send size={18} />
                  {loading ? "Sending..." : "Send message"} <ArrowRight size={17} />
                </button>
                <p className="text-center text-xs text-slate-400">
                  By sending this form, you agree that we may reply to your
                  email.
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
