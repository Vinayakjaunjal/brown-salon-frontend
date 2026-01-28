import React from "react";
import "../styles/Footer.css";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer id="contact" className="footer-section">
      <div className="footer-container">
        <div className="footer-col">
          <h3>Contact Us</h3>
          <div className="contact-icons">
            <p>
              <FaMapMarkerAlt /> Near South Point School, Krida Square, Nagpur
            </p>

            <p>
              <a href="tel:+919876543210" className="footer-link">
                <FaPhone /> +91 9623245713
              </a>
            </p>

            <p>
              <a
                href="mailto:brown.unisex.salon@gmail.com"
                className="footer-link"
              >
                <FaEnvelope /> brown.unisex.salon@gmail.com
              </a>
            </p>

            <p>
              <FaClock /> Mon–Sun: 9:00 AM – 10:00 PM
            </p>
          </div>
        </div>

        <div className="footer-col">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/brown_hair_unisex_saloon">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/share/1VyxMZ1hub/">
              <FaFacebook />
            </a>
            <a href="https://wa.me/919623245713" color="#0b7ecbff">
              <FaWhatsapp />
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h3>Stay in the Know</h3>
          <p>Subscribe to our newsletter for updates & offers.</p>

          <div className="subscribe-box">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 <span>Brown Hair Salon.</span> All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
