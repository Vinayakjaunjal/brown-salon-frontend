import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ServiceCard from "./ServiceCard";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/services`)
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);

  return (
    <Box
      id="services"
      sx={{
        padding: "60px 80px",
        textAlign: "center",
        background: "#fff",
        color: "#111",

        "@media (max-width:600px)": {
          padding: "40px 20px",
        },
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <Typography
          sx={{
            fontSize: "34px",
            fontWeight: 700,
            marginBottom: "35px",
          }}
        >
          Our Services
        </Typography>

        <Box
          sx={{
            display: "grid",
            justifyContent: "center",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "30px",

            "@media (max-width:992px)": {
              gridTemplateColumns: "repeat(2, 1fr)",
            },

            "@media (max-width:600px)": {
              gridTemplateColumns: "repeat(1, 1fr)",
            },
          }}
        >
          {services.map((item) => (
            <ServiceCard
              key={item._id}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Services;
