import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("success");

  const sendLink = async () => {
    const res = await fetch(
      `${import.meta.env.BACKEND_URL}/api/admin/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    const data = await res.json();

    if (!data.success) {
      setType("error");
      setMsg(data.message || "Something went wrong");
    } else {
      setType("success");
      setMsg("Reset link sent to your email");
    }
    setOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Forgot Password
        </Typography>

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button fullWidth variant="contained" onClick={sendLink}>
          Send Reset Link
        </Button>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert severity={type}>{msg}</Alert>
      </Snackbar>
    </Box>
  );
}
