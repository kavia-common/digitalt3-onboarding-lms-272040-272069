import React from "react";

/**
 * Login page scaffold.
 */
export default function LoginPage() {
  return (
    <div className="lms-login-wrapper">
      <div className="lms-login-card" role="form" aria-label="Login Form">
        <h1 className="lms-title" tabIndex={0}>Welcome to DigitalT3 Onboarding</h1>
        <p className="lms-desc" tabIndex={0}>
          Sign in to access your employee learning dashboard.
        </p>
        <form>
          <label htmlFor="email" className="lms-label">Email</label>
          <input id="email" type="email" className="lms-input" autoComplete="username" />
          <label htmlFor="password" className="lms-label">Password</label>
          <input id="password" type="password" className="lms-input" autoComplete="current-password" />
          <button type="submit" className="lms-btn lms-btn-primary" aria-label="Login">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
