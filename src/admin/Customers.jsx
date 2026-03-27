import React, { useEffect, useState } from "react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/customers`)
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch(() => setCustomers([]));
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <h2 className="text-slate-800 font-bold text-xl">Customers</h2>

      {/* Search */}
      <div className="relative w-full max-w-xs">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by name, email or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              {["Name", "Email", "Phone", "Visits", "Last Visit"].map((h) => (
                <th key={h} className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredCustomers.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-slate-400 text-sm">No customers found</td></tr>
            ) : filteredCustomers.map((c, i) => (
              <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                <td className="px-5 py-3 text-slate-700 text-sm font-medium">{c.name}</td>
                <td className="px-5 py-3 text-indigo-500 text-sm">{c.email || "—"}</td>
                <td className="px-5 py-3 text-emerald-600 text-sm">{c.phone || "—"}</td>
                <td className="px-5 py-3">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-lg">{c.visits || 0}</span>
                </td>
                <td className="px-5 py-3 text-slate-500 text-sm">{c.lastVisit || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredCustomers.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-slate-700 font-semibold text-sm">{c.name}</p>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-lg">{c.visits || 0} visits</span>
            </div>
            {c.email && <p className="text-indigo-500 text-xs">{c.email}</p>}
            {c.phone && <p className="text-emerald-600 text-xs mt-0.5">{c.phone}</p>}
            {c.lastVisit && <p className="text-slate-400 text-xs mt-0.5">Last visit: {c.lastVisit}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
