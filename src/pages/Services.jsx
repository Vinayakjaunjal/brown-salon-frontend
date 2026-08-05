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
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#FBF6EE] pt-5 sm:pt-6 pb-5 sm:pb-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Choose Your Service
          </h1>

          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Premium salon services in Nagpur.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-10 sm:py-14">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex gap-2.5 mb-8 flex-wrap justify-center sm:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  selectedCategory === cat
                    ? "bg-amber-400 text-gray-900 border-amber-400"
                    : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-gray-500">
              No services available in this category.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
