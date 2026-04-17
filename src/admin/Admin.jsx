import React from "react";
import { useEffect, useState } from "react";

export default function Admin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");

    if (!isAdmin) {
      window.location.href = "/admin-login";
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/all`)
      .then((res) => res.json())
      .then((res) => {
        console.log("ADMIN BOOKINGS:", res);
        const finalData = Array.isArray(res)
          ? res
          : Array.isArray(res.data)
            ? res.data
            : [];
        setData(finalData);
      })
      .catch(() => alert("Failed to load appointments"));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      const data = await res.json();
      console.log("UPDATED:", data);

      setData((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item)),
      );
    } catch (err) {
      console.log("UPDATE ERROR:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/admin-login";
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel – Appointments</h2>
      <button onClick={logout}>Logout</button>

      {data.map((app) => (
        <div
          key={app._id}
          style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
        >
          <p>
            <b>{app.serviceName}</b> — {app.date} — {app.time}
          </p>
          <p>
            Status: <b>{app.status}</b>
          </p>

          <button onClick={() => updateStatus(app._id, "completed")}>
            Completed
          </button>
          <button onClick={() => updateStatus(app._id, "cancelled")}>
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}
