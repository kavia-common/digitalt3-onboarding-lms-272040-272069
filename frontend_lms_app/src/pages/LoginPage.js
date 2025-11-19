import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

/**
 * Supabase-powered login page with sign-out support if already signed in.
 */
export default function LoginPage() {
  const { signIn, signOut, isAuthenticated, user, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(form.email, form.password);
      // Successful login will redirect via route guard
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="lms-login-wrapper">
      <div className="lms-login-card" role="form" aria-label="Login Form">
        <h1 className="lms-title" tabIndex={0}>Welcome to DigitalT3 Onboarding</h1>
        <p className="lms-desc" tabIndex={0}>
          Sign in to access your employee learning dashboard.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="lms-label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="lms-input"
            autoComplete="username"
            required
            value={form.email}
            onChange={handleChange}
            disabled={submitting}
          />
          <label htmlFor="password" className="lms-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="lms-input"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={handleChange}
            disabled={submitting}
          />
          <button
            type="submit"
            className="lms-btn lms-btn-primary"
            aria-label="Login"
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
          {error && (
            <div
              style={{ color: "#EF4444", marginTop: "1rem", fontSize: "1rem" }}
              role="alert"
              aria-live="polite"
              tabIndex={-1}
            >
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
