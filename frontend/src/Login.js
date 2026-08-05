import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginExitoso }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/login', {
        usuario,
        contrasena,
      });
      console.log(res.data);
      onLoginExitoso();
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Usuario: </label>
          <input
            type="text"
            data-testid="input-usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Contraseña: </label>
          <input
            type="password"
            data-testid="input-contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>
        <button type="submit" data-testid="btn-login" style={{ marginTop: '10px' }}>
          Ingresar
        </button>
      </form>
      {error && <p data-testid="error-login" style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;