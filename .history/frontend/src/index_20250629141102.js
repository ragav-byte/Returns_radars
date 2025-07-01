import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './MainApp'; // this will handle role switching
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
