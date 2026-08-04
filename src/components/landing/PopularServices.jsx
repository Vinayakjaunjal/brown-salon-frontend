import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Droplet, Scissors, Flower2 } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

import beard from "../../assets/pop-beard-grooming.webp";
import dtan from "../../assets/pop-d-tan.webp";
import haircolor from "../../assets/pop-hair-coloring.webp";
import hairsmooth from "../../assets/pop-hair-smoothing.webp";
import spa from "../../assets/pop-hair-spa.webp";
import haircut from "../../assets/pop-haircut-styling.webp";
import massage from "../../assets/pop-head-massage.webp";
import keratin from "../../assets/pop-keratin-treatment.webp";

// Simple beard icon (lucide has no dedicated beard glyph, so a custom one keeps
// the same visual language as the reference)
const BeardIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    {...props}
  >
    <path d="M8 4c0 2-1 3-1 5v4c0 3 2 6 5 6s5-3 5-6V9c0-2-1-3-1-5" />
    <path d="M8 4c1.3 1 2.6 1.4 4 1.4S14.7 5 16 4" />
    <path d="M10 15c.6.8 1.3 1.2 2 1.2s1.4-.4 2-1.2" />
  </svg>
);

const featuredServices = [
  {
    title: "Haircut & Styling",
    image: haircut,
    icon: Scissors,
    description: "A precision cut and finish tailored to your face and style.",
  },
  {
    title: "Hair Coloring",
    image: haircolor,
    icon: Droplet,
    description: "Vibrant, long-lasting color crafted to suit your look.",
  },
  {
    title: "Hair Spa",
    image: spa,
    icon: Flower2,
    description: "Deep nourishment and relaxation for healthier hair.",
  },
  {
    title: "Keratin Treatment",
    image: keratin,
    icon: Droplet,
    description: "Smooth, frizz-free and silky hair that shines with health.",
  },
  {
    title: "Beard Grooming",
    image: beard,
    icon: BeardIcon,
    description:
      "Precision trimming, shaping and styling for the perfect look.",
  },
  {
    title: "Hair Smoothing",
    image: hairsmooth,
    icon: Scissors,
    description:
      "Get silky, smooth and manageable hair with long-lasting results.",
  },
  {
    title: "Head Massage",
    image: massage,
    icon: Flower2,
    description: "Relax, de-stress and rejuvenate with a calming head massage.",
  },
  {
    title: "D-Tan & Cleanup",
    image: dtan,
    icon: Droplet,
    description: "Refresh your skin with a gentle, revitalizing cleanup.",
  },
];

export default function PopularServices() {
  return (
    <section className="relative pt-12 sm:pt-14 pb-20 bg-[#FBF3EA]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300 text-amber-700 text-xs font-semibold tracking-wide uppercase mb-6">
            ✦ Our Signature Services
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
            Services <span className="text-amber-600">Designed</span> for You
          </h2>

          <div className="w-16 h-px bg-amber-300 mx-auto mb-5 relative">
            <span className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-amber-500" />
          </div>

          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            Experience expert care and premium treatments crafted to enhance
            your style and confidence.
          </p>
        </div>

        <div className="relative">
          <button className="services-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-gray-900 hover:bg-amber-50 transition">
            ‹
          </button>
          <button className="services-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-amber-600 hover:bg-amber-50 transition">
            ›
          </button>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={4}
            spaceBetween={24}
            loop={true}
            speed={800}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: ".services-prev",
              nextEl: ".services-next",
            }}
            pagination={{
              clickable: true,
              el: ".services-pagination",
            }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 18 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
          >
            {featuredServices.map((service) => {
              const Icon = service.icon;
              return (
                <SwiperSlide key={service.title}>
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden pb-8">
                    <div className="relative">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full aspect-[4/5] object-cover"
                      />
                      <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-md border border-amber-100 flex items-center justify-center text-amber-600">
                        <Icon size={20} strokeWidth={1.6} />
                      </div>
                    </div>

                    <div className="pt-10 px-5 text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className="services-pagination flex justify-center gap-2 mt-10" />
        </div>
      </div>
    </section>
  );
}
