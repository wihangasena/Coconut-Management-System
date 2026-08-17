import React from "react";
import { Card } from "../app/ui/Card.jsx";
import { Badge } from "../app/ui/Badge.jsx";
import apiService from "../services/api.js";
import { Can } from "../app/auth/Can.jsx";

export default function DashboardPage() {
  const [kpis, setKpis] = React.useState(null);
  const [error, setError] = React.useState("");

  const recentOilBatches = kpis?.recentOilBatches || [];
  const recentCharcoalBatches = kpis?.recentCharcoalBatches || [];

  React.useEffect(() => {
    let mounted = true;
    apiService
      .getDashboardKpis()
      .then((data) => mounted && setKpis(data))
      .catch((err) => {
        console.error("Failed to load dashboard KPIs", err);
        if (mounted) setError(err.message || "Could not load dashboard data.");
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <div className="pageTitle">Dashboard</div>
      <div className="pageSubtitle">Revenue, yields, QC health, and circular economy visibility.</div>

      {!kpis ? (
        <div className="card">
          {error ? <div style={{ color: "#f87171" }}>{error}</div> : "Loading KPIs…"}
        </div>
      ) : (
        <div className="grid">
          <Card className="col3">
            <div className="kpiLabel">Total Revenue (LKR)</div>
            <div className="kpiValue">{kpis.totalRevenueLkr.toLocaleString()}</div>
            <div style={{ marginTop: 10 }}>
              <Badge tone="ok">Sales flowing</Badge>
            </div>
          </Card>
          <Card className="col3">
            <div className="kpiLabel">Oil Yield (L)</div>
            <div className="kpiValue">{kpis.totalOilYieldLiters.toLocaleString()}</div>
            <div style={{ marginTop: 10 }}>
              <Badge>Batch-tracked</Badge>
            </div>
          </Card>
          <Card className="col3">
            <div className="kpiLabel">Charcoal Yield (KG)</div>
            <div className="kpiValue">{kpis.charcoalYieldKg.toLocaleString()}</div>
            <div style={{ marginTop: 10 }}>
              <Badge>Export-ready</Badge>
            </div>
          </Card>
          <Card className="col3">
            <div className="kpiLabel">QC Failure Rate</div>
            <div className="kpiValue">{(kpis.qcFailureRate * 100).toFixed(1)}%</div>
            <div style={{ marginTop: 10 }}>
              <Badge tone={kpis.qcFailureRate > 0.25 ? "bad" : kpis.qcFailureRate > 0.1 ? "warn" : "ok"}>
                QC trend
              </Badge>
            </div>
          </Card>

          <Card title="Circular Economy" className="col6">
            <div className="twoCols" style={{ marginTop: 12 }}>
              <div>
                <div className="kpiLabel">Husks recovered (KG)</div>
                <div className="kpiValue">{kpis.circular.huskRecoveredKg.toLocaleString()}</div>
                <div className="muted" style={{ fontSize: 12 }}>Resale stream, buyer management</div>
              </div>
              <div>
                <div className="kpiLabel">Shells recovered (KG)</div>
                <div className="kpiValue">{kpis.circular.shellsRecoveredKg.toLocaleString()}</div>
                <div className="muted" style={{ fontSize: 12 }}>Charcoal unit feedstock</div>
              </div>
            </div>
          </Card>

          <Card 
            title="Production Snapshot" 
            className="col6" 
            action={
              <Can roles={["ADMIN", "MANAGER"]}>
                <button className="btn">View batches</button>
              </Can>
            }
          >
            <div className="twoCols" style={{ marginTop: 12 }}>
              <div>
                <div className="kpiLabel" style={{ marginBottom: 8 }}>Recent oil batches</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {recentOilBatches.length > 0 ? recentOilBatches.map((batch) => (
                    <div key={batch.id} style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <strong>{batch.batchId || batch.id}</strong>
                        <Badge tone={batch.status === "READY" || batch.status === "PACKAGED" ? "ok" : "warn"}>
                          {batch.status || "PROCESSING"}
                        </Badge>
                      </div>
                      <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                        {batch.productionDate ? new Date(batch.productionDate).toLocaleDateString() : "-"} · {Number(batch.yieldLiters || 0).toLocaleString()} L
                      </div>
                    </div>
                  )) : (
                    <div className="muted" style={{ fontSize: 13 }}>No oil batches yet.</div>
                  )}
                </div>
              </div>

              <div>
                <div className="kpiLabel" style={{ marginBottom: 8 }}>Recent charcoal batches</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {recentCharcoalBatches.length > 0 ? recentCharcoalBatches.map((batch) => (
                    <div key={batch.id} style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <strong>{batch.batchId || batch.id}</strong>
                        <Badge tone={batch.status === "READY" || batch.status === "PACKAGED" ? "ok" : "warn"}>
                          {batch.status || "PRODUCTION"}
                        </Badge>
                      </div>
                      <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                        {batch.productionDate ? new Date(batch.productionDate).toLocaleDateString() : "-"} · {Number(batch.yieldKg || 0).toLocaleString()} KG
                      </div>
                    </div>
                  )) : (
                    <div className="muted" style={{ fontSize: 13 }}>No charcoal batches yet.</div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
