import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Login({ onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        // 🔥 Create a new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Create a default Firestore document for user
        const defaultUserData = {
          email,
          role: "user", // or "admin" if testing admin dashboard
        };

        await setDoc(doc(db, "users", uid), defaultUserData);
        onLoginSuccess({ uid, ...defaultUserData });

      } else {
        // ✅ Login existing user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        const userDoc = await getDoc(doc(db, "users", uid));
        const userData = userDoc.data();

        onLoginSuccess({ uid, ...userData });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br />

      <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>

      <p style={{ marginTop: "10px" }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button type="button" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Login" : "Sign Up"}
        </button>
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
