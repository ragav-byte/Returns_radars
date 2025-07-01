// MainApp.js
import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel'; // if you’ve made it
import { auth } from "./firebase/config";

import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // assuming db is initialized

const MainApp = () => {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role); // assuming role is stored
        }
      }
    };
    fetchRole();
  }, [user]);

  const handleLogout = () => {
    auth.signOut();
  };

  if (loading || (user && !role)) return <p>Loading...</p>;
  if (!user) return <p>Please log in</p>;

  return role === "admin" ? (
    <AdminPanel user={user} onLogout={handleLogout} />
  ) : (
    <Dashboard user={user} onLogout={handleLogout} />
  );
};

export default MainApp;
