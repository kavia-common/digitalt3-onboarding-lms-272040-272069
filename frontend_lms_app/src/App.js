import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import { AuthProvider, useAuth } from "./AuthContext";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    Object.entries(Tokens.color).forEach(([k, v]) => {
      document.documentElement.style.setProperty(`--${k}`, v);
    });
  }, [theme]);
  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <AuthProvider>
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
            {/* Auth-protected routes */}
            <Route element={<RequireAuth />}>
              <Route
                path="/"
                element={<LayoutWithAuth />}
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<EmployeeDashboard />} />
                <Route path="admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
                <Route path="modules" element={<ModulesPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="editor" element={<EditorPage />} />
              </Route>
            </Route>
            {/* fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// PUBLIC_INTERFACE
function LayoutWithAuth() {
  const { isAdmin } = useAuth(); // supplies isAdmin to sidebar etc
  return <Layout isAdmin={isAdmin} />;
}

/**
 * Guards a route: only renders child routes if authenticated, else redirects to login.
 */
function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

/**
 * Guards a route: only for admins.
 */
function RequireAdmin({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

export default App;
