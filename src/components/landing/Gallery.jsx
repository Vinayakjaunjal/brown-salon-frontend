import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState("work");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch(() => setImages([]));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  const filteredImages = images.filter((img) => img.category === activeTab);

  return (
    <>
      <Helmet>
        <title>Gallery | Brown Hair The Unisex Salon</title>

        <meta
          name="description"
          content="Explore our latest hairstyles, beard styling, salon ambience and behind the scenes."
        />
      </Helmet>

      <section className="bg-white pt-14 md:pt-20 pb-16">
        {/* Heading */}

        <div className="max-w-5xl mx-auto px-5">
          <h2
            className="
            text-center
            uppercase
            font-light
            tracking-[0.16em]
            text-[34px]
            md:text-[56px]
            "
          >
            Our Work
          </h2>

          <div
            className="
            w-24
            h-px
            bg-[#C89B5D]
            mx-auto
            mt-6
            mb-10
            "
          />

          {/* Tabs */}

          <div
            className="
            flex
            justify-center
            gap-8
            md:gap-12
            mb-10
            "
          >
            {["work", "bts", "ambience"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  uppercase
                  text-[11px]
                  md:text-sm
                  tracking-[0.18em]
                  pb-2
                  transition-all
                  duration-300

                  ${
                    activeTab === tab
                      ? "text-[#C89B5D] border-b border-[#C89B5D]"
                      : "text-neutral-600 hover:text-[#C89B5D]"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Apple Style Gallery */}

        <div
          className="
          w-full
          px-[8px]
          md:px-8
          "
        >
          <div
            className="
            max-w-[1500px]
            mx-auto

            grid

            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4

            gap-[6px]
            md:gap-3
            "
          >
            {filteredImages.map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(img.image)}
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
                  object-center

                  transition-all
                  duration-500

                  group-hover:scale-[1.05]
                  "
                />

                {/* Apple Overlay */}

                <div
                  className="
                  absolute
                  inset-0

                  bg-black/0

                  group-hover:bg-black/20

                  transition-all
                  duration-500
                  "
                />
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No images available.
            </p>
          )}
        </div>

        {/* PART 2 STARTS FROM HERE */}

        {/* Apple Home Gallery */}

        <div className="w-full px-[6px] sm:px-3 md:px-8">
          <div
            className="
      mx-auto
      max-w-[1700px]

      grid
      grid-cols-2
      md:grid-cols-3
      lg:grid-cols-4

      gap-[6px]
      md:gap-3
    "
          >
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="
            w-full
            aspect-[4/5]
            bg-neutral-200
            animate-pulse
          "
                  />
                ))
              : galleryImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img.image)}
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
              object-center

              transition-transform
              duration-500
              ease-out

              group-hover:scale-[1.05]
            "
                    />

                    {/* Apple Overlay */}

                    <div
                      className="
              absolute
              inset-0

              bg-black/0

              group-hover:bg-black/20

              transition-all
              duration-500
            "
                    />
                  </div>
                ))}
          </div>
        </div>

        {/* Lightbox Starts In Part 3 */}
        {/* Lightbox */}

        {selectedImage && (
          <div
            className="
      fixed
      inset-0
      z-[9999]

      bg-black/90

      flex
      items-center
      justify-center

      p-4
    "
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}

            <button
              onClick={() => setSelectedImage(null)}
              className="
        absolute
        top-5
        right-5

        text-white
        text-4xl
        leading-none

        hover:text-[#C89B5D]

        transition-colors
        duration-300
      "
              aria-label="Close"
            >
              ×
            </button>

            {/* Image */}

            <img
              src={selectedImage}
              alt="Gallery Preview"
              onClick={(e) => e.stopPropagation()}
              className="
        max-w-full
        max-h-[90vh]

        object-contain

        rounded-sm

        shadow-2xl

        animate-[fadeIn_.35s_ease]
      "
            />
          </div>
        )}
      </section>
    </>
  );
}
