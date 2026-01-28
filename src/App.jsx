import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Pricing from "./components/Pricing";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import AppointmentForm from "./components/AppointmentForm";
import MapSection from "./components/MapSection";
import Footer from "./components/Footer";

import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Appointments from "./admin/Appointments";
import Customers from "./admin/Customers";
import Slots from "./admin/Slots";
import Birthdays from "./admin/Birthdays";
import PricingAdmin from "./admin/PricingAdmin";
import ServicesAdmin from "./admin/ServicesAdmin";
import AdminGallery from "./admin/AdminGallery";
import AdminReviews from "./admin/AdminReviews";
import ProtectedAdmin from "./admin/ProtectedAdmin";
import ForgotPassword from "./admin/ForgotPassword";
import ResetPassword from "./admin/ResetPassword";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Pricing />
      <Gallery />
      <Reviews />
      <AppointmentForm />
      <MapSection />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-forgot" element={<ForgotPassword />} />
        <Route path="/admin-reset/:token" element={<ResetPassword />} />

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
          <Route path="appointments" element={<Appointments />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="pricing" element={<PricingAdmin />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="customers" element={<Customers />} />
          <Route path="slots" element={<Slots />} />
          <Route path="birthdays" element={<Birthdays />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
