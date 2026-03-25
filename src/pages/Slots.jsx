import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, Clock3, Sparkles } from "lucide-react";
import SlotButton from "../components/SlotButton";
import BackNavButton from "../components/common/BackNavButton";
import api from "../utils/api";

const TIMES = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
];

const getLocalToday = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

const toMinutes = (time) => {
  const [t, meridian] = time.split(" ");
  let [h, m] = t.split(":").map(Number);

  if (meridian === "PM" && h !== 12) h += 12;
  if (meridian === "AM" && h === 12) h = 0;

  return h * 60 + m;
};

export default function Slots() {
  const { id } = useParams();
  const nav = useNavigate();

  const [service, setService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  const today = getLocalToday();
  const [date, setDate] = useState(today);

  useEffect(() => {
    api
      .get("/services/" + id)
      .then((res) => setService(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!date) return;

    api
      .get(`/slots?date=${date}`)
      .then((res) => {
        console.log("DB SLOTS:", res.data);
        setSlots(res.data);
      })
      .catch(() => setSlots([]));
  }, [date]);

  useEffect(() => {
    if (!date) return;

    api
      .get("/bookings/all")
      .then((res) => {
        console.log("BOOKINGS:", res.data);
        setBookings(res.data.data || []);
      })
      .catch(() => setBookings([]));
  }, [date]);

  const isBlocked = (time) => {
    const bookingBlocked = bookings.some(
      (b) => b.date === date && b.time === time && b.status === "confirmed",
    );

    const manualBlocked = slots.some(
      (s) =>
        s.time === time && (s.status === "blocked" || s.status === "booked"),
    );

    return bookingBlocked || manualBlocked;
  };

  const isPast = (time) => {
    if (date !== today) return false;

    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();

    return toMinutes(time) <= current;
  };

  if (loading) return <div>Loading...</div>;
  if (!service) return <div>Service not found</div>;

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <BackNavButton fallback={`/services/${id}`} label="Back to Service" />

      <section className="rounded-3xl bg-gradient-to-br from-indigo-50 to-cyan-50 p-6">
        <h1 className="text-2xl font-bold">Select your preferred time slot</h1>
        <p className="text-sm text-gray-600 mt-2">
          Choose date and time for {service.title}
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5">
        <section className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-semibold flex items-center gap-2">
            <CalendarDays /> Choose Date
          </h2>

          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="mt-3 border p-2 rounded"
          />

          <p className="mt-2 text-sm">
            Selected: <b>{formattedDate}</b>
          </p>

          <h3 className="mt-6 font-semibold flex items-center gap-2">
            <Clock3 /> Available Slots
          </h3>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {TIMES.map((time) => {
              const disabled = isBlocked(time) || isPast(time);

              return (
                <SlotButton
                  key={time}
                  time={time}
                  selected={selected === time}
                  disabled={disabled}
                  onClick={() => {
                    console.log("SELECTED TIME:", time);
                    if (!disabled) setSelected(time);
                  }}
                />
              );
            })}
          </div>
        </section>

        <aside className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-semibold">Booking Snapshot</h2>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Service</span>
              <b>{service.title}</b>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <b>{formattedDate}</b>
            </div>
            <div className="flex justify-between">
              <span>Slot</span>
              <b>{selected || "Select a slot"}</b>
            </div>
            <div className="flex justify-between">
              <span>Price</span>
              <b>₹{service.price}</b>
            </div>
          </div>

          <button
            disabled={!selected}
            onClick={() =>
              nav("/checkout", {
                state: {
                  serviceId: service._id,
                  serviceName: service.title,
                  date,
                  time: selected,
                  price: service.price,
                },
              })
            }
            className="mt-5 w-full bg-green-500 text-white py-2 rounded disabled:bg-gray-300"
          >
            Continue to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
