import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthVisualPanel from "../components/auth/AuthVisualPanel";
import { api, apiErrorMessage, saveAuthToken } from "../lib/api";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));

    if (payload.password !== payload.password_confirmation) {
      setError("The passwords do not match. Please try again.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name: String(payload.name),
        email: String(payload.email),
        password: String(payload.password),
        password_confirmation: String(payload.password_confirmation),
      });
      saveAuthToken(response.data.token);
      setSubmitted(true);
      navigate("/");
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
        <section className="islamic-watermark-bg flex items-center justify-center px-6 py-14">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-8 flex items-center gap-3 text-emerald-950 dark:text-white lg:hidden"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-950 text-[#e2bd69] dark:bg-[#d6a84b] dark:text-emerald-950">
                <BookOpen size={20} />
              </span>
              <strong className="text-lg">SunnahVoice</strong>
            </Link>
            <p className="text-xs font-bold uppercase tracking-[.24em] text-[#a67928]">
              Join the community
            </p>
            <h1 className="mt-3 text-4xl font-bold text-emerald-950 dark:text-white sm:text-5xl">
              Create your account.
            </h1>
            <p className="mt-4 text-slate-500 dark:text-emerald-100/45">
              Free, simple and created to keep beneficial media close.
            </p>

            {submitted && (
              <div className="mt-6 rounded-2xl border border-emerald-700/15 bg-emerald-100/60 p-4 text-sm text-emerald-900 dark:border-[#d6a84b]/20 dark:bg-[#d6a84b]/10 dark:text-[#efd58f]">
                Your account was created successfully.
              </div>
            )}
            {error && (
              <div
                role="alert"
                className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-emerald-950 dark:text-emerald-50">
                  Full name
                </span>
                <span className="auth-input-wrap">
                  <User size={18} />
                  <input
                    required
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                  />
                </span>
              </label>
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
                    autoComplete="new-password"
                    minLength={8}
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide passwords" : "Show passwords"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-emerald-950 dark:text-emerald-50">
                  Confirm password
                </span>
                <span className="auth-input-wrap">
                  <Lock size={18} />
                  <input
                    required
                    name="password_confirmation"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    placeholder="Repeat your password"
                  />
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 py-2 text-sm leading-6 text-slate-600 dark:text-emerald-100/50">
                <input
                  required
                  name="terms"
                  type="checkbox"
                  className="mt-1 accent-[#a67928]"
                />
                <span>
                  I agree to the{" "}
                  <a href="#" className="font-bold text-[#9c7124]">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-bold text-[#9c7124]">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-6 py-4 font-bold text-white transition hover:bg-[#a67928] dark:bg-[#d6a84b] dark:text-emerald-950"
              >
                {loading ? "Creating account..." : "Create account"} <ArrowRight size={18} />
              </button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-[#9c7124]">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
