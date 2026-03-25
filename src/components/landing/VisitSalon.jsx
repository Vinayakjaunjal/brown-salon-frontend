import React from "react";

export default function VisitSalon() {
  return (
    <section className="section-fade">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Visit Brown Salon
            </h2>

            <p className="mt-3 text-gray-600">
              Experience premium grooming and beauty services at our salon. Walk
              in or book your appointment online for a relaxing salon experience
              with professional stylists.
            </p>

            <div className="mt-6 space-y-2 text-sm text-gray-700">
              <p>
                <strong>Address:</strong> Near South Point School, Krida Square,
                Nagpur
              </p>

              <p>
                <strong>Opening Hours:</strong> 10:00 AM – 9:00 PM
              </p>

              <p>
                <strong>Phone:</strong> +91 9623245713
              </p>

              <p>
                <strong>Email:</strong> brown.unisex.salon@gmail.com
              </p>
            </div>

            <button
              onClick={() => window.open("https://maps.google.com")}
              className="mt-6 px-6 py-3 rounded-xl bg-amber-400 text-black font-semibold hover:bg-amber-500 transition-colors"
            >
              Get Directions
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-soft h-[320px]">
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
