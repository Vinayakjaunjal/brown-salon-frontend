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
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [action, setAction] = useState("");

  // Snackbar
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

  const loadData = async () => {
    if (!date) {
      showSnack("Please select a date", "warning");
      return;
    }

    const apRes = await fetch(
      `${import.meta.env.BACKEND_URL}/api/appointments?date=${date}`,
    );
    const slRes = await fetch(
      `${import.meta.env.BACKEND_URL}/api/slots?date=${date}`,
    );

    setAppointments(await apRes.json());
    setSlots(await slRes.json());
    setSelectedSlots([]);
    setAction("");
  };

  const isBooked = (time) =>
    appointments.some((a) => a.time === time && a.status === "approved");

  const getFinalStatus = (time) => {
    if (appointments.some((a) => a.time === time && a.status === "approved")) {
      return "booked";
    }
    const slot = slots.find((s) => s.time === time);
    return slot ? slot.status : "available";
  };

  const toggleSelect = (time) => {
    if (isBooked(time)) return;

    setSelectedSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  };

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

  const saveSlots = async () => {
    await fetch(`${import.meta.env.BACKEND_URL}/api/slots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, slots }),
    });

    showSnack("Slots saved successfully");
  };

  return (
    <Box
      sx={{
        bgcolor: "#f9fafb",
        minHeight: "100vh",
        px: { xs: 1.5, md: 3 },
        py: 3,
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Typography variant="h5" fontWeight={600} color="#0b0f19" mb={2}>
        Manage Time Slots
      </Typography>

      {/* DATE PICKER */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{ bgcolor: "#fff", borderRadius: 1 }}
        />
        <Button variant="contained" onClick={loadData}>
          Load Slots
        </Button>
      </Box>

      {/* SLOTS GRID */}
      <Grid container spacing={2}>
        {TIMES.map((time) => {
          const finalStatus = getFinalStatus(time);

          let bg = "#22c55e"; // available
          let color = "#fff";

          if (finalStatus === "booked") bg = "#ef4444";
          if (selectedSlots.includes(time)) bg = "#f59e0b";

          return (
            <Grid item xs={4} sm={3} md={3} key={time}>
              <Paper
                onClick={() => toggleSelect(time)}
                sx={{
                  py: { xs: 1, md: 2 },
                  px: 1,
                  textAlign: "center",
                  cursor: finalStatus === "booked" ? "not-allowed" : "pointer",
                  bgcolor: bg,
                  color,
                  borderRadius: 2,
                  minHeight: { xs: 56, md: "auto" },
                }}
              >
                <Typography fontWeight={600} fontSize={{ xs: 13, md: 14 }}>
                  {time}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ fontSize: { xs: 10, md: 12 } }}
                >
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

      {/* ACTION PANEL */}
      {selectedSlots.length > 0 && (
        <Box
          sx={{
            mt: 4,
            p: 3,
            bgcolor: "#ffffff",
            borderRadius: 2,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography mb={1} fontWeight={600}>
            Selected Slots
          </Typography>
          <Typography mb={2}>{selectedSlots.join(", ")}</Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              variant={action === "booked" ? "contained" : "outlined"}
              color="error"
              onClick={() => setAction("booked")}
            >
              Mark Booked
            </Button>

            <Button
              variant={action === "available" ? "contained" : "outlined"}
              color="success"
              onClick={() => setAction("available")}
            >
              Mark Available
            </Button>
          </Box>

          <Button variant="contained" onClick={applyAction}>
            Apply Changes
          </Button>
        </Box>
      )}

      {/* SAVE */}
      <Button
        onClick={saveSlots}
        variant="contained"
        color="success"
        sx={{ mt: 4 }}
      >
        Save Slots
      </Button>

      {/* SNACKBAR */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnack}
          severity={snack.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
