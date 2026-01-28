import { useEffect, useRef, useState } from "react";
import "../styles/Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  const loopImages = [...images, ...images];
  const trackRef = useRef(null);
  const startX = useRef(0);
  const currentTranslate = useRef(0);

  useEffect(() => {
    fetch(`${import.meta.env.BACKEND_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => setImages(data));
  }, []);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    trackRef.current.style.animationPlayState = "paused";
  };

  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientX - startX.current;
    trackRef.current.style.transform = `translateX(${
      currentTranslate.current + diff
    }px)`;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX.current;

    currentTranslate.current += diff;
    trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;

    trackRef.current.style.animationPlayState = "running";
  };

  return (
    <section id="gallery" className="gallery-section">
      <h2 className="gallery-title">Our Gallery</h2>

      <div
        className="gallery-slider"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="gallery-track" ref={trackRef}>
          {loopImages.map((img) => (
            <div className="gallery-item" key={img._id}>
              <img
                src={`${import.meta.env.BACKEND_URL}${img.image}`}
                alt=""
                className="clickable"
                onClick={() => setLightbox(img.image)}
              />
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img
            src={`${import.meta.env.BACKEND_URL}${lightbox}`}
            alt=""
            className="lightbox-img"
          />
        </div>
      )}
    </section>
  );
};

export default Gallery;
