import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthVisualPanel from "../components/auth/AuthVisualPanel";
import { api, apiErrorMessage, saveAuthToken } from "../lib/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      saveAuthToken(response.data.token);
      setSubmitted(true);
      const from = location.state?.from;
      navigate(typeof from === "string" && from.startsWith("/blog/") ? from : response.data.user.role === "admin" ? "/dashboard" : "/");
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f3e9] pt-20 dark:bg-[#061914]">
      <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-[1.05fr_.95fr]">
        <AuthVisualPanel />

        <section className="islamic-watermark-bg flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-10 flex items-center gap-3 text-emerald-950 dark:text-white lg:hidden"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-950 text-[#e2bd69] dark:bg-[#d6a84b] dark:text-emerald-950">
                <BookOpen size={20} />
              </span>
              <strong className="text-lg">SunnahVoice</strong>
            </Link>

            <p className="text-xs font-bold uppercase tracking-[.24em] text-[#a67928]">
              Welcome back
            </p>
            <h1 className="mt-3 text-4xl font-bold text-emerald-950 dark:text-white sm:text-5xl">
              Sign in to your space.
            </h1>
            <p className="mt-4 text-slate-500 dark:text-emerald-100/45">
              Continue exploring and saving beneficial Islamic media.
            </p>

            {submitted && (
              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-emerald-700/15 bg-emerald-100/60 p-4 text-sm text-emerald-900 dark:border-[#d6a84b]/20 dark:bg-[#d6a84b]/10 dark:text-[#efd58f]">
                <ShieldCheck className="mt-0.5 shrink-0" size={18} />
                <span>
                  You are signed in successfully.
                </span>
              </div>
            )}
            {error && (
              <div role="alert" className="mt-7 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-emerald-950 dark:text-emerald-50">
                  Email address
                </span>
                <span className="auth-input-wrap">
                  <Mail size={18} />
                  <input
                    required
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-emerald-950 dark:text-emerald-50">
                  Password
                </span>
                <span className="auth-input-wrap">
                  <Lock size={18} />
                  <input
                    required
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    minLength={8}
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>
              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-slate-600 dark:text-emerald-100/50">
                  <input
                    name="remember"
                    type="checkbox"
                    className="accent-[#a67928]"
                  />
                  Remember me
                </label>
                <button type="button" className="font-bold text-[#9c7124]">
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-6 py-4 font-bold text-white transition hover:bg-[#a67928] dark:bg-[#d6a84b] dark:text-emerald-950"
              >
                {loading ? "Signing in..." : "Sign in"} <ArrowRight size={18} />
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <span className="h-px flex-1 bg-emerald-950/10 dark:bg-white/10" />
              <span className="text-xs uppercase tracking-wider text-slate-400">
                New here?
              </span>
              <span className="h-px flex-1 bg-emerald-950/10 dark:bg-white/10" />
            </div>
            <Link
              to="/register"
              className="flex w-full items-center justify-center rounded-full border border-emerald-950/15 px-6 py-4 font-bold text-emerald-950 transition hover:bg-emerald-950 hover:text-white dark:border-white/15 dark:text-white dark:hover:bg-white/10"
            >
              Create a free account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
