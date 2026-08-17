import React from "react";
import { Card } from "../app/ui/Card.jsx";
import { Badge } from "../app/ui/Badge.jsx";
import apiService from "../services/api.js";

export default function QualityPage() {
  const [records, setRecords] = React.useState([]);
  const [batchType, setBatchType] = React.useState("OIL");
  const [batchId, setBatchId] = React.useState("");
  const [passed, setPassed] = React.useState(true);
  const [testerName, setTesterName] = React.useState("");
  const [metrics, setMetrics] = React.useState("FFA:0.2\nMoisture:0.07\nColour:Clear");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    apiService.listQualityRecords().then(setRecords).catch(err => console.error('Failed to load quality records:', err));
  }, []);

  function parseMetrics(raw) {
    const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
    const out = {};
    lines.forEach((line) => {
      const [k, v] = line.split(":").map((x) => x?.trim());
      if (!k) return;
      if (k.toLowerCase().includes("moisture")) out.moisturePercentage = Number(v) || 0;
      if (k.toLowerCase().includes("ffa") || k.toLowerCase().includes("acid")) out.acidValue = Number(v) || 0;
      if (k.toLowerCase().includes("impurity")) out.impurityPercentage = Number(v) || 0;
      if (k.toLowerCase().includes("colour") || k.toLowerCase().includes("color")) out.colorRating = v || "";
      if (k.toLowerCase().includes("odor")) out.odor = v || "";
    });
    return out;
  }

  async function handleSaveQc() {
    setMessage("");
    setError("");
    if (!batchId) {
      setError("Please enter batch code.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        batchId,
        batchType,
        testDate: new Date().toISOString(),
        testerName,
        parameters: parseMetrics(metrics),
        passed,
        remarks: metrics,
      };
      const created = await apiService.createQualityRecord(payload);
      setRecords((prev) => [created, ...prev]);
      setMessage("QC record saved successfully.");
    } catch (err) {
      setError(err.message || "Failed to save QC record.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="pageTitle">Quality Control</div>
      <div className="pageSubtitle">Capture QC metrics (Oil: FFA, moisture, colour • Charcoal: hardness, burn time, residue).</div>

      <div className="grid">
        <Card title="Record QC Result" className="col6" action={<Badge>Ready</Badge>}>
          <div className="grid" style={{ marginTop: 12 }}>
            <div className="col6 field">
              <div className="label">Product</div>
              <select value={batchType} onChange={(e) => setBatchType(e.target.value)}>
                <option value="OIL">Oil</option>
                <option value="CHARCOAL">Charcoal</option>
                <option value="BYPRODUCT">By-product</option>
              </select>
            </div>
            <div className="col6 field">
              <div className="label">Batch code</div>
              <input value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="OIL-0001" />
            </div>
            <div className="col6 field">
              <div className="label">Result</div>
              <select value={passed ? "PASS" : "FAIL"} onChange={(e) => setPassed(e.target.value === "PASS")}>
                <option value="PASS">PASS</option>
                <option value="FAIL">FAIL</option>
              </select>
            </div>
            <div className="col6 field">
              <div className="label">Inspector</div>
              <input value={testerName} onChange={(e) => setTesterName(e.target.value)} placeholder="QC Inspector" />
            </div>
            <div className="col12 field">
              <div className="label">Metrics (key:value)</div>
              <textarea value={metrics} onChange={(e) => setMetrics(e.target.value)} placeholder="FFA:0.2\nMoisture:0.07\nColour:Clear" />
            </div>
            <div className="col12" style={{ display: "flex", gap: 10 }}>
              <button className="btn btnPrimary" onClick={handleSaveQc} disabled={saving}>
                {saving ? "Saving..." : "Save QC"}
              </button>
            </div>
            {(message || error) && (
              <div className="col12" style={{ color: error ? "#f87171" : "#86efac", fontSize: 13 }}>
                {error || message}
              </div>
            )}
          </div>
        </Card>

        <Card title="QC Records" className="col6" action={<button className="btn">Failure analysis</button>}>
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Batch</th>
                  <th>Date</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id || r.id}>
                    <td><Badge>{r.batchType || r.type}</Badge></td>
                    <td>{r.batchId || "-"}</td>
                    <td>{r.testDate ? new Date(r.testDate).toLocaleDateString() : "-"}</td>
                    <td>
                      <Badge tone={r.passed ? "ok" : "bad"}>{r.passed ? "PASS" : "FAIL"}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
            Next step: per-metric charts + batch-level QC gating.
          </div>
        </Card>
      </div>
    </div>
  );
}
