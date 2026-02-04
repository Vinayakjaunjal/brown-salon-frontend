import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import PricingCard from "./PricingCard";

const Pricing = () => {
  const categories = [
    "All Pricing",
    "Gents",
    "Ladies",
    "Skin Treatment",
    "Hair Treatment",
    "Premium Offers",
  ];

  const keyMap = {
    Gents: "gents",
    Ladies: "ladies",
    "Skin Treatment": "skin",
    "Hair Treatment": "hair",
    "Premium Offers": "premium",
  };

  const [active, setActive] = useState("All Pricing");
  const [pricing, setPricing] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/pricing`)
      .then((res) => res.json())
      .then((data) => setPricing(data));
  }, []);

  const cardsToShow =
    active === "All Pricing"
      ? pricing
      : pricing.filter((item) => item.category === keyMap[active]);

  return (
    <Box
      id="pricing"
      sx={{
        padding: "40px 80px",
        textAlign: "center",

        "@media (max-width:600px)": {
          padding: "40px 20px",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: "32px",
          fontWeight: 700,
          mb: "30px",
        }}
      >
        Our Pricing
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "12px",
          mb: "35px",

          "@media (max-width:600px)": {
            display: "grid",
            gridTemplateColumns: "repeat(3, 110px)",
            justifyContent: "center",
            gap: "8px",
          },
        }}
      >
        {categories.map((cat) => (
          <Box
            key={cat}
            component="button"
            onClick={() => setActive(cat)}
            sx={{
              minWidth: "110px",
              padding: "8px 20px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: active === cat ? "#0b0b0a" : "#fff",
              color: active === cat ? "#d4af37" : "#111",
              cursor: "pointer",
              fontSize: "18px",

              ...(active === cat && {
                borderColor: "#d4af37",
              }),

              "@media (max-width:600px)": {
                width: "110px",
                padding: "6px 8px",
                fontSize: "12px",
                minWidth: "110px",
              },
            }}
          >
            {cat}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          justifyContent: "center",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "25px",
          marginTop: "30px",

          "@media (max-width:992px)": {
            gridTemplateColumns: "repeat(2, 1fr)",
          },

          "@media (max-width:600px)": {
            gridTemplateColumns: "repeat(1, 320px)",
            justifyContent: "center",
          },
        }}
      >
        {cardsToShow.length === 0 ? (
          <Typography sx={{ color: "#999" }}>No services available</Typography>
        ) : (
          cardsToShow.map((item) => (
            <PricingCard
              key={item._id}
              title={item.title}
              description={item.description}
              price={item.price}
              isPremium={item.category === "premium"}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default Pricing;
