import React, { useEffect, useState } from "react";
import {
  getAdminDashboardData,
  type AdminUser,
  type ModuleTrack,
  type Submission,
} from "../services/mockLmsData";

/**
 * Admin Dashboard main page for user, module, submission management.
 * Accessible, Ocean Professional theme, responsive (sidebar + main).
 */
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    let mounted = true;
    getAdminDashboardData().then((data) => {
      if (mounted) {
        setAdminData(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <section aria-busy="true" aria-label="Loading admin dashboard">
        <div className="lms-card" style={{ minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "var(--primary)" }} role="status" aria-live="polite">
            Loading admin dashboard…
          </span>
        </div>
      </section>
    );
  if (!adminData) return null;

  const { users, tracks, submissions } = adminData;

  return (
    <section aria-label="Admin Dashboard Main Section">
      <h2 className="lms-title" tabIndex={0}>
        Admin Dashboard
      </h2>
      <p className="lms-desc" tabIndex={0}>
        Manage users, modules & tracks, and review submissions for DigitalT3 Onboarding.
      </p>
      <div className="lms-dashboard-grid" style={{ gap: "1.6rem", flexWrap: "wrap" }}>
        {/* User Management */}
        <AdminUserTable users={users} />

        {/* Track/Module Management */}
        <AdminTrackModuleSection tracks={tracks} />

        {/* Submission Review */}
        <AdminSubmissionReviewSection submissions={submissions} />
      </div>
    </section>
  );
}

/** User management listing with role/status, accessible ARIA table */
function AdminUserTable({ users }) {
  return (
    <section className="lms-card" aria-labelledby="admin-user-table-title" style={{ minWidth: 370, flex: "2 1 430px", overflowX: "auto" }}>
      <h3 id="admin-user-table-title" style={{ color: "var(--primary)", margin: "0 0 1.2rem 0", fontSize: "1.04em" }}>Users</h3>
      <div role="table" aria-label="User list" tabIndex={0} style={{ width: "100%" }}>
        <div role="rowgroup">
          <div role="row" className="lms-row" style={{ display: "flex", fontWeight: 700, fontSize: "1em", paddingBottom: "6px", borderBottom: "1.5px solid #e9ecef" }}>
            <span role="columnheader" scope="col" style={{ width: "110px" }}>Name</span>
            <span role="columnheader" scope="col" style={{ width: "165px" }}>Email</span>
            <span role="columnheader" scope="col" style={{ width: "60px" }}>Role</span>
            <span role="columnheader" scope="col" style={{ width: "55px" }}>Status</span>
            <span role="columnheader" scope="col" style={{ width: "55px" }}>Actions</span>
          </div>
        </div>
        <div role="rowgroup">
          {users && users.length > 0 ? (
            users.map((u, idx) => (
              <div
                key={u.id}
                role="row"
                style={{
                  display: "flex",
                  fontSize: ".98em",
                  alignItems: "center",
                  background: idx % 2 ? "#f5f8fc" : "#fff",
                  borderRadius: 8,
                  marginTop: 4,
                  padding: "7px 0",
                }}
                tabIndex={0}
                aria-label={`User ${u.name}, status ${u.status}`}
              >
                <span role="cell" style={{ width: "110px", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  <img src={u.avatarUrl} alt="" style={{ width: 26, height: 26, borderRadius: "50%", marginRight: 7, border: "1.3px solid #e9ecef" }} />
                  {u.name}
                </span>
                <span role="cell" style={{ width: "165px", color: "#3776c7", fontSize: ".97em" }}>{u.email}</span>
                <span role="cell" style={{ width: "60px" }}>
                  <span aria-label={u.role} style={{ background: u.role === "admin" ? "#fdfbe9" : "#e8f3fa", color: "#2b63bc", borderRadius: 7, fontWeight: 600, padding: "2.5px 8px", fontSize: ".92em" }}>
                    {u.role === "admin" ? "Admin" : "Employee"}
                  </span>
                </span>
                <span role="cell" style={{ width: "55px" }}>
                  <span aria-label={u.status} style={{ background: u.status === "Active" ? "#d0f7d8" : "#ffeaea", color: u.status === "Active" ? "#15803d" : "#d72045", borderRadius: 7, fontWeight: 600, padding: "2px 7px", fontSize: ".92em" }}>
                    {u.status}
                  </span>
                </span>
                <span role="cell" style={{ width: "55px" }}>
                  <button className="lms-btn lms-btn-primary" style={{ fontSize: ".83em", padding: "2px 7px", width: "auto", marginTop: 0 }}
                    aria-label={`View details for ${u.name}`}>⋮</button>
                </span>
              </div>
            ))
          ) : (
            <div>— No users found —</div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Track/Module Management stub: lists tracks, provides CRUD action placeholders */
function AdminTrackModuleSection({ tracks }) {
  return (
    <section className="lms-card" aria-labelledby="admin-track-table-title" style={{ minWidth: 320, flex: "1 1 325px", overflowX: "auto" }}>
      <h3 id="admin-track-table-title" style={{ color: "var(--secondary)", margin: "0 0 1.1rem 0", fontSize: "1.04em" }}>Modules & Tracks</h3>
      <div role="table" aria-label="Module and track list" tabIndex={0}>
        <div role="rowgroup">
          <div role="row" className="lms-row" style={{ display: "flex", fontWeight: 700, fontSize: ".97em", paddingBottom: "5px", borderBottom: "1.3px solid #e9ecef" }}>
            <span role="columnheader" scope="col" style={{ width: "150px" }}>Name</span>
            <span role="columnheader" scope="col" style={{ width: "70px" }}>Type</span>
            <span role="columnheader" scope="col" style={{ width: "70px" }}>#Modules</span>
            <span role="columnheader" scope="col" style={{ width: "80px" }}>Actions</span>
          </div>
        </div>
        <div role="rowgroup">
          {tracks && tracks.length > 0 ? (
            tracks.map((t, idx) => (
              <div
                key={t.id}
                role="row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: ".97em",
                  background: idx % 2 ? "#f5f8fc" : "#fff",
                  borderRadius: 7,
                  marginTop: 4,
                  padding: "7px 0"
                }}
                tabIndex={0}
                aria-label={`Track ${t.name}, ${t.type}, modules: ${t.numModules}`}
              >
                <span role="cell" style={{ width: "150px", fontWeight: 600 }}>{t.name}</span>
                <span role="cell" style={{ width: "70px" }}>
                  <span style={{ background: "#e1eafe", padding: "2px 7px", borderRadius: 6, fontSize: ".91em", color: "#2563EB", fontWeight: 600 }}>{t.type}</span>
                </span>
                <span role="cell" style={{ width: "70px" }}>{t.numModules}</span>
                <span role="cell" style={{ width: "80px" }}>
                  <button className="lms-btn lms-btn-primary" aria-label="Edit track" style={{ fontSize: ".81em", marginRight: 2, padding: "1px 7px" }}>✎</button>
                  <button className="lms-btn" aria-label="Delete track" style={{ background: "#eee", color: "#d11", fontSize: ".81em", padding: "1px 7px" }}>🗑️</button>
                </span>
              </div>
            ))
          ) : (
            <div>— No tracks found —</div>
          )}
        </div>
      </div>
      {/* Add Module/Track button: shown as stub */}
      <button className="lms-btn lms-btn-primary" style={{ fontSize: "1em", marginTop: 17, width: "auto", minWidth: 112 }}>
        + Add Module/Track (Stub)
      </button>
    </section>
  );
}

/** Submission review UI; lists user projects/submissions for review */
function AdminSubmissionReviewSection({ submissions }) {
  return (
    <section
      className="lms-card"
      aria-labelledby="admin-submissions-title"
      style={{ minWidth: 350, flex: "2 1 480px", overflowX: "auto" }}
    >
      <h3 id="admin-submissions-title" style={{ color: "var(--primary)", margin: "0 0 1.1rem 0", fontSize: "1.04em" }}>
        Submissions / Projects Review
      </h3>
      <div role="table" aria-label="Submissions list" tabIndex={0}>
        <div role="rowgroup">
          <div
            role="row"
            className="lms-row"
            style={{ display: "flex", fontWeight: 700, fontSize: ".98em", paddingBottom: "6px", borderBottom: "1.5px solid #e9ecef" }}
          >
            <span role="columnheader" scope="col" style={{ width: "110px" }}>User</span>
            <span role="columnheader" scope="col" style={{ width: "120px" }}>Project</span>
            <span role="columnheader" scope="col" style={{ width: "90px" }}>Submitted At</span>
            <span role="columnheader" scope="col" style={{ width: "80px" }}>Status</span>
            <span role="columnheader" scope="col" style={{ width: "60px" }}>Actions</span>
          </div>
        </div>
        <div role="rowgroup">
          {submissions && submissions.length > 0 ? (
            submissions.map((s, idx) => (
              <div
                key={s.id}
                role="row"
                tabIndex={0}
                aria-label={`Submission by ${s.user.name}, project ${s.projectTitle}, status ${s.status}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: idx % 2 ? "#f5f8fc" : "#fff",
                  borderRadius: 7,
                  fontSize: ".97em",
                  marginTop: 4,
                  padding: "7px 0",
                }}
              >
                <span role="cell" style={{ width: "110px", display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src={s.user.avatarUrl}
                    alt=""
                    style={{ width: 24, height: 24, borderRadius: "50%", border: "1.3px solid #e9ecef", marginRight: 5 }}
                  />
                  {s.user.name}
                </span>
                <span role="cell" style={{ width: "120px" }}>{s.projectTitle}</span>
                <span role="cell" style={{ width: "90px", fontSize: ".92em", color: "#686868" }}>
                  {s.submittedAt}
                </span>
                <span role="cell" style={{ width: "80px" }}>
                  <span
                    aria-label={s.status}
                    style={{
                      background: s.status === "pending" ? "#FEF7D1" : "#d0f7d8",
                      color: s.status === "pending" ? "#F59E0B" : "#0C8840",
                      borderRadius: 7,
                      fontWeight: 600,
                      padding: "2.5px 8px",
                      fontSize: ".92em",
                    }}
                  >
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </span>
                <span role="cell" style={{ width: "60px" }}>
                  <button className="lms-btn lms-btn-primary" aria-label="Review submission" style={{ fontSize: ".81em", padding: "2px 9px" }}>
                    Review
                  </button>
                </span>
              </div>
            ))
          ) : (
            <div>— No submissions —</div>
          )}
        </div>
      </div>
    </section>
  );
}
