import React from "react";
import "../styles/About.css";
import { FaCheckCircle } from "react-icons/fa";
import aboutImg from "../assets/about-brown.jpg";

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-content">
          <h2 className="about-title">About Us</h2>

          <p className="about-description">
            Welcome to <strong>Brown Hair The Unisex Salon</strong>, where
            beauty meets precision and style becomes an experience. For years,
            we’ve dedicated ourselves to creating a space where every client
            feels valued, confident, and transformed.
            <br />
            <br />
            Our journey began with a simple goal — to offer world-class hair and
            beauty services with unmatched comfort and care.
            <br />
            <br />
            With a team of skilled stylists, premium products, and modern
            techniques, we deliver results that elevate your natural beauty.
          </p>

          <div className="about-points">
            <h3>What We Stand For</h3>
            <ul>
              <li>
                <FaCheckCircle /> Premium, modern & customer-centric salon
              </li>
              <li>
                <FaCheckCircle /> Highly skilled beauty & hair experts
              </li>
              <li>
                <FaCheckCircle /> Personalized styling & consultation
              </li>
            </ul>
          </div>

          <div className="about-why">
            <h3>Why Choose Us</h3>
            <ul>
              <li>
                <FaCheckCircle /> Custom styling based on your personality
              </li>
              <li>
                <FaCheckCircle /> Premium, safe & branded products
              </li>
              <li>
                <FaCheckCircle /> Transparent pricing & friendly staff
              </li>
              <li>
                <FaCheckCircle /> Luxury experience at affordable prices
              </li>
            </ul>
          </div>
        </div>

        <div className="about-image">
          <img src={aboutImg} alt="Brown Hair Salon" />
        </div>
      </div>
    </section>
  );
};

export default About;
