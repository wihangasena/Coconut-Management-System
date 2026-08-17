import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { routes } from "../routes.jsx";
import { Icon } from "../ui/Icon.jsx";

function useAllowedRoutes(role) {
  return routes.filter((r) => r.roles.includes(role));
}

export function AppShell() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const allowed = useAllowedRoutes(user.role);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="appRoot">
      <header className="topbar">
        <button className="iconBtn" onClick={() => setSidebarOpen((s) => !s)} aria-label="Toggle menu">
          <Icon name="menu" />
        </button>
        <div className="brand">
          <div className="brandMark">CO</div>
          <div>
            <div className="brandTitle">Coconut ERP</div>
            <div className="brandSub">Oil + By-products + QC</div>
          </div>
        </div>

        <div className="topbarRight">
          <div className="userPill">
            <div className="avatar">{(user.fullName || user.name || user.username).slice(0, 1).toUpperCase()}</div>
            <div className="userMeta">
              <div className="userName">{user.fullName || user.name || user.username}</div>
              <div className="userRole">{user.role}</div>
            </div>
          </div>
          <button
            className="btn"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
            onClick={() => {
              logout();
              nav("/login");
            }}
          >
            <Icon name="logout" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="main">
        <aside className={"sidebar " + (sidebarOpen ? "open" : "")}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="sidebarInner" onClick={(e) => e.stopPropagation()}>
            <div className="navSectionTitle">Modules</div>
            <nav className="nav">
              {allowed.map((r) => (
                <NavLink
                  key={r.path}
                  to={`/${r.path}`}
                  className={({ isActive }) => "navItem " + (isActive ? "active" : "")}
                >
                  <Icon name={r.icon} />
                  <span>{r.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="sidebarFooter">
            </div>
          </div>
        </aside>

        <section className="content">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
