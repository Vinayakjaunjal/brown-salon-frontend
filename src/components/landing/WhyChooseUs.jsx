import React from "react";
import { useNavigate } from "react-router-dom";

export default function WhyChooseUs() {
  const nav = useNavigate();

  return (
    <section className="rounded-3xl bg-[#101418] px-5 sm:px-8 py-8 sm:py-10 text-white section-fade">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Why Choose Brown Salon
          </h2>

          <p className="mt-3 text-sm sm:text-base text-gray-300">
            Our expert stylists provide premium grooming and beauty services in
            a relaxing salon environment.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-gray-200">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span>Certified and experienced beauty professionals.</span>
            </li>

            <li className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span>Affordable pricing with transparent billing.</span>
            </li>

            <li className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span>Easy online booking and flexible scheduling.</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl overflow-hidden h-36 sm:h-44">
            <img
              src="https://images.pexels.com/photos/3993446/pexels-photo-3993446.jpeg?auto=compress&cs=tinysrgb&w=1000"
              alt="Salon service"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="rounded-2xl overflow-hidden h-36 sm:h-44">
            <img
              src="https://images.pexels.com/photos/3993322/pexels-photo-3993322.jpeg?auto=compress&cs=tinysrgb&w=1000"
              alt="Professional makeup"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="col-span-2 rounded-2xl bg-white/10 border border-white/10 p-5">
            <p className="text-sm text-gray-200">
              Ready for your next grooming session? Choose a service, select
              your time slot, and confirm your booking instantly.
            </p>

            <button
              onClick={() => nav("/services")}
              className="mt-4 px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-colors"
            >
              Browse Services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
