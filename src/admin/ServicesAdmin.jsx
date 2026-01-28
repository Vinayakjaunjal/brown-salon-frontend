import { useEffect, useState } from "react";
import {
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
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useTheme, useMediaQuery } from "@mui/material";

const ICON_OPTIONS = [
  { label: "Hair Styling", value: "bi bi-scissors" },
  { label: "Beard Grooming", value: "bi bi-person-lines-fill" },
  { label: "Hair Coloring", value: "bi bi-brush" },
  { label: "Hair Spa", value: "bi bi-droplet-half" },
  { label: "Skin Care", value: "bi bi-heart-pulse" },
  { label: "Makeup & Styling", value: "bi bi-sun" },
  { label: "Premium Package", value: "bi bi-gem" },
  { label: "Quick Grooming", value: "bi bi-clock-history" },
];

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    icon: "",
    title: "",
    desc: "",
  });
  const [editId, setEditId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const loadServices = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services`);
    const data = await res.json();
    setServices(data);
  };

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const closeSnack = () => {
    setSnack({ ...snack, open: false });
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveService = async () => {
    if (!form.icon || !form.title) {
      alert("Icon & Title required");
      return;
    }

    const url = editId
      ? `${import.meta.env.VITE_API_URL}/api/services/${editId}`
      : `${import.meta.env.VITE_API_URL}/api/services`;

    await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ icon: "", title: "", desc: "" });
    setEditId(null);
    loadServices();
    showSnack(editId ? "Service updated" : "Service added", "success");
  };

  const editService = (s) => {
    setForm({
      icon: s.icon,
      title: s.title,
      desc: s.desc,
    });
    setEditId(s._id);
  };

  const deleteService = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/services/${deleteId}`, {
      method: "DELETE",
    });

    setConfirmOpen(false);
    setDeleteId(null);
    loadServices();
    showSnack("Service deleted successfully", "success");
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight={600} mb={3} color="#0f172a">
        Services Management
      </Typography>

      {/* FORM */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          background: "#ffffff",
          borderRadius: 2,
          border: "1px solid #e5e7eb",
        }}
      >
        <Typography sx={{ color: "#0f172a", mb: 2 }}>
          {editId ? "Edit Service" : "Add New Service"}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Select
            name="icon"
            value={form.icon}
            onChange={handleChange}
            displayEmpty
            sx={{ bgcolor: "#f9fafb", borderRadius: 1, minWidth: 220 }}
          >
            <MenuItem value="">Select Icon</MenuItem>
            {ICON_OPTIONS.map((icon) => (
              <MenuItem key={icon.value} value={icon.value}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <i className={icon.value} />
                  <span>{icon.label}</span>
                </Box>
              </MenuItem>
            ))}
          </Select>

          <TextField
            name="title"
            label="Service Title"
            value={form.title}
            onChange={handleChange}
            sx={{ bgcolor: "#f9fafb", borderRadius: 1 }}
          />

          <TextField
            name="desc"
            label="Description"
            value={form.desc}
            onChange={handleChange}
            sx={{ bgcolor: "#f9fafb", borderRadius: 1, minWidth: 220 }}
          />

          <Button
            variant="contained"
            onClick={saveService}
            sx={{ minWidth: 220 }}
          >
            {editId ? "Update" : "Add"}
          </Button>
        </Box>
      </Paper>

      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {services.map((s) => (
            <Paper
              key={s._id}
              sx={{
                p: 2,
                borderRadius: 2,
                background: "#ffffff",
                border: "1px solid #e5e7eb",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    bgcolor: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#7c3aed",
                    fontSize: 20,
                  }}
                >
                  <i className={s.icon} />
                </Box>

                <Typography fontWeight={600} color="#0f172a">
                  {s.title}
                </Typography>
              </Box>

              {s.desc && (
                <Typography variant="body2" sx={{ color: "#4b5563", mt: 1 }}>
                  {s.desc}
                </Typography>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  mt: 2,
                }}
              >
                <IconButton onClick={() => editService(s)} color="primary">
                  <EditIcon />
                </IconButton>

                <IconButton onClick={() => deleteService(s._id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <Paper
          sx={{
            background: "#ffffff",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#f3f4f6" }}>
                {["Icon", "Title", "Description", "Actions"].map((h) => (
                  <TableCell key={h} sx={{ color: "#0f172a", fontWeight: 600 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {services.map((s) => (
                <TableRow key={s._id}>
                  <TableCell sx={{ fontSize: 20, color: "#7c3aed" }}>
                    <i className={s.icon} />
                  </TableCell>

                  <TableCell sx={{ color: "#0f172a" }}>{s.title}</TableCell>

                  <TableCell sx={{ color: "#4b5563" }}>{s.desc}</TableCell>

                  <TableCell>
                    <IconButton onClick={() => editService(s)} color="primary">
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      onClick={() => deleteService(s._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {services.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    sx={{ color: "#6b7280", textAlign: "center" }}
                  >
                    No services found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Snackbar
            open={snack.open}
            autoHideDuration={3000}
            onClose={closeSnack}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <MuiAlert
              onClose={closeSnack}
              severity={snack.severity}
              elevation={6}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snack.message}
            </MuiAlert>
          </Snackbar>
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>

            <DialogContent>
              Are you sure you want to delete this service?
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button onClick={confirmDelete} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={closeSnack}
          severity={snack.severity}
          elevation={6}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </MuiAlert>
      </Snackbar>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this service?
        </DialogContent>
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
