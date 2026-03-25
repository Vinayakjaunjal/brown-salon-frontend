import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// ================= COMMON =================
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RouteLoader from "./components/common/RouteLoader";
import GlobalLoader from "./components/common/GlobalLoader";
import ScrollToTop from "./components/ScrollToTop";

// ================= USER PAGES =================
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPasswordUser = lazy(() => import("./pages/ForgotPassword"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Slots = lazy(() => import("./pages/Slots"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Success = lazy(() => import("./pages/Success"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Gallery = lazy(() => import("./components/landing/Gallery"));

// ================= ADMIN =================
import ProtectedAdmin from "./admin/ProtectedAdmin";
import AdminLayout from "./admin/AdminLayout";

// ================= ADMIN PAGES =================
const Dashboard = lazy(() => import("./admin/Dashboard.jsx"));
const Bookings = lazy(() => import("./admin/Bookings"));
const Customers = lazy(() => import("./admin/Customers"));
const SlotsAdmin = lazy(() => import("./admin/Slots"));
const Birthdays = lazy(() => import("./admin/Birthdays"));
const Festivals = lazy(() => import("./admin/Festivals"));
const ServicesAdmin = lazy(() => import("./admin/ServicesAdmin"));
const AdminGallery = lazy(() => import("./admin/AdminGallery"));
const AdminReviews = lazy(() => import("./admin/AdminReviews"));
const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const AdminForgot = lazy(() => import("./admin/ForgotPassword"));
const AdminReset = lazy(() => import("./admin/ResetPassword"));

// ================= MAIN WRAPPER =================
function LayoutWrapper() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-bg-default">
      {/* Navbar only for user */}
      {!isAdmin && <Navbar />}

      <main
        className={`flex-1 w-full mx-auto px-4 sm:px-6 ${
          isAdmin ? "max-w-full py-4" : "max-w-5xl py-8"
        }`}
      >
        <Suspense fallback={<RouteLoader />}>
          <ScrollToTop />

          <Routes>
            {/* ================= USER ROUTES ================= */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPasswordUser />} />

            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/slots/:id" element={<Slots />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />

            <Route path="/profile" element={<Profile />} />

            {/* ================= ADMIN AUTH ================= */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-forgot" element={<AdminForgot />} />
            <Route path="/admin-reset/:token" element={<AdminReset />} />

            {/* ================= ADMIN PANEL ================= */}
            <Route
              path="/admin/*"
              element={
                <ProtectedAdmin>
                  <AdminLayout />
                </ProtectedAdmin>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="services" element={<ServicesAdmin />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="customers" element={<Customers />} />
              <Route path="slots" element={<SlotsAdmin />} />
              <Route path="birthdays" element={<Birthdays />} />
              <Route path="festivals" element={<Festivals />} />
            </Route>
          </Routes>
        </Suspense>
      </main>

      {/* Footer only for user */}
      {!isAdmin && <Footer />}

      <GlobalLoader />
    </div>
  );
}

// ================= APP ROOT =================
export default function App() {
  return <LayoutWrapper />;
}
