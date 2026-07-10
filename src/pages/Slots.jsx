import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, Clock3, UserRound } from "lucide-react";
import SlotButton from "../components/SlotButton";
import BackNavButton from "../components/common/BackNavButton";
import api from "../utils/api";
import { io } from "socket.io-client";

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

const socket = io(import.meta.env.VITE_API_URL);

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

const ArtistAvatar = ({ artist }) => {
  const [imageError, setImageError] = useState(false);

  if (artist.image && !imageError) {
    return (
      <img
        src={artist.image}
        alt={artist.name}
        onError={() => setImageError(true)}
        className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-50 to-violet-100 border border-indigo-100 flex items-center justify-center shrink-0">
      <UserRound className="w-5 h-5 text-indigo-400" strokeWidth={1.8} />
    </div>
  );
};

export default function Slots() {
  const { id } = useParams();
  const nav = useNavigate();

  const [service, setService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState("");

  const today = getLocalToday();
  const [date, setDate] = useState(today);

  useEffect(() => {
    api.get("/artists").then((res) => {
      setArtists(res.data);

      if (res.data.length > 0) {
        setSelectedArtist(res.data[0]._id);
      }
    });
  }, []);

  useEffect(() => {
    api
      .get("/services/" + id)
      .then((res) => setService(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const fetchSlots = () => {
    api
      .get(`/slots/available?date=${date}&artist=${selectedArtist}`)
      .then((res) => setSlots(res.data))
      .catch(() => setSlots([]));
  };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);

    const room = `${date}_${selectedArtist}`;

    socket.emit("joinRoom", room);

    socket.on("slotUpdated", () => {
      fetchSlots();
    });

    return () => {
      socket.disconnect();
    };
  }, [date, selectedArtist]);

  useEffect(() => {
    if (!date) return;
    fetchSlots();
  }, [date, selectedArtist]);

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

  const selectedArtistObj = artists.find((a) => a._id === selectedArtist);

  const sortedArtists = [...artists].sort((a, b) => {
    if (a.type === "Owner") return -1;
    if (b.type === "Owner") return 1;
    return 0;
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
          <h3 className="font-semibold mb-2">Select Artist</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {sortedArtists.map((a) => (
              <div
                key={a._id}
                onClick={() => setSelectedArtist(a._id)}
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer 
                ${
                  selectedArtist === a._id
                    ? a.type === "Owner"
                      ? "bg-yellow-100 border-yellow-500 text-yellow-900 shadow-sm"
                      : "bg-indigo-50 border-indigo-400 text-indigo-700 shadow-sm"
                    : a.type === "Owner"
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-200"
                }`}
              >
                <ArtistAvatar artist={a} />
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    {a.name}
                    {a.type === "Owner" && (
                      <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md">
                        ⭐ Owner
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{a.type}</p>
                </div>
              </div>
            ))}
          </div>
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
            {slots.map((slot) => {
              const disabled = slot.status !== "available" || isPast(slot.time);

              return (
                <SlotButton
                  key={slot.time}
                  time={slot.time}
                  selected={selected === slot.time}
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) setSelected(slot.time);
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
              <span>Artist</span>
              <b>{selectedArtistObj?.name || "Select artist"}</b>
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
                  artist: selectedArtist,
                  artistName: selectedArtistObj?.name,
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
