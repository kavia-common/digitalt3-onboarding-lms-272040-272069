import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Sidebar navigation component for main app navigation.
 * Props:
 * - navItems: [{ label, to, icon }]
 * - adminNavItems: [{ label, to }]
 * - isAdmin: boolean
 * - sidebarOpen: boolean
 * - toggleSidebar: fn
 */
export default function Sidebar({ navItems, adminNavItems, isAdmin, sidebarOpen, toggleSidebar }) {
  return (
    <nav
      className={`lms-sidebar${sidebarOpen ? " open" : ""}`}
      aria-label="Sidebar"
      tabIndex={-1}
      role="navigation"
    >
      <div className="lms-sidebar__logo" tabIndex={0}>
        <span
          aria-label="DigitalT3 LMS"
          style={{
            fontWeight: "bold",
            fontSize: "1.3rem",
            letterSpacing: "0.06em"
          }}
        >
          🐳 DigitalT3
        </span>
      </div>
      <ul className="lms-sidebar__list">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                "lms-sidebar__link" + (isActive ? " sidebar-active" : "")
              }
              aria-label={item.label}
            >
              {item.icon && <span aria-hidden="true" style={{ marginRight: 11 }}>{item.icon}</span>}
              {item.label}
            </NavLink>
          </li>
        ))}
        {isAdmin && adminNavItems && adminNavItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                "lms-sidebar__link" + (isActive ? " sidebar-active" : "")
              }
              aria-label={item.label}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <button
        className="lms-sidebar__toggle"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        tabIndex={0}
      >
        <span aria-hidden="true">{sidebarOpen ? "✕" : "☰"}</span>
      </button>
    </nav>
  );
}
