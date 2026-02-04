import React from "react";
import { Box, Typography } from "@mui/material";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      id="contact"
      sx={{
        background: "#222426",
        color: "#f7f7f7",
        padding: "90px 0 30px",
        fontFamily: "Inter, sans-serif",
        borderTop: "1px solid #eee",

        "@media (max-width:768px)": {
          padding: "70px 0 25px",
        },
      }}
    >
      <Box
        sx={{
          width: "85%",
          maxWidth: "1200px",
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
          gap: "70px",
          flexWrap: "wrap",

          "@media (max-width:768px)": {
            flexDirection: "column",
            gap: "45px",
          },
        }}
      >
        <Box sx={{ flex: 1, minWidth: "250px" }}>
          <Typography
            sx={{
              marginBottom: "22px",
              color: "#fafafa",
              fontWeight: 600,
              fontSize: "1.3rem",
              letterSpacing: "0.3px",
            }}
          >
            Contact Us
          </Typography>

          <Box className="contact-icons">
            {[
              {
                icon: <FaMapMarkerAlt />,
                text: "Near South Point School, Krida Square, Nagpur",
              },
              {
                icon: <FaPhone />,
                text: "+91 9623245713",
                link: "tel:+919623245713",
              },
              {
                icon: <FaEnvelope />,
                text: "brown.unisex.salon@gmail.com",
                link: "mailto:brown.unisex.salon@gmail.com",
              },
              {
                icon: <FaClock />,
                text: "Mon–Sun: 9:00 AM – 10:00 PM",
              },
            ].map((item, i) => (
              <Box
                key={i}
                component={item.link ? "a" : "p"}
                href={item.link}
                sx={{
                  color: "#fbf9f9",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  lineHeight: 1.8,
                  textDecoration: "none",
                  transition: "0.3s ease",
                  cursor: item.link ? "pointer" : "default",

                  "&:hover": {
                    color: "#d4af37",
                    transform: "translateX(2px)",
                  },
                }}
              >
                {item.icon} {item.text}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: "250px" }}>
          <Typography
            sx={{
              marginBottom: "22px",
              color: "#fafafa",
              fontWeight: 600,
              fontSize: "1.3rem",
              letterSpacing: "0.3px",
            }}
          >
            Follow Us
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: "18px",
              marginTop: "5px",
            }}
          >
            {[
              {
                icon: <FaInstagram />,
                link: "https://www.instagram.com/brown_hair_unisex_saloon",
              },
              {
                icon: <FaFacebook />,
                link: "https://www.facebook.com/share/1VyxMZ1hub/",
              },
              {
                icon: <FaWhatsapp />,
                link: "https://wa.me/919623245713",
              },
            ].map((social, i) => (
              <Box
                key={i}
                component="a"
                href={social.link}
                target="_blank"
                sx={{
                  fontSize: "26px",
                  color: "#ebebeb",
                  transition: "all 0.35s ease",
                  cursor: "pointer",

                  "&:hover": {
                    color: "#d4af37",
                    transform: "translateY(-4px) scale(1.05)",
                  },
                }}
              >
                {social.icon}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: "250px" }}>
          <Typography
            sx={{
              marginBottom: "22px",
              color: "#fafafa",
              fontWeight: 600,
              fontSize: "1.3rem",
              letterSpacing: "0.3px",
            }}
          >
            Stay in the Know
          </Typography>

          <Typography
            sx={{
              fontSize: "15px",
              color: "#fbf9f9",
              lineHeight: 1.8,
            }}
          >
            Subscribe to our newsletter for updates & offers.
          </Typography>

          <Box
            sx={{
              marginTop: "14px",
              display: "flex",
              maxWidth: "340px",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid #ddd",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Box
              component="input"
              type="email"
              placeholder="Enter your email"
              sx={{
                padding: "13px 15px",
                border: "none",
                width: "70%",
                outline: "none",
                fontSize: "14px",
                background: "transparent",
                fontFamily: "inherit",
              }}
            />

            <Box
              component="button"
              sx={{
                padding: "13px 18px",
                border: "none",
                background: "linear-gradient(135deg, #d4af37, #c49a2c)",
                color: "#111",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",

                "&:hover": {
                  background: "linear-gradient(135deg, #c49a2c, #b08a24)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Subscribe
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          marginTop: "70px",
          paddingTop: "25px",
          borderTop: "1px solid #e5e5e5",
          color: "#777",
          fontSize: "14px",
          letterSpacing: "0.3px",
        }}
      >
        © 2025{" "}
        <Box component="span" sx={{ color: "#f9f9f7", fontWeight: 600 }}>
          Brown Hair Salon.
        </Box>{" "}
        All Rights Reserved.
      </Box>
    </Box>
  );
};

export default Footer;
