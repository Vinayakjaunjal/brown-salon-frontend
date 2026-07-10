import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const STATUS_STYLES = {
  confirmed: { bg: "bg-indigo-50", text: "text-indigo-600" },
  completed: { bg: "bg-emerald-50", text: "text-emerald-600" },
  cancelled: { bg: "bg-red-50", text: "text-red-500" },
  "no-show": { bg: "bg-slate-100", text: "text-slate-500" },
};

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/all`)
      .then((res) => res.json())
      .then((res) => setData(res.data || []));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 3000);
  };

  const today = new Date().toISOString().split("T")[0];

  const countByDateRange = (startOffset, endOffset) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return data.filter((a) => {
      if (a.status !== "confirmed") return false;
      const d = new Date(a.date);
      d.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((d - today) / (1000 * 60 * 60 * 24));
      return (
        diffDays >= startOffset &&
        (endOffset === undefined || diffDays < endOffset)
      );
    }).length;
  };

  const recentAppointments = [...data]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const updateStatus = async (id, status) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setData((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    showToast(
      `Appointment ${status.toUpperCase()} successfully`,
      status === "completed"
        ? "success"
        : status === "cancelled"
          ? "error"
          : "warning",
    );
  };

  const getMonthlyData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const counts = Array(12).fill(0);
    data.forEach((a) => {
      counts[new Date(a.date).getMonth()]++;
    });
    return months.map((m, i) => ({ month: m, appointments: counts[i] }));
  };

  const bigCards = [
    {
      title: "Confirmed",
      value: data.filter((a) => a.status === "confirmed").length,
      color: "from-indigo-500 to-violet-600",
      shadow: "shadow-indigo-200",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Completed",
      value: data.filter((a) => a.status === "completed").length,
      color: "from-emerald-400 to-teal-500",
      shadow: "shadow-emerald-200",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Cancelled",
      value: data.filter((a) => a.status === "cancelled").length,
      color: "from-rose-400 to-pink-500",
      shadow: "shadow-rose-200",
      icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h2 className="text-slate-800 font-bold text-xl">Bookings Overview</h2>
      </div>

      {/* Big cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {bigCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} shadow-lg ${card.shadow} flex items-center justify-center mb-3`}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d={card.icon}
                />
              </svg>
            </div>
            <p className="text-slate-400 text-xs font-medium">{card.title}</p>
            <p className="text-slate-800 text-2xl md:text-3xl font-bold mt-0.5">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Small cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {[
          {
            title: "This Week",
            value: countByDateRange(0, 7),
            color: "from-amber-400 to-orange-500",
            shadow: "shadow-amber-200",
          },
          {
            title: "Next Week",
            value: countByDateRange(7, 14),
            color: "from-sky-400 to-blue-500",
            shadow: "shadow-sky-200",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5 flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} shadow-lg ${card.shadow} flex items-center justify-center text-white font-bold text-lg shrink-0`}
            >
              {card.value}
            </div>
            <p className="text-slate-500 text-sm font-medium">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-slate-700 font-semibold text-sm">
            Recent Appointments
          </h3>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                {["Name", "Service", "Artist", "Date", "Time", "Status"].map(
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
              {recentAppointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-slate-400 text-sm"
                  >
                    No recent appointments
                  </td>
                </tr>
              ) : (
                recentAppointments.map((app) => {
                  const s =
                    STATUS_STYLES[app.status] || STATUS_STYLES.confirmed;
                  return (
                    <tr
                      key={app._id}
                      className="hover:bg-slate-50/40 transition-colors"
                    >
                      <td className="px-5 py-3 text-slate-700 text-sm font-medium">
                        {app.name || "User"}
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-sm">
                        {app.serviceName || "Service"}
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-sm">
                        {app.artist?.name || "-"}
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-sm">
                        {app.date}
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-sm">
                        {app.time}
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={app.status || "confirmed"}
                          onChange={(e) =>
                            updateStatus(app._id, e.target.value)
                          }
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

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {recentAppointments.length === 0 ? (
            <p className="text-center py-10 text-slate-400 text-sm">
              No recent appointments
            </p>
          ) : (
            recentAppointments.map((app) => {
              const s = STATUS_STYLES[app.status] || STATUS_STYLES.confirmed;
              return (
                <div key={app._id} className="p-4 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-700 font-semibold text-sm">
                        {app.name || "User"}
                      </p>
                      <p className="text-slate-400 text-xs">
                        💇 {app.serviceName || "Service"}
                      </p>
                      <p className="text-slate-400 text-xs">
                        💇 {app.artist?.name || "Artist"}
                      </p>
                      <p className="text-slate-400 text-xs">
                        ⏰ {app.time} {app.phone ? `| 📞 ${app.phone}` : ""}
                      </p>
                    </div>
                    <span className="text-slate-400 text-xs">{app.date}</span>
                  </div>
                  <select
                    value={app.status || "confirmed"}
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                    className={`w-full text-sm font-semibold px-3 py-2 rounded-xl border-0 cursor-pointer outline-none ${s.bg} ${s.text}`}
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

      {/* Monthly Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-slate-700 font-semibold text-sm mb-5">
          Monthly Appointments Trend
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getMonthlyData()}>
              <defs>
                <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  fontSize: 12,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="appointments"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#colorApp)"
                dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#6366f1", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Toast */}
      {toast.open && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium shadow-xl transition-all
          ${toast.type === "error" ? "bg-red-500 text-white" : toast.type === "warning" ? "bg-amber-500 text-white" : "bg-slate-800 text-white"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
