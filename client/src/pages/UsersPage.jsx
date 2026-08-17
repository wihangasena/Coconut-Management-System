import React from "react";
import { Card } from "../app/ui/Card.jsx";
import { Badge } from "../app/ui/Badge.jsx";
import apiService from "../services/api.js";

export default function UsersPage() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    apiService.listUsers().then(setUsers).catch(err => console.error('Failed to load users:', err));
  }, []);

  return (
    <div>
      <div className="pageTitle">Users & Roles</div>
      <div className="pageSubtitle">Role-based access control design preview.</div>

      <div className="grid">
        <Card title="Users" className="col8" action={<Badge>System</Badge>}>
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id || u.id}>
                    <td><code>{u.username}</code></td>
                    <td>{u.fullName || u.name || "-"}</td>
                    <td><Badge>{u.role}</Badge></td>
                    <td><Badge tone={u.isActive === false ? "bad" : "ok"}>{u.isActive === false ? "INACTIVE" : "ACTIVE"}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Role Matrix (Preview)" className="col4">
          <div className="muted" style={{ marginTop: 12, fontSize: 13 }}>
            <div style={{ marginBottom: 10 }}><Badge>ADMIN</Badge> Full access</div>
            <div style={{ marginBottom: 10 }}><Badge>MANAGER</Badge> Ops + analytics</div>
            <div style={{ marginBottom: 10 }}><Badge>PRODUCTION</Badge> Intake + batches + by-products</div>
            <div style={{ marginBottom: 10 }}><Badge>QC</Badge> QC records + gating</div>
            <div style={{ marginBottom: 10 }}><Badge>SALES</Badge> Orders + customers</div>
            <div><Badge>DELIVERY</Badge> Dispatch + delivery (future screen)</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
