import React, { useEffect, useState } from "react";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const token = localStorage.getItem("adminToken");

  const loadProfile = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (res.status === 401) return;
    const data = await res.json();
    setAdmin(data);
    setForm({ name: data.name || "", email: data.email || "" });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateProfile = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      },
    );
    const data = await res.json();
    setAdmin(data);
    setEdit(false);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    window.location.href = "/admin-login";
  };

  if (!admin)
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="max-w-md space-y-5">
      <h2 className="text-slate-800 font-bold text-xl">Admin Profile</h2>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 font-black text-2xl shadow-sm">
            {(admin.name || "A")[0].toUpperCase()}
          </div>
          <div>
            <p className="text-slate-800 font-bold text-lg">{admin.name}</p>
            <p className="text-slate-400 text-sm">{admin.email}</p>
          </div>
        </div>

        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 transition-all"
          >
            Edit Profile
          </button>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={updateProfile}
                className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setEdit(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
