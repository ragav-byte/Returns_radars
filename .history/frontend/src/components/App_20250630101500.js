// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import ReturnHistory from "./components/ReturnHistory"; // 👈 Make sure this exists

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogout = () => setUser(null);

  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route
              path="/signup"
              element={<Signup onSignupSuccess={() => setShowSignup(false)} />}
            />
            <Route
              path="/"
              element={
                <>
                  <Login onLoginSuccess={(userData) => setUser(userData)} />
                  <p>
                    Don’t have an account?{" "}
                    <button onClick={() => setShowSignup(true)}>Sign up</button>
                  </p>
                </>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : user.role === "admin" ? (
          <>
            <Route path="/" element={<AdminPanel user={user} onLogout={handleLogout} />} />
            <Route path="/history" element={<ReturnHistory user={user} />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} />} />
            <Route path="/history" element={<ReturnHistory user={user} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
