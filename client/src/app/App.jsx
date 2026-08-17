import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import { AppShell } from "./layout/AppShell.jsx";
import { routes } from "./routes.jsx";
import LoginPage from "../pages/LoginPage.jsx";

function ProtectedLayout() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div className="muted">Initialising security...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <AppShell />;
}

function RoleGuard({ roles, children }) {
  const { user } = useAuth();
  if (user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedLayout />}>
          {routes.map((r) => (
            <Route 
              key={r.path} 
              path={r.path} 
              element={<RoleGuard roles={r.roles}>{r.element}</RoleGuard>} 
            />
          ))}
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
