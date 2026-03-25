import React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import { MenuItem } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  const [editId, setEditId] = useState(null);

  const API = `${import.meta.env.VITE_API_URL}/api/services`;

  const loadServices = async () => {
    const res = await fetch(API);
    const data = await res.json();

    console.log("SERVICES API:", data);

    setServices(data);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveService = async () => {
    const url = editId ? `${API}/${editId}` : API;

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);

    if (form.image) {
      formData.append("image", form.image);
    }

    await fetch(url, {
      method: editId ? "PUT" : "POST",
      body: formData,
    });

    setForm({
      title: "",
      description: "",
      price: "",
      category: "",
      image: null,
    });

    setEditId(null);

    loadServices();
  };

  const editService = (s) => {
    setForm({
      title: s.title,
      description: s.description,
      price: s.price,
      category: s.category,
      image: null,
    });

    setEditId(s._id);
  };

  const deleteService = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    loadServices();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>
        Services Management
      </Typography>

      {/* FORM */}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography mb={2}>
          {editId ? "Edit Service" : "Add Service"}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            name="title"
            label="Service Title"
            value={form.title}
            onChange={handleChange}
          />
          <TextField
            name="description"
            label="Description"
            value={form.description}
            onChange={handleChange}
          />
          <TextField
            name="price"
            label="Price"
            type="number"
            value={form.price}
            onChange={handleChange}
          />

          <TextField
            select
            name="category"
            label="Category"
            value={form.category}
            onChange={handleChange}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="Mens">Mens</MenuItem>
            <MenuItem value="Womens">Womens</MenuItem>
            <MenuItem value="Skin Treatment">Skin Treatment</MenuItem>
            <MenuItem value="Hair Treatment">Hair Treatment</MenuItem>
          </TextField>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({
                ...form,
                image: e.target.files[0],
              })
            }
          />
          <Button variant="contained" onClick={saveService}>
            {editId ? "Update" : "Add"}
          </Button>
        </Box>
      </Paper>

      {/* TABLE */}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {services.map((s) => (
              <TableRow key={s._id}>
                <TableCell>
                  {s.image && (
                    <img
                      src={s.image}
                      width="60"
                      style={{ borderRadius: 6, objectFit: "cover" }}
                    />
                  )}
                </TableCell>

                <TableCell>{s.title}</TableCell>

                <TableCell>{s.description}</TableCell>

                <TableCell>₹{s.price}</TableCell>

                <TableCell>{s.category}</TableCell>

                <TableCell>
                  <IconButton onClick={() => editService(s)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => deleteService(s._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
