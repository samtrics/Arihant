import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { inventoryData } from "../mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const GREEN = "#1F5132";
const GOLD = "#D4A64A";
const card = { background: "white", borderRadius: "16px", border: "1px solid #f0ede8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" };

export default function InventoryManager() {
  const [inventory, setInventory] = useState(inventoryData);
  const [updateModal, setUpdateModal] = useState(null);
  const [updateQty, setUpdateQty] = useState("");
  const [search, setSearch] = useState("");

  const filtered = inventory.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()));

  const stockStatus = (item) => {
    if (item.stock === 0) return { label: "Out of Stock", color: "#ef4444", bg: "#fef2f2" };
    if (item.stock < item.minStock) return { label: "Low Stock", color: "#f59e0b", bg: "#fffbeb" };
    return { label: "In Stock", color: "#10b981", bg: "#ecfdf5" };
  };

  const handleUpdate = () => {
    const qty = parseInt(updateQty);
    if (isNaN(qty) || qty < 0) return;
    setInventory((inv) => inv.map((i) => i.id === updateModal.id ? { ...i, stock: qty, lastUpdated: new Date().toISOString().split("T")[0] } : i));
    setUpdateModal(null);
    setUpdateQty("");
  };

  const totalValue = inventory.reduce((s, i) => s + i.value, 0);
  const lowStockItems = inventory.filter((i) => i.stock > 0 && i.stock < i.minStock);
  const outOfStock = inventory.filter((i) => i.stock === 0);

  const chartData = inventory.map((i) => ({ name: i.name.split(" ").slice(0, 2).join(" "), stock: i.stock, min: i.minStock }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "#1C1C1C", margin: 0 }}>Inventory Management</h2>
        <p style={{ color: "#9ca3af", fontSize: "12.5px", margin: "3px 0 0" }}>Real-time stock tracking across all warehouses</p>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
        {[["warehouse", "Total SKUs", inventory.length, GREEN, "rgba(31,81,50,0.08)"], ["payments", "Stock Value", `₹${(totalValue / 100000).toFixed(1)}L`, "#8b5cf6", "rgba(139,92,246,0.08)"], ["warning", "Low Stock", lowStockItems.length, "#f59e0b", "#fffbeb"], ["remove_shopping_cart", "Out of Stock", outOfStock.length, "#ef4444", "#fef2f2"]].map(([icon, label, val, color, bg]) => (
          <div key={label} style={{ ...card, padding: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "22px", color }}>{icon}</span>
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "22px", fontFamily: "'Poppins',sans-serif", color: "#1C1C1C" }}>{val}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Low stock alerts */}
      {(lowStockItems.length > 0 || outOfStock.length > 0) && (
        <div style={{ ...card, padding: "14px 18px", display: "flex", gap: "12px", alignItems: "flex-start", borderLeft: "4px solid #f59e0b" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "#f59e0b", flexShrink: 0, marginTop: "2px" }}>warning</span>
          <div>
            <div style={{ fontWeight: "700", fontSize: "14px", color: "#1C1C1C", marginBottom: "6px" }}>⚠ Stock Alerts</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {outOfStock.map((i) => (
                <span key={i.id} style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11.5px", fontWeight: "700", background: "#fef2f2", color: "#ef4444" }}>
                  {i.name}: OUT OF STOCK
                </span>
              ))}
              {lowStockItems.map((i) => (
                <span key={i.id} style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11.5px", fontWeight: "700", background: "#fffbeb", color: "#f59e0b" }}>
                  {i.name}: {i.stock} left (min: {i.minStock})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stock Chart */}
      <div style={{ ...card, padding: "20px" }}>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "15px", color: "#1C1C1C", marginBottom: "4px" }}>Stock Levels vs Minimum</h3>
        <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "16px" }}>Current stock compared to reorder threshold</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="stock" name="Current Stock" radius={[5, 5, 0, 0]} barSize={18}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.stock === 0 ? "#ef4444" : entry.stock < entry.min ? "#f59e0b" : GREEN} />
              ))}
            </Bar>
            <Bar dataKey="min" name="Min. Required" fill="rgba(212,166,74,0.3)" radius={[5, 5, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Search */}
      <div style={{ ...card, padding: "12px 16px" }}>
        <div style={{ position: "relative", maxWidth: "320px" }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "16px" }}>search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inventory…"
            style={{ width: "100%", padding: "8px 12px 8px 34px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Inventory Table */}
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#faf8f5", borderBottom: "2px solid #f0ede8" }}>
                {["Product", "SKU", "Category", "Warehouse", "Stock", "Min. Stock", "Value", "Status", "Action"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 13px", color: "#6b7280", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const s = stockStatus(item);
                return (
                  <tr key={item.id} style={{ borderBottom: "1px solid #faf8f5", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#faf8f5"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "13px", fontWeight: "700", color: "#1C1C1C" }}>{item.name}</td>
                    <td style={{ padding: "13px", fontFamily: "monospace", fontSize: "12px", color: "#6b7280" }}>{item.sku}</td>
                    <td style={{ padding: "13px" }}>
                      <span style={{ padding: "3px 9px", borderRadius: "100px", fontSize: "11px", fontWeight: "600", background: "rgba(31,81,50,0.08)", color: GREEN }}>{item.category}</span>
                    </td>
                    <td style={{ padding: "13px", fontSize: "12px", color: "#6b7280" }}>{item.warehouse}</td>
                    <td style={{ padding: "13px" }}>
                      <div style={{ fontWeight: "700", color: s.color, fontSize: "15px" }}>{item.stock}</div>
                      <div style={{ fontSize: "10.5px", color: "#9ca3af" }}>{item.unit}</div>
                    </td>
                    <td style={{ padding: "13px", color: "#6b7280", fontWeight: "600" }}>{item.minStock}</td>
                    <td style={{ padding: "13px", fontWeight: "700", color: "#1C1C1C" }}>₹{item.value.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "13px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "700", background: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                    <td style={{ padding: "13px" }}>
                      <motion.button onClick={() => { setUpdateModal(item); setUpdateQty(String(item.stock)); }}
                        style={{ padding: "6px 12px", borderRadius: "8px", border: "1.5px solid #f0ede8", background: "white", fontSize: "11.5px", fontWeight: "700", cursor: "pointer", color: GREEN, display: "flex", alignItems: "center", gap: "4px" }}
                        whileHover={{ borderColor: GREEN, background: "rgba(31,81,50,0.05)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>edit</span>
                        Update
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Stock Modal */}
      <AnimatePresence>
        {updateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={(e) => { if (e.target === e.currentTarget) setUpdateModal(null); }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              style={{ background: "white", borderRadius: "20px", padding: "28px", maxWidth: "380px", width: "100%" }}>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "18px", color: "#1C1C1C", marginBottom: "6px" }}>Update Stock</h3>
              <p style={{ color: "#6b7280", fontSize: "13.5px", marginBottom: "20px" }}>{updateModal.name} — {updateModal.sku}</p>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>New Stock Quantity ({updateModal.unit})</label>
              <input type="number" value={updateQty} onChange={e => setUpdateQty(e.target.value)} min="0"
                style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "6px", color: "#1C1C1C" }}
                onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>Min. required: {updateModal.minStock} {updateModal.unit} · Current: {updateModal.stock}</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setUpdateModal(null)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                <motion.button onClick={handleUpdate} style={{ flex: 1, padding: "10px", borderRadius: "10px", background: GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                  whileHover={{ opacity: 0.9 }}>Save Stock</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
