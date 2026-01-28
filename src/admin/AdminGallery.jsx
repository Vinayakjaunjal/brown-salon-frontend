import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Snackbar
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Delete Dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const closeSnack = () => {
    setSnack({ ...snack, open: false });
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
    if (!file) {
      showSnack("Select image first", "error");
      return;
    }

    const fd = new FormData();
    fd.append("image", file);

    await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`, {
      method: "POST",
      body: fd,
    });

    setFile(null);
    loadGallery();
    showSnack("Image uploaded successfully");
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
    <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", p: isMobile ? 2 : 3 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Gallery Management
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <Button
            variant="contained"
            onClick={uploadImage}
            fullWidth={isMobile}
          >
            Upload
          </Button>
        </Box>
      </Paper>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="gallery" direction="horizontal">
          {(provided) => (
            <Grid
              container
              spacing={isMobile ? 1.5 : 2}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {images.map((img, index) => (
                <Draggable key={img._id} draggableId={img._id} index={index}>
                  {(provided) => (
                    <Grid
                      item
                      xs={6}
                      sm={4}
                      md={3}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Paper
                        sx={{
                          p: 0.5,
                          position: "relative",
                          borderRadius: 2,
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL}${img.image}`}
                          alt=""
                          style={{
                            width: "100%",
                            height: isMobile ? 120 : 180,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />

                        <IconButton
                          size="small"
                          onClick={() => deleteImage(img._id)}
                          sx={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            bgcolor: "#fff",
                            boxShadow: 1,
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>

      {images.length === 0 && (
        <Typography mt={3} color="text.secondary">
          No images uploaded
        </Typography>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={closeSnack}
          severity={snack.severity}
          elevation={6}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </MuiAlert>
      </Snackbar>

      {/* Delete Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 2, m: 1 } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          Are you sure you want to delete this image?
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
