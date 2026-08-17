import React from "react";
import { Card } from "../app/ui/Card.jsx";
import { Badge } from "../app/ui/Badge.jsx";
import apiService from "../services/api.js";

export default function SalesPage() {
  const [orders, setOrders] = React.useState(null);
  const [orderId, setOrderId] = React.useState("");
  const [customerName, setCustomerName] = React.useState("");
  const [productName, setProductName] = React.useState("Virgin Coconut Oil");
  const [quantity, setQuantity] = React.useState(20);
  const [unitPrice, setUnitPrice] = React.useState(1800);
  const [status, setStatus] = React.useState("CONFIRMED");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    apiService.listSalesOrders().then((result) => {
      const rows = Array.isArray(result) ? result : result?.orders || [];
      setOrders(rows);
      if (!orderId) {
        setOrderId(`SO-${String(rows.length + 1).padStart(3, "0")}-${new Date().getFullYear()}`);
      }
    }).catch(err => console.error('Failed to load sales orders:', err));
  }, [orderId]);

  async function handleSaveOrder() {
    setMessage("");
    setError("");
    if (!customerName) {
      setError("Please enter customer name.");
      return;
    }

    setSaving(true);
    try {
      const totalLkr = Number(quantity) * Number(unitPrice);
      const payload = {
        orderId,
        customerName,
        orderDate: new Date().toISOString(),
        deliveryDate: new Date().toISOString(),
        status,
        paymentStatus: "PENDING",
        items: [
          {
            productName,
            quantity: Number(quantity),
            unitPrice: Number(unitPrice),
            totalPrice: totalLkr,
          }
        ],
        totalLkr,
      };

      const created = await apiService.createSalesOrder(payload);
      setOrders((prev) => [created, ...(prev || [])]);
      setMessage("Sales order created successfully.");
      setCustomerName("");
    } catch (err) {
      setError(err.message || "Failed to create order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="pageTitle">Sales & Orders</div>
      <div className="pageSubtitle">Order processing, customers, and delivery readiness.</div>

      {!orders ? (
        <div className="card">Loading…</div>
      ) : (
        <div className="grid">
          <Card title="Create Sales Order" className="col6" action={<Badge>Ready</Badge>}>
            <div className="grid" style={{ marginTop: 12 }}>
              <div className="col6 field">
                <div className="label">Order No</div>
                <input value={orderId} onChange={(e) => setOrderId(e.target.value)} />
              </div>
              <div className="col6 field">
                <div className="label">Customer</div>
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" />
              </div>
              <div className="col6 field">
                <div className="label">Product</div>
                <select value={productName} onChange={(e) => setProductName(e.target.value)}>
                  <option value="Virgin Coconut Oil">Virgin Coconut Oil</option>
                  <option value="Coconut Shell Charcoal">Coconut Shell Charcoal</option>
                  <option value="Coconut Husk">Coconut Husk</option>
                </select>
              </div>
              <div className="col6 field">
                <div className="label">Quantity</div>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
              </div>
              <div className="col6 field">
                <div className="label">Unit price (LKR)</div>
                <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} />
              </div>
              <div className="col6 field">
                <div className="label">Delivery method</div>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
              <div className="col12" style={{ display: "flex", gap: 10 }}>
                <button className="btn btnPrimary" onClick={handleSaveOrder} disabled={saving}>
                  {saving ? "Saving..." : "Save order"}
                </button>
              </div>
              {(message || error) && (
                <div className="col12" style={{ color: error ? "#f87171" : "#86efac", fontSize: 13 }}>
                  {error || message}
                </div>
              )}
            </div>
          </Card>

          <Card title="Recent Orders" className="col6" action={<button className="btn">Dispatch board</button>}>
            <div style={{ marginTop: 12, overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id || o.id}>
                      <td>{o.orderId || o.orderNo || "-"}</td>
                      <td>{o.customerName || "-"}</td>
                      <td>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "-"}</td>
                      <td><Badge tone={o.status === "DELIVERED" ? "ok" : o.status === "CONFIRMED" ? "warn" : "neutral"}>{o.status}</Badge></td>
                      <td>{(o.totalLkr || 0).toLocaleString()}</td>
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
