import React, { useRef, useState, useEffect } from "react";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  const trackRef = useRef(null);
  const startX = useRef(0);
  const currentTranslate = useRef(0);

  // ================= FETCH IMAGES =================
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch(() => setImages([]));
  }, []);

  const loopImages = [...images, ...images];
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "paused";
    }
  };

  const handleTouchMove = (e) => {
    if (!trackRef.current) return;
    const diff = e.touches[0].clientX - startX.current;
    trackRef.current.style.transform = `translateX(${currentTranslate.current + diff}px)`;
  };

  const handleTouchEnd = (e) => {
    if (!trackRef.current) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX.current;

    currentTranslate.current += diff;
    trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
    trackRef.current.style.animationPlayState = "running";
  };

  return (
    <section id="gallery" className="py-12">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Our Gallery</h2>

        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <div ref={trackRef} className="flex gap-3 galleryTrack w-max">
            {loopImages.map((img, i) => (
              <div
                key={i}
                className="w-[260px] rounded-xl overflow-hidden flex-shrink-0 shadow-md"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}${img?.image}`}
                  onClick={() => setLightbox(img?.image)}
                  onError={(e) => (e.target.style.display = "none")}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {images.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No images available</p>
        )}
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-5"
        >
          <img
            src={`${import.meta.env.VITE_API_URL}${lightbox}`}
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-lg"
          />
        </div>
      )}

      <style>{`
        .galleryTrack {
          animation: scrollLeft 60s linear infinite;
        }

        .galleryTrack:hover {
          animation-play-state: paused;
        }

        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
