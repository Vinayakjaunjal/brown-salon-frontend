import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  TextField,
} from "@mui/material";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/appointments`)
      .then((res) => res.json())
      .then((data) => {
        const map = {};

        data.forEach((a) => {
          const key = a.email || a.phone;

          if (!map[key]) {
            map[key] = {
              name: a.name,
              email: a.email,
              phone: a.phone,
              visits: 1,
              lastVisit: a.date,
            };
          } else {
            map[key].visits += 1;
            if (new Date(a.date) > new Date(map[key].lastVisit)) {
              map[key].lastVisit = a.date;
            }
          }
        });

        setCustomers(Object.values(map));
      });
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", p: 2 }}>
      <Typography variant="h5" fontWeight={600} mb={3} color="#0b0f19">
        Customers
      </Typography>

      <TextField
        size="small"
        placeholder="Search by name, email or phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, width: 320 }}
      />

      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredCustomers.map((c, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid #e5e7eb",
                background: "#ffffff",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.5,
                }}
              >
                <Typography fontWeight={600} fontSize={16}>
                  {c.name}
                </Typography>

                <Chip
                  label={`${c.visits} visits`}
                  size="small"
                  sx={{
                    bgcolor: "#dcfce7",
                    color: "#166534",
                    fontWeight: 600,
                    height: 22,
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{ color: "#2563eb", fontSize: 13 }}
              >
                {c.email || "—"}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#475569", fontSize: 13 }}
              >
                {c.phone || "—"}
              </Typography>

              <Box
                sx={{
                  mt: 1,
                  pt: 1,
                  borderTop: "1px dashed #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}
                >
                  Last Visit
                </Typography>

                <Typography
                  sx={{ fontSize: 12, fontWeight: 700, color: "#ca8a04" }}
                >
                  {c.lastVisit}
                </Typography>
              </Box>
            </Paper>
          ))}

          {filteredCustomers.length === 0 && (
            <Typography align="center" color="text.secondary">
              No customers found
            </Typography>
          )}
        </Box>
      ) : (
        <Paper
          sx={{
            borderRadius: 1,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#0f172a" }}>
                {["Customer", "Contact", "Visits", "Last Visit"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{ color: "#fff", fontWeight: 600, fontSize: 14 }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCustomers.map((c, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "#f1f5f9" },
                  }}
                >
                  <TableCell>
                    <Typography fontWeight={600} color="#0f172a">
                      {c.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="#2563eb">
                      {c.email || "—"}
                    </Typography>
                    <Typography variant="caption" color="#64748b">
                      {c.phone || "—"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={`${c.visits} visits`}
                      size="small"
                      sx={{
                        bgcolor: "#dcfce7",
                        color: "#166534",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#ca8a04",
                      }}
                    >
                      {c.lastVisit}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
