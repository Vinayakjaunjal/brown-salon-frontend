import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  UserCheck,
  ShieldCheck,
  Calendar,
  Scissors,
  Leaf,
  CalendarCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import whyImg1 from "../../assets/why-chose-img1.webp";
import whyImg2 from "../../assets/why-chose-img2.webp";

const features = [
  {
    icon: UserCheck,
    title: "Certified & Experienced Stylists",
    description: "Trained professionals delivering top-quality care.",
  },
  {
    icon: ShieldCheck,
    title: "Affordable Pricing",
    description: "Transparent billing with no hidden charges.",
  },
  {
    icon: Calendar,
    title: "Easy Online Booking",
    description: "Flexible scheduling and instant confirmation.",
  },
];

export default function WhyChooseUs() {
  const nav = useNavigate();

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 mt-0 sm:mt-1 mb-10 sm:mb-12">
      <section className="relative overflow-hidden rounded-3xl bg-[#FBF6EF] px-6 sm:px-10 py-10 sm:py-12">
        {/* decorative dotted grid, bottom left */}
        <div
          className="hidden sm:block absolute bottom-8 left-8 w-16 h-16 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle, #D4A24C 1.5px, transparent 1.5px)",
            backgroundSize: "9px 9px",
          }}
        />

        <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left column */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-4 py-2 rounded-full border border-amber-300 bg-amber-50 text-[#1A1A1A]">
              <Star size={14} className="fill-[#D9A227] text-[#D9A227]" />
              Premium Salon Experience
            </span>

            <h2 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
              Why Choose
              <br />
              <span className="text-[#D9A227]">Brown Salon</span>
            </h2>

            <div className="w-16 h-1 bg-[#D9A227] rounded-full mt-5" />

            <p className="mt-5 text-gray-500 max-w-md leading-relaxed">
              Our expert stylists provide premium grooming and beauty services
              in a relaxing salon environment.
            </p>

            <ul className="mt-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <li
                    key={feature.title}
                    className={`flex items-start gap-4 py-4 ${
                      idx !== features.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <div className="w-11 h-11 shrink-0 rounded-full bg-white border border-amber-100 shadow-sm flex items-center justify-center text-[#D9A227]">
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right column */}
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 shadow-md">
                <img
                  src={whyImg1}
                  alt="Expert hair care at Brown Salon"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="400"
                  height="500"
                />
                <div className="absolute left-3 right-3 bottom-3 flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2.5">
                  <div className="w-9 h-9 shrink-0 rounded-lg bg-white/15 flex items-center justify-center text-[#D9A227]">
                    <Scissors size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white leading-tight">
                      Expert Care
                    </div>
                    <div className="text-xs text-gray-300 leading-tight">
                      For every style
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 shadow-md">
                <img
                  src={whyImg2}
                  alt="Hygienic and clean salon environment"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="400"
                  height="500"
                />
                <div className="absolute left-3 right-3 bottom-3 flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2.5">
                  <div className="w-9 h-9 shrink-0 rounded-lg bg-white/15 flex items-center justify-center text-[#D9A227]">
                    <Leaf size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white leading-tight">
                      Hygienic Environment
                    </div>
                    <div className="text-xs text-gray-300 leading-tight">
                      Clean &amp; safe always
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="relative overflow-hidden mt-4 rounded-2xl bg-gradient-to-br from-[#FDECC8] to-[#FBF6EF] border border-amber-100 p-6">
              <Sparkles
                size={18}
                className="hidden sm:block absolute top-6 right-24 text-amber-300"
              />
              <div
                className="hidden sm:block absolute right-3 bottom-0 w-28 h-32 rounded-t-full border-2 border-amber-200/60"
                aria-hidden="true"
              />

              <div className="relative flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center text-[#D9A227]">
                  <CalendarCheck size={24} />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    Ready for your next grooming session?
                  </h3>
                  <p className="text-sm text-gray-500 mt-1.5 max-w-sm">
                    Choose a service, select your time slot, and confirm your
                    booking instantly.
                  </p>

                  <button
                    onClick={() => nav("/services")}
                    className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D9A227] text-[#14213D] font-semibold hover:bg-[#c8931f] transition-colors"
                  >
                    Browse Services
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
