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
    fetch(`${import.meta.env.BACKEND_URL}/api/appointments`)
      .then((res) => res.json())
      .then(setData);
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const countByDate = (days) =>
    data.filter((a) => {
      const d = new Date(a.date);
      const now = new Date();
      const diff = (d - now) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff < days;
    }).length;

  const recentAppointments = [...data]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const updateStatus = async (id, status) => {
    await fetch(`${import.meta.env.BACKEND_URL}/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setData((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));

    setToast({
      open: true,
      message: `Appointment ${status.toUpperCase()} successfully`,
      type:
        status === "approved"
          ? "success"
          : status === "rejected"
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
        Appointment Overview
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "nowrap",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <BigCard
            title="Pending"
            value={data.filter((a) => a.status === "pending").length}
            color="#fbb034"
            icon={<PendingIcon />}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <BigCard
            title="Completed"
            value={data.filter((a) => a.status === "approved").length}
            color="#00b09b"
            icon={<DoneIcon />}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <BigCard
            title="Cancelled"
            value={data.filter((a) => a.status === "rejected").length}
            color="#ff416c"
            icon={<CancelIcon />}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mt: 2,
        }}
      >
        <Box sx={{ flex: "1 1 30%", minWidth: "30%" }}>
          <SmallCard
            title="Today"
            value={data.filter((a) => a.date === today).length}
          />
        </Box>

        <Box sx={{ flex: "1 1 30%", minWidth: "30%" }}>
          <SmallCard title="Tomorrow" value={countByDate(2) - countByDate(1)} />
        </Box>

        <Box sx={{ flex: "1 1 30%", minWidth: "30%" }}>
          <SmallCard title="This Week" value={countByDate(7)} />
        </Box>

        <Box sx={{ flex: "1 1 48%", minWidth: "48%" }}>
          <SmallCard
            title="Next Week"
            value={countByDate(14) - countByDate(7)}
          />
        </Box>

        <Box sx={{ flex: "1 1 48%", minWidth: "48%" }}>
          <SmallCard title="This Month" value={countByDate(30)} />
        </Box>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Recent Appointments
        </Typography>

        {isMobile && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {recentAppointments.map((app) => (
              <Card
                key={app._id}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography fontWeight={600}>{app.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {app.date}
                  </Typography>
                </Box>

                <Typography variant="body2" mb={1}>
                  Time: {app.time}
                </Typography>

                <Select
                  size="small"
                  fullWidth
                  value={app.status}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  sx={{
                    bgcolor:
                      app.status === "approved"
                        ? "#2e7d32"
                        : app.status === "rejected"
                          ? "#d32f2f"
                          : "#ed6c02",
                    color: "#fff",
                  }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </Card>
            ))}
          </Box>
        )}

        {!isMobile && (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f3f4f6" }}>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {recentAppointments.map((app) => (
                <TableRow key={app._id} hover>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.date}</TableCell>
                  <TableCell>{app.time}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={app.status}
                      onChange={(e) => updateStatus(app._id, e.target.value)}
                      sx={{
                        minWidth: 120,
                        bgcolor:
                          app.status === "approved"
                            ? "#2e7d32"
                            : app.status === "rejected"
                              ? "#d32f2f"
                              : "#ed6c02",
                        color: "#fff",
                      }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
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
        height: 100,
        borderRadius: 2,
        background: `linear-gradient(90deg, ${color})`,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <CardContent>
        <Box sx={{ fontSize: 30 }}>{icon}</Box>
        <Typography variant="h5">{value}</Typography>
        <Typography>{title}</Typography>
      </CardContent>
    </Card>
  );
}

function SmallCard({ title, value }) {
  return (
    <Card
      sx={{
        height: 80,
        borderRadius: 2,
        background: "linear-gradient(90deg,#1e3c72,#2a5298)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <CardContent sx={{ p: 1 }}>
        <Typography variant="h6">{value}</Typography>
        <Typography variant="body2">{title}</Typography>
      </CardContent>
    </Card>
  );
}
