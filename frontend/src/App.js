import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import { auth, db } from "./firebase/config";

const DEFAULT_ROLE = "user";

async function loadUserProfile(currentUser) {
  const userRef = doc(db, "users", currentUser.uid);
  const userSnapshot = await getDoc(userRef);

  if (userSnapshot.exists()) {
    const profile = userSnapshot.data();
    return {
      uid: currentUser.uid,
      email: profile.email || currentUser.email || "",
      role: profile.role || DEFAULT_ROLE,
    };
  }

  const fallbackProfile = {
    email: currentUser.email || "",
    role: DEFAULT_ROLE,
  };

  await setDoc(userRef, fallbackProfile, { merge: true });

  return {
    uid: currentUser.uid,
    ...fallbackProfile,
  };
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isActive = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthError("");

      if (!currentUser) {
        if (isActive) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const resolvedUser = await loadUserProfile(currentUser);

        if (isActive) {
          setUser(resolvedUser);
        }
      } catch (error) {
        console.error("Unable to load the signed-in user profile.", error);

        if (isActive) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email || "",
            role: DEFAULT_ROLE,
          });
          setAuthError(
            "We signed you in, but your profile could not be fully loaded. Default access was applied."
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setAuthError("");
    setIsSigningOut(true);

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out failed.", error);
      setAuthError("We could not sign you out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <div className="app-loading-card">
          <p className="app-kicker">ReturnsRadar</p>
          <h1>Loading your workspace</h1>
          <p>Checking your session and preparing the right dashboard.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login authError={authError} />;
  }

  return (
    <div className="app-shell">
      {authError ? <div className="app-banner">{authError}</div> : null}
      {user.role === "admin" ? (
        <AdminPanel
          user={user}
          onLogout={handleLogout}
          isSigningOut={isSigningOut}
        />
      ) : (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          isSigningOut={isSigningOut}
        />
      )}
    </div>
  );
}
