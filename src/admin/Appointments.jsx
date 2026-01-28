import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const months = [
  "All",
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
];

export default function Appointments() {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState("All");

  const [selectedDate, setSelectedDate] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetch(`${import.meta.env.BACKEND_URL}/api/appointments`)
      .then((res) => res.json())
      .then(setData);
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`${import.meta.env.BACKEND_URL}/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setData((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
  };

  const filteredData = data.filter((a) => {
    const appointmentMonth = months[new Date(a.date).getMonth() + 1];

    const matchMonth = month === "All" || appointmentMonth === month;

    const matchDate = !selectedDate || a.date === selectedDate;

    return matchMonth && matchDate;
  });

  const sortedData = [...filteredData].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", p: 2 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Appointments
      </Typography>

      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          sx={{ width: 120, height: 45 }}
        >
          {months.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </Select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        {(selectedDate || month !== "All") && (
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedDate("");
              setMonth("All");
            }}
          >
            Clear
          </Button>
        )}
      </Box>

      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {sortedData.map((app) => (
            <Paper
              key={app._id}
              sx={{
                p: 2,
                borderRadius: 2,
                border:
                  app.date === today
                    ? "2px solid #1976d2"
                    : "1px solid #e0e0e0",
                backgroundColor: app.date === today ? "#f0f7ff" : "#fff",
              }}
            >
              {app.date === today && (
                <Box
                  sx={{
                    alignSelf: "flex-start",
                    mb: 1,
                    bgcolor: "#facc15",
                    color: "#060101ff",
                    fontSize: 11,
                    px: 1.5,
                    py: "3px",
                    borderRadius: 1,
                    fontWeight: 600,
                    width: "fit-content",
                  }}
                >
                  TODAY
                </Box>
              )}
              <Typography fontWeight={600}>{app.name}</Typography>
              <Typography fontWeight={700} color="#df45"></Typography>

              <Typography variant="body2" sx={{ mt: 0.5 }}>
                📅 {app.date} | ⏰ {app.time}
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Select
                  fullWidth
                  size="small"
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
              </Box>
            </Paper>
          ))}

          {filteredData.length === 0 && (
            <Typography align="center" color="text.secondary">
              No appointments found
            </Typography>
          )}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "#1e3c72",
                }}
              >
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Date
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Time
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedData.map((app) => (
                <TableRow
                  key={app._id}
                  hover
                  sx={{ bgcolor: app.date === today ? "#e3f2fd" : "inherit" }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography>{app.name}</Typography>

                      {app.date === today && (
                        <Box
                          sx={{
                            bgcolor: "#facc15",
                            color: "#0d0505ff",
                            fontSize: 10,
                            px: 1,
                            py: "2px",
                            borderRadius: 1,
                            fontWeight: 600,
                          }}
                        >
                          TODAY
                        </Box>
                      )}
                    </Box>
                  </TableCell>
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
                        "& .MuiSelect-icon": {
                          color: "#fff",
                        },
                      }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Button variant="contained" size="small">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No appointments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
