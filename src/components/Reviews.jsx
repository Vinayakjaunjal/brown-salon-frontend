import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data.filter((r) => r.isActive)));
  }, []);

  useEffect(() => {
    if (reviews.length === 0 || pause) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [reviews, pause]);

  if (reviews.length === 0) return null;

  const current = reviews[index];

  const next = () => setIndex((index + 1) % reviews.length);
  const prev = () => setIndex((index - 1 + reviews.length) % reviews.length);

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0]?.toUpperCase();
    return (
      words[0][0]?.toUpperCase() + words[words.length - 1][0]?.toUpperCase()
    );
  };

  return (
    <Box
      sx={{
        padding: "60px 0",
        background: "#f7f7f7",
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: "32px",
          fontWeight: 700,
          marginBottom: "40px",
          fontFamily: "inherit",
          color: "#111",
        }}
      >
        What Our Clients Say
      </Typography>

      {/* SLIDER */}
      <Box
        onMouseEnter={() => setPause(true)}
        onMouseLeave={() => setPause(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* LEFT ARROW */}
        <Box
          component="button"
          onClick={prev}
          sx={{
            color: "#0b0101",
            border: "none",
            fontSize: "24px",
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            cursor: "pointer",
            transition: "0.3s",
            background: "transparent",
          }}
        >
          ❮
        </Box>

        {/* REVIEW CARD */}
        <Box
          sx={{
            width: "450px",
            background: "#fff",
            padding: "30px 25px",
            borderRadius: "18px",
            boxShadow: "0 5px 25px rgba(0,0,0,0.15)",
            margin: "0 25px",
            transition: "0.4s ease",

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* PROFILE IMAGE / INITIAL */}
          <Box
            sx={{
              width: "90px",
              height: "90px",
              margin: "0 auto 15px",
              borderRadius: "50%",
              border: "4px solid #d4af37",
              overflow: "hidden",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {current.image ? (
              <Box
                component="img"
                src={`${import.meta.env.VITE_API_URL}${current.image}`}
                alt={current.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #d4af37, #b8962e)",
                  color: "#111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  fontWeight: 700,
                  borderRadius: "50%",
                  textTransform: "uppercase",
                }}
              >
                {getInitials(current.name)}
              </Box>
            )}
          </Box>

          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              marginTop: "10px",
              fontFamily: "inherit",
            }}
          >
            {current.name}
          </Typography>

          <Typography
            sx={{
              color: "#555",
              fontStyle: "italic",
              margin: "15px 0",
              fontFamily: "inherit",
            }}
          >
            "{current.review}"
          </Typography>

          {/* STARS */}
          <Box>
            {Array.from(
              { length: Math.max(0, Number(current.rating) || 0) },
              (_, i) => (
                <Box
                  key={i}
                  component="span"
                  sx={{
                    color: "#d4af37",
                    fontSize: "20px",
                  }}
                >
                  ★
                </Box>
              ),
            )}
          </Box>
        </Box>

        {/* RIGHT ARROW */}
        <Box
          component="button"
          onClick={next}
          sx={{
            color: "#0b0101",
            border: "none",
            fontSize: "24px",
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            cursor: "pointer",
            transition: "0.3s",
            background: "transparent",
          }}
        >
          ❯
        </Box>
      </Box>

      {/* DOTS */}
      <Box
        sx={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {reviews.map((review, i) => (
          <Box
            key={review._id || i}
            onClick={() => setIndex(i)}
            sx={{
              width: "12px",
              height: "12px",
              background: index === i ? "#d4af37" : "#ccc",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "0.3s",
              transform: index === i ? "scale(1.25)" : "scale(1)",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Reviews;
