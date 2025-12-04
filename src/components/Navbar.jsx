import { useState } from "react";
import "../styles/Navbar.css";
import logo from "../assets/Brown_Salon_Logo.png";

function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark shadow-sm">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img src={logo} alt="Brown Hair Logo" className="brand-logo me-2" />

          <div className="brand-text">
            <span className="brand-main">BROWN</span>
            <span className="brand-sub">Hair The Unisex Salon</span>
          </div>
        </a>

        <button className="navbar-toggler" onClick={() => setOpen(!open)}>
          <i className="bi bi-list fs-2"></i>
        </button>

        <div
          className={`collapse navbar-collapse justify-content-end ${
            open ? "show" : ""
          }`}
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="#home" className="nav-link active" onClick={closeMenu}>
                Home
              </a>
            </li>

            <li className="nav-item">
              <a href="#about" className="nav-link" onClick={closeMenu}>
                About
              </a>
            </li>

            <li className="nav-item">
              <a href="#services" className="nav-link" onClick={closeMenu}>
                Services
              </a>
            </li>

            <li className="nav-item">
              <a href="#pricing" className="nav-link" onClick={closeMenu}>
                Pricing
              </a>
            </li>

            <li className="nav-item">
              <a href="#gallery" className="nav-link" onClick={closeMenu}>
                Gallery
              </a>
            </li>

            <li className="nav-item">
              <a href="#appointment" className="nav-link" onClick={closeMenu}>
                Appointment
              </a>
            </li>

            <li className="nav-item">
              <a href="#contact" className="nav-link" onClick={closeMenu}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
