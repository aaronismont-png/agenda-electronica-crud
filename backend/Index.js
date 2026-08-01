const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./db');

const app = express();
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

  res.status(201).json({ mensaje: 'Contacto agregado con éxito', data });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});