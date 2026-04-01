import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";

export default function AdminHeader({ onMenuClick }) {
  const [adminName, setAdminName] = useState("Admin");
  const [anchorEl, setAnchorEl] = useState(false);
  const [notifAnchor, setNotifAnchor] = useState(false);
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle =
    {
      "/admin/dashboard": "Dashboard",
      "/admin/appointments": "Appointments",
      "/admin/services": "Services",
      "/admin/gallery": "Gallery",
      "/admin/reviews": "Reviews",
      "/admin/customers": "Customers",
      "/admin/slots": "Slots",
      "/admin/birthdays": "Birthdays",
      "/admin/bookings": "Bookings",
      "/admin/festivals": "Festivals",
    }[location.pathname] || "Dashboard";

  const fetchNotifications = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/notifications`,
    );
    const data = await res.json();
    setNotifications(data);
  };

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name) setAdminName(name);
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifAnchor(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setAnchorEl(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(e.target.value);
    if (value.includes("appoint")) navigate("/admin/appointments");
    if (value.includes("service")) navigate("/admin/services");
    if (value.includes("gallery")) navigate("/admin/gallery");
    if (value.includes("review")) navigate("/admin/reviews");
    if (value.includes("customer")) navigate("/admin/customers");
    if (value.includes("slot")) navigate("/admin/slots");
    if (value.includes("birthday")) navigate("/admin/birthdays");
    if (value.includes("dashboard")) navigate("/admin/dashboard");
    if (value.includes("booking")) navigate("/admin/bookings");
    if (value.includes("festival")) navigate("/admin/festivals");
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/admin-login";
  };

  const clearAllNotifications = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
      method: "DELETE",
    });
    setNotifications([]);
    setNotifAnchor(false);
  };

  const deleteNotification = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}`, {
      method: "DELETE",
    });
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const markAsRead = async (id) => {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`,
      {
        method: "PUT",
      },
    );

    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
  };

  const todayNotifications = notifications.filter((n) =>
    dayjs(n.createdAt).isSame(dayjs(), "day"),
  );

  const last7DaysNotifications = notifications.filter(
    (n) =>
      dayjs(n.createdAt).isAfter(dayjs().subtract(7, "day")) &&
      !dayjs(n.createdAt).isSame(dayjs(), "day"),
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur border-b border-slate-100 flex items-center px-4 md:px-6 gap-3">
      <button
        onClick={onMenuClick}
        className="md:hidden w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors shrink-0"
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
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-slate-800 font-semibold text-sm truncate">
          {pageTitle}
        </p>
        <p className="text-slate-400 text-[11px] hidden sm:block">
          Welcome back, {adminName}
        </p>
      </div>

      {/* Search */}
      <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-9 w-44 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        <svg
          className="w-3.5 h-3.5 text-slate-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          value={search}
          onChange={handleSearch}
          placeholder="Search..."
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
        />
      </div>

      {/* Notifications */}
      <div className="relative shrink-0" ref={notifRef}>
        <button
          onClick={() => setNotifAnchor(!notifAnchor)}
          className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {notifAnchor && (
          <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="text-slate-700 font-semibold text-sm">
                Notifications
              </span>
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-red-400 hover:text-red-600 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {todayNotifications.length > 0 && (
                <>
                  <p className="px-4 py-2 text-xs text-gray-400 font-semibold">
                    Today
                  </p>

                  {todayNotifications.map((n) => (
                    <div
                      key={n._id}
                      className="flex justify-between px-4 py-3 hover:bg-slate-50"
                    >
                      <div
                        onClick={() => {
                          markAsRead(n._id);
                          navigate(n.link);
                          setNotifAnchor(false);
                        }}
                        className="flex gap-2 cursor-pointer"
                      >
                        <span>{n.type === "appointment" ? "📅" : "🎂"}</span>
                        <div>
                          <p className="text-sm font-semibold">{n.title}</p>
                          <p className="text-xs text-gray-400">{n.message}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n._id);
                        }}
                        className="text-red-400 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </>
              )}
              {last7DaysNotifications.length > 0 && (
                <>
                  <p className="px-4 py-2 text-xs text-gray-400 font-semibold">
                    Last 7 Days
                  </p>

                  {last7DaysNotifications.map((n) => (
                    <div
                      key={n._id}
                      className="flex justify-between px-4 py-3 hover:bg-slate-50"
                    >
                      <div
                        onClick={() => {
                          markAsRead(n._id);
                          navigate(n.link);
                          setNotifAnchor(false);
                        }}
                        className="flex gap-2 cursor-pointer"
                      >
                        <span>{n.type === "appointment" ? "📅" : "🎂"}</span>
                        <div>
                          <p className="text-sm font-semibold">{n.title}</p>
                          <p className="text-xs text-gray-400">{n.message}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n._id);
                        }}
                        className="text-red-400 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative shrink-0" ref={profileRef}>
        <button
          onClick={() => setAnchorEl(!anchorEl)}
          className="flex items-center gap-2 py-1 px-1.5 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow shadow-indigo-200">
            {adminName[0]?.toUpperCase()}
          </div>
          <span className="hidden sm:block text-slate-600 text-sm font-medium">
            {adminName}
          </span>
        </button>

        {anchorEl && (
          <div className="absolute right-0 top-12 w-44 bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-slate-700 font-semibold text-sm">
                {adminName}
              </p>
            </div>
            <div className="p-2">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 text-sm hover:bg-red-50 transition-colors"
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
        )}
      </div>
    </header>
  );
}
