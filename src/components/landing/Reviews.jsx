import React from "react";
import { useEffect, useState } from "react";

export default function Reviews() {
  const [index, setIndex] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/reviews`)
      .then((res) => res.json())
      .then((data) => {
        const active = data.filter((r) => r.isActive);
        setReviews(active);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const next = () => {
    setIndex((index + 1) % reviews.length);
  };

  const prev = () => {
    setIndex((index - 1 + reviews.length) % reviews.length);
  };

  const getInitials = (name) => {
    const words = name.split(" ");
    return words[0][0] + (words[1] ? words[1][0] : "");
  };

  if (!reviews.length) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-5 text-center">
        <h2 className="text-3xl font-bold mb-10">What Our Clients Say</h2>

        <div className="relative flex items-center justify-center overflow-hidden">
          <button onClick={prev} className="absolute left-0 text-2xl z-10">
            ❮
          </button>

          <div className="w-full overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {reviews.map((item, i) => (
                <div
                  key={i}
                  className="w-full flex-shrink-0 flex justify-center"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
                    <div className="flex flex-col items-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          className="w-16 h-16 rounded-full object-cover mb-3"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-lg mb-3">
                          {getInitials(item.name)}
                        </div>
                      )}

                      <h3 className="font-semibold text-lg">{item.name}</h3>

                      <div className="text-yellow-500 mt-1">
                        {"★".repeat(item.rating)}
                        {"☆".repeat(5 - item.rating)}
                        {}
                      </div>

                      <p className="text-gray-600 italic mt-4">
                        "{item.review}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={next} className="absolute right-0 text-2xl z-10">
            ❯
          </button>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          {reviews.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                index === i ? "bg-yellow-500" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
