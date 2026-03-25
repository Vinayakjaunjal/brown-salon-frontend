import React from "react";
import haircut from "../../assets/pop-img-hair.webp";
import beard from "../../assets/pop-img-beard.webp";
import facial from "../../assets/pop-img-facial.webp";
import spa from "../../assets/pop-img-spa.webp";

const featuredServices = [
  {
    title: "Haircut & Styling",
    description: "Professional haircut and modern styling at your home.",
    image: haircut,
  },
  {
    title: "Beard Grooming",
    description: "Clean beard shaping and premium grooming experience.",
    image: beard,
  },
  {
    title: "Facial & Skin Care",
    description: "Relaxing facial treatments for glowing healthy skin.",
    image: facial,
  },
  {
    title: "Hair Spa Treatment",
    description: "Deep nourishment and scalp care for strong hair.",
    image: spa,
  },
];

export default function PopularServices() {
  return (
    <section>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Popular Services</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {featuredServices.map((service) => (
          <div
            key={service.title}
            className="rounded-2xl overflow-hidden shadow-soft"
          >
            <img src={service.image} className="h-44 w-full object-cover" />

            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900">
                {service.title}
              </h3>
              <p className="text-sm text-gray-700">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
