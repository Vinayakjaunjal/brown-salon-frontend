import { useEffect, useState } from "react";
import PricingCard from "./PricingCard";
import "../styles/Pricing.css";

const Pricing = () => {
  const categories = [
    "All Pricing",
    "Gents",
    "Ladies",
    "Skin Treatment",
    "Hair Treatment",
    "Premium Offers",
  ];

  const keyMap = {
    Gents: "gents",
    Ladies: "ladies",
    "Skin Treatment": "skin",
    "Hair Treatment": "hair",
    "Premium Offers": "premium",
  };

  const [active, setActive] = useState("All Pricing");
  const [pricing, setPricing] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/pricing`)
      .then((res) => res.json())
      .then((data) => setPricing(data))
      .catch((err) => console.error("Pricing fetch error", err));
  }, []);

  const cardsToShow =
    active === "All Pricing"
      ? pricing
      : pricing.filter((item) => item.category === keyMap[active]);

  return (
    <section id="pricing" className="pricing-section">
      <h2 className="pricing-title">Our Pricing</h2>

      <div className="pricing-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={active === cat ? "active" : ""}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="pricing-grid">
        {cardsToShow.length === 0 ? (
          <p style={{ color: "#999", textAlign: "center" }}>
            No services available
          </p>
        ) : (
          cardsToShow.map((item) => (
            <PricingCard
              key={item._id}
              title={item.title}
              description={item.description}
              price={item.price}
              isPremium={item.category === "premium"}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Pricing;
