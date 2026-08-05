import React, { useState } from "react";
import { CheckCircle2, ArrowRight, ChevronDown, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const whyItems = [
  "Professional Stylists",
  "Hygienic Environment",
  "Unisex Services",
];

const faqs = [
  {
    q: "Do you provide services for both men and women?",
    a: "Yes, we are a unisex salon.",
  },
  {
    q: "Do I need to book appointment?",
    a: "Walk-in is allowed but booking is recommended.",
  },
];

export default function About() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <Helmet>
        <title>About Brown Hair The Unisex Salon</title>
      </Helmet>

      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-10 space-y-12 sm:space-y-16">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-3xl border border-amber-100 bg-[#FBF6EE] p-6 sm:p-10">
            <div className="absolute -top-12 -right-10 h-44 w-44 rounded-full bg-amber-300/15 blur-3xl" />
            <div className="absolute -bottom-14 -left-10 h-44 w-44 rounded-full bg-amber-200/15 blur-3xl" />

            <div className="relative space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                Brown Hair Salon
              </span>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 max-w-2xl leading-tight">
                Experience Premium Grooming at Brown Hair The Unisex Salon
              </h1>

              <p className="text-gray-500 max-w-2xl leading-relaxed">
                Visit Brown Hair – The Unisex Salon for expert haircuts,
                grooming, skincare and beauty services by experienced stylists
                in a professional and hygienic environment.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 bg-amber-400 text-gray-900 px-5 py-2.5 rounded-xl font-semibold hover:bg-amber-300 transition-colors"
                >
                  Book Appointment <ArrowRight size={16} />
                </Link>

                <Link
                  to="/services"
                  className="border border-gray-200 px-5 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  View Services
                </Link>
              </div>
            </div>
          </section>

          {/* WHY */}
          <section>
            <h2 className="text-2xl font-bold mb-5 text-gray-900">
              Why Choose Us
            </h2>

            <div className="grid sm:grid-cols-3 gap-4">
              {whyItems.map((item) => (
                <div
                  key={item}
                  className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-3">
                    <CheckCircle2 className="text-amber-600 w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{item}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* About text */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-100 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              About Brown Hair The Unisex Salon
            </h2>

            <p className="text-gray-600 leading-relaxed">
              At Brown Hair – The Unisex Salon, we believe great style builds
              confidence.
            </p>

            <p className="text-gray-600 leading-relaxed">
              We provide high-quality haircuts, grooming, skincare and beauty
              services with a focus on style, hygiene and customer satisfaction.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Our experienced stylists ensure you get the perfect look tailored
              to your personality.
            </p>

            <ul className="space-y-2.5 mt-4">
              <li className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="text-amber-600 w-4.5 h-4.5 shrink-0" />
                Expert haircuts &amp; styling
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="text-amber-600 w-4.5 h-4.5 shrink-0" />
                Beard grooming &amp; skincare
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="text-amber-600 w-4.5 h-4.5 shrink-0" />
                Services for men &amp; women
              </li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqs.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className="border border-amber-100 rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex justify-between items-center gap-3 p-3.5 text-left"
                    >
                      <span className="font-medium text-gray-900 text-sm">
                        {item.q}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-amber-600 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <p className="text-sm text-gray-500 px-3.5 pb-3.5 leading-relaxed">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
