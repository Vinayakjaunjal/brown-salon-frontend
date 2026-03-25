import React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

const TIMES = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
];

export default function Slots() {
  const [date, setDate] = useState("");
  const [bookings, setBookings] = useState([]); // ✅ FIXED
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [action, setAction] = useState("");

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const closeSnack = () => {
    setSnack({ ...snack, open: false });
  };

  // 🔥 LOAD DATA
  const loadData = async () => {
    if (!date) {
      showSnack("Please select a date", "warning");
      return;
    }

    try {
      // ✅ BOOKINGS (NEW SYSTEM)
      const bkRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/all`,
      );
      const bkData = await bkRes.json();
      setBookings(bkData.data || []);

      // ✅ SLOTS
      const slRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/slots?date=${date}`,
      );
      const slData = await slRes.json();
      setSlots(slData || []);

      setSelectedSlots([]);
      setAction("");
    } catch (err) {
      console.log(err);
      showSnack("Error loading data", "error");
    }
  };

  // ✅ ONLY CONFIRMED BOOKINGS BLOCK SLOT
  const isBooked = (time) =>
    bookings.some(
      (b) => b.date === date && b.time === time && b.status === "confirmed",
    );

  const getFinalStatus = (time) => {
    const booking = bookings.find((b) => b.date === date && b.time === time);

    if (booking && booking.status === "confirmed") {
      return "booked";
    }

    if (
      booking &&
      (booking.status === "cancelled" || booking.status === "no-show")
    ) {
      return "available";
    }

    const slot = slots.find((s) => s.time === time);
    return slot ? slot.status : "available";
  };

  // ✅ SELECT SLOT
  const toggleSelect = (time) => {
    if (isBooked(time)) return;

    setSelectedSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  };

  // ✅ APPLY ACTION
  const applyAction = () => {
    if (!action || selectedSlots.length === 0) {
      showSnack("Select slots and action first", "warning");
      return;
    }

    setSlots((prev) => {
      let updated = [...prev];

      selectedSlots.forEach((time) => {
        const exists = updated.find((s) => s.time === time);

        if (!exists) {
          updated.push({ time, status: action });
        } else {
          updated = updated.map((s) =>
            s.time === time ? { ...s, status: action } : s,
          );
        }
      });

      return updated;
    });

    setSelectedSlots([]);
    setAction("");
    showSnack("Slots updated");
  };

  // ✅ SAVE TO DB
  const saveSlots = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, slots }),
      });

      showSnack("Slots saved successfully");
    } catch (err) {
      showSnack("Error saving slots", "error");
    }
  };

  return (
    <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Manage Time Slots
      </Typography>

      {/* DATE */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button variant="contained" onClick={loadData}>
          Load Slots
        </Button>
      </Box>

      {/* GRID */}
      <Grid container spacing={2}>
        {TIMES.map((time) => {
          const finalStatus = getFinalStatus(time);

          let bg = "#22c55e"; // available
          if (finalStatus === "booked") bg = "#ef4444";
          if (selectedSlots.includes(time)) bg = "#f59e0b";

          return (
            <Grid item xs={4} md={2} key={time}>
              <Paper
                onClick={() => toggleSelect(time)}
                sx={{
                  p: 2,
                  textAlign: "center",
                  cursor: finalStatus === "booked" ? "not-allowed" : "pointer",
                  bgcolor: bg,
                  color: "#fff",
                  borderRadius: 2,
                }}
              >
                <Typography fontWeight={600}>{time}</Typography>
                <Typography variant="caption">
                  {finalStatus === "booked"
                    ? "Booked"
                    : selectedSlots.includes(time)
                      ? "Selected"
                      : "Available"}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* ACTION */}
      {selectedSlots.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography>{selectedSlots.join(", ")}</Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant={action === "booked" ? "contained" : "outlined"}
              color="error"
              onClick={() => setAction("booked")}
            >
              Booked
            </Button>

            <Button
              variant={action === "available" ? "contained" : "outlined"}
              color="success"
              onClick={() => setAction("available")}
            >
              Available
            </Button>
          </Box>

          <Button sx={{ mt: 2 }} variant="contained" onClick={applyAction}>
            Apply
          </Button>
        </Box>
      )}

      {/* SAVE */}
      <Button sx={{ mt: 4 }} variant="contained" onClick={saveSlots}>
        Save Slots
      </Button>

      {/* SNACK */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={closeSnack}>
        <Alert severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
