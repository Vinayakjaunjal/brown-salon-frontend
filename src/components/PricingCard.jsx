import { Box, Typography } from "@mui/material";

const PricingCard = ({ title, description, price, isPremium }) => {
  const goToAppointment = () => {
    const section = document.getElementById("appointment");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      sx={{
        background: isPremium
          ? "linear-gradient(135deg, #000, #1a1a1a)"
          : "#fff",

        borderRadius: "16px",
        padding: "25px",
        textAlign: "center",

        width: "100%",
        minHeight: "230px",

        border: isPremium ? "2px solid #d4af37" : "none",

        boxShadow: isPremium
          ? "0 0 20px rgba(212,175,55,0.4)"
          : "0 4px 15px rgba(0,0,0,0.1)",

        transform: isPremium ? "scale(1.05)" : "translateY(0)",

        transition: "all 0.3s ease",

        cursor: "pointer", // IMPORTANT
        willChange: "transform, box-shadow",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        "&:hover": {
          boxShadow: isPremium
            ? "0 0 35px rgba(212,175,55,0.8)"
            : "0 12px 25px rgba(0,0,0,0.12)",

          transform: isPremium
            ? "scale(1.08)" // tiny boost like CSS glow feel
            : "translateY(-10px)",
        },

        "@media (max-width:600px)": {
          minHeight: "auto",
          padding: "18px",
          width: "320px",
          margin: "0 auto",
        },

        "@media (max-width:768px)": {
          minWidth: "300px",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 600,
          color: isPremium ? "#d4af37" : "#111",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: isPremium ? "#ccc" : "#666",
          margin: "10px 0 15px",
          fontSize: "15px",
          fontWeight: 400,
          fontFamily: "inherit",
        }}
      >
        {description}
      </Typography>

      <Typography
        sx={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#d4af37",
          margin: "10px 0",
        }}
      >
        ₹{price}
      </Typography>

      <Box
        component="button"
        onClick={goToAppointment}
        sx={{
          padding: "6px 20px",
          borderRadius: "5px",
          width: "120px",
          fontWeight: 600,
          fontSize: "14px",
          alignSelf: "center",
          border: "none",
          cursor: "pointer",
          transition: "all 0.3s ease",

          background: "linear-gradient(135deg, #d4af37, #b8962e)",
          color: "#111",

          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 10px 25px rgba(212,175,55,0.3)",
          },
        }}
      >
        BOOK NOW
      </Box>
    </Box>
  );
};

export default PricingCard;
