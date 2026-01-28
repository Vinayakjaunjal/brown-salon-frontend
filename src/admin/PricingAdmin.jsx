import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const categories = [
  { label: "Gents", value: "gents" },
  { label: "Ladies", value: "ladies" },
  { label: "Skin Treatment", value: "skin" },
  { label: "Hair Treatment", value: "hair" },
  { label: "Premium Offers", value: "premium" },
];

export default function PricingAdmin() {
  const [pricing, setPricing] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "gents",
  });
  const [editId, setEditId] = useState(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const loadPricing = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pricing`);
    const data = await res.json();
    setPricing(data);
  };

  useEffect(() => {
    loadPricing();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const savePricing = async () => {
    if (!form.title || !form.price) {
      showSnackbar("Title & Price required", "error");
      return;
    }

    const url = editId
      ? `${import.meta.env.VITE_API_URL}/api/pricing/${editId}`
      : `${import.meta.env.VITE_API_URL}/api/pricing`;

    await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ title: "", description: "", price: "", category: "gents" });
    setEditId(null);
    loadPricing();
    showSnackbar(editId ? "Updated successfully" : "Added successfully");
  };

  const editPricing = (item) => {
    setForm(item);
    setEditId(item._id);
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/pricing/${deleteId}`, {
      method: "DELETE",
    });
    setConfirmOpen(false);
    setDeleteId(null);
    loadPricing();
    showSnackbar("Deleted successfully");
  };

  const filteredPricing = pricing.filter((item) => {
    const catMatch =
      activeCategory === "all" || item.category === activeCategory;
    const searchMatch = item.title.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <Box sx={{ p: 2, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Pricing Management
      </Typography>

      {/* FORM */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography fontWeight={600} mb={2}>
          {editId ? "Edit Service" : "Add New Service"}
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <TextField
            size="small"
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
          <TextField
            size="small"
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <TextField
            size="small"
            label="Price"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
          <Select
            size="small"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {categories.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </Select>

          <Button variant="contained" onClick={savePricing}>
            {editId ? "Update" : "Add"}
          </Button>
        </Box>
      </Paper>

      {/* FILTERS */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        <Button
          size="small"
          variant={activeCategory === "all" ? "contained" : "outlined"}
          onClick={() => setActiveCategory("all")}
        >
          All
        </Button>
        {categories.map((c) => (
          <Button
            key={c.value}
            size="small"
            variant={activeCategory === c.value ? "contained" : "outlined"}
            onClick={() => setActiveCategory(c.value)}
          >
            {c.label}
          </Button>
        ))}
      </Box>

      <TextField
        size="small"
        placeholder="Search service..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, width: 260 }}
      />

      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {filteredPricing.map((p) => (
            <Paper key={p._id} sx={{ p: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={600}>{p.title}</Typography>

                <Box>
                  <IconButton size="small" onClick={() => editPricing(p)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => openDeleteDialog(p._id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="caption" color="text.secondary">
                {p.category.toUpperCase()}
              </Typography>

              <Typography fontWeight={600}>₹ {p.price}</Typography>
            </Paper>
          ))}
        </Box>
      ) : (
        /* DESKTOP */
        <Paper>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#e5e7eb" }}>
                <TableCell>Service</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredPricing.map((p) => (
                <TableRow key={p._id} hover>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>₹ {p.price}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => editPricing(p)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openDeleteDialog(p._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* DELETE DIALOG */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 2, m: 1 } }}
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

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
