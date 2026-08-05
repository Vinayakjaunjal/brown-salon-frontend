import React, { useState } from "react";
import {
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
} from "lucide-react";
import { Helmet } from "react-helmet";
import api from "../utils/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.phone || !form.message) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/site/inquiries", form);
      setSuccess("Thank you! We will contact you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-colors";

  return (
    <>
      <Helmet>
        <title>Contact Brown Hair The Unisex Salon</title>
      </Helmet>
      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-10 space-y-10 sm:space-y-14">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-3xl border border-amber-100 bg-[#FBF6EE] p-6 sm:p-10">
            <div className="absolute -top-12 -right-10 h-44 w-44 rounded-full bg-amber-300/15 blur-3xl" />
            <div className="absolute -bottom-14 -left-10 h-44 w-44 rounded-full bg-amber-200/15 blur-3xl" />

            <div className="relative space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                Contact Us
              </span>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 max-w-2xl leading-tight">
                Get in Touch with Brown Hair The Unisex Salon
              </h1>

              <p className="text-gray-500 max-w-2xl leading-relaxed">
                Have questions or want to book an appointment? Reach out to our
                team for quick assistance.
              </p>
            </div>
          </section>

          {/* CONTACT INFO + FORM */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* INFO */}
            <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Contact Information
              </h2>

              <div className="flex gap-3 items-center">
                <span className="w-9 h-9 shrink-0 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <Phone size={16} />
                </span>
                <a
                  href="tel:+919623245713"
                  className="text-sm text-gray-700 hover:text-amber-700 transition-colors"
                >
                  +91 9623245713
                </a>
              </div>

              <div className="flex gap-3 items-center">
                <span className="w-9 h-9 shrink-0 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <Mail size={16} />
                </span>
                <a
                  href="mailto:brown.unisex.salon@gmail.com"
                  className="text-sm text-gray-700 hover:text-amber-700 transition-colors"
                >
                  brown.unisex.salon@gmail.com
                </a>
              </div>

              <div className="flex gap-3 items-center">
                <span className="w-9 h-9 shrink-0 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <MapPin size={16} />
                </span>
                <span className="text-sm text-gray-700">
                  Nagpur, Maharashtra
                </span>
              </div>

              <div className="pt-4 border-t border-amber-100">
                <h3 className="font-semibold mb-3 text-gray-900">
                  Why Contact Us?
                </h3>
                <ul className="space-y-2.5 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="text-amber-600 w-4.5 h-4.5 shrink-0" />
                    Book appointments easily
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="text-amber-600 w-4.5 h-4.5 shrink-0" />
                    Get service guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="text-amber-600 w-4.5 h-4.5 shrink-0" />
                    Resolve your queries quickly
                  </li>
                </ul>
              </div>
            </div>

            {/* FORM */}
            <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Send us a Message
              </h2>

              {success && (
                <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-lg mb-3 text-sm">
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 p-2.5 rounded-lg mb-3 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={inputClass}
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={inputClass}
                />

                <textarea
                  placeholder="Message"
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className={inputClass}
                  rows={4}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-400 text-gray-900 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Message"}
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
