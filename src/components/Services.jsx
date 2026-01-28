import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import "../styles/Services.css";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.BACKEND_URL}/api/services`)
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <h2 className="section-title">Our Services</h2>

        <div className="services-grid">
          {services.map((item) => (
            <ServiceCard
              key={item._id}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
