import React, { useState } from "react";
import AdminLogo from "../assets/brown-logo.webp";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendLink = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Something went wrong");
      } else {
        setSuccess(true);
        setMsg("Reset link sent to your email");
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8">

        <div className="flex flex-col items-center mb-6">
          <img src={AdminLogo} className="h-20 w-20 rounded-xl mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Forgot Password</h2>
        </div>

        {error && (
          <div className="mb-3 text-red-600 text-sm">{error}</div>
        )}

        {success ? (
          <div className="text-center">
            <div className="text-green-600 text-3xl">✓</div>
            <p className="mt-2 text-sm text-gray-600">{msg}</p>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl mb-4"
            />

            <button
              onClick={sendLink}
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}