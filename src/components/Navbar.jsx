import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { clearAuthSession } from "../utils/auth";
import logo from "../assets/brown-logo.webp";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

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
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={logo}
                alt="Brown Salon"
                width="64"
                height="64"
                className="object-contain"
              />
            </div>

            <div>
              <p className="font-bold text-gray-900 leading-none">
                Brown Salon
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                Premium Experience
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative text-sm font-medium transition ${
                  isActive(item.to)
                    ? "text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {item.label}

                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-amber-400 transition-all duration-300 ${
                    isActive(item.to) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}

            <button
              onClick={() => nav("/services")}
              className="px-5 py-2 rounded-xl bg-amber-400 text-black font-semibold hover:bg-amber-500 transition"
            >
              Appointment
            </button>

            <button
              onClick={handleAuthAction}
              className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                token
                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {token ? "Logout" : "Login"}
            </button>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg border border-gray-200"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-96 pb-4" : "max-h-0"
          }`}
        >
          <div className="mt-3 rounded-2xl border border-gray-100 bg-white shadow-md p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg ${
                  isActive(item.to)
                    ? "bg-amber-50 text-amber-800"
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
              className="w-full mt-2 px-4 py-2 rounded-lg bg-amber-400 text-black font-semibold"
            >
              Book Appointment
            </button>

            <button
              onClick={handleAuthAction}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-800"
            >
              {token ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
