import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, Clock3, UserRound, Crown } from "lucide-react";
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
    <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
      <UserRound className="w-5 h-5 text-amber-500" strokeWidth={1.8} />
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

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
        <div className="rounded-2xl border border-amber-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
        <div className="rounded-2xl border border-amber-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Service not found
        </div>
      </div>
    );
  }

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
    <div className="bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-6">
        <BackNavButton fallback={`/services/${id}`} label="Back to Service" />

        <section className="rounded-3xl bg-[#FBF6EE] border border-amber-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Select your preferred time slot
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Choose date and time for {service.title}
          </p>
        </section>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5">
          <section className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Select Artist</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {sortedArtists.map((a) => (
                <div
                  key={a._id}
                  onClick={() => setSelectedArtist(a._id)}
                  className={`relative flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors
                  ${
                    a.type === "Owner"
                      ? selectedArtist === a._id
                        ? "bg-gradient-to-br from-amber-100 to-yellow-50 border-amber-400 shadow-md ring-1 ring-amber-300"
                        : "bg-gradient-to-br from-amber-50 to-yellow-50/50 border-amber-200 hover:border-amber-300"
                      : selectedArtist === a._id
                        ? "bg-gray-900 border-gray-900 text-white shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <ArtistAvatar artist={a} />
                  <div>
                    <p
                      className={`font-semibold flex items-center gap-2 ${
                        a.type === "Owner"
                          ? "text-amber-900"
                          : selectedArtist === a._id
                            ? "text-white"
                            : "text-gray-900"
                      }`}
                    >
                      {a.name}
                      {a.type === "Owner" && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-400 text-amber-950 px-2 py-0.5 rounded-md font-semibold">
                          <Crown size={10} />
                          Owner
                        </span>
                      )}
                    </p>
                    <p
                      className={`text-xs ${
                        a.type === "Owner"
                          ? "text-amber-700"
                          : selectedArtist === a._id
                            ? "text-gray-300"
                            : "text-gray-500"
                      }`}
                    >
                      {a.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <CalendarDays className="text-amber-600" size={18} /> Choose Date
            </h2>

            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="mt-3 border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
            />

            <p className="mt-2 text-sm text-gray-600">
              Selected: <b className="text-gray-900">{formattedDate}</b>
            </p>

            <h3 className="mt-6 font-semibold text-gray-900 flex items-center gap-2">
              <Clock3 className="text-amber-600" size={18} /> Available Slots
            </h3>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {slots.map((slot) => {
                const disabled =
                  slot.status !== "available" || isPast(slot.time);

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

          <aside className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm h-fit">
            <h2 className="font-semibold text-gray-900">Booking Snapshot</h2>

            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <b className="text-gray-900">{service.title}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <b className="text-gray-900">{formattedDate}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Slot</span>
                <b className="text-gray-900">{selected || "Select a slot"}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Artist</span>
                <b className="text-gray-900">
                  {selectedArtistObj?.name || "Select artist"}
                </b>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price</span>
                <b className="text-gray-900">₹{service.price}</b>
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
              className="mt-5 w-full bg-amber-400 text-gray-900 font-semibold py-2.5 rounded-xl hover:bg-amber-300 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
            >
              Continue to Checkout
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
