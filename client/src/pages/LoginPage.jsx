import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../app/auth/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(username, password);
      nav("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      background: "radial-gradient(circle at top left, rgba(34,197,94,0.15), transparent), radial-gradient(circle at bottom right, rgba(6,182,212,0.15), transparent)"
    }}>
      <div className="card" style={{ width: 420, padding: 32, boxShadow: "var(--shadow)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="brandMark" style={{ width: 64, height: 64, fontSize: 24, margin: "0 auto 16px" }}>CO</div>
          <h1 className="pageTitle" style={{ fontSize: 28, marginBottom: 8 }}>Coconut ERP</h1>
          <p className="muted">Intelligent Supply Chain & Production</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              background: "rgba(244,63,94,0.1)", 
              color: "#fb7185", 
              padding: "12px", 
              borderRadius: "8px", 
              fontSize: "14px",
              marginBottom: "20px",
              border: "1px solid rgba(244,63,94,0.2)"
            }}>
              {error}
            </div>
          )}

          <div className="field">
            <label className="label" style={{ fontWeight: 600 }}>Username</label>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin, manager, production, qc..."
              style={{ fontSize: 15, padding: "12px 14px" }}
              autoFocus
            />
          </div>

          <div style={{ height: 16 }} />

          <div className="field">
            <label className="label" style={{ fontWeight: 600 }}>Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ fontSize: 15, padding: "12px 14px" }}
            />
          </div>

          <div style={{ height: 24 }} />

          <button
            type="submit"
            className="btn btnPrimary"
            disabled={busy}
            style={{ width: "100%", padding: "14px", fontSize: 16 }}
          >
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ height: 32 }} />
        <div style={{ textAlign: "center", borderTop: "1px solid var(--border)", paddingTop: 20 }}>
          <p className="muted" style={{ fontSize: 12 }}>
            Other users: manager, production, qc, sales, delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
