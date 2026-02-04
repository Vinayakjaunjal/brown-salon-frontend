import React from "react";
import { Box, Grid, Typography, List, ListItem } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import aboutImg from "../assets/Brown-About-Us.jpg";

const About = () => {
  return (
    <Box
      id="about"
      sx={{
        padding: "80px 0",
        background: "#fff",
        fontFamily: "Inter, sans-serif",
        "@media (max-width:768px)": {
          padding: "60px 0",
        },
      }}
    >
      <Box
        sx={{
          width: "85%",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <Grid
          container
          alignItems="center"
          columnSpacing="60px"
          sx={{
            gridTemplateColumns: "1.2fr 1fr",
            display: "grid",
            "@media (max-width:992px)": {
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "40px",
            },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#111",
                marginBottom: "25px",
                position: "relative",
                "@media (max-width:992px)": {
                  fontSize: "2rem",
                },
                "@media (max-width:480px)": {
                  fontSize: "1.7rem",
                },
                "&::after": {
                  content: '""',
                  width: "55px",
                  height: "3px",
                  background: "#d4af37",
                  position: "absolute",
                  left: 0,
                  bottom: "-10px",
                },
              }}
            >
              About Us
            </Typography>

            <Typography
              sx={{
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "#555",
                marginBottom: "35px",
                maxWidth: "95%",
                "@media (max-width:768px)": {
                  fontSize: "0.95rem",
                },
              }}
            >
              Welcome to <strong>Brown Hair The Unisex Salon</strong>, where
              beauty meets precision and style becomes an experience. For years,
              we’ve dedicated ourselves to creating a space where every client
              feels valued, confident, and transformed.
              <br />
              <br />
              Our journey began with a simple goal — to offer world-class hair
              and beauty services with unmatched comfort and care.
              <br />
              <br />
              With a team of skilled stylists, premium products, and modern
              techniques, we deliver results that elevate your natural beauty.
            </Typography>

            <Box sx={{ marginBottom: "35px" }}>
              <Typography
                sx={{
                  fontSize: "1.3rem",
                  marginBottom: "16px",
                  color: "#111",
                  fontWeight: 600,
                }}
              >
                What We Stand For
              </Typography>

              <List disablePadding>
                {[
                  "Premium, modern & customer-centric salon",
                  "Highly skilled beauty & hair experts",
                  "Personalized styling & consultation",
                ].map((item, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "14px",
                      padding: 0,
                      color: "#555",
                      fontSize: "1rem",
                      lineHeight: 1.6,
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        color: "#d4af37",
                        fontSize: "1.1rem",
                        marginTop: "4px",
                      }}
                    />
                    {item}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ marginBottom: "35px" }}>
              <Typography
                sx={{
                  fontSize: "1.3rem",
                  marginBottom: "16px",
                  color: "#111",
                  fontWeight: 600,
                }}
              >
                Why Choose Us
              </Typography>

              <List disablePadding>
                {[
                  "Custom styling based on your personality",
                  "Premium, safe & branded products",
                  "Transparent pricing & friendly staff",
                  "Luxury experience at affordable prices",
                ].map((item, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "14px",
                      padding: 0,
                      color: "#555",
                      fontSize: "1rem",
                      lineHeight: 1.6,
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        color: "#d4af37",
                        fontSize: "1.1rem",
                        marginTop: "4px",
                      }}
                    />
                    {item}
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>

          <Box
            sx={{
              background: "#fff",
              padding: "12px",
              borderRadius: "18px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
            }}
          >
            <Box
              component="img"
              src={aboutImg}
              loading="lazy"
              alt="Brown Hair Salon"
              sx={{
                width: "115%",
                maxWidth: "520px",
                borderRadius: "14px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                objectFit: "cover",
                "@media (max-width:768px)": {
                  width: "100%",
                  maxHeight: "360px",
                },
                "@media (max-width:480px)": {
                  maxHeight: "300px",
                  borderRadius: "12px",
                },
              }}
            />
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default About;
