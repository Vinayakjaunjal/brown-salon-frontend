import { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminHeader from "./AdminHeader";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PeopleIcon from "@mui/icons-material/People";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CakeIcon from "@mui/icons-material/Cake";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/brown-logo-Side.png";

const SIDEBAR_WIDTH = 260;

const menuItems = [
  { text: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
  { text: "Appointments", path: "/admin/appointments", icon: <EventIcon /> },
  { text: "Services", path: "/admin/services", icon: <ContentCutIcon /> },
  { text: "Pricing", path: "/admin/pricing", icon: <AttachMoneyIcon /> },
  { text: "Gallery", path: "/admin/gallery", icon: <PhotoLibraryIcon /> },
  { text: "Reviews", path: "/admin/reviews", icon: <RateReviewIcon /> },
  { text: "Customers", path: "/admin/customers", icon: <PeopleIcon /> },
  { text: "Slots", path: "/admin/slots", icon: <ScheduleIcon /> },
  { text: "Birthdays", path: "/admin/birthdays", icon: <CakeIcon /> },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/admin-login";
  };

  const Sidebar = (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        bgcolor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* LOGO */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {/* LOGO IMAGE */}
        <Box
          component="img"
          src={logo}
          alt="Brown Salon"
          sx={{
            width: 65,
            height: 65,
            borderRadius: "50%", // 🔥 Circle
            objectFit: "cover",
          }}
        />

        {/* TEXT */}
        <Box>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: 20,
              fontFamily: "'Poppins', sans-serif",
              color: "#111827",
              lineHeight: 1.4,
            }}
          >
            Brown Salon
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              color: "#6b7280",
              letterSpacing: 0.4,
            }}
          >
            Admin Panel
          </Typography>
        </Box>
      </Box>

      <List sx={{ py: 1, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                bgcolor: active ? "#eff6ff" : "transparent",
                "&:hover": { bgcolor: "#eff6ff" },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? "#2563eb" : "#6b7280",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#2563eb" : "#111827",
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* LOGOUT */}
      <Box
        onClick={handleLogout}
        sx={{
          mx: 1,
          mb: 2,
          p: 1.5,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          cursor: "pointer",
          color: "#dc2626",
          "&:hover": {
            bgcolor: "#fef2f2",
          },
        }}
      >
        <LogoutIcon />
        <Typography fontSize={14} fontWeight={500}>
          Logout
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafb" }}>
      {isMobile ? (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{ sx: { width: SIDEBAR_WIDTH } }}
        >
          {Sidebar}
        </Drawer>
      ) : (
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            position: "fixed",
            left: 0,
            top: 0,
            height: "100vh",
          }}
        >
          {Sidebar}
        </Box>
      )}

      <Box
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : `${SIDEBAR_WIDTH}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AdminHeader
          isMobile={isMobile}
          onMenuClick={() => setMobileOpen(true)}
        />

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            px: 2,
            pt: 2,
            bgcolor: "#f9fafb",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
