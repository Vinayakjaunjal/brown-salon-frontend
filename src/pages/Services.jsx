import React, { useState, useEffect } from "react";
import ServiceCard from "../components/ServiceCard";
import { getServices } from "../services/api";

const categories = [
  "All",
  "Mens",
  "Womens",
  "Skin Treatment",
  "Hair Treatment",
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    getServices().then((data) => {
      setServices(data);
    });
  }, []);

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-8 section-fade">
      <section className="rounded-3xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 px-5 sm:px-7 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Choose Your Service
        </h1>
      </section>

      <div className="flex gap-2 mb-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat
                ? "bg-amber-400 text-black"
                : "bg-white text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {filteredServices.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </div>
  );
}
