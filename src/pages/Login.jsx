import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, ShieldCheck } from "lucide-react";
import Input from "../components/Input";
import api from "../utils/api";
import { AuthSticker } from "../components/illustrations/SalonIllustrations";
import { clearAuthSession } from "../utils/auth";

const phoneRegex = /^\+?[0-9\s()-]{8,20}$/;

export default function Login() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const nav = useNavigate();
  const roleBlockedMessage = location.state?.error || "";

  const title = useMemo(
    () => (isRegister ? "Create your account" : "Welcome back"),
    [isRegister],
  );
  const subtitle = useMemo(
    () =>
      isRegister
        ? "Join Brown Salon and book salon services in minutes."
        : "Sign in to continue your Brown experience.",
    [isRegister],
  );

  const validateForm = () => {
    const nextErrors = {};

    if (isRegister && !name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      nextErrors.email = "Please enter a valid email";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetFormState = () => {
    setError("");
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetFormState();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // LOGIN
      if (!isRegister) {
        const res = await api.post("/auth/login", {
          email: email.trim().toLocaleLowerCase(),
          password,
        });

        const { token, user } = res.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role);

        nav("/profile");
        return;
      }

      // REGISTER → SEND OTP
      await api.post("/auth/send-otp", {
        email: email.trim().toLowerCase(),
      });

      setStep(2);
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    if (timer === 0) {
      setCanResend(true);
    }
  }, [step, timer]);

  const handleVerifyOtp = async () => {
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        email: email.trim().toLowerCase(),
        otp,
        name,
        password,
      });

      const { token, user } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      nav("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await api.post("/auth/send-otp", {
      email: email.trim().toLowerCase(),
    });

    setTimer(30);
    setCanResend(false);
  };

  const switchMode = () => {
    setIsRegister((prev) => !prev);
    setError("");
    setFieldErrors({});
    setStep(1);
    setOtp("");
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
          {/* FORM — now on the left on desktop */}
          <section className="order-1 p-5 sm:p-7 md:p-10 login-animate">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Brown Salon
              </span>
              <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">
                {title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            </div>

            {(error || roleBlockedMessage) && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2 break-words">
                {error || roleBlockedMessage}
              </div>
            )}

            <form
              onSubmit={step === 1 ? handleSubmit : (e) => e.preventDefault()}
              className="space-y-4"
            >
              {step === 1 && (
                <>
                  {isRegister && (
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                    />
                  )}

                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />

                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />

                  {!isRegister && (
                    <div className="text-right -mt-2">
                      <button
                        type="button"
                        onClick={() => nav("/forgot-password")}
                        className="text-sm text-gray-900 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <div className="rounded-xl border border-amber-100 bg-[#FBF6EE] p-3 text-center text-sm text-gray-600">
                    OTP sent to{" "}
                    <span className="font-semibold text-gray-900">{email}</span>
                  </div>

                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="w-full py-3 rounded-2xl bg-amber-400 text-gray-900 font-semibold hover:bg-amber-300 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <div className="text-center text-sm text-gray-500">
                    {canResend ? (
                      <button
                        onClick={handleResendOtp}
                        className="text-amber-700 font-semibold hover:underline"
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <span>Resend in {timer}s</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-gray-500 underline w-full"
                  >
                    Back
                  </button>
                </>
              )}

              {step === 1 && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-amber-400 text-gray-900 font-semibold hover:bg-amber-300 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Please wait..."
                    : isRegister
                      ? "Send OTP"
                      : "Login"}
                </button>
              )}
            </form>

            <div className="text-center text-sm text-gray-600 mt-5">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                className="font-semibold text-amber-600 underline underline-offset-2 hover:text-amber-700"
                disabled={loading}
              >
                {isRegister ? "Login" : "Register"}
              </button>
            </div>
          </section>

          {/* ILLUSTRATION — now on the right on desktop, visible on mobile too */}
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
                  Welcome to Brown Hair - The Unisex Salon.
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                  Easy bookings, verified professionals, and transparent pricing
                  for every appointment.
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
