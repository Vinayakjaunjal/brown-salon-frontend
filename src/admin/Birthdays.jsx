import React, { useEffect, useState } from "react";

const isToday = (dob) => {
  const today = new Date();
  const d = new Date(dob);
  return today.getDate() === d.getDate() && today.getMonth() === d.getMonth();
};

const isUpcoming = (dob) => {
  const today = new Date();
  const d = new Date(dob);
  d.setFullYear(today.getFullYear());
  const diff = (d - today) / (1000 * 60 * 60 * 24);
  return diff > 0 && diff <= 7;
};

export default function Birthdays() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", dob: "" });
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar((s) => ({ ...s, open: false })), 3000);
  };

  const loadCustomers = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/birthdays`);
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => { loadCustomers(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addCustomer = async () => {
    if (!form.name || !form.dob) { showSnackbar("Name and DOB are required", "error"); return; }
    await fetch(`${import.meta.env.VITE_API_URL}/api/birthdays`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "", phone: "", dob: "" });
    loadCustomers();
  };

  const sendWish = async (customer) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/birthdays/wish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: customer.name, email: customer.email }),
    });
    showSnackbar(`Birthday wish sent to ${customer.name}`);
  };

  const sendWhatsAppWish = (phone, name) => {
    const msg = `🎉 Happy Birthday ${name}! 🎂\n\nWarm wishes from Brown Hair The Unisex Salon ✨\nWe have a special birthday offer waiting for you 🎁💇‍♂️\n\nHope to see you soon!\n— Team Brown Hair Salon`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const confirmDelete = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/birthdays/${deleteId}`, { method: "DELETE" });
    setCustomers((prev) => prev.filter((c) => c._id !== deleteId));
    setConfirmOpen(false);
  };

  const monthWiseCustomers = selectedMonth === "all"
    ? customers
    : customers.filter((c) => new Date(c.dob).getMonth() === Number(selectedMonth));

  const todayBirthdays = customers.filter((c) => isToday(c.dob));
  const upcomingBirthdays = customers.filter((c) => isUpcoming(c.dob));

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return (
    <div className="space-y-5">
      <h2 className="text-slate-800 font-bold text-xl">Birthday Customers</h2>

      {/* Month Filter */}
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all cursor-pointer"
      >
        <option value="all">All</option>
        {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
      </select>

      {/* Today's Birthdays */}
      {todayBirthdays.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
          <h3 className="text-amber-600 font-semibold text-sm mb-3">Today's Birthdays 🎂</h3>
          <div className="space-y-2">
            {todayBirthdays.map((c) => (
              <div key={c._id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 bg-amber-50 rounded-xl">
                <div>
                  <p className="text-slate-800 font-semibold text-sm">🎉 {c.name}</p>
                  <p className="text-slate-500 text-xs">DOB: {c.dob}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => sendWish(c)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-white text-xs font-semibold rounded-lg hover:bg-amber-500 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email
                  </button>
                  <button onClick={() => sendWhatsAppWish(c.phone, c.name)} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.998-1.417A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fillRule="evenodd" clipRule="evenodd"/></svg>
                    WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcomingBirthdays.length > 0 && (
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
          <h3 className="text-sky-600 font-semibold text-sm mb-3">⏳ Upcoming Birthdays (Next 7 Days)</h3>
          <div className="space-y-2">
            {upcomingBirthdays.map((c) => (
              <div key={c._id} className="flex justify-between items-center p-3 bg-sky-50 rounded-xl">
                <div>
                  <p className="text-slate-800 font-semibold text-sm">🎈 {c.name}</p>
                  <p className="text-slate-500 text-xs">Birthday: {c.dob}</p>
                </div>
                <span className="px-2.5 py-1 bg-sky-100 text-sky-600 text-xs font-semibold rounded-lg">Upcoming</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Birthday Customer */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-pink-500 font-semibold text-sm mb-4">🎁 Add Birthday Customer</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input name="name" placeholder="Customer Name" value={form.name} onChange={handleChange}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all" />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all" />
          <input name="dob" type="date" value={form.dob} onChange={handleChange}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all" />
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={addCustomer}
            className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-violet-500 text-white text-sm font-semibold rounded-xl shadow shadow-pink-200 hover:from-pink-600 hover:to-violet-600 transition-all">
            ➕ Add Customer
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-pink-50 to-violet-50">
          <p className="text-slate-700 font-semibold text-sm">🎁 Birthday Customer List</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              {["Name", "Email", "Phone", "DOB", "Actions"].map((h) => (
                <th key={h} className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {monthWiseCustomers.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-slate-400 text-sm">No customers found</td></tr>
            ) : monthWiseCustomers.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50/40 transition-colors">
                <td className="px-5 py-3 text-slate-700 text-sm font-medium">{c.name}</td>
                <td className="px-5 py-3 text-indigo-500 text-sm">{c.email || "—"}</td>
                <td className="px-5 py-3 text-emerald-600 text-sm">{c.phone || "—"}</td>
                <td className="px-5 py-3 text-amber-600 text-sm">{c.dob}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => sendWish(c)} className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition-colors" title="Send Email">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </button>
                    <button onClick={() => sendWhatsAppWish(c.phone, c.name)} className="w-7 h-7 rounded-lg bg-green-50 text-green-500 hover:bg-green-100 flex items-center justify-center transition-colors" title="WhatsApp">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.998-1.417A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fillRule="evenodd" clipRule="evenodd"/></svg>
                    </button>
                    <button onClick={() => { setDeleteId(c._id); setConfirmOpen(true); }} className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {monthWiseCustomers.map((c) => (
          <div key={c._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 relative">
            <p className="text-slate-800 font-semibold text-sm">🎉 {c.name}</p>
            <p className="text-slate-400 text-xs mt-0.5">🎂 {c.dob}</p>
            {c.email && <p className="text-indigo-500 text-xs">📧 {c.email}</p>}
            {c.phone && <p className="text-emerald-600 text-xs">📱 {c.phone}</p>}
            <div className="absolute top-3 right-3 flex gap-1">
              <button onClick={() => sendWish(c)} className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </button>
              <button onClick={() => sendWhatsAppWish(c.phone, c.name)} className="w-7 h-7 rounded-lg bg-green-50 text-green-500 hover:bg-green-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.998-1.417A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fillRule="evenodd" clipRule="evenodd"/></svg>
              </button>
              <button onClick={() => { setDeleteId(c._id); setConfirmOpen(true); }} className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Delete */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 z-10">
            <h3 className="text-slate-800 font-bold text-base mb-2">Confirm Delete</h3>
            <p className="text-slate-500 text-sm mb-5">Are you sure you want to delete this birthday customer?</p>
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
