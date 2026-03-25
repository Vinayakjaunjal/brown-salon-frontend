import React from "react";
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
  useTheme,
  useMediaQuery,
} from "@mui/material";

export default function Bookings() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    console.log("ADMIN API:", import.meta.env.VITE_API_URL);
    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/all`)
      .then((res) => res.text())
      .then((text) => {
        console.log("RAW RESPONSE:", text);

        try {
          const res = JSON.parse(text);

          if (Array.isArray(res)) setData(res);
          else if (Array.isArray(res.data)) setData(res.data);
          else setData([]);
        } catch {
          console.error("NOT JSON RESPONSE");
          setData([]);
        }
      });
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      const result = await res.json();
      console.log("UPDATED RESPONSE:", result);

      setData((prev) => prev.map((b) => (b._id === id ? result.data : b)));
    } catch (err) {
      console.log("UPDATE ERROR:", err);
    }
  };

  const filteredData = data.filter((b) => {
    return (
      (!selectedDate || b.date === selectedDate) &&
      (!statusFilter || b.status === statusFilter) &&
      (!search ||
        b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.serviceName?.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const sortedData = Array.isArray(filteredData)
    ? [...filteredData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      )
    : [];

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", p: 2 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Bookings
      </Typography>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      />

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginLeft: 10, padding: 8 }}
      />

      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        size="small"
        sx={{ ml: 2 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="confirmed">Confirmed</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
        <MenuItem value="cancelled">Cancelled</MenuItem>
        <MenuItem value="no-show">No Show</MenuItem>
      </Select>

      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Array.isArray(sortedData) &&
            sortedData.map((b) => (
              <Paper
                key={b._id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography fontWeight={700} fontSize={16}>
                    {b.name || "User"}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {b.date}
                  </Typography>
                </Box>

                {/* SERVICE */}
                <Typography variant="body2" sx={{ color: "#555", mt: 0.5 }}>
                  💇 {b.serviceName || "Service"}
                </Typography>

                {/* TIME + PHONE */}
                <Typography variant="body2" sx={{ color: "#777", mt: 0.5 }}>
                  ⏰ {b.time} {b.phone ? `| 📞 ${b.phone}` : ""}
                </Typography>

                {/* STATUS */}
                <Select
                  fullWidth
                  size="small"
                  value={b.status || "confirmed"}
                  onChange={(e) => updateStatus(b._id, e.target.value)}
                  sx={{
                    mt: 1.5,
                    bgcolor:
                      b.status === "completed"
                        ? "#2e7d32"
                        : b.status === "cancelled"
                          ? "#d32f2f"
                          : b.status === "no-show"
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

          {sortedData.length === 0 && (
            <Typography align="center" color="text.secondary">
              No bookings found
            </Typography>
          )}
        </Box>
      ) : (
        /* DESKTOP VIEW */
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1e3c72" }}>
                <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Service</TableCell>
                <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                <TableCell sx={{ color: "#fff" }}>Time</TableCell>
                <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
                <TableCell sx={{ color: "#fff" }}>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.isArray(sortedData) &&
                sortedData.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell>{b.name || "User"}</TableCell>
                    <TableCell>{b.serviceName || "Service"}</TableCell>
                    <TableCell>{b.date}</TableCell>
                    <TableCell>{b.time}</TableCell>
                    <TableCell>{b.phone || "-"}</TableCell>

                    <TableCell>
                      <Select
                        size="small"
                        value={b.status || "confirmed"}
                        onChange={(e) => updateStatus(b._id, e.target.value)}
                        sx={{
                          minWidth: 120,
                          fontWeight: 600,

                          bgcolor:
                            b.status === "completed"
                              ? "#2e7d32"
                              : b.status === "cancelled"
                                ? "#d32f2f"
                                : b.status === "no-show"
                                  ? "#757575"
                                  : "#1976d2",

                          color: "#fff",

                          "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                            color: "#fff",
                          },

                          "& .MuiSvgIcon-root": {
                            color: "#fff",
                          },
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

              {sortedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No bookings found
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
