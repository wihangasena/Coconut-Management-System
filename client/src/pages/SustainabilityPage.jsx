import React from "react";
import { Card } from "../app/ui/Card.jsx";
import { Badge } from "../app/ui/Badge.jsx";
import apiService from "../services/api.js";

export default function SustainabilityPage() {
  const [kpis, setKpis] = React.useState(null);
  React.useEffect(() => {
    apiService.getDashboardKpis().then(setKpis).catch(err => console.error('Failed to load KPIs:', err));
  }, []);

  return (
    <div>
      <div className="pageTitle">Sustainability / Circular Economy</div>
      <div className="pageSubtitle">Waste reduction metrics, by-product recovery, and reporting (UI-only).</div>

      {!kpis ? (
        <div className="card">Loading…</div>
      ) : (
        <div className="grid">
          <Card title="Recovery Summary" className="col6" action={<Badge>Ready</Badge>}>
            <div className="twoCols" style={{ marginTop: 12 }}>
              <div>
                <div className="kpiLabel">Husks recovered (KG)</div>
                <div className="kpiValue">{kpis.circular.huskRecoveredKg.toLocaleString()}</div>
                <div className="muted" style={{ fontSize: 12 }}>Resold instead of disposed</div>
              </div>
              <div>
                <div className="kpiLabel">Shells recovered (KG)</div>
                <div className="kpiValue">{kpis.circular.shellsRecoveredKg.toLocaleString()}</div>
                <div className="muted" style={{ fontSize: 12 }}>Converted to charcoal</div>
              </div>
            </div>
          </Card>

          <Card title="Sustainability Report" className="col6">
            <div className="muted" style={{ marginTop: 12 }}>
              Sustainability metrics and traceability data will be displayed here.
            </div>
          </Card>

          <Card title="Waste Reduction KPI" className="col12" action={<Badge tone="ok">Active</Badge>}>
            <div style={{
              height: 160,
              marginTop: 10,
              borderRadius: 14,
              border: "1px dashed rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.03)"
            }} />
          </Card>
        </div>
      )}
    </div>
  );
}
