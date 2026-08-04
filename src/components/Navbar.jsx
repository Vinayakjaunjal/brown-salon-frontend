import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Calendar, LogOut, LogIn } from "lucide-react";
import { clearAuthSession } from "../utils/auth";
import logo from "../assets/brown-logo.webp";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = useMemo(() => {
    const items = [
      { to: "/", label: "Home" },
      { to: "/services", label: "Services" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ];

    if (token && role === "user") {
      items.push({ to: "/profile", label: "Profile" });
    }

    return items;
  }, [token, role]);

  const handleLogout = () => {
    clearAuthSession();
    setMobileOpen(false);
    nav("/login", { replace: true });
  };

  const handleAuthAction = () => {
    if (token) {
      handleLogout();
      return;
    }
    setMobileOpen(false);
    nav("/login");
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur-md transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_2px_20px_rgba(0,0,0,0.06)] border-b border-amber-100"
          : "border-b border-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center ring-1 ring-amber-100">
              <img
                src={logo}
                alt="Brown Salon"
                width="48"
                height="48"
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-gray-900 leading-none text-lg font-serif tracking-wide">
                Brown Salon
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.14em] mt-1">
                Premium Experience
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-9">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative text-sm font-medium py-2 transition-colors ${
                  isActive(item.to)
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-[2px] bg-amber-400 transition-all duration-300 ${
                    isActive(item.to) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}

            <div className="h-6 w-px bg-gray-200" />

            <button
              onClick={() => nav("/services")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all hover:shadow-md"
            >
              <Calendar size={15} />
              Appointment
            </button>

            <button
              onClick={handleAuthAction}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                token
                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {token ? <LogOut size={15} /> : <LogIn size={15} />}
              {token ? "Logout" : "Login"}
            </button>
          </nav>

          <button
            className="md:hidden p-2.5 rounded-xl border border-gray-200 text-gray-700"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-[420px] pb-4" : "max-h-0"
          }`}
        >
          <div className="mt-2 rounded-2xl border border-amber-100 bg-white shadow-lg shadow-amber-900/5 p-4 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "bg-amber-50 text-amber-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <button
              onClick={() => {
                nav("/services");
                setMobileOpen(false);
              }}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm"
            >
              <Calendar size={15} />
              Book Appointment
            </button>

            <button
              onClick={handleAuthAction}
              className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                token
                  ? "bg-amber-50 text-amber-700"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {token ? <LogOut size={15} /> : <LogIn size={15} />}
              {token ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
