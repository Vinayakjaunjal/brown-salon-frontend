import React, { useEffect, useState } from "react";

const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  return today.getDate() === d.getDate() && today.getMonth() === d.getMonth();
};

const isUpcoming = (date) => {
  const today = new Date();
  const d = new Date(date);
  d.setFullYear(today.getFullYear());
  const diff = (d - today) / (1000 * 60 * 60 * 24);
  return diff > 0 && diff <= 7;
};

export default function Festivals() {
  const [festivals, setFestivals] = useState([]);
  const [form, setForm] = useState({ name: "", date: "", subject: "", message: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showSnackbar = (msg, sev = "success") => {
    setSnackbar({ open: true, message: msg, severity: sev });
    setTimeout(() => setSnackbar((s) => ({ ...s, open: false })), 3000);
  };

  const loadFestivals = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/festivals`);
    const data = await res.json();
    setFestivals(data);
  };

  useEffect(() => { loadFestivals(); }, []);

  const addFestival = async () => {
    if (!form.name || !form.date) { showSnackbar("Name & Date Required", "error"); return; }
    await fetch(`${import.meta.env.VITE_API_URL}/api/festivals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", date: "", subject: "", message: "" });
    loadFestivals();
    showSnackbar("Festival Added");
  };

  const sendWish = async (fest) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/festivals/send/${fest._id}`, { method: "POST" });
    showSnackbar(`${fest.name} wish sent successfully`);
  };

  const confirmDelete = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/festivals/${deleteId}`, { method: "DELETE" });
    setFestivals((prev) => prev.filter((f) => f._id !== deleteId));
    setConfirmOpen(false);
  };

  const todayFestivals = festivals.filter((f) => isToday(f.date));
  const upcomingFestivals = festivals.filter((f) => isUpcoming(f.date));

  return (
    <div className="space-y-5">
      <h2 className="text-slate-800 font-bold text-xl">🎉 Festivals</h2>

      {/* Today */}
      {todayFestivals.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
          <h3 className="text-amber-600 font-semibold text-sm mb-3">Today's Festivals 🎉</h3>
          <div className="space-y-2">
            {todayFestivals.map((f) => (
              <div key={f._id} className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                <p className="text-slate-700 font-medium text-sm">{f.name}</p>
                <button
                  onClick={() => sendWish(f)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-white text-xs font-semibold rounded-lg hover:bg-amber-500 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Send Wish
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcomingFestivals.length > 0 && (
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
          <h3 className="text-sky-600 font-semibold text-sm mb-3">Upcoming Festivals ⏳</h3>
          <div className="space-y-2">
            {upcomingFestivals.map((f) => (
              <p key={f._id} className="text-slate-700 text-sm px-3 py-2 bg-sky-50 rounded-xl">{f.name}</p>
            ))}
          </div>
        </div>
      )}

      {/* Add Festival */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-slate-700 font-semibold text-sm mb-4">🎁 Add Festival</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            placeholder="Festival Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
          <input
            placeholder="Email Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
          <input
            placeholder="Wish Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
        </div>
        <button
          onClick={addFestival}
          className="mt-4 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 transition-all"
        >
          ➕ Add Festival
        </button>
      </div>

      {/* Festival List Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              {["Name", "Date", "Actions"].map((h) => (
                <th key={h} className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {festivals.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-10 text-slate-400 text-sm">No festivals added yet</td></tr>
            ) : festivals.map((f) => (
              <tr key={f._id} className="hover:bg-slate-50/40 transition-colors">
                <td className="px-5 py-3 text-slate-700 text-sm font-medium">{f.name}</td>
                <td className="px-5 py-3 text-slate-500 text-sm">{f.date}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => sendWish(f)} className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-colors" title="Send Wish">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                    <button onClick={() => { setDeleteId(f._id); setConfirmOpen(true); }} className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 z-10">
            <h3 className="text-slate-800 font-bold text-base mb-2">Confirm Delete</h3>
            <p className="text-slate-500 text-sm mb-5">Delete this festival?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-medium shadow-xl ${snackbar.severity === "error" ? "bg-red-500 text-white" : "bg-slate-800 text-white"}`}>
          {snackbar.message}
        </div>
      )}
    </div>
  );
}
