import "../styles/PricingCard.css";

const PricingCard = ({ title, description, price, isPremium }) => {
  const goToAppointment = () => {
    const section = document.getElementById("appointment");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`pricing-card ${isPremium ? "premium-card" : ""}`}>
      <h3>{title}</h3>
      <p className="desc">{description}</p>

      <h4 className="price">₹{price}</h4>

      <button className="book-btn primary" onClick={goToAppointment}>
        BOOK NOW
      </button>
    </div>
  );
};

export default PricingCard;
