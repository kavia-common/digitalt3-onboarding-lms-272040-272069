import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./index.css";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ModulesPage from "./pages/ModulesPage";
import ProjectsPage from "./pages/ProjectsPage";
import EditorPage from "./pages/EditorPage";
import { Tokens } from "./theme";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    // Apply Ocean Professional theme tokens
    Object.entries(Tokens.color).forEach(([k, v]) => {
      document.documentElement.style.setProperty(`--${k}`, v);
    });
  }, [theme]);
  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Dummy admin switch, replace with real role check in future
  const [isAdmin] = useState(false);

  return (
    <Router>
      <div className="App" style={{ background: "var(--background)", color: "var(--text)" }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Protected routes: layout with sidebar/nav */}
          <Route
            path="/"
            element={<Layout isAdmin={isAdmin} />}
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="modules" element={<ModulesPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="editor" element={<EditorPage />} />
          </Route>
          {/* fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
