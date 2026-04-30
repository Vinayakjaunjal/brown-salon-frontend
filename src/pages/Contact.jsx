import React, { useState } from "react";
import { CheckCircle2, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
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

  return (
    <>
      <Helmet>
        <title>Contact Brown Hair The Unisex Salon</title>
      </Helmet>
      <div className="space-y-10 sm:space-y-14 text-slate-900">
        {/* HERO */}
        <section className="rounded-[30px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 sm:p-10">
          <div className="space-y-5">
            <span className="inline-flex rounded-full bg-indigo-900 px-3 py-1 text-xs font-semibold text-white">
              Contact Us
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold">
              Get in Touch with Brown Hair The Unisex Salon
            </h1>

            <p className="text-gray-600 max-w-2xl">
              Have questions or want to book an appointment? Reach out to our
              team for quick assistance.
            </p>
          </div>
        </section>

        {/* CONTACT INFO + FORM */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* INFO */}
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>

            <div className="flex gap-3 items-center">
              <Phone className="text-green-500" />
              <a href="tel:+919623245713">+91 9623245713</a>
            </div>

            <div className="flex gap-3 items-center">
              <Mail className="text-blue-500" />
              <a href="mailto:brown.unisex.salon@gmail.com">
                brown.unisex.salon@gmail.com
              </a>
            </div>

            <div className="flex gap-3 items-center">
              <MapPin className="text-red-500" />
              <span>Nagpur, Maharashtra</span>
            </div>

            <div className="pt-4">
              <h3 className="font-semibold mb-2">Why Contact Us?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="text-green-500" />
                  Book appointments easily
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="text-green-500" />
                  Get service guidance
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="text-green-500" />
                  Resolve your queries quickly
                </li>
              </ul>
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>

            {success && (
              <div className="bg-green-50 text-green-700 p-2 rounded mb-3 text-sm">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 p-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full border px-3 py-2 rounded-xl"
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full border px-3 py-2 rounded-xl"
              />

              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full border px-3 py-2 rounded-xl"
              />

              <textarea
                placeholder="Message"
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className="w-full border px-3 py-2 rounded-xl"
                rows={4}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 text-white py-2 rounded-xl flex items-center justify-center gap-2"
              >
                {loading ? "Sending..." : "Send Message"}
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
