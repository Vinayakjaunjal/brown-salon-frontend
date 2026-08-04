import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Clock,
  Users,
  Scissors,
  Trophy,
} from "lucide-react";
import heroImg1 from "../../assets/hero-img-1.webp";
import heroImg2 from "../../assets/hero-img-2.webp";

const trustStats = [
  {
    icon: Star,
    value: "4.9/5",
    label: "Customer Rating",
    sub: "(500+ Reviews)",
  },
  {
    icon: Users,
    value: "2K+",
    label: "Happy Clients",
    sub: "and Counting",
  },
  {
    icon: Scissors,
    value: "5+",
    label: "Expert",
    sub: "Stylists",
  },
  {
    icon: Trophy,
    value: "10+",
    label: "Years of Experience",
    sub: "in Grooming",
  },
];

export default function Hero() {
  const nav = useNavigate();

  return (
    <section className="relative bg-[#FBF6EE] pt-6 sm:pt-8 pb-6 sm:pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-start w-full">
          {/* Left column */}
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase px-4 py-2 rounded-full border border-amber-200 bg-[#FBF6EE] text-gray-800">
              <Star
                className="w-3.5 h-3.5 text-amber-500"
                fill="currentColor"
              />
              Premium Salon Experience
            </span>

            <h1
              className="mt-5 text-4xl sm:text-5xl lg:text-[3.2rem] font-bold leading-[1.1] text-gray-900"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
              }}
            >
              Best Salon in Nagpur – Experience Premium Salon Services
              <br />
              <span className="relative inline-block text-amber-600 mt-1">
                at Brown Salon
                <svg
                  className="absolute left-0 -bottom-2 w-full"
                  height="10"
                  viewBox="0 0 300 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8 C 80 2, 220 2, 298 8"
                    stroke="#D97706"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-6 text-base text-gray-500 max-w-md leading-relaxed">
              Visit Brown Salon in Nagpur for expert haircuts, beard styling and
              beauty services. Enjoy premium grooming in a modern, hygienic
              space.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => nav("/services")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment
              </button>

              <button
                onClick={() => nav("/services")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-amber-200 bg-transparent text-gray-800 font-semibold hover:bg-amber-50 transition-colors"
              >
                Explore Services
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right column - images */}
          <div className="flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72">
              <img
                src={heroImg1}
                alt="Barber giving a haircut at Brown Salon in Nagpur"
                className="w-full h-full object-cover"
                loading="eager"
                fetchpriority="high"
                width="900"
                height="500"
              />
              <div className="absolute left-4 bottom-4 right-4 sm:right-auto flex items-center gap-3 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-full border border-amber-400/70 text-amber-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-white text-sm font-semibold">
                    Premium Quality
                  </div>
                  <div className="text-white/70 text-xs leading-snug">
                    Hygienic • Professional
                    <br />
                    Trusted by Thousands
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden h-44">
                <img
                  src={heroImg2}
                  alt="Modern and relaxing ambience at Brown Salon"
                  className="w-full h-full object-cover"
                  loading="eager"
                  width="500"
                  height="400"
                />
                <div className="absolute left-3 bottom-3 right-3 flex items-center gap-2 bg-white/95 rounded-xl px-3 py-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div className="text-gray-900 text-xs font-semibold leading-snug">
                    Modern &amp;
                    <br />
                    Relaxing Ambience
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-amber-200 bg-[#FBF6EE] p-4 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-amber-300 text-amber-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-gray-900 text-sm font-semibold">
                      We're Open
                    </div>
                    <div className="text-gray-500 text-xs leading-snug">
                      10:00 AM – 9:00 PM
                      <br />
                      Everyday
                    </div>
                  </div>
                </div>

                <div className="h-px bg-amber-200/70" />

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-amber-600 shrink-0" />
                  <div className="text-gray-900 text-sm font-semibold">
                    Walk-ins Welcome!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust stats bar */}
        <div className="mt-6">
          <div className="rounded-2xl border border-amber-100 bg-white grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-amber-100">
            {trustStats.map(({ icon: Icon, value, label, sub }) => (
              <div key={label} className="flex items-center gap-3 px-5 py-5">
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-amber-100 text-amber-600 shrink-0">
                  <Icon
                    className="w-5 h-5"
                    fill={Icon === Star ? "currentColor" : "none"}
                  />
                </span>
                <div>
                  <div className="text-xl font-bold text-gray-900 leading-tight">
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 leading-snug">
                    {label}
                    <br />
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
