import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [active, setActive] = useState("work");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch(() => setImages([]));
  }, []);

  const filteredImages = images.filter((img) => img.category === active);

  return (
    <>
      <Helmet>
        <title>Gallery | Brown Hair The Unisex Salon</title>
        <meta
          name="description"
          content="Explore the gallery of Brown Hair The Unisex Salon. View our latest haircuts, beard grooming, hair color, hair spa, salon ambience and behind the scenes."
        />
      </Helmet>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-4xl md:text-5xl font-light tracking-[0.15em] uppercase text-center">
            Our Work
          </h2>

          <div className="w-20 h-[1px] bg-[#C89B5D] mx-auto mt-5 mb-10"></div>

          {/* Tabs */}

          <div className="flex justify-center gap-8 md:gap-12 mb-12">
            {["work", "bts", "ambience"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`
                  uppercase
                  text-xs
                  md:text-sm
                  tracking-[0.25em]
                  pb-2
                  transition-all
                  duration-300

                  ${
                    active === cat
                      ? "text-[#C89B5D] border-b border-[#C89B5D]"
                      : "text-gray-600 hover:text-[#C89B5D]"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredImages.map((img, index) => (
              <div
                key={index}
                onClick={() => setLightbox(img.image)}
                className="
                relative
                overflow-hidden
                cursor-pointer
                group
                "
              >
                <img
                  src={img.image}
                  alt="Brown Hair The Unisex Salon"
                  loading="lazy"
                  className="
                  w-full
                  aspect-[4/5]
                  object-cover
                  transition-all
                  duration-500
                  ease-out
                  group-hover:scale-105
                  "
                />

                <div
                  className="
                  absolute
                  inset-0
                  bg-black/0
                  group-hover:bg-black/25
                  transition-all
                  duration-500
                  "
                ></div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No images available.
            </p>
          )}

          {lightbox && (
            <div
              onClick={() => setLightbox(null)}
              className="
              fixed
              inset-0
              bg-black/90
              backdrop-blur-sm
              flex
              items-center
              justify-center
              z-[9999]
              p-4
              "
            >
              <button
                onClick={() => setLightbox(null)}
                className="
                absolute
                top-6
                right-6
                text-white
                text-4xl
                leading-none
                hover:text-[#C89B5D]
                transition
                "
              >
                ×
              </button>

              <img
                src={lightbox}
                alt="Brown Hair The Unisex Salon"
                onClick={(e) => e.stopPropagation()}
                className="
                max-w-[95vw]
                max-h-[90vh]
                object-contain
                rounded-md
                shadow-2xl
                "
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
