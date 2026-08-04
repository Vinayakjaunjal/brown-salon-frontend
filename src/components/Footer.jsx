import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  ArrowUpRight,
  ArrowUp,
  Calendar,
} from "lucide-react";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/brown-logo-2.webp";

const footerSections = [
  {
    key: "shop",
    title: "Shop",
    items: [
      { label: "About", path: "/about" },
      { label: "Services", path: "/services" },
      { label: "Gallery", path: "/gallery" },
      { label: "Contact", path: "/contact" },
    ],
  },
  {
    key: "services",
    title: "Services",
    items: [
      { label: "Haircut", path: "/services" },
      { label: "Beard Grooming", path: "/services" },
      { label: "Facial", path: "/services" },
      { label: "Hair Spa", path: "/services" },
    ],
  },
  {
    key: "contact",
    title: "Get in Touch",
    items: [
      {
        label: "Near South Point School, Krida Square, Nagpur",
        icon: MapPin,
      },
      {
        label: "+91 9623245713",
        icon: Phone,
      },
      {
        label: "brown.unisex.salon@gmail.com",
        icon: Mail,
      },
      {
        label: "10:00 AM – 9:00 PM",
        icon: Clock,
      },
    ],
  },
];

const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/brown_hair_unisex_saloon",
    label: "Instagram",
  },
  {
    icon: FaFacebook,
    href: "https://www.facebook.com/share/1VyxMZ1hub/",
    label: "Facebook",
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/919623245713",
    label: "Whatsapp",
  },
];

export default function Footer() {
  const nav = useNavigate();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-[#0b0f1a] text-slate-300">
      {/* premium CTA strip */}
      <div className="relative border-b border-slate-800/80">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400/80 font-semibold">
              Ready when you are
            </p>
            <h3 className="mt-2 text-xl sm:text-2xl font-serif text-white tracking-wide">
              Book your next appointment at Brown Salon
            </h3>
          </div>
          <button
            onClick={() => nav("/services")}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-[#0b0f1a] font-semibold text-sm hover:bg-amber-300 transition-all hover:shadow-lg hover:shadow-amber-400/20"
          >
            <Calendar size={16} />
            Book Appointment
          </button>
        </div>
      </div>

      {/* top hairline shimmer */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      {/* ambient glow blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-300/5 blur-3xl" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden ring-1 ring-amber-400/30 flex items-center justify-center bg-white/5">
                <img
                  src={logo}
                  alt="Brown Salon logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-serif text-white tracking-wide">
                Brown Salon
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
              Premium grooming and beauty services in Nagpur — expert stylists,
              modern ambience, trusted by thousands.
            </p>

            <div className="flex gap-3 mt-6">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 text-slate-300 transition-all duration-300 hover:border-amber-400/60 hover:text-amber-300 hover:-translate-y-1"
                  >
                    <span className="absolute inset-0 rounded-full bg-amber-400/0 group-hover:bg-amber-400/10 blur-md transition-all duration-300" />
                    <Icon className="relative h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.key}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">
                {section.title}
                <span className="block mt-2 h-px w-6 bg-amber-400/50" />
              </h3>

              {section.key === "contact" ? (
                <ul className="space-y-3.5 text-sm">
                  {section.items.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-slate-400"
                      >
                        <Icon className="h-4 w-4 mt-0.5 text-amber-400/80 shrink-0" />
                        <span>{item.label}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="space-y-3 text-sm">
                  {section.items.map((item) => (
                    <li key={item.label + item.path}>
                      <Link
                        className="group inline-flex items-center gap-1 text-slate-400 transition-colors duration-200 hover:text-amber-300"
                        to={item.path}
                      >
                        <span className="relative">
                          {item.label}
                          <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-amber-300 transition-all duration-300 group-hover:w-full" />
                        </span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col items-center gap-2 text-sm text-slate-500 text-center">
          <p>© {new Date().getFullYear()} Brown Salon. All rights reserved.</p>

          <p>
            Designed &amp; Developed by{" "}
            <span className="font-semibold text-amber-400">
              Vinayak Jaunjal
            </span>
          </p>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 z-40 inline-flex items-center justify-center w-11 h-11 rounded-full bg-amber-400 text-[#0b0f1a] shadow-lg shadow-black/20 transition-all duration-300 hover:bg-amber-300 hover:-translate-y-1 ${
          showTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}
