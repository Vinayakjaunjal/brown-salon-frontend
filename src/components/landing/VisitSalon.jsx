import React from "react";
import { MapPin, Clock, Phone, Mail, Navigation, Star } from "lucide-react";

const details = [
  {
    icon: MapPin,
    label: "Address",
    value: "Near South Point School, Krida Square, Nagpur",
  },
  {
    icon: Clock,
    label: "Opening Hours",
    value: "10:00 AM – 9:00 PM, Everyday",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9623245713",
  },
  {
    icon: Mail,
    label: "Email",
    value: "brown.unisex.salon@gmail.com",
  },
];

export default function VisitSalon() {
  return (
    <section className="relative pt-10 sm:pt-12 pb-4 sm:pb-5 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left column */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-4 py-2 rounded-full border border-amber-300 bg-amber-50 text-gray-900">
              <Star size={14} className="fill-amber-500 text-amber-500" />
              Visit Us
            </span>

            <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-gray-900">
              Visit Brown Salon
            </h2>

            <p className="mt-4 text-gray-500 max-w-md leading-relaxed">
              Experience premium grooming and beauty services at our salon. Walk
              in or book your appointment online for a relaxing salon experience
              with professional stylists.
            </p>

            <div className="mt-8 space-y-4">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-full bg-white border border-amber-100 shadow-sm flex items-center justify-center text-amber-600">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {label}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.open("https://maps.google.com")}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-gray-900 font-semibold hover:bg-amber-500 transition-colors"
            >
              <Navigation size={18} />
              Get Directions
            </button>
          </div>

          {/* Right column - map */}
          <div className="rounded-2xl overflow-hidden shadow-md border-4 border-amber-200 h-[340px] sm:h-[400px]">
            <iframe
              title="Salon Location"
              src="https://maps.google.com/maps?width=600&height=350&hl=en&q=brown%20hair%20the%20unisex%20saloon&t=&z=14&ie=UTF8&iwloc=B&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
