import React from "react";

/**
 * Top navigation bar
 * Props:
 * - title: string (optional)
 * - children: (actions/buttons)
 */
export default function TopNav({ title, children }) {
  return (
    <nav
      className="lms-topnav"
      style={{
        background: "var(--surface)",
        borderBottom: "1.5px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.85rem 2.2rem 0.85rem 1rem",
        minHeight: 60,
        position: "sticky",
        top: 0,
        zIndex: 20
      }}
      aria-label="Top Navigation"
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: "1.18rem",
          color: "var(--primary)",
          letterSpacing: ".03em"
        }}
        tabIndex={0}
        aria-label={title}
      >
        {title || "DigitalT3 LMS"}
      </span>
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        {children}
      </div>
    </nav>
  );
}
