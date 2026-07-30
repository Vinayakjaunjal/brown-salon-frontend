import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

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

const featuredServices = [
  {
    title: "Haircut & Styling",
    image: haircut,
  },
  {
    title: "Hair Coloring",
    image: haircolor,
  },
  {
    title: "Hair Spa",
    image: spa,
  },
  {
    title: "Keratin Treatment",
    image: keratin,
  },
  {
    title: "Beard Grooming",
    image: beard,
  },
  {
    title: "Hair Smoothing",
    image: hairsmooth,
  },
  {
    title: "Head Massage",
    image: massage,
  },
  {
    title: "D-Tan & Cleanup",
    image: dtan,
  },
];

export default function PopularServices() {
  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold uppercase tracking-wide text-gray-900">
          Popular Services
        </h2>

        <div className="w-28 h-0.5 bg-amber-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={4}
        spaceBetween={20}
        loop={true}
        speed={800}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 18,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
      >
        {featuredServices.map((service) => (
          <SwiperSlide key={service.title}>
            <div>
              <div className="overflow-hidden rounded-xl shadow-md">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full aspect-[4/5] object-cover rounded-xl"
                />
              </div>

              <h3 className="mt-3 text-xl font-semibold tracking-wide text-center">
                {service.title}
              </h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
