import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import ReturnHistory from "./components/ReturnHistory";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {!user && !showSignup && (
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
        )}
        {!user && showSignup && (
          <Route
            path="/"
            element={<Signup onSignupSuccess={() => setShowSignup(false)} />}
          />
        )}

        {/* Authenticated User Routes */}
        {user && user.role === "admin" && (
          <>
            <Route
              path="/"
              element={<AdminPanel user={user} onLogout={handleLogout} />}
            />
            <Route
              path="/return-history"
              element={<ReturnHistory user={user} />}
            />
          </>
        )}

        {user && user.role === "user" && (
          <>
            <Route
              path="/"
              element={<Dashboard user={user} onLogout={handleLogout} />}
            />
            <Route
              path="/return-history"
              element={<ReturnHistory user={user} />}
            />
          </>
        )}

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
