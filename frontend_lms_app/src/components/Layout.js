import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./ui/Sidebar";
import TopNav from "./ui/TopNav";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: "🏠" },
  { label: "Modules", to: "/modules", icon: "📚" },
  { label: "Projects", to: "/projects", icon: "💡" },
  { label: "Editor", to: "/editor", icon: "💻" }
];
const adminNavItems = [
  { label: "Admin Dashboard", to: "/admin" }
];

// PUBLIC_INTERFACE
export default function Layout({ isAdmin }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // PUBLIC_INTERFACE
  function toggleSidebar() {
    setSidebarOpen((prev) => !prev);
  }

  return (
    <div className="lms-app-root">
      <Sidebar
        navItems={navItems}
        adminNavItems={adminNavItems}
        isAdmin={isAdmin}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <main className="lms-main-content" tabIndex={0} style={{ flex: "1 1 0", minHeight: "100vh" }}>
        <TopNav />
        <Outlet />
      </main>
    </div>
  );
}
