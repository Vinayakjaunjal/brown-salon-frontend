import React, { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import api from "../utils/api";
import { AuthSticker } from "../components/illustrations/SalonIllustrations";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(`/auth/reset-password/${token}`, {
        password,
      });

      setSuccess(res.data.message || "Password reset successful");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 sm:py-12 flex items-center">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
          
          {/* LEFT SIDE */}
          <section className="hidden md:flex items-center bg-gradient-to-br from-amber-50 to-yellow-100 p-8">
            <AuthSticker />
          </section>

          {/* RIGHT SIDE */}
          <section className="p-5 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Reset Password
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Enter your new password below.
            </p>

            {/* ERROR */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="mt-6 text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-2xl">✓</span>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-gray-800">
                  Password Updated
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Your password has been successfully reset.
                </p>
              </div>
            )}

            {/* FORM */}
            {!success && (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    error={Boolean(error)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary rounded-2xl py-3 font-semibold text-black disabled:opacity-60 disabled:cursor-not-allowed inline-flex justify-center items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? "Updating..." : "Reset Password"}
                </button>
              </form>
            )}

            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}