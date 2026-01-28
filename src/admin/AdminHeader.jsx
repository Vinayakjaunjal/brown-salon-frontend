import { useState, useEffect } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Typography,
  InputBase,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminHeader({ isMobile, onMenuClick }) {
  const [adminName, setAdminName] = useState("Admin");
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name) setAdminName(name);
  }, []);

  const pageTitle =
    {
      "/admin/dashboard": "Dashboard",
      "/admin/appointments": "Appointments",
      "/admin/services": "Services",
      "/admin/pricing": "Pricing",
      "/admin/gallery": "Gallery",
      "/admin/reviews": "Reviews",
      "/admin/customers": "Customers",
      "/admin/slots": "Slots",
      "/admin/birthdays": "Birthdays",
    }[location.pathname] || "Dashboard";

  const fetchNotifications = async () => {
    const res = await fetch(`${import.meta.env.BACKEND_URL}/api/notifications`);
    const data = await res.json();
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30 sec
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    if (value.includes("appoint")) navigate("/admin/appointments");
    if (value.includes("service")) navigate("/admin/services");
    if (value.includes("price")) navigate("/admin/pricing");
    if (value.includes("gallery")) navigate("/admin/gallery");
    if (value.includes("review")) navigate("/admin/reviews");
    if (value.includes("customer")) navigate("/admin/customers");
    if (value.includes("slot")) navigate("/admin/slots");
    if (value.includes("birthday")) navigate("/admin/birthdays");
    if (value.includes("dashboard")) navigate("/admin/dashboard");
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/admin-login";
  };

  const clearAllNotifications = async () => {
    await fetch(`${import.meta.env.BACKEND_URL}/api/notifications`, {
      method: "DELETE",
    });
    fetchNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <Box
        sx={{
          height: 70,
          px: 2,
          position: "sticky",
          top: 0,
          zIndex: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {/* LEFT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isMobile && (
            <IconButton onClick={onMenuClick}>
              <MenuIcon />
            </IconButton>
          )}

          <Box>
            <Typography fontWeight={700} fontSize={18} color="#111827">
              {pageTitle}
            </Typography>
            <Typography fontSize={10} color="#6b7280">
              Welcome back, {adminName}
            </Typography>
          </Box>
        </Box>

        {/* SEARCH + NOTIFICATION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#f3f4f6",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              width: { xs: 100, sm: 180, md: 180 },
              height: 38,
            }}
          >
            <SearchIcon sx={{ fontSize: 18 }} />
            <InputBase
              value={search}
              onChange={handleSearch}
              placeholder="Search"
              sx={{ ml: 1, fontSize: 14, width: "100%" }}
            />
          </Box>

          <IconButton onClick={(e) => setNotifAnchor(e.currentTarget)}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ bgcolor: "#2563eb", color: "#fff" }}>
              {adminName[0]}
            </Avatar>
          </IconButton>
        </Box>
      </Box>

      {/* PROFILE MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem disabled>{adminName}</MenuItem>
        <MenuItem onClick={logout} sx={{ color: "#dc2626" }}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* NOTIFICATION MENU */}
      <Menu
        anchorEl={notifAnchor}
        open={Boolean(notifAnchor)}
        onClose={() => setNotifAnchor(null)}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 380,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight={600}>Notifications</Typography>
          <Button size="small" color="error" onClick={clearAllNotifications}>
            Clear All
          </Button>
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <Typography sx={{ p: 2, color: "#6b7280" }}>
            No notifications
          </Typography>
        ) : (
          <List dense>
            {notifications.map((n) => (
              <ListItem
                key={n._id}
                button
                onClick={() => {
                  navigate(n.link);
                  setNotifAnchor(null);
                }}
              >
                <ListItemText primary={n.title} secondary={n.message} />
              </ListItem>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
}
