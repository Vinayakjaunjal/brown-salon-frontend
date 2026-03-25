import React from "react";

import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Stack,
  Avatar,
} from "@mui/material";

import PendingIcon from "@mui/icons-material/HourglassTop";
import DoneIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTheme, useMediaQuery } from "@mui/material";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/all`)
      .then((res) => res.json())
      .then((res) => {
        console.log("DASHBOARD DATA:", res.data);
        setData(res.data);
      });
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const countByDateRange = (startOffset, endOffset) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return data.filter((a) => {
      if (a.status !== "confirmed") return false;
      const d = new Date(a.date);
      d.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((d - today) / (1000 * 60 * 60 * 24));

      return diffDays >= startOffset && diffDays < endOffset;
    }).length;
  };

  const recentAppointments = [...data]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const updateStatus = async (id, status) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setData((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));

    setToast({
      open: true,
      message: `Appointment ${status.toUpperCase()} successfully`,
      type:
        status === "completed"
          ? "success"
          : status === "cancelled"
            ? "error"
            : "warning",
    });
  };

  const getMonthlyData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const counts = Array(12).fill(0);

    data.forEach((a) => {
      const m = new Date(a.date).getMonth();
      counts[m]++;
    });

    return months.map((m, i) => ({
      month: m,
      appointments: counts[i],
    }));
  };

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        minHeight: "100vh",
        px: 1,
        py: 2,
        overflowX: "hidden",
      }}
    >
      <Typography
        color="#0b0f19"
        fontWeight={600}
        variant="h6"
        textAlign="left"
        mb={4}
      >
        Bookings Overview
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          width: "100%",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <BigCard
            title="Confirmed"
            value={data.filter((a) => a.status === "confirmed").length}
            color="#fbb034"
            icon={<PendingIcon />}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <BigCard
            title="Completed"
            value={data.filter((a) => a.status === "completed").length}
            color="#00b09b"
            icon={<DoneIcon />}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <BigCard
            title="Cancelled"
            value={data.filter((a) => a.status === "cancelled").length}
            color="#ff416c"
            icon={<CancelIcon />}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          mt: 2,
          width: "100%",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <SmallCard title="This Week" value={countByDateRange(0, 7)} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <SmallCard
            title="Next Week"
            value={countByDateRange(14) - countByDateRange(7, 14)}
          />
        </Box>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Recent Appointments
        </Typography>

        {isMobile && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recentAppointments.map((app) => (
              <Paper
                key={app._id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                {/* TOP ROW */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography fontWeight={600}>{app.name || "User"}</Typography>

                  <Typography variant="caption" color="text.secondary">
                    {app.date}
                  </Typography>
                </Box>

                {/* SERVICE */}
                <Typography variant="body2" sx={{ color: "#555", mt: 0.5 }}>
                  💇 {app.serviceName || "Service"}
                </Typography>

                {/* TIME + PHONE */}
                <Typography variant="body2" sx={{ color: "#777", mt: 0.5 }}>
                  ⏰ {app.time} {app.phone ? `| 📞 ${app.phone}` : ""}
                </Typography>

                {/* STATUS */}
                <Select
                  fullWidth
                  size="small"
                  value={app.status || "confirmed"}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  sx={{
                    mt: 1.5,
                    bgcolor:
                      app.status === "completed"
                        ? "#2e7d32"
                        : app.status === "cancelled"
                          ? "#d32f2f"
                          : app.status === "no-show"
                            ? "#757575"
                            : "#1976d2",
                    color: "#fff",
                    borderRadius: 2,
                  }}
                >
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="no-show">No Show</MenuItem>
                </Select>
              </Paper>
            ))}

            {recentAppointments.length === 0 && (
              <Typography align="center" color="text.secondary">
                No recent appointments
              </Typography>
            )}
          </Box>
        )}

        {!isMobile && (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1e3c72" }}>
                <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Service</TableCell>
                <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                <TableCell sx={{ color: "#fff" }}>Time</TableCell>
                <TableCell sx={{ color: "#fff" }}>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {recentAppointments.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>{app.name || "User"}</TableCell>
                  <TableCell>{app.serviceName || "Service"}</TableCell>
                  <TableCell>{app.date}</TableCell>
                  <TableCell>{app.time}</TableCell>

                  <TableCell>
                    <Select
                      size="small"
                      value={app.status || "confirmed"}
                      onChange={(e) => updateStatus(app._id, e.target.value)}
                      sx={{
                        minWidth: 120,
                        bgcolor:
                          app.status === "completed"
                            ? "#2e7d32"
                            : app.status === "cancelled"
                              ? "#d32f2f"
                              : app.status === "no-show"
                                ? "#757575"
                                : "#1976d2",
                        color: "#fff",
                      }}
                    >
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                      <MenuItem value="no-show">No Show</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}

              {recentAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No recent appointments
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {recentAppointments.length === 0 && (
          <Typography mt={2} color="text.secondary">
            No recent appointments
          </Typography>
        )}
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight={600} mb={1}>
          Monthly Appointments Trend
        </Typography>

        <Box
          sx={{
            width: "100%",
            height: 300,
            overflow: "hidden",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getMonthlyData()}>
              <defs>
                <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="appointments"
                stroke="#b8962e"
                fill="url(#colorApp)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <Alert severity={toast.type} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function BigCard({ title, value, color, icon }) {
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: { xs: 120, sm: 180, md: "100%" }, // mobile small
        borderRadius: 3,
        boxShadow: 2,
        textAlign: "center",
      }}
    >
      <CardContent
        sx={{
          py: { xs: 1, md: 2 },
        }}
      >
        <Stack spacing={1} alignItems="center">
          <Avatar
            sx={{
              bgcolor: color,
              height: { xs: 32, md: 56 },
              width: { xs: 32, md: 56 },
            }}
          >
            {icon}
          </Avatar>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: 9, md: 12 } }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 16, md: 26 },
              fontWeight: 600,
            }}
          >
            {value}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function SmallCard({ title, value }) {
  return (
    <Card
      sx={{
        height: 150,
        borderRadius: 3,
        boxShadow: 2,
        textAlign: "center",
      }}
    >
      <CardContent>
        <Stack spacing={1} alignItems="center" justifyContent="center">
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              height: 40,
              width: 40,
            }}
          >
            {value}
          </Avatar>

          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>

          <Typography variant="h6">{value}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
