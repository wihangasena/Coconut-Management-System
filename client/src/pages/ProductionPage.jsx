import React from "react";
import { Card } from "../app/ui/Card.jsx";
import { Badge } from "../app/ui/Badge.jsx";
import { Can } from "../app/auth/Can.jsx";
import apiService from "../services/api.js";

const OIL_STATUSES = ["PROCESSING", "QUALITY_CHECK", "READY", "PACKAGED"];

export default function ProductionPage() {
  const [oilBatches, setOilBatches] = React.useState([]);
  const [coconutBatches, setCoconutBatches] = React.useState([]);
  const [sourceBatchId, setSourceBatchId] = React.useState("");
  const [batchCode, setBatchCode] = React.useState("");
  const [yieldLiters, setYieldLiters] = React.useState(0);
  const [acidValue, setAcidValue] = React.useState(0.3);
  const [moisture, setMoisture] = React.useState(0.1);
  const [saving, setSaving] = React.useState(false);
  const [updatingStatusId, setUpdatingStatusId] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [tracingBatchId, setTracingBatchId] = React.useState("");
  const [traceData, setTraceData] = React.useState(null);
  const [traceLoading, setTraceLoading] = React.useState(false);

  React.useEffect(() => {
    Promise.all([apiService.listOilBatches(), apiService.listCoconutBatches()]).then(([o, c]) => {
      setOilBatches(o);
      setCoconutBatches(c);
      if (c.length > 0) {
        setSourceBatchId((curr) => curr || (c[0]._id || c[0].id));
      }
      if (!batchCode) {
        setBatchCode(`OB-${String((o?.length || 0) + 1).padStart(3, "0")}-${new Date().getFullYear()}`);
      }
    }).catch(err => console.error('Failed to load batches:', err));
  }, [batchCode]);

  async function handleCreateBatch() {
    setMessage("");
    setError("");
    if (!sourceBatchId) {
      setError("Please select a coconut source batch.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        batchId: batchCode,
        coconutBatchId: sourceBatchId,
        productionDate: new Date().toISOString(),
        yieldLiters: Number(yieldLiters),
        oilQuality: "Standard",
        acidValue: Number(acidValue),
        moisture: Number(moisture),
        impurities: 0,
        status: "PROCESSING"
      };

      const created = await apiService.createOilBatch(payload);
      setOilBatches((prev) => [created, ...prev]);
      setMessage("Oil batch created successfully.");
      setYieldLiters(0);
    } catch (err) {
      setError(err.message || "Failed to create oil batch.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(batchId, nextStatus) {
    setMessage("");
    setError("");
    setUpdatingStatusId(batchId);

    try {
      if (!batchId) {
        throw new Error("Invalid batch ID");
      }

      const idStr = String(batchId).trim();
      
      const updated = await apiService.updateOilBatchStatus(idStr, nextStatus);
      setOilBatches((prev) => prev.map((b) => {
        const bid = String(b._id || b.id).trim();
        const uid = String(updated._id || updated.id).trim();
        return bid === uid ? updated : b;
      }));
      setMessage(`Status updated to ${updated.status}.`);
    } catch (err) {
      console.error('Status update error:', err);
      setError(err.message || "Failed to update status. Check console for details.");
    } finally {
      setUpdatingStatusId("");
    }
  }

  async function handleOpenTraceability(batchId) {
    setTraceLoading(true);
    try {
      const selectedOil = oilBatches.find((b) => (b._id || b.id) === batchId);
      const sourceCoconut = selectedOil?.coconutBatchId
        ? coconutBatches.find((c) => (c._id || c.id) === selectedOil.coconutBatchId)
        : null;

      let qualityRecs = [];
      try {
        const qrList = await apiService.listQualityRecords();
        if (qrList && Array.isArray(qrList)) {
          qualityRecs = qrList.filter((q) => 
            String(q.batchId) === String(selectedOil?.batchId) || 
            String(q.batchId) === String(selectedOil?.id) || 
            String(q.batchId) === String(selectedOil?._id)
          );
        }
      } catch (e) {
        console.error('Failed to fetch quality records:', e);
      }

      let linkedByProducts = [];
      try {
        const byProducts = await apiService.listByProducts();
        if (byProducts && typeof byProducts === 'object') {
          const allBP = [...(byProducts.husks || []), ...(byProducts.shells || []), ...(byProducts.coir || [])];
          linkedByProducts = allBP.filter(
            (bp) => String(bp.coconutBatchId) === String(selectedOil?.coconutBatchId) || 
                    String(bp.coconutBatchId) === String(sourceCoconut?._id) || 
                    String(bp.coconutBatchId) === String(sourceCoconut?.id)
          );
        }
      } catch (e) {
        console.error('Failed to fetch by-products:', e);
      }

      setTraceData({
        oilBatch: selectedOil,
        sourceBatch: sourceCoconut,
        quality: qualityRecs,
        byProducts: linkedByProducts,
      });
      setTracingBatchId(batchId);
    } catch (err) {
      console.error('Failed to load traceability data:', err);
      setError("Failed to load traceability data.");
    } finally {
      setTraceLoading(false);
    }
  }

  function closeTraceability() {
    setTracingBatchId("");
    setTraceData(null);
  }

  return (
    <div>
      <div className="pageTitle">Oil Production Tracking</div>
      <div className="pageSubtitle">Create batches, update status, and calculate yield.</div>

      <div className="grid">
        <Card title="Create Oil Batch" className="col6" action={<Badge>Ready</Badge>}>
          <div className="grid" style={{ marginTop: 12 }}>
            <div className="col6 field">
              <div className="label">Coconut batch source</div>
              <select value={sourceBatchId} onChange={(e) => setSourceBatchId(e.target.value)}>
                {coconutBatches.map((b) => (
                  <option key={b._id || b.id} value={b._id || b.id}>
                    {b.batchId || b.id || "-"} • {b.dateReceived ? new Date(b.dateReceived).toLocaleDateString() : "-"} • {b.weightKg || 0}KG
                  </option>
                ))}
              </select>
            </div>
            <div className="col6 field">
              <div className="label">Batch code</div>
              <input value={batchCode} onChange={(e) => setBatchCode(e.target.value)} />
            </div>
            <div className="col6 field">
              <div className="label">Expected Yield (L)</div>
              <input type="number" value={yieldLiters} onChange={(e) => setYieldLiters(Number(e.target.value))} />
            </div>
            <div className="col6 field">
              <div className="label">Acid Value</div>
              <input type="number" step="0.01" value={acidValue} onChange={(e) => setAcidValue(Number(e.target.value))} />
            </div>
            <div className="col6 field">
              <div className="label">Moisture</div>
              <input type="number" step="0.01" value={moisture} onChange={(e) => setMoisture(Number(e.target.value))} />
            </div>
            <div className="col12" style={{ display: "flex", gap: 10 }}>
              <button className="btn btnPrimary" onClick={handleCreateBatch} disabled={saving}>
                {saving ? "Creating..." : "Create"}
              </button>
            </div>
            {(message || error) && (
              <div className="col12" style={{ color: error ? "#f87171" : "#86efac", fontSize: 13 }}>
                {error || message}
              </div>
            )}
          </div>
        </Card>

        <Card title="Active Oil Batches" className="col6" action={<button className="btn" onClick={() => {if (oilBatches.length > 0) handleOpenTraceability(oilBatches[0]._id || oilBatches[0].id);}}>Batch traceability</button>}>
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Status</th>
                  <th>Yield (L)</th>
                </tr>
              </thead>
              <tbody>
                {oilBatches.map((b) => {
                  const rowId = b._id || b.id;
                  return (
                    <tr key={rowId}>
                      <td>{b.batchId || b.code || "-"}</td>
                      <td>
                        <Can
                          roles={["ADMIN", "MANAGER", "PRODUCTION"]}
                          fallback={
                            <Badge tone={b.status === "READY" || b.status === "PACKAGED" ? "ok" : b.status === "PROCESSING" || b.status === "QUALITY_CHECK" ? "warn" : "neutral"}>
                              {b.status}
                            </Badge>
                          }
                        >
                          <select
                            value={b.status || "PROCESSING"}
                            onChange={(e) => handleStatusChange(rowId, e.target.value)}
                            disabled={updatingStatusId === rowId}
                          >
                            {OIL_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </Can>
                      </td>
                      <td>{b.yieldLiters}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {tracingBatchId && traceData && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: 4, maxWidth: 700, width: "90%", maxHeight: "80vh", overflowY: "auto", padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.3)", color: "#000" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, color: "#000" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#000" }}>Batch Traceability</div>
              <button className="btn" onClick={closeTraceability} style={{ padding: "4px 8px", fontSize: 14 }}>Close</button>
            </div>

            {traceLoading ? (
              <div style={{ color: "#000" }}>Loading traceability data...</div>
            ) : (
              <>
                <div style={{ marginBottom: 20, color: "#000" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: "#000" }}>Oil Batch</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13, color: "#000" }}>
                    <div style={{ color: "#000" }}>Code: <strong style={{ color: "#000" }}>{traceData.oilBatch?.batchId}</strong></div>
                    <div style={{ color: "#000" }}>Status: <strong style={{ color: "#000" }}>{traceData.oilBatch?.status}</strong></div>
                    <div style={{ color: "#000" }}>Yield: <strong style={{ color: "#000" }}>{traceData.oilBatch?.yieldLiters}L</strong></div>
                    <div style={{ color: "#000" }}>Quality: <strong style={{ color: "#000" }}>{traceData.oilBatch?.oilQuality}</strong></div>
                    <div style={{ color: "#000" }}>Acid Value: <strong style={{ color: "#000" }}>{traceData.oilBatch?.acidValue}</strong></div>
                    <div style={{ color: "#000" }}>Moisture: <strong style={{ color: "#000" }}>{traceData.oilBatch?.moisture}</strong></div>
                  </div>
                </div>

                {traceData.sourceBatch ? (
                  <div style={{ marginBottom: 20, padding: "12px", backgroundColor: "#f0f0f0", borderRadius: 4, color: "#000" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: "#000" }}>Source Coconut Batch</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13, color: "#000" }}>
                      <div style={{ color: "#000" }}>Batch ID: <strong style={{ color: "#000" }}>{traceData.sourceBatch?.batchId}</strong></div>
                      <div style={{ color: "#000" }}>Supplier: <strong style={{ color: "#000" }}>{traceData.sourceBatch?.supplierName}</strong></div>
                      <div style={{ color: "#000" }}>Weight: <strong style={{ color: "#000" }}>{traceData.sourceBatch?.weightKg} KG</strong></div>
                      <div style={{ color: "#000" }}>Quality: <strong style={{ color: "#000" }}>{traceData.sourceBatch?.quality}</strong></div>
                      <div style={{ color: "#000" }}>Moisture: <strong style={{ color: "#000" }}>{traceData.sourceBatch?.moistureLevel || "-"}%</strong></div>
                      <div style={{ color: "#000" }}>Date: <strong style={{ color: "#000" }}>{traceData.sourceBatch?.dateReceived ? new Date(traceData.sourceBatch.dateReceived).toLocaleDateString() : "-"}</strong></div>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: 20, padding: "8px", backgroundColor: "#f0f0f0", borderRadius: 4, color: "#666", fontSize: 12 }}>
                    No source batch information available.
                  </div>
                )}

                {traceData.quality && traceData.quality.length > 0 ? (
                  <div style={{ marginBottom: 20, color: "#000" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: "#000" }}>Quality Records ({traceData.quality.length})</div>
                    {traceData.quality.map((qr, idx) => (
                      <div key={idx} style={{ padding: "8px", backgroundColor: "#f9f9f9", marginBottom: 8, borderLeft: `3px solid ${qr.passed ? "#10b981" : "#ef4444"}`, color: "#000" }}>
                        <div style={{ fontSize: 12, color: "#000" }}><strong style={{ color: "#000" }}>{new Date(qr.testDate).toLocaleDateString()}</strong> - {qr.testerName || "Unknown"} - {qr.passed ? "✓ Passed" : "✗ Failed"}</div>
                        <div style={{ fontSize: 11, color: "#000", marginTop: 4 }}>Moisture: {qr.parameters?.moisturePercentage || "-"}% | Acid: {qr.parameters?.acidValue || "-"}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginBottom: 20, padding: "8px", backgroundColor: "#f0f0f0", borderRadius: 4, color: "#666", fontSize: 12 }}>
                    No quality records found for this batch.
                  </div>
                )}

                {traceData.byProducts && traceData.byProducts.length > 0 ? (
                  <div style={{ marginBottom: 20, color: "#000" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: "#000" }}>By-Products ({traceData.byProducts.length})</div>
                    {traceData.byProducts.map((bp, idx) => (
                      <div key={idx} style={{ padding: "8px", backgroundColor: "#f9f9f9", marginBottom: 8, color: "#000" }}>
                        <div style={{ fontSize: 12, color: "#000" }}><strong style={{ color: "#000" }}>{bp.type}</strong> - {bp.weight || "-"}kg</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginBottom: 20, padding: "8px", backgroundColor: "#f0f0f0", borderRadius: 4, color: "#666", fontSize: 12 }}>
                    No by-products found for this source batch.
                  </div>
                )}

                <div style={{ fontSize: 12, color: "#000", marginTop: 20, paddingTop: 12, borderTop: "1px solid #ddd" }}>
                  Created: {new Date(traceData.oilBatch?.createdAt).toLocaleString()}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
