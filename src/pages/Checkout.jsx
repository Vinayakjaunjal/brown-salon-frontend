import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Home,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import api from "../utils/api";
import BackNavButton from "../components/common/BackNavButton";

export default function Checkout() {
  const location = useLocation();
  const nav = useNavigate();
  const { serviceId, serviceName, date, time, price, artist } =
    location.state || {};

  const backTarget = serviceId ? `/slots/${serviceId}` : "/services";
  const [resolvedServiceName, setResolvedServiceName] = useState(
    serviceName || "",
  );

  const [email, setEmail] = useState("");
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [artists, setArtists] = useState([]);

  const total = price || 0;

  useEffect(() => {
    if (resolvedServiceName || !serviceId) {
      return;
    }

    api
      .get("/services")
      .then((res) => {
        const found = (res.data.data || []).find(
          (item) => (item._id || item.id) === serviceId,
        );
        if (found?.title) {
          setResolvedServiceName(found.title);
        }
      })
      .catch(() => {});
  }, [resolvedServiceName, serviceId]);

  useEffect(() => {
    api.get("/artists").then((res) => setArtists(res.data));
  }, []);

  const selectedArtistObj = artists.find((a) => a._id === artist);

  const formattedDate = useMemo(() => {
    if (!date) return "";
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [date]);

  const validate = () => {
    if (!email.trim()) {
      setEmailError("Please enter email");
      return false;
    }
    if (!email.includes("@")) {
      setEmailError("Invalid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleBook = async () => {
    setError("");

    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      localStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          serviceId,
          serviceName,
          date,
          time,
          price,
        }),
      );

      nav("/login", {
        state: { from: "/checkout" },
      });

      return;
    }

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post("/bookings", {
        name: user.name,
        phone: user.phone,
        serviceId,
        serviceName: resolvedServiceName,
        date,
        time,
        artist,
        totalAmount: total,
        email: email,
        userId: user._id,
        paymentMethod: method,
      });

      nav("/success", { state: { booking: res.data.data } });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to place booking",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!serviceId || !date || !time) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-4">
        <BackNavButton fallback="/services" label="Back to Services" />
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-amber-100">
          <div className="text-red-600 mb-4">Missing booking information.</div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Service ID: {serviceId || "missing"}</p>
            <p>Date: {date || "missing"}</p>
            <p>Time: {time || "missing"}</p>
          </div>
          <button
            onClick={() => nav("/services")}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-400 font-semibold text-gray-900 hover:bg-amber-300 transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-6">
        <BackNavButton fallback={backTarget} label="Back to Slots" />

        <section className="relative overflow-hidden rounded-3xl border border-amber-100 bg-[#FBF6EE] px-5 py-6 sm:px-7 sm:py-7">
          <div className="absolute -top-10 -right-8 h-40 w-40 rounded-full bg-amber-300/15 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-200/15 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Secure Checkout
            </span>
            <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              Confirm your booking details
            </h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Review your service details, enter your email, and confirm your
              booking.
            </p>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-5">
            <article className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-4 h-4 text-amber-600" />
                <h2 className="font-semibold text-lg text-gray-900">
                  Email Address
                </h2>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-[#FBF6EE] p-3 mb-4 text-xs text-gray-600">
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-amber-600 shrink-0" />
                  <span>
                    Please enter your email so we can send booking confirmation
                    and updates.
                  </span>
                </p>
              </div>

              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                placeholder="Enter your email"
                error={Boolean(emailError)}
                disabled={loading}
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-600">{emailError}</p>
              )}
            </article>

            <article className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <h3 className="font-semibold text-lg text-gray-900">
                  Payment Method
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                    method === "card"
                      ? "border-amber-300 bg-amber-50 shadow-[0_16px_30px_-24px_rgba(217,162,39,0.9)]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  disabled={loading}
                >
                  <div className="inline-flex items-center gap-2 font-medium text-sm text-gray-900">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    Card
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Pay securely with your card
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("cash")}
                  className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                    method === "cash"
                      ? "border-amber-300 bg-amber-50 shadow-[0_16px_30px_-24px_rgba(217,162,39,0.9)]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  disabled={loading}
                >
                  <div className="inline-flex items-center gap-2 font-medium text-sm text-gray-900">
                    <Wallet className="w-4 h-4 text-amber-600" />
                    Cash
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Pay at the time of service
                  </p>
                </button>
              </div>
            </article>

            <article className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-gray-900">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 mt-0.5 shrink-0 text-amber-600" />
                <span>
                  Your booking is confirmed only after successful checkout.
                </span>
              </p>
            </article>
          </section>

          <aside className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5 sm:p-6 h-fit lg:sticky lg:top-24">
            <h2 className="font-semibold text-lg text-gray-900">
              Booking Summary
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Service</span>
                <span className="font-medium text-gray-900 text-right">
                  {resolvedServiceName || serviceId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Artist</span>
                <span className="font-medium text-gray-900 text-right">
                  {selectedArtistObj?.name || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-900">
                  {formattedDate || date}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Time</span>
                <span className="font-medium text-gray-900">{time}</span>
              </div>
            </div>

            <div className="my-4 border-t border-amber-100" />

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Service Charge</span>
                <span>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 2,
                  }).format(price || 0)}
                </span>
              </div>

              <div className="pt-3 mt-3 border-t border-amber-100 flex items-center justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span className="inline-flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {new Intl.NumberFormat("en-IN", {
                    maximumFractionDigits: 2,
                  }).format(total)}
                </span>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-amber-400 py-3.5 font-semibold text-gray-900 shadow-lg shadow-amber-400/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
