import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  const loopImages = [...images, ...images];
  const trackRef = useRef(null);
  const startX = useRef(0);
  const currentTranslate = useRef(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => setImages(data));
  }, []);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    trackRef.current.style.animationPlayState = "paused";
  };

  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientX - startX.current;
    trackRef.current.style.transform = `translateX(${currentTranslate.current + diff}px)`;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX.current;

    currentTranslate.current += diff;
    trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
    trackRef.current.style.animationPlayState = "running";
  };

  return (
    <Box
      id="gallery"
      sx={{
        padding: "40px 0",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "30px",
          fontWeight: 700,
          color: "#111",
          fontFamily: "inherit",
        }}
      >
        Our Gallery
      </Typography>

      <Box
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        sx={{
          width: "100%",
          overflow: "hidden",
          overflowX: "auto",
          scrollBehavior: "smooth",
          cursor: "grab",
          position: "relative",

          "&:active": {
            cursor: "grabbing",
          },

          "&:hover .galleryTrack": {
            animationPlayState: "paused",
          },
        }}
      >
        <Box
          ref={trackRef}
          className="galleryTrack"
          sx={{
            display: "flex",
            gap: "8px",
            width: "max-content",
            animation: "scrollLeft 35s linear infinite",
          }}
        >
          {loopImages.map((img) => (
            <Box
              key={img._id}
              sx={{
                width: "260px",
                borderRadius: "4px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={`${import.meta.env.VITE_API_URL}${img.image}`}
                alt=""
                onClick={() => setLightbox(img.image)}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {lightbox && (
        <Box
          onClick={() => setLightbox(null)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            padding: "20px",
          }}
        >
          <Box
            component="img"
            src={`${import.meta.env.VITE_API_URL}${lightbox}`}
            alt=""
            sx={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "8px",
              boxShadow: "0 0 25px rgba(255,215,0,0.4)",
              animation: "popIn 0.25s ease",
            }}
          />
        </Box>
      )}

      <style>
        {`
          @keyframes scrollLeft {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes popIn {
            0% {
              transform: scale(0.85);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Gallery;
