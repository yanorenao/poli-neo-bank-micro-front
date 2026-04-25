import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: 24, fontFamily: 'sans-serif', color: '#374151' }}>
      <p>Remote Transfer — cargado como standalone.</p>
      <p style={{ fontSize: 12, color: '#6b7280' }}>
        Este remote se consume desde el Shell en localhost:5173.
      </p>
    </div>
  </React.StrictMode>
);
