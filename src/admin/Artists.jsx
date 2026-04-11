import React, { useEffect, useState } from "react";

const getInitials = (name = "") => {
  const w = name.trim().split(" ");
  return w.length === 1
    ? w[0][0]?.toUpperCase()
    : w[0][0]?.toUpperCase() + w[w.length - 1][0]?.toUpperCase();
};

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [form, setForm] = useState({ name: "", type: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const API = import.meta.env.VITE_API_URL;

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
    setTimeout(() => setSnack((s) => ({ ...s, open: false })), 3000);
  };

  const loadArtists = async () => {
    const res = await fetch(`${API}/api/artists`);
    const data = await res.json();
    setArtists(data);
  };

  useEffect(() => {
    loadArtists();
  }, []);

  const saveArtist = async () => {
    if (!form.name || !form.type) {
      showSnack("Name & type required", "error");
      return;
    }
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("type", form.type);
    if (image) fd.append("image", image);

    const url = editId ? `${API}/api/artists/${editId}` : `${API}/api/artists`;
    await fetch(url, { method: editId ? "PUT" : "POST", body: fd });

    setForm({ name: "", type: "" });
    setImage(null);
    setEditId(null);
    setPreview(null);
    loadArtists();
    showSnack(editId ? "Artist updated" : "Artist added");
  };

  const editArtist = (a) => {
    setForm({ name: a.name, type: a.type });
    setEditId(a._id);
    if (a.image) setPreview(`${API}${a.image}`);
  };

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await fetch(`${API}/api/artists/${deleteId}`, { method: "DELETE" });
    setConfirmOpen(false);
    setDeleteId(null);
    loadArtists();
    showSnack("Artist deleted");
  };

  const toggleArtist = async (id) => {
    await fetch(`${API}/api/artists/${id}/toggle`, { method: "PUT" });
    loadArtists();
    showSnack("Status updated");
  };

  return (
    <div className="space-y-5">
      <h2 className="text-slate-800 font-bold text-xl">Artists Management</h2>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex flex-wrap gap-3">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="flex-1 min-w-[140px] px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
          <input
            placeholder="Type (Gents / Ladies / Unisex)"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="flex-1 min-w-[200px] px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files[0];
              setImage(f);
              if (f) setPreview(URL.createObjectURL(f));
            }}
            className="text-sm text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer self-center"
          />
          {preview && (
            <img
              src={preview}
              alt=""
              className="w-10 h-10 rounded-full object-cover self-center border border-slate-200"
            />
          )}
          <button
            onClick={saveArtist}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 transition-all"
          >
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setForm({ name: "", type: "" });
                setPreview(null);
                setImage(null);
              }}
              className="px-4 py-2.5 bg-slate-100 text-slate-500 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {artists.map((a) => (
          <div
            key={a._id}
            className="flex justify-between items-center px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              {a.image ? (
                <img
                  src={a.image}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-600">
                  {getInitials(a.name)}
                </div>
              )}
              <div>
                <p className="text-slate-700 font-semibold text-sm">{a.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">{a.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleArtist(a._id)}
                className={`relative w-11 h-6 rounded-full transition-colors ${a.isActive ? "bg-indigo-500" : "bg-slate-200"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${a.isActive ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
              <button
                onClick={() => editArtist(a)}
                className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => askDelete(a._id)}
                className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {artists.length === 0 && (
          <p className="text-center py-12 text-slate-400 text-sm">
            No artists yet
          </p>
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {artists.map((a) => (
          <div
            key={a._id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              {a.image ? (
                <img
                  src={a.image}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-600 shrink-0">
                  {getInitials(a.name)}
                </div>
              )}
              <div>
                <p className="text-slate-700 font-semibold text-sm">{a.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">{a.type}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => toggleArtist(a._id)}
                className={`relative w-11 h-6 rounded-full transition-colors ${a.isActive ? "bg-indigo-500" : "bg-slate-200"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${a.isActive ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => editArtist(a)}
                  className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-400 hover:bg-indigo-100 flex items-center justify-center"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => askDelete(a._id)}
                  className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-10">
            <h3 className="text-slate-800 font-bold text-base mb-2">
              Confirm Delete
            </h3>
            <p className="text-slate-500 text-sm mb-5">
              Are you sure you want to delete this artist?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {snack.open && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-medium shadow-xl ${snack.severity === "error" ? "bg-red-500 text-white" : "bg-slate-800 text-white"}`}
        >
          {snack.message}
        </div>
      )}
    </div>
  );
}
