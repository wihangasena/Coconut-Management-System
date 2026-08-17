import React from "react";
import { Card } from "../app/ui/Card.jsx";
import { Badge } from "../app/ui/Badge.jsx";
import apiService from "../services/api.js";
import { Can } from "../app/auth/Can.jsx";

export default function IntakePage() {
  const [suppliers, setSuppliers] = React.useState([]);
  const [batches, setBatches] = React.useState([]);
  const [supplierName, setSupplierName] = React.useState("");
  const [dateReceived, setDateReceived] = React.useState(new Date().toISOString().slice(0, 10));
  const [weight, setWeight] = React.useState(800);
  const [quality, setQuality] = React.useState("A");
  const [unitCost, setUnitCost] = React.useState(120);
  const [moistureLevel, setMoistureLevel] = React.useState(12);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    apiService.listCoconutBatches().then((batches) => {
      setBatches(batches);
      const uniqueSuppliers = [...new Set((batches || []).map((b) => b.supplierName).filter(Boolean))];
      setSuppliers(uniqueSuppliers);
    }).catch(err => console.error('Failed to load batches:', err));
  }, []);

  const total = weight * unitCost;

  function csvValue(value) {
    if (value === null || value === undefined) return '""';
    const text = String(value).replace(/"/g, '""');
    return `"${text}"`;
  }

  function extractUnitCost(notes) {
    if (!notes) return "";
    const match = String(notes).match(/Unit\s*Cost\s*LKR\s*:\s*([\d.]+)/i);
    return match ? match[1] : "";
  }

  function toIsoDate(value) {
    if (!value) return "";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
  }

  async function handleExportCsv() {
    setMessage("");
    setError("");

    try {
      const allBatches = await apiService.listCoconutBatches();

      if (!allBatches || allBatches.length === 0) {
        setError("No intake data available to export.");
        return;
      }

      const headers = [
        "Batch ID",
        "Supplier ID",
        "Supplier Name",
        "Date Received",
        "Quantity Coconuts",
        "Weight KG",
        "Quality",
        "Moisture Level",
        "Status",
        "Unit Cost LKR",
        "Estimated Total LKR",
        "Notes",
        "Created At",
        "Updated At"
      ];

      const rows = allBatches.map((b) => {
        const unitCostLkr = b.unitCostLkr ?? extractUnitCost(b.notes);
        const weightKg = Number(b.weightKg ?? b.quantityCoconuts ?? 0);
        const estimatedTotal = unitCostLkr !== "" ? Number(unitCostLkr) * weightKg : "";

        return [
          b.batchId || b.id || b._id || "",
          b.supplierId || "",
          b.supplierName || "",
          toIsoDate(b.dateReceived),
          b.quantityCoconuts ?? "",
          b.weightKg ?? "",
          b.quality || "",
          b.moistureLevel ?? "",
          b.status || "",
          unitCostLkr,
          estimatedTotal,
          b.notes || "",
          b.createdAt || "",
          b.updatedAt || ""
        ];
      });

      const csvContent = [
        headers.map(csvValue).join(","),
        ...rows.map((row) => row.map(csvValue).join(","))
      ].join("\n");

      const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `intake_full_report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage(`CSV exported successfully (${allBatches.length} records).`);
    } catch (err) {
      setError(err.message || "Failed to export intake CSV.");
    }
  }

  async function handleSaveIntake() {
    setMessage("");
    setError("");

    if (!supplierName) {
      setError("Please choose a supplier.");
      return;
    }

    setSaving(true);
    try {
      const nextBatchNo = batches.length + 1;
      const batchId = `CB-${String(nextBatchNo).padStart(3, "0")}-${new Date().getFullYear()}`;

      const payload = {
        batchId,
        supplierName,
        dateReceived,
        quantityCoconuts: Number(weight),
        weightKg: Number(weight),
        quality,
        moistureLevel: Number(moistureLevel),
        status: "RECEIVED",
        notes: `Unit Cost LKR: ${unitCost}`
      };

      const created = await apiService.createCoconutBatch(payload);
      setBatches((prev) => [created, ...prev]);
      setMessage("Intake saved successfully.");
    } catch (err) {
      setError(err.message || "Failed to save intake.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="pageTitle">Raw Material Intake</div>
      <div className="pageSubtitle">Record coconut purchases, supplier details, weight, quality, date and cost.</div>

      <div className="grid">
        <Card title="New Intake" className="col6" action={<Badge>Ready</Badge>}>
          <div className="grid" style={{ marginTop: 12 }}>
            <div className="col6 field">
              <div className="label">Supplier</div>
              <input
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Enter supplier name"
              />
            </div>
            <div className="col6 field">
              <div className="label">Date</div>
              <input type="date" value={dateReceived} onChange={(e) => setDateReceived(e.target.value)} />
            </div>
            <div className="col6 field">
              <div className="label">Weight (KG)</div>
              <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
            </div>
            <div className="col6 field">
              <div className="label">Quality grade</div>
              <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <div className="col6 field">
              <div className="label">Unit cost (LKR/KG)</div>
              <input type="number" value={unitCost} onChange={(e) => setUnitCost(Number(e.target.value))} />
            </div>
            <div className="col6 field">
              <div className="label">Moisture Level (%)</div>
              <input type="number" value={moistureLevel} onChange={(e) => setMoistureLevel(Number(e.target.value))} />
            </div>
            <div className="col6 field">
              <div className="label">Estimated total (LKR)</div>
              <input type="number" value={total} readOnly />
            </div>
            <div className="col12" style={{ display: "flex", gap: 10 }}>
              <button className="btn btnPrimary" onClick={handleSaveIntake} disabled={saving}>
                {saving ? "Saving..." : "Save intake"}
              </button>
              <button className="btn">Reset</button>
            </div>
            {(message || error) && (
              <div className="col12" style={{ color: error ? "#f87171" : "#86efac", fontSize: 13 }}>
                {error || message}
              </div>
            )}
          </div>
        </Card>

        <Card 
          title="Recent Coconut Batches" 
          className="col6" 
          action={
            <Can roles={["ADMIN"]}>
              <button className="btn" onClick={handleExportCsv}>Export CSV</button>
            </Can>
          }
        >
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>KG</th>
                  <th>Grade</th>
                  <th>Unit (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={b._id || b.id}>
                    <td>{b.dateReceived ? new Date(b.dateReceived).toLocaleDateString() : "-"}</td>
                    <td>{b.supplierName || suppliers.find((s) => s.id === b.supplierId)?.name || "-"}</td>
                    <td>{b.weightKg}</td>
                    <td><Badge tone={b.quality === "A" ? "ok" : b.quality === "B" ? "warn" : "bad"}>{b.quality}</Badge></td>
                    <td>{b.unitCostLkr ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
