import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/contactos';

function Contactos() {
  const [contactos, setContactos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const cargarContactos = async () => {
    try {
      const res = await axios.get(API_URL);
      setContactos(res.data.data || res.data);
    } catch (err) {
      console.log('Error al cargar contactos', err);
    }
  };

  useEffect(() => {
    cargarContactos();
  }, []);

  const limpiarFormulario = () => {
    setNombre('');
    setTelefono('');
    setEmail('');
    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!nombre || !telefono || !email) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }

    try {
      if (editandoId) {
        await axios.put(`${API_URL}/${editandoId}`, { nombre, telefono, email });
        setMensaje('Contacto actualizado con éxito');
      } else {
        await axios.post(API_URL, { nombre, telefono, email });
        setMensaje('Contacto agregado con éxito');
      }
      limpiarFormulario();
      cargarContactos();
    } catch (err) {
      setMensaje('Error al guardar el contacto');
    }
  };

  const handleEditar = (contacto) => {
    setNombre(contacto.nombre);
    setTelefono(contacto.telefono);
    setEmail(contacto.email);
    setEditandoId(contacto.id);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMensaje('Contacto eliminado con éxito');
      cargarContactos();
    } catch (err) {
      setMensaje('Error al eliminar el contacto');
    }
  };

  return (
    <div>
      <h2>Contactos</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre: </label>
          <input
            type="text"
            data-testid="input-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Teléfono: </label>
          <input
            type="text"
            data-testid="input-telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Email: </label>
          <input
            type="email"
            data-testid="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" data-testid="btn-guardar" style={{ marginTop: '10px' }}>
          {editandoId ? 'Actualizar' : 'Agregar'}
        </button>
        {editandoId && (
          <button type="button" onClick={limpiarFormulario} style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        )}
      </form>

      {mensaje && <p data-testid="mensaje">{mensaje}</p>}

      <table style={{ marginTop: '20px', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nombre</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Teléfono</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contactos.map((c) => (
            <tr key={c.id} data-testid={`fila-contacto-${c.id}`}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{c.nombre}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{c.telefono}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{c.email}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <button data-testid={`btn-editar-${c.id}`} onClick={() => handleEditar(c)}>
                  Editar
                </button>
                <button
                  data-testid={`btn-eliminar-${c.id}`}
                  onClick={() => handleEliminar(c.id)}
                  style={{ marginLeft: '5px' }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Contactos;