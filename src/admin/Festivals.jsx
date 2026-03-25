import React from "react";
import { useEffect, useState } from "react";

import CelebrationIcon from "@mui/icons-material/Celebration";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";

// ================= DATE HELPERS =================

const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);

  return today.getDate() === d.getDate() && today.getMonth() === d.getMonth();
};

const isUpcoming = (date) => {
  const today = new Date();
  const d = new Date(date);

  d.setFullYear(today.getFullYear());

  const diff = (d - today) / (1000 * 60 * 60 * 24);
  return diff > 0 && diff <= 7;
};

// ================= COMPONENT =================

export default function Festivals() {
  const [festivals, setFestivals] = useState([]);

  const [form, setForm] = useState({
    name: "",
    date: "",
    subject: "",
    message: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const showSnackbar = (msg, sev = "success") => {
    setSnackbar({ open: true, message: msg, severity: sev });
  };

  // ================= LOAD =================

  const loadFestivals = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/festivals`);
    const data = await res.json();
    setFestivals(data);
  };

  useEffect(() => {
    loadFestivals();
  }, []);

  // ================= ADD =================

  const addFestival = async () => {
    if (!form.name || !form.date) {
      showSnackbar("Name & Date Required", "error");
      return;
    }

    await fetch(`${import.meta.env.VITE_API_URL}/api/festivals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", date: "", subject: "", message: "" });
    loadFestivals();
    showSnackbar("Festival Added");
  };

  // ================= SEND WISH =================

  const sendWish = async (fest) => {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/festivals/send/${fest._id}`,
      {
        method: "POST",
      },
    );

    showSnackbar(`${fest.name} wish sent successfully`);
  };

  // ================= DELETE =================

  const confirmDelete = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/festivals/${deleteId}`, {
      method: "DELETE",
    });

    setFestivals((prev) => prev.filter((f) => f._id !== deleteId));
    setConfirmOpen(false);
  };

  // ================= FILTER =================

  const todayFestivals = festivals.filter((f) => isToday(f.date));
  const upcomingFestivals = festivals.filter((f) => isUpcoming(f.date));

  // ================= UI =================

  return (
    <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        <CelebrationIcon /> Festivals
      </Typography>

      {/* TODAY */}

      {todayFestivals.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ color: "#ca8a04", mb: 2 }}>
            Today’s Festivals 🎉
          </Typography>

          {todayFestivals.map((f) => (
            <Box
              key={f._id}
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>{f.name}</Typography>

              <Button
                size="small"
                variant="contained"
                color="warning"
                endIcon={<SendIcon />}
                onClick={() => sendWish(f)}
              >
                Send Wish
              </Button>
            </Box>
          ))}
        </Paper>
      )}

      {/* UPCOMING */}

      {upcomingFestivals.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ color: "#0284c7", mb: 2 }}>
            Upcoming Festivals ⏳
          </Typography>

          {upcomingFestivals.map((f) => (
            <Typography key={f._id}>{f.name}</Typography>
          ))}
        </Paper>
      )}

      {/* ADD */}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🎁 Add Festival
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Festival Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <TextField
            label="Email Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />

          <TextField
            label="Wish Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </Box>

        <Button sx={{ mt: 2 }} variant="contained" onClick={addFestival}>
          ➕ Add Festival
        </Button>
      </Paper>

      {/* LIST */}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {festivals.map((f) => (
              <TableRow key={f._id}>
                <TableCell>{f.name}</TableCell>
                <TableCell>{f.date}</TableCell>

                <TableCell>
                  <IconButton color="warning" onClick={() => sendWish(f)}>
                    <SendIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => {
                      setDeleteId(f._id);
                      setConfirmOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* SNACKBAR */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      {/* DELETE DIALOG */}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Delete this festival?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
