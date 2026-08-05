import { useState } from 'react';
import Login from './Login';
import Contactos from './Contactos';

function App() {
  const [logueado, setLogueado] = useState(false);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Agenda Electrónica</h1>
      {!logueado ? (
        <Login onLoginExitoso={() => setLogueado(true)} />
      ) : (
        <Contactos />
      )}
    </div>
  );
}

export default App;