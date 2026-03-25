import React from "react";

import Hero from "../components/landing/Hero";
import PopularServices from "../components/landing/PopularServices";
import WhyChooseUs from "../components/landing/WhyChooseUs";
import VisitSalon from "../components/landing/VisitSalon";
import Gallery from "../components/landing/Gallery";
import Reviews from "../components/landing/Reviews";

export default function Landing() {
  return (
    <div className="space-y-16 sm:space-y-20 section-fade">
      <Hero />
      <PopularServices />
      <Gallery />
      <WhyChooseUs />
      <Reviews />
      <VisitSalon />
    </div>
  );
}
