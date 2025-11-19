import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployeeDashboardData } from "../services/mockLmsData";

/**
 * Modules overview page: shows assigned modules, links to module viewer/detail.
 */
export default function ModulesPage() {
  const [modules, setModules] = useState([]);
  useEffect(() => {
    getEmployeeDashboardData().then((data) => {
      setModules(data.modules || []);
    });
  }, []);

  return (
    <section>
      <h2 className="lms-title" tabIndex={0}>Learning Modules</h2>
      <div className="lms-card">
        {modules.length === 0 ? (
          <p>No modules assigned yet.</p>
        ) : (
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            {modules.map((mod, idx) => (
              <li key={mod.id}
                style={{
                  flex: "1 1 210px",
                  minWidth: 185,
                  maxWidth: 325,
                  background: "var(--card-bg)",
                  boxShadow: "var(--card-shadow)",
                  marginBottom: 15,
                  borderRadius: 10,
                  border: "1.5px solid #2563EB12",
                  opacity: mod.status === "locked" ? 0.55 : 1,
                  cursor: mod.status === "locked" ? "not-allowed" : "pointer",
                  padding: "1.1rem 1.3rem"
                }}
                tabIndex={0}
                aria-label={`Module: ${mod.title} (${mod.status})`}
              >
                <div style={{ fontWeight: 700, fontSize: "1.1em", color: "var(--primary)", marginBottom: 3 }}>{mod.title}</div>
                <div style={{ fontSize: "0.98em", color: "#495468", opacity: 0.92, marginBottom: 8 }}>{mod.description}</div>
                <div style={{
                  marginTop: ".4em", color: mod.status === "locked" ? "#A2B0C3" : "#22c55e", fontWeight: 600, fontSize: ".98em"
                }}>
                  {mod.status === "completed" ? "Completed" :
                    mod.status === "in_progress" ? "In Progress" :
                      "Locked"}
                </div>
                {mod.status !== "locked" && (
                  <Link
                    to={`/modules/${mod.id}`}
                    tabIndex={0}
                    style={{
                      marginTop: "0.47rem",
                      display: "inline-block",
                      color: "#fff",
                      background: "var(--primary)",
                      padding: "0.36rem 1.1rem",
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: ".97em",
                      textDecoration: "none",
                      outline: "none"
                    }}
                    aria-label={`Open module ${mod.title}`}
                  >
                    Open
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
