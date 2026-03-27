import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
    setTimeout(() => setSnack((s) => ({ ...s, open: false })), 3000);
  };

  const loadGallery = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`);
    const data = await res.json();
    setImages(data);
  };

  useEffect(() => { loadGallery(); }, []);

  const uploadImage = async () => {
    if (!file) { showSnack("Select image first", "error"); return; }
    const fd = new FormData();
    fd.append("image", file);
    await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`, { method: "POST", body: fd });
    setFile(null);
    loadGallery();
    showSnack("Image uploaded successfully");
  };

  const deleteImage = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/gallery/${deleteId}`, { method: "DELETE" });
    setConfirmOpen(false);
    setDeleteId(null);
    loadGallery();
    showSnack("Image deleted successfully");
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(images);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setImages(items);
    await fetch(`${import.meta.env.VITE_API_URL}/api/gallery/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-slate-800 font-bold text-xl">Gallery Management</h2>

      {/* Upload */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
          />
          <button
            onClick={uploadImage}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow shadow-indigo-200 hover:from-indigo-600 hover:to-violet-700 transition-all"
          >
            Upload
          </button>
        </div>
      </div>

      {/* Gallery Grid with DnD */}
      {images.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 flex flex-col items-center gap-2 text-slate-400">
          <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">No images uploaded</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="gallery" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
              >
                {images.map((img, index) => (
                  <Draggable key={img._id} draggableId={img._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative group rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL}${img.image}`}
                          alt=""
                          className="w-full object-cover rounded-2xl"
                          style={{ height: 150 }}
                        />
                        <button
                          onClick={() => deleteImage(img._id)}
                          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-xl shadow flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Confirm Delete Dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-10">
            <h3 className="text-slate-800 font-bold text-base mb-2">Confirm Delete</h3>
            <p className="text-slate-500 text-sm mb-5">Are you sure you want to delete this image?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {snack.open && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-medium shadow-xl ${snack.severity === "error" ? "bg-red-500 text-white" : "bg-slate-800 text-white"}`}>
          {snack.message}
        </div>
      )}
    </div>
  );
}
