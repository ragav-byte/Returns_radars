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
        {/* Login or Signup Route */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} />
            ) : showSignup ? (
              <Signup onSignupSuccess={() => setShowSignup(false)} />
            ) : (
              <>
                <Login onLoginSuccess={(userData) => setUser(userData)} />
                <p>
                  Don’t have an account?{" "}
                  <button onClick={() => setShowSignup(true)}>Sign up</button>
                </p>
              </>
            )
          }
        />

        {/* Admin Panel Route */}
        <Route
          path="/admin"
          element={
            user && user.role === "admin" ? (
              <AdminPanel user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* User Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            user && user.role === "user" ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Return History Route */}
        <Route
          path="/return-history"
          element={
            user ? (
              <ReturnHistory user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
