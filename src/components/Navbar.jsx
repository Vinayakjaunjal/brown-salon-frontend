import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { FiMenu } from "react-icons/fi";

import logo from "../assets/brown-logo.png";

function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "Gallery", href: "#gallery" },
    { label: "Appointment", href: "#appointment" },
    { label: "Contact", href: "#contact" },
  ];

  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = links.map((l) => document.querySelector(l.href));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      {
        threshold: [0.2, 0.4, 0.6],
      },
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Box
      sx={{
        background: "#ffffff",
        height: "70px",
        padding: "0 20px",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",

        "@media (max-width:768px)": {
          height: "85px",
        },

        "@media (max-width:576px)": {
          height: "75px",
        },
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "auto",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <Box component="a" href="#">
          <Box
            component="img"
            src={logo}
            alt="Brown Hair Logo"
            sx={{
              height: "110px",
              objectFit: "contain",

              "@media (max-width:768px)": {
                height: "95px",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
              },
            }}
          />
        </Box>

        <Box
          onClick={() => setOpen(!open)}
          sx={{
            width: "55px",
            height: "35px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#111",
            background: "#fff",
            transition: "all 0.3s ease",

            "&:hover": {
              borderColor: "#d4af37",
              color: "#d4af37",
              boxShadow: "0 4px 12px rgba(212,175,55,0.25)",
            },
          }}
        >
          <FiMenu size={22} />
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: "24px",
            alignItems: "center",
          }}
        >
          {links.map((link) => (
            <Box
              key={link.label}
              component="a"
              href={link.href}
              sx={{
                color: active === link.href ? "#d4af37" : "#111",

                fontWeight: "bold",
                textDecoration: "none",
                transition: "color 0.3s ease",

                "&:hover": {
                  color: "#d4af37",
                },
              }}
            >
              {link.label}
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: "100%",
          left: 0,
          width: "100%",
          background: "#ffffff",
          padding: open ? "20px" : "0 20px",
          boxShadow: open ? "0 10px 25px rgba(0,0,0,0.15)" : "none",
          borderRadius: "0 0 16px 16px",
          overflow: "hidden",

          maxHeight: open ? "420px" : "0px",
          transition: "all 0.35s ease",

          display: { xs: "block", md: "none" },
        }}
      >
        {links.map((link, i) => (
          <Box
            key={link.label}
            component="a"
            href={link.href}
            onClick={closeMenu}
            sx={{
              display: "block",
              padding: "12px 0",
              fontSize: "1.05rem",
              fontWeight: "bold",
              color: "#111",
              textDecoration: "none",
              borderBottom:
                i !== links.length - 1 ? "1px solid #f0f0f0" : "none",
              transition: "color 0.3s ease",

              "&:hover": {
                color: "#d4af37",
              },
            }}
          >
            {link.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Navbar;
