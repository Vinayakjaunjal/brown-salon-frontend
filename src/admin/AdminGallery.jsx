import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [category, setCategory] = useState("work");

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
    setTimeout(() => setSnack((s) => ({ ...s, open: false })), 3000);
  };

  const loadGallery = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`);
    const data = await res.json();
    setImages(data);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const uploadImage = async () => {
    if (!files.length) return;

    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append("image", files[i]);
      fd.append("category", category); // ✅ FIXED

      await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`, {
        method: "POST",
        body: fd,
      });
    }

    setFiles([]);
    loadGallery();
  };

  const deleteImage = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/gallery/${deleteId}`, {
      method: "DELETE",
    });
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
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="work">Work</option>
            <option value="bts">BTS</option>
            <option value="ambience">Ambience</option>
          </select>
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
          <svg
            className="w-10 h-10 opacity-30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
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
                        className="relative group rounded-xl overflow-hidden border shadow-sm"
                      >
                        <img
                          src={img.image}
                          className="w-full object-cover"
                          style={{ height: 270 }}
                        />

                        {/* CATEGORY EDIT */}
                        <select
                          value={img.category || "work"}
                          onChange={async (e) => {
                            const newCategory = e.target.value;

                            await fetch(
                              `${import.meta.env.VITE_API_URL}/api/gallery/${img._id}/category`,
                              {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ category: newCategory }),
                              },
                            );

                            loadGallery();
                          }}
                          className="absolute bottom-2 left-2 text-xs bg-white px-2 py-1 rounded shadow"
                        >
                          <option value="work">Work</option>
                          <option value="bts">BTS</option>
                          <option value="ambience">Ambience</option>
                        </select>

                        {/* DELETE */}
                        <button
                          onClick={() => deleteImage(img._id)}
                          className="absolute top-2 right-2 bg-white p-1 rounded shadow"
                        >
                          ❌
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-sm rounded-2xl p-6 shadow-2xl animate-[fadeIn_0.25s_ease]">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Image
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this image? This action cannot be
              undone.
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {snack.open && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-sm font-medium shadow-xl transition-all duration-300 ${
            snack.severity === "error"
              ? "bg-red-500 text-white"
              : "bg-black text-white"
          }`}
        >
          {snack.message}
        </div>
      )}
    </div>
  );
}
