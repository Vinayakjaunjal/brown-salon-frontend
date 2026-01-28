import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Switch,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", review: "", rating: 5 });
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const closeSnack = () => {
    setSnack({ ...snack, open: false });
  };

  const loadReviews = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`);
    const data = await res.json();
    setReviews(data);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const saveReview = async () => {
    if (!form.name || !form.review) {
      showSnack("Name & review required", "error");
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("review", form.review);
    fd.append("rating", form.rating);
    if (image) fd.append("image", image);

    const url = editId
      ? `${import.meta.env.VITE_API_URL}/api/reviews/${editId}`
      : `${import.meta.env.VITE_API_URL}/api/reviews`;

    await fetch(url, { method: editId ? "PUT" : "POST", body: fd });

    setForm({ name: "", review: "", rating: 5 });
    setImage(null);
    setEditId(null);
    setPreview(null);
    loadReviews();

    showSnack(editId ? "Review updated" : "Review added");
  };

  const editReview = (r) => {
    setForm({ name: r.name, review: r.review, rating: r.rating });
    setEditId(r._id);
    if (r.image) setPreview(`${import.meta.env.VITE_API_URL}${r.image}`);
  };

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${deleteId}`, {
      method: "DELETE",
    });
    setConfirmOpen(false);
    setDeleteId(null);
    loadReviews();
    showSnack("Review deleted");
  };

  const toggleReview = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${id}/toggle`, {
      method: "PUT",
    });
    loadReviews();
    showSnack("Status updated");
  };

  const getInitials = (name = "") => {
    const w = name.trim().split(" ");
    return w.length === 1
      ? w[0][0]?.toUpperCase()
      : w[0][0]?.toUpperCase() + w[w.length - 1][0]?.toUpperCase();
  };

  return (
    <Box sx={{ p: 2, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Reviews Management
      </Typography>

      {/* FORM */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Review"
            value={form.review}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
          />
          <TextField
            label="Rating"
            type="number"
            value={form.rating}
            inputProps={{ min: 1, max: 5 }}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files[0];
              setImage(f);
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
          {preview && (
            <img
              src={preview}
              alt=""
              style={{ width: 60, height: 60, borderRadius: "50%" }}
            />
          )}
          <Button variant="contained" onClick={saveReview}>
            {editId ? "Update" : "Add"}
          </Button>
        </Box>
      </Paper>

      {/* LIST */}
      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {reviews.map((r) => (
            <Paper key={r._id} sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {r.image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${r.image}`}
                    alt=""
                    width={50}
                    height={50}
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      bgcolor: "#fde68a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    {getInitials(r.name)}
                  </Box>
                )}

                <Box>
                  <Typography fontWeight={600}>{r.name}</Typography>
                  <Typography variant="body2">⭐ {r.rating}</Typography>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ mt: 1 }}>
                {r.review}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Switch
                  checked={r.isActive}
                  onChange={() => toggleReview(r._id)}
                />

                <Box>
                  <IconButton onClick={() => editReview(r)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => askDelete(r._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <Paper>
          {reviews.map((r) => (
            <Box
              key={r._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                {r.image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${r.image}`}
                    alt=""
                    width={60}
                    height={60}
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      bgcolor: "#fde68a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    {getInitials(r.name)}
                  </Box>
                )}
                <Box>
                  <Typography fontWeight={600}>{r.name}</Typography>
                  <Typography variant="body2">{r.review}</Typography>
                  <Typography variant="body2">⭐ {r.rating}</Typography>
                </Box>
              </Box>

              <Box>
                <Switch
                  checked={r.isActive}
                  onChange={() => toggleReview(r._id)}
                />
                <IconButton onClick={() => editReview(r)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => askDelete(r._id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Paper>
      )}

      {/* SNACKBAR */}
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
        >
          {snack.message}
        </MuiAlert>
      </Snackbar>

      {/* DELETE DIALOG */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            width: isMobile ? "85%" : 400,
            maxWidth: "90%",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this review?
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
