import { Box } from "@mui/material";

const MapSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "40px",
        padding: "60px 40px",
        alignItems: "center",
        background: "#fff",

        "@media (max-width:768px)": {
          flexDirection: "column",
          padding: "40px 20px",
        },
      }}
    >
      <Box
        sx={{
          flex: 1.5,
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <Box
          component="iframe"
          src="https://maps.google.com/maps?width=600&height=350&hl=en&q=brown%20hair%20the%20unisex%20saloon&t=&z=14&ie=UTF8&iwloc=B&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          sx={{
            width: "100%",
            height: "520px",
            border: "none",

            "@media (max-width:768px)": {
              height: "320px",
              width: "450px",
            },

            "@media (max-width:480px)": {
              height: "240px",
              width: "380px",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default MapSection;
