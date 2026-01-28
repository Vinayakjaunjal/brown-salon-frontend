import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
} from "@mui/material";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const token = localStorage.getItem("adminToken");

  const loadProfile = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status === 401) return;

    const data = await res.json();
    setAdmin(data);
    setForm({ name: data.name || "", email: data.email || "" });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateProfile = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      },
    );

    const data = await res.json();
    setAdmin(data);
    setEdit(false);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    window.location.href = "/admin-login";
  };

  if (!admin) return null;

  return (
    <Box sx={{ p: 3, maxWidth: 520 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: "#facc15",
              color: "#111",
              fontSize: 36,
              fontWeight: 700,
              mx: "auto",
              mb: 1,
            }}
          >
            {admin.name?.[0]}
          </Avatar>

          <Typography fontWeight={600} fontSize={18}>
            {admin.name}
          </Typography>

          <Typography color="text.secondary" fontSize={14}>
            {admin.email}
          </Typography>
        </Box>

        {edit ? (
          <>
            <TextField
              label="Name"
              fullWidth
              sx={{ mb: 2 }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <TextField
              label="Email"
              fullWidth
              sx={{ mb: 3 }}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <Button variant="contained" fullWidth onClick={updateProfile}>
              Update Profile
            </Button>
          </>
        ) : (
          <Button
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            onClick={() => setEdit(true)}
          >
            Edit Profile
          </Button>
        )}

        <Button color="error" variant="outlined" fullWidth onClick={logout}>
          Logout
        </Button>
      </Paper>
    </Box>
  );
}
