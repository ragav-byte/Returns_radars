import React, { useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import login_img from "./login_img.png";
import "./Login.css";

function getFriendlyError(error) {
  const code = error?.code || "";

  if (code.includes("invalid-credential")) {
    return "Those credentials do not match our records. Please check them and try again.";
  }

  if (code.includes("email-already-in-use")) {
    return "That email is already registered. Try logging in instead.";
  }

  if (code.includes("weak-password")) {
    return "Use a stronger password with at least six characters.";
  }

  if (code.includes("network-request-failed")) {
    return "We could not reach Firebase. Check your internet connection and try again.";
  }

  return error?.message || "Something went wrong. Please try again.";
}

export default function Login({ authError = "" }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const helperCopy = useMemo(
    () =>
      isSignup
        ? {
            title: "Create your ReturnsRadar account",
            subtitle:
              "Start tracking return requests and customer outcomes from one clean workspace.",
            submit: "Create account",
            switchLabel: "Already have an account?",
            switchAction: "Sign in",
          }
        : {
            title: "Sign in to ReturnsRadar",
            subtitle:
              "Review requests, inspect product evidence, and keep return decisions moving.",
            submit: "Sign in",
            switchLabel: "Need an account?",
            switchAction: "Create one",
          },
    [isSignup]
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        const uid = userCredential.user.uid;

        await setDoc(
          doc(db, "users", uid),
          {
            email: email.trim(),
            role: "user",
          },
          { merge: true }
        );
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (loginError) {
      setError(getFriendlyError(loginError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-panel">
        <div className="login-panel__content">
          <p className="login-eyebrow">ReturnsRadar</p>
          <h1 className="login-title">{helperCopy.title}</h1>
          <p className="login-subtitle">{helperCopy.subtitle}</p>

          {(error || authError) && (
            <div className="login-alert">{error || authError}</div>
          )}

          <form className="login-form" onSubmit={handleLogin}>
            <label className="field-group">
              <span>Email address</span>
              <input
                className="input-field"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="field-group">
              <span>Password</span>
              <div className="password-row">
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <button className="primary-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Working..." : helperCopy.submit}
            </button>
          </form>

          <p className="login-switch">
            {helperCopy.switchLabel}
            <button
              className="signup-btn"
              type="button"
              onClick={() => {
                setIsSignup((value) => !value);
                setError("");
              }}
            >
              {helperCopy.switchAction}
            </button>
          </p>
        </div>
      </section>

      <section className="login-hero">
        <div className="login-hero__copy">
          <p className="login-hero__eyebrow">Operations clarity</p>
          <h2>
            Better return decisions, less manual back-and-forth, and a cleaner
            view of what is happening.
          </h2>
          <p>
            Review customer requests, inspect product history, and keep your
            support workflow moving without losing the bigger picture.
          </p>
        </div>
        <img
          className="login-image"
          src={login_img}
          alt="ReturnsRadar dashboard preview"
        />
      </section>
    </div>
  );
}
