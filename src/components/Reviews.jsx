import { useEffect, useState } from "react";
import "../styles/Reviews.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data.filter((r) => r.isActive)));
  }, []);

  useEffect(() => {
    if (reviews.length === 0 || pause) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [reviews, pause]);

  if (reviews.length === 0) return null;

  const current = reviews[index];

  const next = () => setIndex((index + 1) % reviews.length);
  const prev = () => setIndex((index - 1 + reviews.length) % reviews.length);

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0]?.toUpperCase();
    return (
      words[0][0]?.toUpperCase() + words[words.length - 1][0]?.toUpperCase()
    );
  };

  return (
    <section className="reviews-section">
      <h2 className="reviews-title">What Our Clients Say</h2>

      <div
        className="review-slider"
        onMouseEnter={() => setPause(true)}
        onMouseLeave={() => setPause(false)}
      >
        <button className="arrow-btn left" onClick={prev}>
          ❮
        </button>

        <div className="review-card">
          <div className="profile-img-wrapper">
            {current.image ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${current.image}`}
                alt={current.name}
              />
            ) : (
              <div className="initial-avatar">{getInitials(current.name)}</div>
            )}
          </div>

          <h3 className="review-name">{current.name}</h3>
          <p className="review-text">"{current.review}"</p>

          <div className="stars">
            {Array.from(
              { length: Math.max(0, Number(current.rating) || 0) },
              (_, i) => (
                <span key={i}>★</span>
              ),
            )}
          </div>
        </div>

        <button className="arrow-btn right" onClick={next}>
          ❯
        </button>
      </div>

      <div className="dots-wrapper">
        {reviews.map((review, i) => (
          <span
            key={review._id || i}
            className={`dot ${index === i ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default Reviews;
