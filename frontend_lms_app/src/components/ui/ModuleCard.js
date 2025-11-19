import React from "react";

/**
 * ModuleCard: Card display for a learning module.
 * Props:
 * - module: { id, title, description, status }
 * - onClick: fn (optional)
 */
export default function ModuleCard({ module, tabIndex = 0, onClick }) {
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
      tabIndex={tabIndex}
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
        transition: "transform 0.13s"
      }}
      onClick={module.status !== "locked" ? onClick : undefined}
      onKeyDown={e => {
        if ((e.key === "Enter" || e.key === " ") && module.status !== "locked") {
          if (onClick) onClick(e);
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
