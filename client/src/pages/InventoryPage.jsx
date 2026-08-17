import React from "react";
import { Card } from "../app/ui/Card.jsx";
import { Badge } from "../app/ui/Badge.jsx";
import apiService from "../services/api.js";

export default function InventoryPage() {
  const [items, setItems] = React.useState(null);
  const [selectedItemId, setSelectedItemId] = React.useState("");
  const [adjustmentType, setAdjustmentType] = React.useState("IN");
  const [adjustmentQty, setAdjustmentQty] = React.useState(10);
  const [reference, setReference] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    apiService.listInventory().then((result) => {
      const list = Array.isArray(result) ? result : result?.inventory || [];
      setItems(list);
      if (list.length > 0) {
        setSelectedItemId((curr) => curr || (list[0]._id || list[0].id));
      }
    }).catch(err => console.error('Failed to load inventory:', err));
  }, []);

  async function handleAdjustStock() {
    setMessage("");
    setError("");
    if (!selectedItemId) {
      setError("Please select a product.");
      return;
    }

    const current = (items || []).find((x) => (x._id || x.id) === selectedItemId);
    if (!current) {
      setError("Selected product not found.");
      return;
    }

    const delta = Number(adjustmentQty) || 0;
    const nextQty = adjustmentType === "IN"
      ? (Number(current.quantityOnHand) || 0) + delta
      : Math.max(0, (Number(current.quantityOnHand) || 0) - delta);

    setSaving(true);
    try {
      const updated = await apiService.updateInventoryItem(selectedItemId, {
        quantityOnHand: nextQty,
        status: nextQty === 0 ? "OUT_OF_STOCK" : (nextQty <= (current.reorderLevel || 0) ? "LOW_STOCK" : "IN_STOCK"),
        notes: reference
      });
      setItems((prev) => prev.map((row) => ((row._id || row.id) === selectedItemId ? { ...row, ...updated } : row)));
      setMessage("Stock updated successfully.");
      setReference("");
    } catch (err) {
      setError(err.message || "Failed to update stock.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="pageTitle">Sales & Inventory</div>
      <div className="pageSubtitle">Manage items (oil, charcoal, husk) and stock movements.</div>

      {!items ? (
        <div className="card">Loading…</div>
      ) : (
        <div className="grid">
          <Card title="Stock Overview" className="col6" action={<button className="btn">Stock-in / Stock-out</button>}>
            <div style={{ marginTop: 12, overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row._id || row.id}>
                      <td>{row.productName || "-"}</td>
                      <td><Badge>{row.category || "-"}</Badge></td>
                      <td>{row.quantityOnHand ?? 0}</td>
                      <td>{row.unit || "-"}</td>
                      <td>{row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Quick Stock Adjustment" className="col6" action={<Badge>Ready</Badge>}>
            <div className="grid" style={{ marginTop: 12 }}>
              <div className="col6 field">
                <div className="label">Product</div>
                <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)}>
                  {items.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.id}>{p.productName || p.productId || "-"}</option>
                  ))}
                </select>
              </div>
              <div className="col6 field">
                <div className="label">Adjustment type</div>
                <select value={adjustmentType} onChange={(e) => setAdjustmentType(e.target.value)}>
                  <option value="IN">Stock-in</option>
                  <option value="OUT">Stock-out</option>
                </select>
              </div>
              <div className="col6 field">
                <div className="label">Quantity</div>
                <input type="number" value={adjustmentQty} onChange={(e) => setAdjustmentQty(Number(e.target.value))} />
              </div>
              <div className="col6 field">
                <div className="label">Reference</div>
                <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Batch / order / note" />
              </div>
              <div className="col12" style={{ display: "flex", gap: 10 }}>
                <button className="btn btnPrimary" onClick={handleAdjustStock} disabled={saving}>
                  {saving ? "Applying..." : "Apply"}
                </button>
              </div>
              {(message || error) && (
                <div className="col12" style={{ color: error ? "#f87171" : "#86efac", fontSize: 13 }}>
                  {error || message}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
