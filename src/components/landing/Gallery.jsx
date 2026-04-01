import React, { useState, useEffect } from "react";

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
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="text-3xl font-semibold text-center mb-6">Our Work</h2>

        <div className="flex justify-center gap-6 mb-10 text-sm font-medium">
          {["work", "bts", "ambience"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`pb-1 capitalize transition ${
                active === cat
                  ? "text-black border-b-2 border-yellow-600"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="columns-2 sm:columns-3 md:columns-4 gap-2 space-y-2">
          {filteredImages.map((img, i) => {
            console.log("GALLERY IMAGE:", img.image);
            return (
              <div
                key={i}
                onClick={() => setLightbox(img.image)}
                className="break-inside-avoid overflow-hidden cursor-pointer group"
              >
                <img
                  src={img.image}
                  alt="gallery"
                  loading="lazy"
                  className="w-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:brightness-110"
                />
              </div>
            );
          })}
        </div>

        {filteredImages.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No images available</p>
        )}
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <img
            src={`${import.meta.env.VITE_API_URL}${lightbox}`}
            className="max-w-[90%] max-h-[90%]"
          />
        </div>
      )}
    </section>
  );
}
