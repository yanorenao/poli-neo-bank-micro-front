/**
 * Punto de entrada del Shell (Host) de Module Federation.
 * Lógica: Monta la App principal con React.StrictMode en el elemento #root.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
