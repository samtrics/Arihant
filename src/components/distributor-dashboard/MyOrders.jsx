import React from "react";
import { motion } from "framer-motion";
const mockOrders = [];

export default function MyOrders() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "24px", fontWeight: "700", color: "#111827" }}>My Orders</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Track past shipments and download invoices.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ padding: "8px 16px", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer", color: "#374151" }}>Filter by Status</button>
          <button style={{ padding: "8px 16px", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer", color: "#374151" }}>Export CSV</button>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <tr>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Order ID</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Date</th>
              <th style={{ padding: "16px", textAlign: "center", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Items</th>
              <th style={{ padding: "16px", textAlign: "right", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Amount</th>
              <th style={{ padding: "16px", textAlign: "center", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "16px", textAlign: "center", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map(order => (
              <tr key={order.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "16px", fontWeight: "700", color: "#1F5132", fontSize: "14px", fontFamily: "monospace" }}>{order.id}</td>
                <td style={{ padding: "16px", color: "#4b5563", fontSize: "14px" }}>{new Date(order.date).toLocaleDateString()}</td>
                <td style={{ padding: "16px", textAlign: "center", color: "#4b5563", fontSize: "14px" }}>{order.items} Skus</td>
                <td style={{ padding: "16px", textAlign: "right", fontWeight: "600", color: "#111827" }}>{order.amount}</td>
                <td style={{ padding: "16px", textAlign: "center" }}>
                  <span style={{ 
                    padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "700",
                    background: order.status === "Delivered" ? "#ecfdf5" : order.status === "In Transit" ? "#eff6ff" : "#fffbeb",
                    color: order.status === "Delivered" ? "#059669" : order.status === "In Transit" ? "#2563eb" : "#d97706"
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: "16px", textAlign: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }} title="Download Invoice">
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>download</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
