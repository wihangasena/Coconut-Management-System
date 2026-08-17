import React from "react";
import { Card } from "../app/ui/Card.jsx";
import { Badge } from "../app/ui/Badge.jsx";
import apiService from "../services/api.js";

export default function ByProductsPage() {
  const [data, setData] = React.useState(null);
  const [coconutBatches, setCoconutBatches] = React.useState([]);
  const [oilBatches, setOilBatches] = React.useState([]);
  const [sourceBatchId, setSourceBatchId] = React.useState("");
  const [linkedOilBatchId, setLinkedOilBatchId] = React.useState("");
  const [shellWeight, setShellWeight] = React.useState(150);
  const [huskWeight, setHuskWeight] = React.useState(220);
  const [notes, setNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  async function reloadData() {
    const [byProductsResult, coconutResult, oilResult] = await Promise.all([
      apiService.listByProducts(),
      apiService.listCoconutBatches(),
      apiService.listOilBatches(),
    ]);

    setData(byProductsResult);
    setCoconutBatches(coconutResult || []);
    setOilBatches(oilResult || []);
  }

  function getBatchLabel(batch, fallbackPrefix) {
    return batch.batchId || `${fallbackPrefix}-${String(batch._id || "").slice(-6)}`;
  }

  function findCoconutBatchCode(batchId) {
    const batch = coconutBatches.find((b) => String(b._id) === String(batchId));
    return batch ? getBatchLabel(batch, "CB") : "-";
  }

  function findOilBatchCode(batchId) {
    const batch = oilBatches.find((b) => String(b._id) === String(batchId));
    return batch ? getBatchLabel(batch, "OB") : "-";
  }

  React.useEffect(() => {
    reloadData().catch(err => console.error('Failed to load by-products:', err));
  }, []);

  async function handleSaveSeparation() {
    setMessage("");
    setError("");
    if (!sourceBatchId) {
      setError("Please enter source coconut batch ID.");
      return;
    }

    setSaving(true);
    try {
      await apiService.createByProduct({
        type: "SHELL",
        coconutBatchId: sourceBatchId,
        ...(linkedOilBatchId ? { oilBatchId: linkedOilBatchId } : {}),
        weightKg: Number(shellWeight),
        quality: "A",
        collectionDate: new Date().toISOString(),
        status: "COLLECTED",
        notes
      });

      await apiService.createByProduct({
        type: "HUSK",
        coconutBatchId: sourceBatchId,
        ...(linkedOilBatchId ? { oilBatchId: linkedOilBatchId } : {}),
        weightKg: Number(huskWeight),
        quality: "A",
        collectionDate: new Date().toISOString(),
        status: "COLLECTED",
        notes
      });

      await reloadData();
      setMessage("By-products saved successfully.");
    } catch (err) {
      setError(err.message || "Failed to save by-products.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="pageTitle">By-product Separation</div>
      <div className="pageSubtitle">Track shells (charcoal) and husks (resale) and link to source batches.</div>

      {!data ? (
        <div className="card">Loading…</div>
      ) : (
        <div className="grid">
          <Card title="Separation Entry" className="col6" action={<Badge>Ready</Badge>}>
            <div className="grid" style={{ marginTop: 12 }}>
              <div className="col6 field">
                <div className="label">Source coconut batch</div>
                <select value={sourceBatchId} onChange={(e) => setSourceBatchId(e.target.value)}>
                  <option value="">Select coconut batch code</option>
                  {coconutBatches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {getBatchLabel(batch, "CB")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col6 field">
                <div className="label">Linked oil batch</div>
                <select value={linkedOilBatchId} onChange={(e) => setLinkedOilBatchId(e.target.value)}>
                  <option value="">None (optional)</option>
                  {oilBatches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {getBatchLabel(batch, "OB")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col6 field">
                <div className="label">Shells weight (KG)</div>
                <input type="number" value={shellWeight} onChange={(e) => setShellWeight(Number(e.target.value))} />
              </div>
              <div className="col6 field">
                <div className="label">Husks weight (KG)</div>
                <input type="number" value={huskWeight} onChange={(e) => setHuskWeight(Number(e.target.value))} />
              </div>
              <div className="col12 field">
                <div className="label">Notes</div>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Moisture notes / storage" />
              </div>
              <div className="col12" style={{ display: "flex", gap: 10 }}>
                <button className="btn btnPrimary" onClick={handleSaveSeparation} disabled={saving}>
                  {saving ? "Saving..." : "Save separation"}
                </button>
              </div>
              {(message || error) && (
                <div className="col12" style={{ color: error ? "#f87171" : "#86efac", fontSize: 13 }}>
                  {error || message}
                </div>
              )}
            </div>
          </Card>

          <Card title="Shell Batches" className="col6" action={<button className="btn">Send to charcoal</button>}>
            <div style={{ marginTop: 12, overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>KG</th>
                    <th>Coconut batch</th>
                    <th>Linked oil</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.shells || []).map((s) => (
                    <tr key={s._id || s.id}>
                      <td>{s._id || s.id}</td>
                      <td>{s.collectionDate ? new Date(s.collectionDate).toLocaleDateString() : "-"}</td>
                      <td>{s.weightKg}</td>
                      <td>{findCoconutBatchCode(s.coconutBatchId)}</td>
                      <td>{findOilBatchCode(s.oilBatchId)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Husk Batches" className="col12" action={<button className="btn">Create husk sale</button>}>
            <div style={{ marginTop: 12, overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>KG</th>
                    <th>Buyer</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.husks || []).map((h) => (
                    <tr key={h._id || h.id}>
                      <td>{h._id || h.id}</td>
                      <td>{h.collectionDate ? new Date(h.collectionDate).toLocaleDateString() : "-"}</td>
                      <td>{h.weightKg}</td>
                      <td>{h.status || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
