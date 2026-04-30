import React from "react";
import { CheckCircle2, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Brown Hair The Unisex Salon</title>
      </Helmet>

      <div className="space-y-10 sm:space-y-14 text-slate-900">
        <section className="rounded-[30px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 sm:p-10">
          <div className="space-y-5">
            <span className="inline-flex rounded-full bg-indigo-900 px-3 py-1 text-xs font-semibold text-white">
              Brown Hair Salon
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold">
              Experience Premium Grooming at Brown Hair The Unisex Salon
            </h1>

            <p className="text-gray-600 max-w-2xl">
              Visit Brown Hair – The Unisex Salon for expert haircuts, grooming,
              skincare and beauty services by experienced stylists in a
              professional and hygienic environment.
            </p>

            <div className="flex gap-3">
              <Link
                to="/services"
                className="bg-emerald-500 text-white px-5 py-2 rounded-xl flex items-center gap-2"
              >
                Book Appointment <ArrowRight size={16} />
              </Link>

              <Link to="/services" className="border px-5 py-2 rounded-xl">
                View Services
              </Link>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section>
          <h2 className="text-2xl font-bold mb-5">Why Choose Us</h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              "Professional Stylists",
              "Hygienic Environment",
              "Unisex Services",
            ].map((item) => (
              <div key={item} className="bg-white p-5 rounded-2xl shadow">
                <CheckCircle2 className="text-green-500 mb-2" />
                <h3 className="font-semibold">{item}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-2xl font-bold">
            About Brown Hair The Unisex Salon
          </h2>

          <p>
            At Brown Hair – The Unisex Salon, we believe great style builds
            confidence.
          </p>

          <p>
            We provide high-quality haircuts, grooming, skincare and beauty
            services with a focus on style, hygiene and customer satisfaction.
          </p>

          <p>
            Our experienced stylists ensure you get the perfect look tailored to
            your personality.
          </p>

          <ul className="space-y-2 mt-4">
            <li className="flex gap-2">
              <CheckCircle2 className="text-green-500" /> Expert haircuts &
              styling
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="text-green-500" /> Beard grooming &
              skincare
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="text-green-500" /> Services for men &
              women
            </li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {[
              {
                q: "Do you provide services for both men and women?",
                a: "Yes, we are a unisex salon.",
              },
              {
                q: "Do I need to book appointment?",
                a: "Walk-in is allowed but booking is recommended.",
              },
            ].map((item, i) => (
              <div key={i} className="border p-3 rounded-xl">
                <div className="flex justify-between">
                  <span>{item.q}</span>
                  <ChevronDown size={16} />
                </div>
                <p className="text-sm text-gray-600 mt-2">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
