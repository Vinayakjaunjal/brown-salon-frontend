import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  CalendarClock,
  MapPin,
  Pencil,
  Save,
  Sparkles,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import Input from "../components/Input";
import api from "../utils/api";
import useSocket from "../hooks/useSocket";
import { clearAuthSession } from "../utils/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s()-]{8,20}$/;

const parseLocalUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    return {};
  }
};

const normalizeProfile = (raw = {}) => {
  const firstName = String(raw.firstName || "").trim();
  const lastName = String(raw.lastName || "").trim();
  const composedName = `${firstName} ${lastName}`.trim();
  const name = String(raw.name || composedName || "").trim();

  return {
    firstName,
    lastName,
    name,
    email: String(raw.email || "").trim(),
    phone: String(raw.phone || "").trim(),
    locationAddress: String(raw.location?.address || "").trim(),
    createdAt: raw.createdAt || null,
    updatedAt: raw.updatedAt || null,
  };
};

const formatDateTime = (booking) => {
  if (!booking.date || !booking.time) {
    return "Date not available";
  }
  return `${new Date(booking.date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${booking.time}`;
};

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const formatMemberSince = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

export default function Profile() {
  const nav = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const localUser = useMemo(() => parseLocalUser(), []);

  const {
    connected,
    bookingStatus,
    bookingAccepted,
    bookingRejected,
    clearEvent,
    joinBookingRoom,
    leaveBookingRoom,
  } = useSocket(token, localUser);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState("");
  const [bookingNotice, setBookingNotice] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileNotice, setProfileNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [profileData, setProfileData] = useState(() =>
    normalizeProfile(localUser),
  );
  const [profileForm, setProfileForm] = useState(() =>
    normalizeProfile(localUser),
  );

  const displayName = profileData.name || localUser.name || "User";
  const displayContact = profileData.email || profileData.phone || "";

  const syncLocalStorageUser = (rawUser = {}) => {
    const previous = parseLocalUser();
    const next = { ...previous, ...rawUser };
    localStorage.setItem("user", JSON.stringify(next));
  };

  const applyProfileData = (raw = {}) => {
    const normalized = normalizeProfile(raw);
    setProfileData(normalized);
    setProfileForm(normalized);
    return normalized;
  };

  const fetchBookings = async () => {
    console.log("USER API:", import.meta.env.VITE_API_URL);
    setLoadingBookings(true);
    setBookingError("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      const res = await api.get(`/bookings?userId=${user._id}`);
      const data = res.data.data;

      setBookings(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setBookingError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch bookings",
      );
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError("");
    try {
      const res = await api.get("/user/profile");
      applyProfileData(res.data.data || {});
      syncLocalStorageUser(res.data.data || {});
    } catch (err) {
      setProfileError(
        err.response?.data?.message || err.message || "Failed to fetch profile",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchProfile();
  }, []);

  useEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state]);

  useEffect(() => {
    if (!Array.isArray(bookings) || bookings.length === 0) return;

    bookings.forEach((booking) => {
      if (booking?._id) joinBookingRoom(booking._id);
    });

    return () => {
      bookings.forEach((booking) => {
        if (booking?._id) leaveBookingRoom(booking._id);
      });
    };
  }, [bookings]);

  const updateBookingFromSocket = (
    payload,
    defaultNotice = "Booking updated",
  ) => {
    if (!payload?.booking?._id) return;
    setBookings((prev) =>
      prev.map((item) =>
        item._id === payload.booking._id
          ? { ...item, ...payload.booking }
          : item,
      ),
    );
    setBookingNotice(payload.message || defaultNotice);

    if (payload.booking.status === "completed") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (bookingStatus) {
      updateBookingFromSocket(bookingStatus);
      clearEvent("bookingStatus");
    }
  }, [bookingStatus, clearEvent]);

  useEffect(() => {
    if (bookingAccepted) {
      updateBookingFromSocket(bookingAccepted, "Your booking was accepted");
      clearEvent("bookingAccepted");
    }
  }, [bookingAccepted, clearEvent]);

  useEffect(() => {
    if (bookingRejected) {
      updateBookingFromSocket(bookingRejected, "Your booking was rejected");
      clearEvent("bookingRejected");
    }
  }, [bookingRejected, clearEvent]);

  const handleCancelBooking = async (bookingId) => {
    setCancellingId(bookingId);
    setBookingError("");
    try {
      const res = await api.patch(`/bookings/${bookingId}/status`, {
        status: "cancelled",
        reason: "Cancelled by customer",
      });
      const updated = res.data.data;
      setBookings((prev) =>
        prev.map((item) => (item._id === bookingId ? updated : item)),
      );
      setBookingNotice("Booking cancelled");
    } catch (err) {
      setBookingError(
        err.response?.data?.message ||
          err.message ||
          "Failed to cancel booking",
      );
    } finally {
      setCancellingId("");
    }
  };

  const validateProfile = () => {
    const nextErrors = {};
    const firstName = profileForm.firstName.trim();
    const lastName = profileForm.lastName.trim();
    const email = profileForm.email.trim();
    const phone = profileForm.phone.trim();
    const fullName = `${firstName} ${lastName}`.trim();

    if (!fullName) {
      nextErrors.firstName = "First or last name is required";
    }

    if (!phone) {
      nextErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
      nextErrors.phone = "Enter a valid phone number";
    }

    if (email && !emailRegex.test(email)) {
      nextErrors.email = "Enter a valid email address";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setProfileError("");
    setProfileNotice("");

    if (!validateProfile()) {
      return;
    }

    const firstName = profileForm.firstName.trim();
    const lastName = profileForm.lastName.trim();
    const name = `${firstName} ${lastName}`.trim();

    setProfileSaving(true);
    try {
      const payload = {
        firstName,
        lastName,
        name,
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
      };

      const res = await api.put("/user/profile", payload);
      applyProfileData(res.data.data || {});
      syncLocalStorageUser(res.data.data || {});
      setIsEditingProfile(false);
      setProfileNotice("Profile updated successfully");
    } catch (err) {
      setProfileError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update profile",
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const startEditProfile = () => {
    setIsEditingProfile(true);
    setProfileError("");
    setProfileNotice("");
    setFieldErrors({});
  };

  const cancelEditProfile = () => {
    setIsEditingProfile(false);
    setProfileForm(profileData);
    setFieldErrors({});
    setProfileError("");
  };

  const handleLogout = () => {
    clearAuthSession();
    nav("/login", { replace: true });
  };

  const statusStyles = {
    confirmed: "bg-green-100 text-green-700 border-green-200",
    completed: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    "no-show": "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 section-fade">
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
              <Sparkles className="h-3.5 w-3.5" />
              Profile Dashboard
            </span>
            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              {displayName}
            </h1>
            <p className="text-sm text-slate-600">{displayContact}</p>
            <p className="mt-2 text-xs text-slate-500">
              Live status:{" "}
              <span
                className={`font-semibold ${connected ? "text-emerald-700" : "text-amber-700"}`}
              >
                {connected ? "Connected" : "Connecting..."}
              </span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Profile Information
            </h2>
            <p className="text-sm text-slate-600">
              Manage your account details and contact information.
            </p>
          </div>

          {!isEditingProfile ? (
            <button
              type="button"
              onClick={startEditProfile}
              disabled={profileLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-medium text-indigo-700 transition-all hover:border-indigo-300 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>
          ) : null}
        </div>

        {profileNotice && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {profileNotice}
          </div>
        )}
        {profileError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {profileError}
          </div>
        )}

        {profileLoading ? (
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            Loading profile...
          </div>
        ) : (
          <form onSubmit={handleProfileSave} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  First Name
                </label>
                <Input
                  value={profileForm.firstName}
                  onChange={(event) =>
                    handleProfileChange("firstName", event.target.value)
                  }
                  placeholder="Enter first name"
                  error={Boolean(fieldErrors.firstName)}
                  disabled={!isEditingProfile || profileSaving}
                />
                {fieldErrors.firstName && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Last Name
                </label>
                <Input
                  value={profileForm.lastName}
                  onChange={(event) =>
                    handleProfileChange("lastName", event.target.value)
                  }
                  placeholder="Enter last name"
                  disabled={!isEditingProfile || profileSaving}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Email
                </label>
                <Input
                  type="email"
                  value={profileForm.email}
                  onChange={(event) =>
                    handleProfileChange("email", event.target.value)
                  }
                  placeholder="Enter email"
                  error={Boolean(fieldErrors.email)}
                  disabled={!isEditingProfile || profileSaving}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Phone
                </label>
                <Input
                  value={profileForm.phone}
                  onChange={(event) =>
                    handleProfileChange("phone", event.target.value)
                  }
                  placeholder="Enter phone number"
                  error={Boolean(fieldErrors.phone)}
                  disabled={!isEditingProfile || profileSaving}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>
            </div>

            {isEditingProfile && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={cancelEditProfile}
                  disabled={profileSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        )}
      </section>

      {bookingNotice && (
        <div className="text-sm text-green-700 bg-green-50 rounded-xl px-3 py-2 border border-green-200">
          {bookingNotice}
        </div>
      )}
      {bookingError && (
        <div className="text-sm text-red-700 bg-red-50 rounded-xl px-3 py-2 border border-red-200">
          {bookingError}
        </div>
      )}

      <section>
        <h2 className="font-semibold mb-3 text-slate-900">Booking History</h2>
        {loadingBookings ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-5 text-sm text-slate-600 shadow-soft">
            Loading bookings...
          </div>
        ) : !Array.isArray(bookings) || bookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-5 text-sm text-slate-600 shadow-soft">
            No bookings yet
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(bookings) &&
              bookings.map((booking) => {
                console.log("BOOKING ITEM:", booking);
                const canCancel = ["pending", "accepted"].includes(
                  booking.status,
                );

                const statusLabelMap = {
                  confirmed: "Confirmed",
                  completed: "Completed",
                  cancelled: "Cancelled",
                  "no-show": "No Show",
                };

                const statusLabel =
                  statusLabelMap[booking.status] || "Confirmed";

                return (
                  <article
                    key={booking._id}
                    className="rounded-3xl border border-slate-100 bg-gradient-to-br p-4 shadow-soft sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {booking.serviceName ||
                            booking.serviceId?.title ||
                            "Service"}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 font-mono">
                          #{booking._id?.slice(-8) || "N/A"}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[booking.status] ||
                          "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                      <div className="flex items-start gap-2">
                        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                        <span>{formatDateTime(booking)}</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>
                          {formatCurrency(
                            booking.totalAmount ||
                              booking.price ||
                              booking.serviceId?.price ||
                              0,
                          )}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                        <span>{booking.artist?.name || "N/A"}</span>
                      </div>
                    </div>

                    {booking.status === "completed" && (
                      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                        Service completed. Thank you for booking with Brown
                        Salon.
                      </div>
                    )}

                    {booking.status === "cancelled" && (
                      <div className="mt-3 p-3 rounded-full bg-red-100 text-red-700 text-sm">
                        Booking cancelled. You can book another appointment
                        anytime.
                      </div>
                    )}

                    {booking.status === "no-show" && (
                      <div className="mt-3 p-3 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                        You missed this appointment. Please book again if
                        needed.
                      </div>
                    )}

                    {canCancel && (
                      <div className="pt-4">
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {cancellingId === booking._id
                            ? "Cancelling..."
                            : "Cancel Booking"}
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}
