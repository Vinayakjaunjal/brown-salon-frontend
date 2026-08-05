import React, { useState } from "react";
import { ArrowLeft, Send, Sparkles, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import api from "../utils/api";
import { AuthSticker } from "../components/illustrations/SalonIllustrations";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setSuccess(response.data.message || "Reset link sent to your email");

      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit password reset request",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] overflow-x-hidden bg-[#FBF6EE] py-6 sm:py-10 md:py-14">
      <style>{`
        @keyframes login-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-animate {
          animation: login-fade-up 0.6s ease-out both;
        }
      `}</style>

      <div className="mx-auto w-full max-w-5xl px-3 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl sm:rounded-3xl border border-amber-100 shadow-xl shadow-amber-900/5 overflow-hidden">
          {/* FORM — left on desktop */}
          <section className="order-1 p-5 sm:p-7 md:p-10 login-animate">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Brown Salon
              </span>
              <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">
                Forgot Password
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Enter your registered email and we&apos;ll send you a reset
                link.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2 break-words">
                {error}
              </div>
            )}

            {success ? (
              <div className="text-center py-2">
                <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 text-2xl">✓</span>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-gray-900">
                  Check your email
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  We&apos;ve sent a password reset link to your email address.
                </p>

                <button
                  onClick={() => navigate("/login")}
                  className="mt-5 w-full py-3 rounded-2xl bg-amber-400 text-gray-900 font-semibold hover:bg-amber-300 transition-all hover:-translate-y-0.5"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  error={Boolean(error)}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-amber-400 text-gray-900 font-semibold hover:bg-amber-300 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed inline-flex justify-center items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Submitting..." : "Send Request"}
                </button>
              </form>
            )}

            {!success && (
              <div className="text-center text-sm text-gray-600 mt-5">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center gap-2 font-semibold text-amber-600 underline underline-offset-2 hover:text-amber-700"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            )}
          </section>

          {/* ILLUSTRATION — right on desktop */}
          <section className="order-2 relative overflow-hidden flex bg-gradient-to-br from-amber-100 via-amber-50 to-white p-6 sm:p-8 xl:p-10 login-animate">
            <div className="absolute -top-14 -right-10 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="absolute -bottom-14 -left-10 h-48 w-48 rounded-full bg-amber-200/25 blur-3xl" />

            <div className="relative flex flex-col justify-between w-full">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  <ShieldCheck size={14} />
                  Trusted by thousands
                </span>
                <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  Recover access to your Brown Salon account.
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                  We'll email you a secure link so you can set a new password in
                  seconds.
                </p>
              </div>
              <div className="w-full max-w-xs sm:max-w-sm mx-auto mt-6 lg:mt-0">
                <AuthSticker />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
