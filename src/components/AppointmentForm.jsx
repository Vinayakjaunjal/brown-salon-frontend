import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    date: "",
    time: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);

  const timeSlots = [];
  for (let hour = 9; hour <= 21; hour++) {
    ["00", "30"].forEach((min) => {
      const h = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      timeSlots.push(`${h}:${min} ${ampm}`);
    });
  }
  timeSlots.push("10:00 PM");

  const fetchSlots = async (date) => {
    if (!date) return;

    const apRes = await fetch(
      `${import.meta.env.VITE_API_URL}/api/appointments?date=${date}`,
    );
    const apData = await apRes.json();
    setAppointments(apData.filter((a) => a.status === "approved"));

    const slRes = await fetch(
      `${import.meta.env.VITE_API_URL}/api/slots?date=${date}`,
    );
    const slData = await slRes.json();
    setBlockedSlots(
      slData.filter((s) => s.status === "booked").map((s) => s.time),
    );
  };

  const isBooked = (time) =>
    appointments.some((a) => a.time === time) || blockedSlots.includes(time);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "date" ? { time: "" } : {}),
    }));

    if (name === "date") fetchSlots(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/appointments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      },
    );

    const result = await response.json();
    if (result.success) setSuccess(true);
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    background: "#fff",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  };

  return (
    <Box
      id="appointment"
      sx={{
        width: "85%",
        maxWidth: "800px",
        margin: "60px auto",
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Typography
        sx={{
          fontSize: "32px",
          marginBottom: "25px",
          fontWeight: 700,
          letterSpacing: "0.5px",
          color: "#2b2b2b",
        }}
      >
        Book an Appointment
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          background: "linear-gradient(135deg, #f8f3ee, #fdfcfa)",
          padding: "35px",
          borderRadius: "18px",
          boxShadow: "0px 15px 40px rgba(0,0,0,0.12)",
          backdropFilter: "blur(10px)",
        }}
      >
        {[
          ["name", "Your Name", "text"],
          ["email", "Email Address", "email"],
          ["phone", "Phone Number", "tel"],
        ].map(([field, label, type]) => (
          <Box key={field} sx={{ marginBottom: "22px", textAlign: "left" }}>
            <Typography
              sx={{
                fontWeight: 600,
                marginBottom: "8px",
                color: "#444",
                fontSize: "14px",
                letterSpacing: "0.3px",
              }}
            >
              {label}
            </Typography>

            <Box
              component="input"
              type={type}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              sx={{
                ...inputStyle,
                "&:focus": {
                  borderColor: "#91765a",
                  boxShadow: "0 0 0 3px rgba(145,118,90,0.15)",
                  outline: "none",
                },
              }}
            />
          </Box>
        ))}

        <Box sx={{ marginBottom: "22px", textAlign: "left" }}>
          <Typography
            sx={{ fontWeight: 600, mb: "8px", color: "#444", fontSize: "14px" }}
          >
            Select Category
          </Typography>

          <Box
            component="select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            sx={{
              ...inputStyle,
              "&:focus": {
                borderColor: "#91765a",
                boxShadow: "0 0 0 3px rgba(145,118,90,0.15)",
              },
            }}
          >
            <option value="">-- Select Service --</option>
            <option>Haircut</option>
            <option>Beard</option>
            <option>Hair Color</option>
            <option>Skin Treatment</option>
            <option>Hair Spa</option>
            <option>Facial</option>
            <option>Premium Package</option>
            <option>Beard Grooming</option>
            <option>Makeup</option>
          </Box>
        </Box>

        <Box sx={{ marginBottom: "22px", textAlign: "left" }}>
          <Typography
            sx={{ fontWeight: 600, mb: "8px", color: "#444", fontSize: "14px" }}
          >
            Select Date
          </Typography>

          <Box
            component="input"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            sx={{
              ...inputStyle,
              "&:focus": {
                borderColor: "#91765a",
                boxShadow: "0 0 0 3px rgba(145,118,90,0.15)",
              },
            }}
          />
        </Box>

        <Box sx={{ marginBottom: "22px", textAlign: "left" }}>
          <Typography
            sx={{ fontWeight: 600, mb: "8px", color: "#444", fontSize: "14px" }}
          >
            Select Time
          </Typography>

          <Box
            component="select"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            sx={{
              ...inputStyle,
              "&:focus": {
                borderColor: "#91765a",
                boxShadow: "0 0 0 3px rgba(145,118,90,0.15)",
              },
            }}
          >
            <option value="">-- Choose Time --</option>

            {timeSlots.map((time, i) => (
              <option key={i} value={time} disabled={isBooked(time)}>
                {time} {isBooked(time) ? "(Booked)" : ""}
              </option>
            ))}
          </Box>
        </Box>

        <Box sx={{ marginBottom: "22px", textAlign: "left" }}>
          <Typography
            sx={{ fontWeight: 600, mb: "8px", color: "#444", fontSize: "14px" }}
          >
            Message (optional)
          </Typography>

          <Box
            component="textarea"
            rows={4}
            name="message"
            value={formData.message}
            onChange={handleChange}
            sx={{
              ...inputStyle,
              resize: "none",
              "&:focus": {
                borderColor: "#91765a",
                boxShadow: "0 0 0 3px rgba(145,118,90,0.15)",
              },
            }}
          />
        </Box>

        <Box
          component="button"
          type="submit"
          sx={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #4a7cff, #3459d6)",
            color: "#fff",
            border: "none",
            fontSize: "16px",
            fontWeight: 600,
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            letterSpacing: "0.4px",
            boxShadow: "0px 10px 20px rgba(74,124,255,0.35)",

            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0px 15px 30px rgba(74,124,255,0.45)",
              background: "linear-gradient(135deg, #3459d6, #4a7cff)",
            },

            "&:active": {
              transform: "scale(0.98)",
            },
          }}
        >
          Book Appointment Now
        </Box>
      </Box>

      {success && (
        <Typography sx={{ color: "green", marginTop: "15px", fontWeight: 700 }}>
          Thank you for submitting your request for appointment at Brown Salon.
          <br />
          Our executive will confirm the appointment.
        </Typography>
      )}
    </Box>
  );
}
