import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, CalendarCheck2 } from "lucide-react";
import BackNavButton from "../components/common/BackNavButton";

export default function Success() {
  const location = useLocation();
  const nav = useNavigate();
  const booking = location.state?.booking;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!booking) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
        <div className="max-w-md mx-auto space-y-4">
          <BackNavButton fallback="/services" label="Back to Services" />
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 text-center">
            <h2 className="font-bold text-2xl mb-4 text-gray-900">
              No booking data
            </h2>
            <div className="text-gray-500 mb-4">
              Booking data was not passed correctly. Please check your booking
              history.
            </div>
            <button
              onClick={() => nav("/services")}
              className="px-6 py-3 rounded-2xl bg-amber-400 text-gray-900 font-semibold hover:bg-amber-300 transition-colors"
            >
              Browse Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
      <div className="max-w-md mx-auto space-y-5">
        <BackNavButton fallback="/checkout" label="Back" />

        <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm p-6 text-center border border-amber-100">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-200/20 blur-3xl" />

          {/* SUCCESS ICON */}
          <div className="relative w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>

          {/* TITLE */}
          <h2 className="relative font-bold text-2xl mb-1 text-gray-900">
            Booking Confirmed!
          </h2>

          <p className="relative text-emerald-600 text-sm mb-5">
            Your appointment has been successfully booked
          </p>

          {/* BOOKING ID */}
          <div className="relative bg-[#FBF6EE] border border-amber-100 rounded-xl p-3 mb-5">
            <p className="text-xs text-gray-500">Booking ID</p>
            <p className="font-mono font-semibold text-lg text-gray-900">
              {booking._id || booking.id}
            </p>
          </div>

          {/* DETAILS */}
          <div className="relative text-left space-y-3 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Service</span>
              <span className="font-medium text-gray-900">
                {booking.serviceName || "Haircut"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Artist</span>
              <span className="font-medium text-gray-900">
                {booking.artist?.name || "—"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-900">
                {booking.date || "Today"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Time</span>
              <span className="font-medium text-gray-900">
                {booking.time || "Selected Slot"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Customer</span>
              <span className="font-medium text-gray-900">
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
              <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                Confirmed
              </span>
            </div>
          </div>

          <div className="relative flex items-center gap-2 justify-center text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl py-2.5 mb-5">
            <CalendarCheck2 size={14} />
            Please arrive 5–10 minutes early for a smooth experience.
          </div>

          <div className="relative flex flex-col gap-3">
            <button
              onClick={() => nav("/profile", { state: { scrollToTop: true } })}
              className="w-full px-6 py-3 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              View My Bookings
            </button>

            <button
              onClick={() => nav("/services")}
              className="w-full px-6 py-3 rounded-2xl border border-amber-200 bg-white text-gray-700 font-medium hover:bg-amber-50 transition-colors"
            >
              Book Another Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
