import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackNavButton from "../components/common/BackNavButton";

export default function Success() {
  const location = useLocation();
  const nav = useNavigate();
  const booking = location.state?.booking;

  console.log("Success page - location state:", location.state);
  console.log("Success page - booking:", booking);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!booking) {
    console.log("No booking data found, showing fallback");
    return (
      <div className="space-y-4 max-w-md mx-auto">
        <BackNavButton fallback="/services" label="Back to Services" />
        <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
          <h2 className="font-bold text-2xl mb-4">No booking data</h2>
          <div className="text-gray-600 mb-4">
            Booking data was not passed correctly. Please check your booking
            history.
          </div>
          <button
            onClick={() => nav("/services")}
            className="btn-primary px-6 py-3 rounded-2xl font-semibold"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-md mx-auto">
      <BackNavButton fallback="/checkout" label="Back" />

      <div className="bg-white rounded-3xl shadow-soft p-6 text-center border border-green-100">
        {/* SUCCESS ICON */}
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
          <span className="text-3xl text-green-600">✓</span>
        </div>

        {/* TITLE */}
        <h2 className="font-bold text-2xl mb-1 text-gray-900">
          Booking Confirmed!
        </h2>

        <p className="text-green-600 text-sm mb-4">
          Your appointment has been successfully booked
        </p>

        {/* BOOKING ID */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4">
          <p className="text-xs text-gray-500">Booking ID</p>
          <p className="font-mono font-semibold text-lg text-gray-800">
            {booking._id || booking.id}
          </p>
        </div>

        {/* DETAILS */}
        <div className="text-left space-y-3 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Service</span>
            <span className="font-medium text-gray-800">
              {booking.serviceName || "Haircut"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-medium text-gray-800">
              {booking.date || "Today"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Time</span>
            <span className="font-medium text-gray-800">
              {booking.time || "Selected Slot"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Customer</span>
            <span className="font-medium text-gray-800">
              {booking.name || "You"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount</span>
            <span className="font-semibold text-gray-900">
              ₹{booking.price || "—"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              Confirmed
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-5">
          Please arrive 5–10 minutes early for a smooth experience.
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => nav("/profile", { state: { scrollToTop: true } })}
            className="w-full px-6 py-3 rounded-2xl btn-primary font-semibold"
          >
            View My Bookings
          </button>

          <button
            onClick={() => nav("/services")}
            className="w-full px-6 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50"
          >
            Book Another Service
          </button>
        </div>
      </div>
    </div>
  );
}
