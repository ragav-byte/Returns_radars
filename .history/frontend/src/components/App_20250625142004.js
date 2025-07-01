import Dashboard from "./Dashboard";
import AdminPanel from "./AdminPanel"; // (we’ll build next)

// hardcoded role for now — later fetch from Firestore
const userRole = "user"; // or "admin"

if (user) {
  return userRole === "admin"
    ? <AdminPanel user={user} onLogout={handleLogout} />
    : <Dashboard user={user} onLogout={handleLogout} />;
}
