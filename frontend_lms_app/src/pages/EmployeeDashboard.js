import React, { useEffect, useState } from "react";
import { getEmployeeDashboardData } from "../services/mockLmsData";

/**
 * Employee Dashboard: Shows onboarding progress, task list, and modules.
 * Responsive, accessible (ARIA, keyboard support), Ocean Professional style.
 */
export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    let mounted = true;
    getEmployeeDashboardData().then((data) => {
      if (mounted) {
        setDashboard(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <section aria-busy="true" aria-label="Loading dashboard">
        <div className="lms-card" style={{ minHeight: 270, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "var(--primary)" }} role="status" aria-live="polite">
            Loading your dashboard&hellip;
          </span>
        </div>
      </section>
    );
  }
  if (!dashboard) return null;

  // Split data
  const { user, progress, todoList, modules } = dashboard;

  return (
    <section aria-label="Employee Dashboard Main Section">
      <h2 className="lms-title" tabIndex={0}>Employee Dashboard</h2>
      <p className="lms-desc" tabIndex={0}>
        Welcome, <strong>{user.name}</strong>! Track your onboarding progress, complete tasks, and explore modules.
      </p>
      <div className="lms-dashboard-grid" style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2rem",
        justifyContent: "stretch",
        alignItems: "flex-start",
        marginBottom: "2rem"
      }}>
        {/* Progress Card */}
        <div className="lms-card"
          style={{ flex: "1 1 380px", minWidth: 285, maxWidth: 450 }}
          role="region"
          aria-label="Onboarding Progress"
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            {/* Avatar */}
            <img
              src={user.avatarUrl}
              alt={`Avatar for ${user.name}`}
              style={{
                width: 62, height: 62, borderRadius: "50%",
                border: "2.5px solid var(--primary)",
                background: "#fff",
                marginRight: 20
              }}
            />
            <div style={{ flex: 1 }}>
              <p style={{
                fontWeight: 600, fontSize: "1.07rem",
                color: "var(--primary)", marginBottom: 2
              }}>
                {user.name}
                <span aria-label={"User status"} style={{
                  background: "#e0e9fe",
                  color: "#2563EB",
                  fontWeight: 500,
                  borderRadius: 7,
                  padding: "2px 9px",
                  marginLeft: 12,
                  fontSize: "0.93em"
                }}>{user.status}</span>
              </p>
              <ProgressCircle percent={progress.percent} />
            </div>
          </div>
          <div style={{
            marginTop: 28, display: "flex", gap: 16, flexWrap: "wrap"
          }}>
            <ProgressStat label="Modules" value={`${progress.completedModules}/${progress.totalModules}`} />
            <ProgressStat label="Tasks" value={`${progress.completedTasks}/${progress.totalTasks}`} />
            <ProgressStat label="Est. Days Left" value={progress.estimatedDaysLeft} />
          </div>
          {/* Next milestone */}
          <div style={{
            marginTop: 18, fontSize: "0.97em", color: "#5774CA", opacity: 0.9
          }}>
            <span style={{ fontWeight: 600 }}>Next:</span> {progress.nextModule.title}{" "}
            <span aria-label="Due soon" style={{
              color: "#F59E0B",
              fontWeight: 600,
              marginLeft: 8
            }}>
              {progress.nextModule.dueInDays} days left
            </span>
          </div>
        </div>

        {/* To-Do List */}
        <div className="lms-card"
          style={{ flex: "1 1 280px", minWidth: 246, maxWidth: 360 }}
          role="region"
          aria-labelledby="dashboard-todo-title"
        >
          <h3 id="dashboard-todo-title" style={{
            margin: "0 0 0.6em 0",
            fontWeight: "bold",
            fontSize: "1.12rem",
            color: "var(--secondary)"
          }}>Your To-Do List</h3>
          <ul
            className="lms-dashboard-todo"
            aria-label="Onboarding To-Do List"
            style={{ 
              listStyle: "none", padding: 0, margin: 0, fontSize: "1rem"
            }}
          >
            {todoList.map((item, i) => (
              <li
                key={item.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  marginBottom: 8,
                  opacity: item.done ? 0.62 : 1,
                  textDecoration: item.done ? "line-through" : "none",
                  background: item.done ? "rgba(245,158,11,0.08)" : "none",
                  borderRadius: 7,
                  padding: "6px 11px"
                }}
                tabIndex={0}
                aria-checked={item.done}
                role="checkbox"
              >
                <span
                  aria-hidden="true"
                  tabIndex={-1}
                  style={{
                    display: "inline-block",
                    width: 18, height: 18,
                    borderRadius: "50%",
                    border: `2.2px solid ${item.done ? "#F59E0B" : "#A2B0C3"}`,
                    background: item.done ? "#f8e7bb" : "#fff",
                    marginRight: 7,
                    flexShrink: 0,
                    position: "relative"
                  }}
                >
                  {item.done && (
                    <span
                      aria-label="Completed"
                      style={{
                        display: "block",
                        width: 11, height: 11,
                        borderRadius: "50%",
                        background: "#F59E0B",
                        position: "absolute",
                        left: 2.2,
                        top: 2.2
                      }}
                    />
                  )}
                </span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
          <div style={{
            marginTop: 9,
            fontSize: "0.96rem",
            color: "var(--text)",
            opacity: 0.8
          }}>
            <span>
              {todoList.filter(x => !x.done).length} task(s) remaining
            </span>
          </div>
        </div>
      </div>

      {/* Modules Panel */}
      <section
        aria-label="Assigned Modules List"
        style={{ marginBottom: 12, paddingTop: 3, maxWidth: 1200 }}
      >
        <h3 style={{
          fontWeight: "bold",
          fontSize: "1.12rem",
          color: "var(--primary)",
          margin: 0,
          marginBottom: 17
        }}>Your Modules</h3>
        <div
          className="lms-modules-grid"
          role="list"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.1rem",
            padding: 0,
            margin: 0
          }}
        >
          {modules.map((mod, idx) => (
            <ModuleCard key={mod.id} module={mod} idx={idx} />
          ))}
        </div>
      </section>
    </section>
  );
}

/**
 * Progress circle component. ARIA-annotated.
 */
function ProgressCircle({ percent }) {
  // Accessible SVG circular progress
  const size = 62, stroke = 7;
  const radius = (size - stroke) / 2;
  const circum = 2 * Math.PI * radius;
  const prog = Math.max(0, Math.min(percent || 0, 100));
  const offset = circum - (prog / 100) * circum;

  return (
    <span
      role="img"
      aria-label={`Learning progress: ${prog}%`}
      style={{ display: "inline-flex", alignItems: "center", gap: 12 }}
      tabIndex={0}
    >
      <svg
        width={size}
        height={size}
        aria-hidden="true"
        style={{ marginRight: 2 }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e3e8f2"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2563EB"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circum}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.5s cubic-bezier(.6,-0.28,.7,1.16)"
          }}
        />
      </svg>
      <b style={{
        fontSize: "1.2rem",
        color: "#2563EB",
        fontWeight: 700,
        minWidth: 36
      }}>{prog}%</b>
    </span>
  );
}

/**
 * Progress stat pill.
 */
function ProgressStat({ label, value }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: "#eef3fa",
        color: "#2563EB",
        fontWeight: 600,
        padding: "5px 13px",
        marginRight: 5,
        borderRadius: 7,
        fontSize: "0.99em",
        minWidth: 55
      }}
      tabIndex={0}
    >
      {value} <span style={{
        color: "#7b898e",
        fontWeight: 500,
        fontSize: "0.92em",
        marginLeft: 4,
        marginRight: 0
      }}>{label}</span>
    </span>
  );
}

/**
 * Individual Learning Module Card
 */
function ModuleCard({ module, idx }) {
  // Color, status highlight
  let status;
  let statusColor;
  let icon;
  switch (module.status) {
    case "completed":
      status = "Completed";
      statusColor = "#22c55e";
      icon = "✔️";
      break;
    case "in_progress":
      status = "In Progress";
      statusColor = "#F59E0B";
      icon = "⏳";
      break;
    case "locked":
      status = "Locked";
      statusColor = "#A2B0C3";
      icon = "🔒";
      break;
    default:
      status = "";
      statusColor = "#7b898e";
      icon = "";
  }
  return (
    <div
      className="lms-mod-card"
      role="listitem"
      tabIndex={0}
      aria-label={`Module: ${module.title}. Status: ${status}`}
      style={{
        background: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
        borderRadius: 13,
        minWidth: 245,
        maxWidth: 340,
        flex: "1 1 245px",
        padding: "1.5rem 1.35rem",
        outline: "none",
        border: status === "Locked" ? "1.5px dashed #e5e7eb" : "1.5px solid #2563EB22",
        opacity: module.status === "locked" ? 0.49 : 1,
        position: "relative",
        cursor: module.status === "locked" ? "not-allowed" : "pointer",
        marginBottom: 8,
        transition: "transform 0.13s",
      }}
      onKeyDown={(e) => {
        // Enter/Space should not open locked; would be used for "view details"
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
        }
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
        <span style={{
          fontSize: "1.11rem",
          fontWeight: 700,
          color: "var(--primary)",
          flex: 1
        }}>
          {module.title}
        </span>
        <span
          aria-label={`Status: ${status}`}
          style={{
            fontSize: "1.05rem", marginLeft: 14,
            fontWeight: 600, color: statusColor,
          }}
        >{icon}</span>
      </div>
      <div style={{
        fontSize: "0.99rem",
        color: "#495468",
        margin: 0,
        opacity: 0.95,
        marginBottom: 12,
      }}>{module.description}</div>
      <div style={{
        fontSize: "0.96em",
        color: statusColor,
        fontWeight: 600,
        letterSpacing: 0.03,
        marginTop: "auto"
      }}>
        {status}
      </div>
    </div>
  );
}
