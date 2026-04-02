import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Phone, UserCircle2 } from "lucide-react";
import Input from "../components/Input";
import api from "../utils/api";
import { AuthSticker } from "../components/illustrations/SalonIllustrations";
import { clearAuthSession } from "../utils/auth";

const phoneRegex = /^\+?[0-9\s()-]{8,20}$/;

export default function Login() {
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
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

    if (!phone.trim()) {
      nextErrors.phone = "Phone or email is required";
    } else if (!phone.includes("@") && !phoneRegex.test(phone.trim())) {
      nextErrors.phone = "Please enter a valid phone number or email";
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
      if (!isRegister) {
        const res = await api.post("/auth/login", {
          phone: phone.trim(),
          password,
        });

        const { token, user } = res.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("user", JSON.stringify(user));

        nav("/");
        return;
      }

      await api.post("/auth/send-otp", {
        phone: phone.trim(),
      });

      alert("OTP sent");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        phone: phone.trim(),
        otp,
        name: name.trim(),
        password,
      });

      const { token, user } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      nav("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister((prev) => !prev);
    setError("");
    setFieldErrors({});
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] overflow-x-hidden py-4 sm:py-8 md:py-10">
      <div className="mx-auto w-full max-w-5xl px-1 sm:px-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
          <section className="hidden lg:flex bg-gradient-to-br from-yellow-100 via-amber-50 to-white p-8 xl:p-10">
            <div className="flex flex-col justify-between w-full">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                  Welcome to Brown Hair - The Unisex Salon.
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                  Easy bookings, verified professionals, and transparent pricing
                  for every appointment.
                </p>
              </div>
              <div className="w-full max-w-sm mx-auto">
                <AuthSticker />
              </div>
            </div>
          </section>

          <section className="p-4 sm:p-7 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                  />

                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <p className="text-sm text-gray-600 text-center">
                    Enter OTP sent to {phone}
                  </p>

                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-full py-3 rounded-2xl btn-primary font-semibold"
                  >
                    Verify OTP
                  </button>
                </>
              )}

              {step === 1 && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl btn-primary font-semibold"
                >
                  {isRegister ? "Send OTP" : "Login"}
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full py-3 rounded-2xl btn-primary font-semibold"
                >
                  Verify OTP
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
                className="font-semibold text-gray-900 underline underline-offset-2"
                disabled={loading}
              >
                {isRegister ? "Login" : "Register"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
