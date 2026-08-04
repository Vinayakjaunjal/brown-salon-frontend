import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`);

        const data = await res.json();

        setImages(data);
      } catch (error) {
        console.error("Gallery Error:", error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Duplicate the list so the marquee loop feels seamless
  const marqueeImages = [...images, ...images];

  return (
    <>
      <Helmet>
        <title>Gallery | Brown Hair The Unisex Salon</title>

        <meta
          name="description"
          content="Explore premium hairstyles, beard grooming, salon ambience and behind the scenes at Brown Hair The Unisex Salon."
        />
      </Helmet>

      <style>{`
        @keyframes gallery-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .gallery-marquee-track {
          animation: gallery-marquee 35s linear infinite;
        }
        .gallery-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section className="bg-white pt-10 md:pt-12 pb-20 overflow-hidden">
        {/* Heading */}

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-amber-600 mb-4">
            <Star size={14} className="fill-amber-500 text-amber-500" />
            Showcase
          </span>

          <h2 className="font-serif text-gray-900 text-4xl md:text-6xl tracking-wide">
            Our{" "}
            <span className="italic bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
              Work
            </span>
          </h2>

          <div className="flex items-center justify-center gap-3 mt-6 mb-10">
            <span className="h-px w-10 bg-amber-300" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="h-px w-10 bg-amber-300" />
          </div>
        </div>

        {/* Continuous scrolling gallery row */}

        {loading ? (
          <div className="flex gap-1 sm:gap-1.5 px-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="w-48 sm:w-64 aspect-[4/5] shrink-0 bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : images.length > 0 ? (
          <div className="w-full overflow-hidden">
            <div className="gallery-marquee-track flex gap-1 sm:gap-1.5 w-max">
              {marqueeImages.map((img, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden group w-48 sm:w-64 aspect-[4/5] shrink-0"
                >
                  <img
                    src={img.image}
                    alt={img.title || "Brown Hair The Unisex Salon"}
                    loading="lazy"
                    draggable={false}
                    className="
                      w-full
                      h-full
                      object-cover
                      object-center
                      transition-transform
                      duration-500
                      ease-out
                      group-hover:scale-105
                    "
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {img.title && (
                    <div className="absolute left-0 right-0 bottom-0 p-3 sm:p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-white text-xs sm:text-sm font-semibold leading-snug">
                        {img.title}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500">
            No images available.
          </div>
        )}

        {/* Explore More CTA */}
        <div className="flex justify-center mt-12">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-amber-300 text-amber-700 font-semibold text-sm hover:bg-amber-50 transition-colors"
          >
            Explore More
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
