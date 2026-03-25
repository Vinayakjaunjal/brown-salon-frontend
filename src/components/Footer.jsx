import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

import { Instagram } from "lucide-react";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";

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
  {
    key: "follow",
    title: "Follow Us",
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
  return (
    <footer className="relative mt-12 overflow-hidden bg-[#0b1225] text-slate-200">
      <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerSections.map((section) => (
            <section key={section.key}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-200">
                {section.title}
              </h3>

              {section.key === "follow" ? (
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-200 hover:text-emerald-300"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              ) : section.key === "contact" ? (
                <ul className="space-y-3 text-sm">
                  {section.items.map((item, i) => {
                    const Icon = item.icon;

                    return (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-slate-300"
                      >
                        <Icon className="h-4 w-4 mt-0.5 text-emerald-300" />
                        <span>{item.label}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="space-y-2 text-sm">
                  {section.items.map((item) => (
                    <li key={item.label + item.path}>
                      <Link
                        className="text-slate-300 transition-colors duration-200 hover:text-emerald-300"
                        to={item.path}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-400 text-center">
          <p>© {new Date().getFullYear()} Brown Salon. All rights reserved.</p>

          <p className="mt-1">
            Designed & Developed by{" "}
            <span className="font-semibold text-amber-300">
              Vinayak Jaunjal
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
