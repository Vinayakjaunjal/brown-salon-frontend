import React from "react";
import { useNavigate } from "react-router-dom";
import { HomeSticker } from "../illustrations/SalonIllustrations";

const trustStats = [
  { label: "Customer Rating", value: "4.9/5" },
  { label: "Happy Clients", value: "12K+" },
  { label: "Expert Stylists", value: "600+" },
];

export default function Hero() {
  const nav = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      <div className="absolute -top-16 -left-10 w-52 h-52 rounded-full bg-amber-300/25 blur-3xl" />
      <div className="absolute -bottom-16 -right-12 w-56 h-56 rounded-full bg-orange-300/20 blur-3xl" />

      <div className="relative grid lg:grid-cols-2 gap-8 px-5 sm:px-8 lg:px-10 py-8 sm:py-10 items-center">
        <div>
          <span className="inline-flex text-[11px] tracking-wide uppercase px-3 py-1 rounded-full bg-gray-900 text-white">
            Premium Salon Experience
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[var(--text-primary)]">
            Experience Premium Salon Services
            <span className="text-yellow-600"> At Brown Salon</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-xl">
            Visit Brown Salon for professional haircuts, grooming, skincare, and
            beauty services from experienced stylists..
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => nav("/services")}
              className="btn-primary px-7 py-3 rounded-2xl font-semibold text-black"
            >
              Book Appointment
            </button>

            <button
              onClick={() => nav("/services")}
              className="px-7 py-3 rounded-2xl border border-gray-200 bg-white text-gray-800 font-medium hover:bg-gray-50 transition-colors"
            >
              View Services
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8 max-w-md">
            {trustStats.map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-gradient-to-br from-white to-amber-50/60 border border-amber-100/80 p-3 shadow-soft"
              >
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  {item.value}
                </div>

                <div className="text-[11px] sm:text-xs text-gray-500">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="col-span-2 rounded-2xl overflow-hidden shadow-soft h-52 sm:h-64">
            <img
              src="https://images.pexels.com/photos/7697394/pexels-photo-7697394.jpeg"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="rounded-2xl overflow-hidden shadow-soft h-36 sm:h-40 bg-white">
            <img
              src="https://images.pexels.com/photos/3993133/pexels-photo-3993133.jpeg"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="rounded-2xl shadow-soft h-36 sm:h-40 bg-white p-2">
            <HomeSticker />
          </div>
        </div>
      </div>
    </section>
  );
}
