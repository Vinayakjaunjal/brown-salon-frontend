import React, { useEffect, useState } from "react";

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

export default function Slots() {
  const [date, setDate] = useState("");
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [action, setAction] = useState("");
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedArtist, setSelectedArtist] = useState("");
  const [artists, setArtists] = useState([]);

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
    setTimeout(() => setSnack((s) => ({ ...s, open: false })), 3000);
  };

  const loadData = async () => {
    if (!date) {
      showSnack("Please select a date", "warning");
      return;
    }
    try {
      const bkRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/all`,
      );
      const bkData = await bkRes.json();
      setBookings(bkData.data || []);

      const slRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/slots?date=${date}&artist=${selectedArtist}`,
      );
      const slData = await slRes.json();
      setSlots(slData || []);

      setSelectedSlots([]);
      setAction("");
    } catch (err) {
      showSnack("Error loading data", "error");
    }
  };

  const isBooked = (time) =>
    bookings.some(
      (b) =>
        b.date === date &&
        b.time === time &&
        b.artist?._id === selectedArtist &&
        b.status === "confirmed",
    );

  const getFinalStatus = (time) => {
    const booking = bookings.find(
      (b) =>
        b.date === date && b.time === time && b.artist?._id === selectedArtist,
    );
    if (booking && booking.status === "confirmed") return "booked";
    if (
      booking &&
      (booking.status === "cancelled" || booking.status === "no-show")
    )
      return "available";
    const slot = slots.find(
      (s) => s.time === time && s.artist === selectedArtist,
    );
    return slot ? slot.status : "available";
  };

  const toggleSelect = (time) => {
    if (isBooked(time)) return;
    setSelectedSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  };

  const applyAction = () => {
    if (!action || selectedSlots.length === 0) {
      showSnack("Select slots and action first", "warning");
      return;
    }
    setSlots((prev) => {
      let updated = [...prev];
      selectedSlots.forEach((time) => {
        const exists = updated.find(
          (s) => s.time === time && s.artist === selectedArtist,
        );
        if (!exists) {
          updated.push({ time, status: action, artist: selectedArtist });
        } else {
          updated = updated.map((s) =>
            s.time === time && s.artist === selectedArtist
              ? { ...s, status: action }
              : s,
          );
        }
      });
      return updated;
    });
    setSelectedSlots([]);
    setAction("");
    showSnack("Slots updated");
  };

  const saveSlots = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, artist: selectedArtist, slots }),
      });
      showSnack("Slots saved successfully");
    } catch {
      showSnack("Error saving slots", "error");
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/artists`)
      .then((res) => res.json())
      .then((data) => {
        setArtists(data);

        if (data.length > 0) {
          setSelectedArtist(data[0]._id);
        }
      });
  }, []);

  return (
    <div className="space-y-5">
      <h2 className="text-slate-800 font-bold text-xl">Manage Time Slots</h2>

      {/* Date + Load */}
      <h3 className="font-semibold mb-2">Select Artist</h3>

      <div className="flex gap-2 flex-wrap mb-4">
        {artists.map((a) => (
          <div
            key={a._id}
            onClick={() => setSelectedArtist(a._id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer ${
              selectedArtist === a._id ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            <img src={a.image} className="w-6 h-6 rounded-full" />
            <span>{a.name}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
        />
        <button
          onClick={loadData}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 transition-all"
        >
          Load Slots
        </button>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {TIMES.map((time) => {
          const finalStatus = getFinalStatus(time);
          const isSelected = selectedSlots.includes(time);
          const booked = finalStatus === "booked";

          let cls =
            "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"; // available
          if (booked)
            cls =
              "bg-red-50 border-red-200 text-red-500 cursor-not-allowed opacity-75";
          if (isSelected)
            cls =
              "bg-amber-50 border-amber-300 text-amber-700 ring-2 ring-amber-300";

          return (
            <button
              key={time}
              onClick={() => toggleSelect(time)}
              disabled={booked}
              className={`px-2 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all active:scale-95 ${cls}`}
            >
              <div>{time}</div>
              <div className="text-[10px] opacity-70 mt-0.5">
                {booked ? "Booked" : isSelected ? "Selected" : "Available"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      {selectedSlots.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
          <p className="text-slate-600 text-sm font-medium">
            {selectedSlots.join(", ")}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAction("booked")}
              className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${action === "booked" ? "bg-red-500 text-white border-red-500" : "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"}`}
            >
              Booked
            </button>
            <button
              onClick={() => setAction("available")}
              className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${action === "available" ? "bg-emerald-500 text-white border-emerald-500" : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"}`}
            >
              Available
            </button>
            <button
              onClick={applyAction}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Save */}
      <button
        onClick={saveSlots}
        className="px-6 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 transition-all shadow shadow-slate-300"
      >
        Save Slots
      </button>

      {/* Toast */}
      {snack.open && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-medium shadow-xl
          ${snack.severity === "error" ? "bg-red-500 text-white" : snack.severity === "warning" ? "bg-amber-500 text-white" : "bg-slate-800 text-white"}`}
        >
          {snack.message}
        </div>
      )}
    </div>
  );
}
