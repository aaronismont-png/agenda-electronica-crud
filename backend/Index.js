const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./db');

const app = express();

// Función para formatear fecha a formato legible (dd/mm/aaaa hh:mm)
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});

// Ruta de prueba de conexión a Supabase
app.get('/test-db', async (req, res) => {
  const { data, error } = await supabase.from('test').select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ mensaje: 'Conexión exitosa a Supabase', data });
});

// Ruta para agregar un contacto (Create)
app.post('/contactos', async (req, res) => {
  const { nombre, telefono, email } = req.body;

  const { data, error } = await supabase
    .from('contactos')
    .insert([{ nombre, telefono, email }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data && data[0]) {
  data[0].created_at = formatearFecha(data[0].created_at);
}

  res.status(201).json({ mensaje: 'Contacto agregado con éxito', data });
});

// Ruta para editar un contacto (Update)
app.put('/contactos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, email } = req.body;

  const { data, error } = await supabase
    .from('contactos')
    .update({ nombre, telefono, email })
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }

  res.json({ mensaje: 'Contacto actualizado con éxito', data });
});

// Ruta para eliminar un contacto (Delete)
app.delete('/contactos/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('contactos')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }

  res.json({ mensaje: 'Contacto eliminado con éxito', data });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});