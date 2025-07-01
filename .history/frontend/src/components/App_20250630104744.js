// App.js
import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import ReturnHistory from "./components/ReturnHistory";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("dashboard");
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

  // Admin Panel
  if (user.role === "admin") {
    return <AdminPanel user={user} onLogout={handleLogout} />;
  }

  // User Panel
  return (
    <>
      <div>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => setCurrentPage("dashboard")}>🏠 Dashboard</button>
        <button onClick={() => setCurrentPage("history")}>📜 Return History</button>
      </div>

      {currentPage === "dashboard" && <Dashboard user={user} />}
      {currentPage === "history" && <ReturnHistory user={user} />}
    </>
  );
}

export default App;
