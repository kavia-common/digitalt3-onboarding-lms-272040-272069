import React from "react";
/**
 * Admin dashboard scaffold.
 */
export default function AdminDashboard() {
  return (
    <section>
      <h2 className="lms-title" tabIndex={0}>Admin Dashboard</h2>
      <div className="lms-card" role="region" aria-label="Admin Portal">
        <p>View cohort progress, approve projects, manage users and content.</p>
      </div>
    </section>
  );
}
