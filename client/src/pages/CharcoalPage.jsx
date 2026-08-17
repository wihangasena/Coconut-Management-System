import React from "react";
import { Card } from "../app/ui/Card.jsx";
import { Badge } from "../app/ui/Badge.jsx";
import apiService from "../services/api.js";

export default function CharcoalPage() {
  const [batches, setBatches] = React.useState([]);
  const [batchId, setBatchId] = React.useState("");
  const [feedstockKg, setFeedstockKg] = React.useState(0);
  const [yieldKg, setYieldKg] = React.useState(0);
  const [carbonContent, setCarbonContent] = React.useState(75);
  const [ashContent, setAshContent] = React.useState(10);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    apiService.listCharcoalBatches().then((rows) => {
      setBatches(rows);
      if (!batchId) {
        setBatchId(`CHB-${String((rows?.length || 0) + 1).padStart(3, "0")}-${new Date().getFullYear()}`);
      }
    }).catch(err => console.error('Failed to load charcoal batches:', err));
  }, []);

  async function handleCreateBatch() {
    setMessage("");
    setError("");
    setSaving(true);
    try {
      const payload = {
        batchId,
        productionDate: new Date().toISOString(),
        feedstockKg: Number(feedstockKg),
        yieldKg: Number(yieldKg),
        conversionRate: Number(feedstockKg) > 0 ? (Number(yieldKg) / Number(feedstockKg)) * 100 : 0,
        carbonContent: Number(carbonContent),
        ashContent: Number(ashContent),
        status: "PRODUCTION",
      };
      const created = await apiService.createCharcoalBatch(payload);
      setBatches((prev) => [created, ...prev]);
      setMessage("Charcoal batch created successfully.");
      setFeedstockKg(0);
      setYieldKg(0);
    } catch (err) {
      setError(err.message || "Failed to create charcoal batch.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="pageTitle">Charcoal Production Unit</div>
      <div className="pageSubtitle">Track kiln process parameters, grading, and yield.</div>

      <div className="grid">
        <Card title="Start Charcoal Batch" className="col6" action={<Badge>Ready</Badge>}>
          <div className="grid" style={{ marginTop: 12 }}>
            <div className="col6 field">
              <div className="label">Shell batch ID</div>
              <input value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="CHB-001-2026" />
            </div>
            <div className="col6 field">
              <div className="label">Charcoal batch code</div>
              <input value={batchId} onChange={(e) => setBatchId(e.target.value)} />
            </div>
            <div className="col6 field">
              <div className="label">Grade</div>
              <select defaultValue="EXPORT">
                <option>EXPORT</option>
                <option>INDUSTRIAL</option>
                <option>BBQ</option>
              </select>
            </div>
            <div className="col6 field">
              <div className="label">Moisture (%)</div>
              <input type="number" value={ashContent} onChange={(e) => setAshContent(Number(e.target.value))} />
            </div>
            <div className="col6 field">
              <div className="label">Temperature (°C)</div>
              <input type="number" value={carbonContent} onChange={(e) => setCarbonContent(Number(e.target.value))} />
            </div>
            <div className="col6 field">
              <div className="label">Feedstock (KG)</div>
              <input type="number" value={feedstockKg} onChange={(e) => setFeedstockKg(Number(e.target.value))} />
            </div>
            <div className="col6 field">
              <div className="label">Yield (KG)</div>
              <input type="number" value={yieldKg} onChange={(e) => setYieldKg(Number(e.target.value))} />
            </div>
            <div className="col12" style={{ display: "flex", gap: 10 }}>
              <button className="btn btnPrimary" onClick={handleCreateBatch} disabled={saving}>
                {saving ? "Creating..." : "Create batch"}
              </button>
            </div>
            {(message || error) && (
              <div className="col12" style={{ color: error ? "#f87171" : "#86efac", fontSize: 13 }}>
                {error || message}
              </div>
            )}
          </div>
        </Card>

        <Card title="Charcoal Batches" className="col6" action={<button className="btn">QC check</button>}>
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Yield (KG)</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={b._id || b.id}>
                    <td>{b.batchId || b.code || "-"}</td>
                    <td><Badge>{b.carbonContent ? `${b.carbonContent}% C` : "-"}</Badge></td>
                    <td><Badge tone={b.status === "READY" || b.status === "PACKAGED" ? "ok" : b.status === "PRODUCTION" || b.status === "COOLING" ? "warn" : "neutral"}>{b.status}</Badge></td>
                    <td>{b.yieldKg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
            Add kiln timeline + grading breakdown UI next.
          </div>
        </Card>
      </div>
    </div>
  );
}
