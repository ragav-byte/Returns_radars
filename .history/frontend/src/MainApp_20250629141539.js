// MainApp.js
import React from 'react';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import { auth, db } from "./firebase/config";
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';

const MainApp = () => {
  const [user, loading, error] = useAuthState(auth); // ✅ valid hook usage

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!user) return <p>Please log in</p>;

  return (
    <>
      {user.email === "admin@example.com" ? (
        <AdminPanel />
      ) : (
        <Dashboard />
      )}
    </>
  );
};

export default MainApp;
