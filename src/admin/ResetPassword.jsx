import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });

  const handleSubmit = async () => {
    if (!password || !confirm) {
      return setSnack({
        open: true,
        msg: "All fields required",
        type: "error",
      });
    }

    if (password !== confirm) {
      return setSnack({
        open: true,
        msg: "Passwords do not match",
        type: "error",
      });
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      },
    );

    const data = await res.json();

    if (!data.success) {
      return setSnack({
        open: true,
        msg: data.message || "Reset failed",
        type: "error",
      });
    }

    setSnack({
      open: true,
      msg: "Password reset successfully",
      type: "success",
    });

    setTimeout(() => {
      navigate("/admin-login");
    }, 2000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Reset Password
        </Typography>

        <TextField
          fullWidth
          label="New Password"
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow(!show)}>
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type={show ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button fullWidth variant="contained" onClick={handleSubmit}>
          Reset Password
        </Button>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.type}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
