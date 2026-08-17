import React from "react";
import { Card } from "../app/ui/Card.jsx";
import { Badge } from "../app/ui/Badge.jsx";

export default function SettingsPage() {
  return (
    <div>
      <div className="pageTitle">Settings</div>
      <div className="pageSubtitle">Company settings, units, pricing rules, and integrations (UI-only).</div>

      <div className="grid">
        <Card title="Company Profile" className="col6" action={<Badge>Ready</Badge>}>
          <div className="grid" style={{ marginTop: 12 }}>
            <div className="col12 field">
              <div className="label">Company name</div>
              <input defaultValue="Maheesha Coconut Oil (Pvt) Ltd" />
            </div>
            <div className="col6 field">
              <div className="label">Currency</div>
              <select defaultValue="LKR">
                <option>LKR</option>
                <option>USD</option>
              </select>
            </div>
            <div className="col6 field">
              <div className="label">Time zone</div>
              <select defaultValue="Asia/Colombo">
                <option>Asia/Colombo</option>
              </select>
            </div>
            <div className="col12" style={{ display: "flex", gap: 10 }}>
              <button className="btn btnPrimary">Save</button>
              <button className="btn">Reset</button>
            </div>
          </div>
        </Card>

        <Card title="Performance Targets" className="col6">
          <div className="grid" style={{ marginTop: 12 }}>
            <div className="col6 field">
              <div className="label">Target oil yield (%)</div>
              <input type="number" defaultValue={18} />
            </div>
            <div className="col6 field">
              <div className="label">QC fail threshold (%)</div>
              <input type="number" defaultValue={10} />
            </div>
            <div className="col12 field">
              <div className="label">Notes</div>
              <textarea placeholder="Define targets by grade / export readiness" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
