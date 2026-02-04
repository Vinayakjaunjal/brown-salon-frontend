import React from "react";
import { Box, Typography } from "@mui/material";

const ServiceCard = ({ icon, title, desc }) => {
  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "14px",
        padding: "28px 22px",
        textAlign: "center",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        width: "100%",
        minHeight: "260px",
        transition: "all 0.3s ease",
        border: "1px solid #eee",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 25px rgba(0,0,0,0.12)",
        },

        "@media (max-width:600px)": {
          minHeight: "auto",
          padding: "20px",
        },
      }}
    >
      {/* ICON */}
      <Box
        component="i"
        className={icon}
        sx={{
          fontSize: "42px",
          color: "#d4af37",
          marginBottom: "12px",
        }}
      />

      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 600,
          color: "#111",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: "#666",
          margin: "12px 0 18px",
          fontSize: "15px",
        }}
      >
        {desc}
      </Typography>
    </Box>
  );
};

export default ServiceCard;
