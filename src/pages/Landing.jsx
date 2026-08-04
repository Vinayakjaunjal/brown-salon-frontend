import React from "react";

import Container from "../components/common/Container";

import Hero from "../components/landing/Hero";
import PopularServices from "../components/landing/PopularServices";
import Gallery from "../components/landing/Gallery";
import WhyChooseUs from "../components/landing/WhyChooseUs";
import Reviews from "../components/landing/Reviews";
import VisitSalon from "../components/landing/VisitSalon";

export default function Landing() {
  return (
    <Container className="section-fade">
      <Hero />

      <PopularServices />

      <Gallery />

      <WhyChooseUs />

      <Reviews />

      <VisitSalon />
    </Container>
  );
}
