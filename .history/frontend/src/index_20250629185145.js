import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard'; // or use AdminPanel instead
import './index.css'; // optional if you have styling

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Dashboard user={{ email: 'ragav@user.com' }} onLogout={() => alert('Logged out')} />
  </React.StrictMode>
);
