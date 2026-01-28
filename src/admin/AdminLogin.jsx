import { useState } from "react";
import AdminLogo from "../assets/brown-logo.png";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const login = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier, password }),
        },
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Invalid credentials");
        setOpenSnackbar(true);
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminName", data.admin.name);

      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Server error. Try again later.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 380,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <img
            src={AdminLogo}
            alt="Brand Logo"
            style={{ height: 150, width: 150 }}
          />
          <Typography variant="h4" fontWeight={700}>
            Brown Salon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin Panel
          </Typography>
        </Box>

        <TextField
          label="Email or Username"
          fullWidth
          sx={{ mb: 2 }}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          sx={{ mb: 1 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <p
          style={{
            textAlign: "right",
            mb: 2,
            color: "#1976d2",
            cursor: "pointer",
            underline: "hover",
            fontSize: 13,
          }}
          onClick={() => (window.location.href = "/admin-forgot")}
        >
          Forgot password?
        </p>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={login}
          sx={{
            py: 1.2,
            fontWeight: 600,
            borderRadius: 2,
            background: "#d09f0c",
          }}
        >
          Login
        </Button>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setOpenSnackbar(false)}
          variant="filled"
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
