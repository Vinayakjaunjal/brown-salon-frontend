import React from "react";
import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const GoogleIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 48 48" className={className}>
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.6 0-14.1 4.3-17.7 10.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.5 34.9 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.9 39.7 16.4 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C40.9 36.6 44 30.9 44 24c0-1.2-.1-2.4-.4-3.5z"
    />
  </svg>
);

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

  const total = reviews.length;
  const prevIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;

  const visible = [
    { review: reviews[prevIndex], active: false },
    { review: reviews[index], active: true },
    { review: reviews[nextIndex], active: false },
  ];

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const ReviewCard = ({ item, active }) => (
    <div
      className={`bg-white rounded-2xl p-6 sm:p-7 w-full h-full flex flex-col ${
        active
          ? "border-2 border-amber-400 shadow-lg"
          : "border border-gray-100 shadow-sm opacity-70"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold text-sm">
              {getInitials(item.name)}
            </div>
          )}
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {item.name}
          </h3>
        </div>
        <GoogleIcon className="w-6 h-6 shrink-0" />
      </div>

      <div className="flex items-center gap-1 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < item.rating
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mt-4 flex-1">
        {item.review}
      </p>
    </div>
  );

  return (
    <section className="pt-10 sm:pt-12 pb-16 sm:pb-20 bg-[#FBF6EE]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-amber-600 mb-3">
            <Star size={14} className="fill-amber-500 text-amber-500" />
            Client Reviews
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            What Our Clients Say
          </h2>

          <p className="text-gray-500 max-w-lg mx-auto mt-3 leading-relaxed">
            Real reviews from our happy clients who love our services and keep
            coming back.
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <button
            onClick={prev}
            className="flex absolute left-1 sm:-left-2 lg:left-4 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-md items-center justify-center text-gray-700 hover:bg-amber-50 transition"
            aria-label="Previous review"
          >
            <ChevronLeft size={18} className="sm:hidden" />
            <ChevronLeft size={20} className="hidden sm:block" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 w-full max-w-5xl px-10 sm:px-0">
            {visible.map(({ review, active }, i) => (
              <div
                key={i}
                className={`${
                  active ? "sm:scale-105" : "hidden sm:block"
                } transition-transform`}
              >
                <ReviewCard item={review} active={active} />
              </div>
            ))}
          </div>

          <button
            onClick={next}
            className="flex absolute right-1 sm:-right-2 lg:right-4 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-md items-center justify-center text-gray-700 hover:bg-amber-50 transition"
            aria-label="Next review"
          >
            <ChevronRight size={18} className="sm:hidden" />
            <ChevronRight size={20} className="hidden sm:block" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === i ? "bg-amber-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <div className="inline-flex items-center gap-3 bg-white rounded-full shadow-sm px-6 py-3">
            <GoogleIcon className="w-6 h-6" />
            <span className="text-xl font-bold text-gray-900">
              {avgRating.toFixed(1)}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.round(avgRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="w-px h-5 bg-gray-200" />
            <span className="text-sm text-gray-500">500+ Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
