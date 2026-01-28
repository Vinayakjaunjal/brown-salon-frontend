import { useEffect, useState } from "react";

export default function Admin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 🔐 SIMPLE ADMIN PROTECTION
    const isAdmin = localStorage.getItem("isAdmin");

    if (!isAdmin) {
      window.location.href = "/admin-login";
      return;
    }

    // 📥 Fetch appointments
    fetch(`${import.meta.env.BACKEND_URL}/api/appointments`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => alert("Failed to load appointments"));
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`${import.meta.env.BACKEND_URL}/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setData((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status } : item)),
    );
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
            <b>{app.name}</b> — {app.date} — {app.time}
          </p>
          <p>
            Status: <b>{app.status}</b>
          </p>

          <button onClick={() => updateStatus(app._id, "approved")}>
            Approve
          </button>
          <button onClick={() => updateStatus(app._id, "rejected")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
