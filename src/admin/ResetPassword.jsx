import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLogo from "../assets/brown-logo.webp";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!password || !confirm) {
      return setError("All fields required");
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/reset/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      },
    );

    const data = await res.json();

    if (!data.success) {
      return setError(data.message || "Reset failed");
    }

    setSuccess(true);

    setTimeout(() => {
      navigate("/admin-login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8">

        <div className="flex flex-col items-center mb-6">
          <img src={AdminLogo} className="h-20 w-20 rounded-xl mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Reset Password</h2>
        </div>

        {error && (
          <div className="mb-3 text-red-600 text-sm">{error}</div>
        )}

        {success ? (
          <div className="text-center text-green-600">
            ✓ Password reset successful
          </div>
        ) : (
          <>
            <input
              type={show ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl mb-3"
            />

            <input
              type={show ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl mb-4"
            />

            <button
              onClick={() => setShow(!show)}
              className="text-xs text-gray-500 mb-4"
            >
              {show ? "Hide Password" : "Show Password"}
            </button>

            <button
              onClick={handleSubmit}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}