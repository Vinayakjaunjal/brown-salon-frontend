import { useState, useEffect } from "react";
import "../styles/AppointmentForm.css";

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    date: "",
    time: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);

  const timeSlots = [];
  for (let hour = 9; hour <= 21; hour++) {
    ["00", "30"].forEach((min) => {
      const h = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      timeSlots.push(`${h}:${min} ${ampm}`);
    });
  }

  timeSlots.push("10:00 PM");

  const fetchBookedSlots = async (selectedDate) => {
    if (!selectedDate) return;

    try {
      const apRes = await fetch(
        `${import.meta.env.BACKEND_URL}/api/appointments?date=${selectedDate}`,
      );
      const appointments = await apRes.json();

      const slRes = await fetch(
        `${import.meta.env.BACKEND_URL}/api/slots?date=${selectedDate}`,
      );
      const slots = await slRes.json();

      const appointmentTimes = appointments.map((a) => a.time);
      const adminBookedTimes = slots
        .filter((s) => s.status === "booked")
        .map((s) => s.time);

      setBookedSlots([...new Set([...appointmentTimes, ...adminBookedTimes])]);
    } catch (err) {
      console.error("Error loading slots", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "date" ? { time: "" } : {}),
    }));

    if (name === "date") {
      fetchBookedSlots(value);
    }
  };

  useEffect(() => {
    if (!formData.date) return;

    fetch(
      `${import.meta.env.BACKEND_URL}/api/appointments?date=${formData.date}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const approved = data.filter((a) => a.status === "approved");
        setAppointments(approved);
      });

    fetch(`${import.meta.env.BACKEND_URL}/api/slots?date=${formData.date}`)
      .then((res) => res.json())
      .then((data) => {
        const booked = data
          .filter((s) => s.status === "booked")
          .map((s) => s.time);

        setBlockedSlots(booked);
      });
  }, [formData.date]);

  const isBooked = (time) => {
    if (appointments.some((a) => a.time === time)) return true;

    if (blockedSlots.includes(time)) return true;

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.BACKEND_URL}/api/appointments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section id="appointment" className="appointment-section">
      <h2>Book an Appointment</h2>

      <form className="appointment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Select Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Service --</option>
            <option value="Haircut">Haircut</option>
            <option value="Beard">Beard</option>
            <option value="Hair Color">Hair Color</option>
            <option value="Skin Treatment">Skin Treatment</option>
            <option value="Hair Spa">Hair Spa</option>
            <option value="Facial">Facial</option>
            <option value="Premium Package">Premium Package</option>
            <option value="Beard Grooming">Beard Grooming</option>
            <option value="Makeup">Makeup</option>
          </select>
        </div>

        <div className="form-group">
          <label>Select Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Select Time</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose Time --</option>

            {timeSlots.map((time, index) => (
              <option key={index} value={time} disabled={isBooked(time)}>
                {time} {isBooked(time) ? "(Booked)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group full">
          <label>Message (optional)</label>
          <textarea
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>

        <button className="submit-btn" type="submit">
          Book Appointment Now
        </button>
      </form>

      {success && (
        <p style={{ color: "green", marginTop: 15 }}>
          <b>
            Thank you for submitting your request for appointment at Brown
            Salon.
            <br />
            Our executive will confirm the appointment.
          </b>
        </p>
      )}
    </section>
  );
}
