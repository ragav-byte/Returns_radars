// App.js
import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return showSignup ? (
      <Signup onSignupSuccess={() => setShowSignup(false)} />
    ) : (
      <>
        <Login onLoginSuccess={(userData) => setUser(userData)} />
        <p>
          Don’t have an account?{" "}
          <button onClick={() => setShowSignup(true)}>Sign up</button>
        </p>
      </>
    );
  }

  return user.role === "admin" ? (
    <AdminPanel user={user} onLogout={handleLogout} />
  ) : (
    <Dashboard user={user} onLogout={handleLogout} />
  );
}

export default App;
