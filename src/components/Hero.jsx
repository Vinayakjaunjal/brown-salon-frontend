import React from "react";
import "../styles/Hero.css";
import heroImg from "../assets/hero-banner-interior.jpg";

function Hero() {
  const goToAppointment = () => {
    const section = document.getElementById("appointment");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="premium-hero">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">Luxury Salon Experience</span>

          <h1 className="hero-title">
            Elevate Your Style
            <br />
            Define Your <span>Confidence</span>
          </h1>

          <p className="hero-subtitle">
            Premium hair & beauty services crafted for elegance, confidence, and
            comfort — just for you.
          </p>

          <div className="hero-actions">
            <button className="hero-btn primary" onClick={goToAppointment}>
              Book Appointment
            </button>
            <a href="#services" className="hero-btn secondary">
              Explore Services
            </a>
          </div>
        </div>
        <div className="hero-image-wrap">
          <img src={heroImg} alt="Luxury Salon" className="hero-image" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
