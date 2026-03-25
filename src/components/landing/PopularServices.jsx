import React from "react";

const featuredServices = [
  {
    title: "Haircut & Styling",
    description: "Professional haircut and modern styling at your home.",
    image:
      "https://images.pexels.com/photos/1319461/pexels-photo-1319461.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Beard Grooming",
    description: "Clean beard shaping and premium grooming experience.",
    image:
      "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Facial & Skin Care",
    description: "Relaxing facial treatments for glowing healthy skin.",
    image:
      "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Hair Spa Treatment",
    description: "Deep nourishment and scalp care for strong hair.",
    image:
      "https://images.pexels.com/photos/853427/pexels-photo-853427.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
