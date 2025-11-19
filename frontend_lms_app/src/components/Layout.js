import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Tokens } from "../theme";

/**
 * Top-level layout with sidebar and main area, styled for Ocean Professional.
 */
const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Modules", to: "/modules" },
  { label: "Projects", to: "/projects" },
  { label: "Editor", to: "/editor" }
];
const adminNavItems = [
  { label: "Admin Dashboard", to: "/admin" }
];

export default function Layout({ isAdmin }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // PUBLIC_INTERFACE
  function toggleSidebar() {
    setSidebarOpen((prev) => !prev);
  }

  return (
    <div className="lms-app-root" style={{ minHeight: "100vh", background: Tokens.color.background }}>
      <nav
        className={`lms-sidebar${sidebarOpen ? " open" : ""}`}
        aria-label="Sidebar"
        tabIndex={-1}
      >
        <div className="lms-sidebar__logo">
          <span
            aria-label="DigitalT3 LMS"
            style={{
              fontFamily: Tokens.font.heading,
              fontWeight: "bold",
              fontSize: "1.3rem",
              color: Tokens.color.sidebarText,
              letterSpacing: "0.06em"
            }}
          >
            🐳 DigitalT3
          </span>
        </div>
        <ul className="lms-sidebar__list">
          {navItems.map((item, i) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  "lms-sidebar__link" + (isActive ? " sidebar-active" : "")
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          {isAdmin &&
            adminNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    "lms-sidebar__link" + (isActive ? " sidebar-active" : "")
                  }
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
        >
          {/* Hamburger/close icon */}
          <span aria-hidden="true">{sidebarOpen ? "✕" : "☰"}</span>
        </button>
      </nav>
      <main className="lms-main-content" tabIndex={0}>
        <Outlet />
      </main>
    </div>
  );
}
