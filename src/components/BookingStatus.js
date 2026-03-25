import React, { useState, useEffect } from "react";
import useSocket from "../../shared/useSocket";

const BookingStatus = ({ booking, token, user }) => {
  const [currentStatus, setCurrentStatus] = useState(booking.status);

  const {
    bookingAccepted,
    serviceCompleted,
    bookingStatus: updatedBooking,
    joinBookingRoom,
    leaveBookingRoom,
  } = useSocket(token, user);

  useEffect(() => {
    joinBookingRoom(booking._id);
    return () => leaveBookingRoom(booking._id);
  }, [booking._id, joinBookingRoom, leaveBookingRoom]);

  useEffect(() => {
    if (bookingAccepted && bookingAccepted.booking._id === booking._id) {
      setCurrentStatus("accepted");
    }
  }, [bookingAccepted, booking._id]);

  useEffect(() => {
    if (serviceCompleted && serviceCompleted.booking._id === booking._id) {
      setCurrentStatus("completed");
    }
  }, [serviceCompleted, booking._id]);

  useEffect(() => {
    if (updatedBooking && updatedBooking.booking._id === booking._id) {
      setCurrentStatus(updatedBooking.status);
    }
  }, [updatedBooking, booking._id]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {currentStatus === "completed" && (
        <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="text-sm text-green-800">
            <span className="font-medium">Service Completed!</span>
            <div className="mt-1">
              Thank you for using Brown Salon. Please rate your experience.
            </div>
          </div>
        </div>
      )}

      {currentStatus === "cancelled" && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <div className="text-sm text-red-800">
            <span className="font-medium">Booking Cancelled</span>
            <div className="mt-1">
              This booking has been cancelled. You can book another slot
              anytime.
            </div>
          </div>
        </div>
      )}

      {currentStatus === "no-show" && (
        <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <div className="text-sm text-yellow-800">
            <span className="font-medium">No Show</span>
            <div className="mt-1">
              You missed this appointment. Please book again if needed.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStatus;
