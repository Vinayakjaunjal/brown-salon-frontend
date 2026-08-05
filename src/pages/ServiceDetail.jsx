import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  IndianRupee,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import api from "../utils/api";
import BackNavButton from "../components/common/BackNavButton";

export default function ServiceDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/services/" + id)
      .then((res) => {
        setService(res.data);
      })
      .catch((err) => {
        console.log("ERROR:", err);
        setError("Service not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-4">
        <BackNavButton fallback="/services" label="Back to Services" />
        <div className="rounded-2xl border border-amber-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-4">
        <BackNavButton fallback="/services" label="Back to Services" />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-4">
        <BackNavButton fallback="/services" label="Back to Services" />
        <div className="rounded-2xl border border-amber-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Service not found
        </div>
      </div>
    );
  }

  const serviceIncludes = Array.isArray(service.includes)
    ? service.includes
    : [];

  return (
    <div className="bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-6">
        <BackNavButton fallback="/services" label="Back to Services" />

        <section className="relative overflow-hidden rounded-3xl border border-amber-100 bg-[#FBF6EE] p-5 sm:p-8">
          <div className="absolute -top-12 -right-10 h-44 w-44 rounded-full bg-amber-300/15 blur-3xl" />
          <div className="absolute -bottom-14 -left-10 h-44 w-44 rounded-full bg-amber-200/15 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Premium Service
              </span>
              <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                {service.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
                {service.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
                  <Clock3 className="h-3.5 w-3.5 text-amber-600" />
                  {service.duration || "Flexible duration"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                  Verified professional
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
                  <CalendarClock className="h-3.5 w-3.5 text-amber-600" />
                  Same-day booking
                </span>
              </div>
            </div>

            <aside className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-400">
                Service Price
              </h2>
              <div className="mt-2 inline-flex items-center gap-1 text-3xl font-bold text-gray-900">
                <IndianRupee className="h-6 w-6" />
                <span>
                  {new Intl.NumberFormat("en-IN", {
                    maximumFractionDigits: 0,
                  }).format(service.price || 0)}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Final amount with taxes will be shown on checkout.
              </p>

              <button
                onClick={() => nav(`/slots/${service._id || service.id}`)}
                className="mt-5 w-full rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-gray-900 shadow-lg shadow-amber-400/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-300"
              >
                Select Slot
              </button>
            </aside>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-gray-900">What's Included</h2>
          {serviceIncludes.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {serviceIncludes.map((item, idx) => (
                <article
                  key={`${item}-${idx}`}
                  className="rounded-2xl border border-amber-100 bg-[#FBF6EE] p-4"
                >
                  <p className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" />
                    <span>{item}</span>
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-500">
              Service inclusions will be shared by your professional before
              starting the session.
            </p>
          )}

          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-gray-900">
            <p className="font-semibold">Booking Tip</p>
            <p className="mt-1 text-gray-600">
              Choose a slot when you can be available for the full duration for
              the best service experience.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
