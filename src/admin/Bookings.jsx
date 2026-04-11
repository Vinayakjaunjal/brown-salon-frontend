import React, { useEffect, useState } from "react";

const STATUS_STYLES = {
  confirmed: { bg: "bg-indigo-50", text: "text-indigo-600" },
  completed: { bg: "bg-emerald-50", text: "text-emerald-600" },
  cancelled: { bg: "bg-red-50", text: "text-red-500" },
  "no-show": { bg: "bg-slate-100", text: "text-slate-500" },
};

export default function Bookings() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/all`)
      .then((res) => res.text())
      .then((text) => {
        try {
          const res = JSON.parse(text);
          if (Array.isArray(res)) setData(res);
          else if (Array.isArray(res.data)) setData(res.data);
          else setData([]);
        } catch {
          setData([]);
        }
      });
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      const result = await res.json();
      setData((prev) => prev.map((b) => (b._id === id ? result.data : b)));
    } catch (err) {
      console.log("UPDATE ERROR:", err);
    }
  };

  const filteredData = data.filter(
    (b) =>
      (!selectedDate || b.date === selectedDate) &&
      (!statusFilter || b.status === statusFilter) &&
      (!search ||
        b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.serviceName?.toLowerCase().includes(search.toLowerCase())),
  );

  const sortedData = Array.isArray(filteredData)
    ? [...filteredData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      )
    : [];

  return (
    <div className="space-y-5">
      <h2 className="text-slate-800 font-bold text-xl">Bookings</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
        />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all w-40"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all cursor-pointer"
        >
          <option value="">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No Show</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              {["Name", "Service", "Date", "Time", "Phone", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wide px-5 py-3"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-slate-400 text-sm"
                >
                  No bookings found
                </td>
              </tr>
            ) : (
              sortedData.map((b) => {
                const s = STATUS_STYLES[b.status] || STATUS_STYLES.confirmed;
                return (
                  <tr
                    key={b._id}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    <td className="px-5 py-3 text-slate-700 text-sm font-medium">
                      {b.name || "User"}
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-sm">
                      {b.serviceName || "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-sm">
                      {b.artist?.name || "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-sm">
                      {b.date}
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-sm">
                      {b.time}
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-sm">
                      {b.phone || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={b.status || "confirmed"}
                        onChange={(e) => updateStatus(b._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-200 ${s.bg} ${s.text}`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no-show">No Show</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {sortedData.length === 0 ? (
          <p className="text-center py-10 text-slate-400 text-sm">
            No bookings found
          </p>
        ) : (
          sortedData.map((b) => {
            const s = STATUS_STYLES[b.status] || STATUS_STYLES.confirmed;
            return (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-700 font-semibold text-sm">
                      {b.name || "User"}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      💇 {b.serviceName || "Service"}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      💇 {b.artist?.name || "Artist"}
                    </p>
                    <p className="text-slate-400 text-xs">
                      ⏰ {b.time} {b.phone ? `| 📞 ${b.phone}` : ""}
                    </p>
                  </div>
                  <span className="text-slate-400 text-xs shrink-0 ml-2">
                    {b.date}
                  </span>
                </div>
                <select
                  value={b.status || "confirmed"}
                  onChange={(e) => updateStatus(b._id, e.target.value)}
                  className={`w-full text-sm font-semibold px-3 py-2.5 rounded-xl border-0 cursor-pointer outline-none ${s.bg} ${s.text}`}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
