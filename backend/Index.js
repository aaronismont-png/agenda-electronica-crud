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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});