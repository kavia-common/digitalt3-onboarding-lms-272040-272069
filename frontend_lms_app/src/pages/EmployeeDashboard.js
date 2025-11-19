import React from "react";

/**
 * Employee dashboard scaffold.
 */
export default function EmployeeDashboard() {
  return (
    <section>
      <h2 className="lms-title" tabIndex={0}>Employee Dashboard</h2>
      <div className="lms-card" role="region" aria-label="Learning Progress">
        <p>Welcome! View your progress, start new modules, and track your onboarding journey here.</p>
      </div>
    </section>
  );
}
