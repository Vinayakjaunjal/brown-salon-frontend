import React from "react";
import { Box, Typography, Button } from "@mui/material";
import heroImg from "../assets/hero-banner-interior.jpg";

function Hero() {
  const goToAppointment = () => {
    const section = document.getElementById("appointment");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      id="home"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #ffffff, #f5f5f5)",
        padding: "100px 20px 60px",

        "@media (max-width:768px)": {
          padding: "80px 16px 50px",
        },
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "auto",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          alignItems: "center",
          gap: "60px",

          "@media (max-width:768px)": {
            gridTemplateColumns: "1fr",
            gap: "5px",
          },

          "@media (max-width:480px)": {
            gap: "30px",
          },
        }}
      >
        <Box
          sx={{
            padding: "60px",
            animation: "fadeUp 1s ease",

            "@media (max-width:768px)": {
              padding: "20px 10px",
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: "inline-block",
              background: "rgba(212,175,55,0.12)",
              color: "#b8962e",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Luxury Salon Experience
          </Box>

          <Typography
            sx={{
              fontFamily: `"Cormorant Garamond", serif`,
              fontSize: "3.4rem",
              fontWeight: 600,
              lineHeight: 1.2,
              color: "#111",
              marginBottom: "20px",

              "@media (max-width:768px)": {
                fontSize: "2.2rem",
                lineHeight: 1.25,
              },

              "@media (max-width:480px)": {
                fontSize: "1.9rem",
              },
            }}
          >
            Elevate Your Style
            <br />
            Define Your{" "}
            <Box component="span" sx={{ color: "#d4af37" }}>
              Confidence
            </Box>
          </Typography>

          <Typography
            sx={{
              fontFamily: `"Manrope", sans-serif`,
              fontSize: "1.05rem",
              color: "#666",
              lineHeight: 1.8,
              maxWidth: "480px",
              marginBottom: "35px",

              "@media (max-width:768px)": {
                fontSize: "1rem",
                marginBottom: "30px",
              },

              "@media (max-width:480px)": {
                fontSize: "0.9rem",
              },
            }}
          >
            Premium hair & beauty services crafted for elegance, confidence, and
            comfort — just for you.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: "16px",

              "@media (max-width:768px)": {
                gap: "14px",
              },
            }}
          >
            <Button
              onClick={goToAppointment}
              sx={{
                padding: "10px 20px",
                borderRadius: "5px",
                fontWeight: 600,
                fontSize: "14px",
                textTransform: "none",
                background: "linear-gradient(135deg, #d4af37, #b8962e)",
                color: "#111",
                transition: "all 0.3s ease",

                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(212,175,55,0.3)",
                  background: "linear-gradient(135deg, #d4af37, #b8962e)",
                },

                "@media (max-width:768px)": {
                  padding: "12px 20px",
                  fontSize: "13px",
                },

                "@media (max-width:480px)": {
                  padding: "10px 16px",
                  fontSize: "12px",
                },
              }}
            >
              Book Appointment
            </Button>

            <Button
              component="a"
              href="#services"
              sx={{
                padding: "10px 20px",
                borderRadius: "5px",
                fontWeight: 600,
                fontSize: "14px",
                textTransform: "none",
                background: "transparent",
                color: "#111",
                border: "1px solid #ddd",
                transition: "all 0.3s ease",

                "&:hover": {
                  borderColor: "#d4af37",
                  color: "#d4af37",
                  background: "transparent",
                },

                "@media (max-width:768px)": {
                  padding: "12px 20px",
                  fontSize: "13px",
                },

                "@media (max-width:480px)": {
                  padding: "10px 16px",
                  fontSize: "12px",
                },
              }}
            >
              Explore Services
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            padding: "60px",
            position: "relative",
            animation: "fadeIn 1.2s ease",

            "@media (max-width:768px)": {
              padding: "20px 10px",
            },
          }}
        >
          <Box
            component="img"
            src={heroImg}
            alt="Luxury Salon"
            loading="lazy"
            sx={{
              width: "100%",
              borderRadius: "8px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              objectFit: "cover",

              "@media (max-width:768px)": {
                borderRadius: "2px",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Hero;
