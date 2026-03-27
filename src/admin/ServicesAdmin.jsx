import React, { useEffect, useState } from "react";

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "", image: null });
  const [editId, setEditId] = useState(null);

  const API = `${import.meta.env.VITE_API_URL}/api/services`;

  const loadServices = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setServices(data);
  };

  useEffect(() => { loadServices(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveService = async () => {
    const url = editId ? `${API}/${editId}` : API;
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    if (form.image) formData.append("image", form.image);
    await fetch(url, { method: editId ? "PUT" : "POST", body: formData });
    setForm({ title: "", description: "", price: "", category: "", image: null });
    setEditId(null);
    loadServices();
  };

  const editService = (s) => {
    setForm({ title: s.title, description: s.description, price: s.price, category: s.category, image: null });
    setEditId(s._id);
  };

  const deleteService = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadServices();
  };

  return (
    <div className="space-y-5">
      <h2 className="text-slate-800 font-bold text-xl">Services Management</h2>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-slate-600 font-semibold text-sm mb-4">{editId ? "Edit Service" : "Add Service"}</p>
        <div className="flex flex-wrap gap-3">
          <input
            name="title"
            placeholder="Service Title"
            value={form.title}
            onChange={handleChange}
            className="flex-1 min-w-[160px] px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="flex-1 min-w-[160px] px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-28 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="min-w-[160px] px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all cursor-pointer"
          >
            <option value="">Category</option>
            <option value="Mens">Mens</option>
            <option value="Womens">Womens</option>
            <option value="Skin Treatment">Skin Treatment</option>
            <option value="Hair Treatment">Hair Treatment</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            className="text-sm text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer self-center"
          />
          <button
            onClick={saveService}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 transition-all"
          >
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button
              onClick={() => { setEditId(null); setForm({ title: "", description: "", price: "", category: "", image: null }); }}
              className="px-5 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-100">
              {["Image", "Title", "Description", "Price", "Category", "Actions"].map((h) => (
                <th key={h} className="text-left text-slate-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {services.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">No services yet</td></tr>
            ) : services.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50/40 transition-colors">
                <td className="px-5 py-3">
                  {s.image && <img src={s.image} width="60" className="rounded-xl object-cover" style={{ height: 50 }} />}
                </td>
                <td className="px-5 py-3 text-slate-700 text-sm font-medium">{s.title}</td>
                <td className="px-5 py-3 text-slate-500 text-sm max-w-[180px] truncate">{s.description}</td>
                <td className="px-5 py-3 text-slate-700 text-sm font-semibold">₹{s.price}</td>
                <td className="px-5 py-3">
                  <span className="px-2.5 py-1 bg-violet-50 text-violet-600 text-xs font-semibold rounded-lg">{s.category}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => editService(s)} className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 flex items-center justify-center transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => deleteService(s._id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {services.map((s) => (
          <div key={s._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-3">
            {s.image && <img src={s.image} className="w-14 h-14 rounded-xl object-cover shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="text-slate-700 font-semibold text-sm">{s.title}</p>
                <span className="text-slate-700 font-bold text-sm ml-2 shrink-0">₹{s.price}</span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5 truncate">{s.description}</p>
              <span className="inline-block mt-1.5 px-2 py-0.5 bg-violet-50 text-violet-600 text-xs font-semibold rounded-md">{s.category}</span>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => editService(s)} className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-400 hover:bg-indigo-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => deleteService(s._id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
