import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
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

const isToday = (dob) => {
  const today = new Date();
  const d = new Date(dob);

  return today.getDate() === d.getDate() && today.getMonth() === d.getMonth();
};

const isUpcoming = (dob) => {
  const today = new Date();
  const d = new Date(dob);

  d.setFullYear(today.getFullYear());

  const diff = (d - today) / (1000 * 60 * 60 * 24);

  return diff > 0 && diff <= 7;
};

export default function Birthdays() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const [selectedMonth, setSelectedMonth] = useState("all");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Load birthday customers
  const loadCustomers = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/birthdays`);
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const monthWiseCustomers =
    selectedMonth === "all"
      ? customers
      : customers.filter(
          (c) => new Date(c.dob).getMonth() === Number(selectedMonth),
        );

  // Handle form change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Add birthday customer
  const addCustomer = async () => {
    if (!form.name || !form.dob) {
      showSnackbar("Name and DOB are required", "error");
      return;
    }

    await fetch(`${import.meta.env.VITE_API_URL}/api/birthdays`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", email: "", phone: "", dob: "" });
    loadCustomers();
  };

  const todayBirthdays = customers.filter((c) => isToday(c.dob));
  const upcomingBirthdays = customers.filter((c) => isUpcoming(c.dob));

  // Send Wish Function
  const sendWish = async (customer) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/birthdays/wish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
      }),
    });

    showSnackbar(`Birthday wish sent to ${customer.name}`, "success");
  };

  // Delete Birthday Button
  const confirmDelete = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/birthdays/${deleteId}`, {
      method: "DELETE",
    });

    setCustomers((prev) => prev.filter((c) => c._id !== deleteId));
    setConfirmOpen(false);
  };

  // Whatsapp Birthday Wish
  const sendWhatsAppWish = (phone, name) => {
    const msg = `🎉 Happy Birthday ${name}! 🎂

Warm wishes from Brown Hair The Unisex Salon ✨
We have a special birthday offer waiting for you 🎁💇‍♂️

Hope to see you soon!
— Team Brown Hair Salon`;

    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <Box
      sx={{
        bgcolor: "#f9fafb",
        minHeight: "100vh",
        px: { xs: 1, md: 3 },
        py: { xs: 2, md: 3 },
        width: "100%",
      }}
    >
      <Typography variant="h5" fontWeight={600} mb={3} color="#0f172a">
        Birthday Customers
      </Typography>
      <TextField
        select
        label="Select Month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        sx={{ bgcolor: "#fff", width: 200, mb: 3 }}
        SelectProps={{ native: true }}
      >
        <option value="all">All</option>

        {[
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ].map((m, i) => (
          <option key={i} value={i}>
            {m}
          </option>
        ))}
      </TextField>
      {todayBirthdays.length > 0 && (
        <Paper
          sx={{
            p: 3,
            mb: 4,
            background: "#ffffff",
            borderRadius: 1,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ color: "#ca8a04", mb: 2 }}
          >
            Today’s Birthdays 🎂
          </Typography>

          {todayBirthdays.map((c) => (
            <Box
              key={c._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                mb: 1.5,
                background: "#f9fafb",
                borderRadius: 1,
                border: "1px solid #e5e7eb",
              }}
            >
              <Box>
                <Typography sx={{ color: "#0f172a", fontWeight: 600 }}>
                  🎉 {c.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#475569" }}>
                  DOB: {c.dob}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  endIcon={<EmailIcon />}
                  onClick={() => sendWish(c)}
                >
                  Email
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  endIcon={<WhatsAppIcon />}
                  onClick={() => sendWhatsAppWish(c.phone, c.name)}
                >
                  WhatsApp
                </Button>
              </Box>
            </Box>
          ))}
        </Paper>
      )}
      {/* UPCOMING BIRTHDAYS */}
      {upcomingBirthdays.length > 0 && (
        <Paper
          sx={{
            p: 3,
            mb: 4,
            background: "#ffffff",
            borderRadius: 1,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ color: "#0284c7", mb: 2 }}
          >
            ⏳ Upcoming Birthdays (Next 7 Days)
          </Typography>

          {upcomingBirthdays.map((c) => (
            <Box
              key={c._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                mb: 1.5,
                background: "#f9fafb",
                borderRadius: 1,
                border: "1px solid #e5e7eb",
              }}
            >
              <Box>
                <Typography sx={{ color: "#0f172a", fontWeight: 600 }}>
                  🎈 {c.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#475569" }}>
                  Birthday: {c.dob}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: 12,
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  background: "#e0f2fe",
                  color: "#0369a1",
                }}
              >
                Upcoming
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
      {/* ADD BIRTHDAY CUSTOMER */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          background: "#ffffff",
          borderRadius: 1,
          border: "1px solid #e5e7eb",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ color: "#db2777", mb: 2 }}
        >
          🎁 Add Birthday Customer
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 1fr",
            },
            gap: 2,
          }}
        >
          <TextField
            name="name"
            label="Customer Name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            sx={{ bgcolor: "#fff", borderRadius: 1 }}
          />

          <TextField
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            sx={{ bgcolor: "#fff", borderRadius: 1 }}
          />

          <TextField
            name="phone"
            label="Phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            sx={{ bgcolor: "#fff", borderRadius: 1 }}
          />

          <TextField
            name="dob"
            type="date"
            label="Date of Birth"
            InputLabelProps={{ shrink: true }}
            value={form.dob}
            onChange={handleChange}
            fullWidth
            sx={{ bgcolor: "#fff", borderRadius: 1 }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={addCustomer}
            sx={{
              background: "linear-gradient(90deg, #ec4899, #8b5cf6)",
              px: 4,
              fontWeight: 600,
            }}
          >
            ➕ Add Customer
          </Button>
        </Box>
      </Paper>
      {/* LIST */}
      {/* BIRTHDAY LIST */}
      {isMobile ? (
        /* ================= MOBILE VIEW ================= */
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {monthWiseCustomers.map((c) => (
            <Paper
              key={c._id}
              sx={{
                p: 2,
                borderRadius: 1,
                background: "#ffffff",
                color: "#0f172a",
                border: "1px solid #e5e7eb",
                position: "relative",
                width: "100%",
              }}
            >
              <Typography fontWeight={600}>🎉 {c.name}</Typography>

              <Typography variant="body2" sx={{ mt: 0.5, color: "#475569" }}>
                🎂 {c.dob}
              </Typography>

              {c.email && (
                <Typography variant="body2" sx={{ color: "#2563eb", mt: 0.5 }}>
                  📧 {c.email}
                </Typography>
              )}

              {c.phone && (
                <Typography variant="body2" sx={{ color: "#059669", mt: 0.5 }}>
                  📱 {c.phone}
                </Typography>
              )}

              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  top: 8,
                  right: 8,
                  gap: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  color="warning"
                  onClick={() => sendWish(c)}
                >
                  <EmailIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="success"
                  onClick={() => sendWhatsAppWish(c.phone, c.name)}
                >
                  <WhatsAppIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    setDeleteId(c._id);
                    setConfirmOpen(true);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        /* ================= DESKTOP VIEW ================= */
        <Paper
          sx={{
            background: "#ffffff",
            borderRadius: 1,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography
            sx={{
              color: "#0f172a",
              fontWeight: 600,
              px: 3,
              py: 2,
              borderBottom: "1px solid #e5e7eb",
              background: "linear-gradient(90deg, #fce7f3, #ede9fe)",
            }}
          >
            🎁 Birthday Customer List
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                {["Name", "Email", "Phone", "DOB", "Actions"].map((h) => (
                  <TableCell key={h} sx={{ color: "#0f172a", fontWeight: 600 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {monthWiseCustomers.map((c) => (
                <TableRow key={c._id}>
                  <TableCell sx={{ color: "#0f172a" }}>{c.name}</TableCell>
                  <TableCell sx={{ color: "#2563eb" }}>
                    {c.email || "-"}
                  </TableCell>
                  <TableCell sx={{ color: "#059669" }}>
                    {c.phone || "-"}
                  </TableCell>
                  <TableCell sx={{ color: "#ca8a04" }}>{c.dob}</TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton color="warning" onClick={() => sendWish(c)}>
                        <EmailIcon />
                      </IconButton>
                      <IconButton
                        color="success"
                        onClick={() => sendWhatsAppWish(c.phone, c.name)}
                      >
                        <WhatsAppIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setDeleteId(c._id);
                          setConfirmOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          Are you sure you want to delete this birthday customer?
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
