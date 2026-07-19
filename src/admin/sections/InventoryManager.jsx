import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { supabase } from "../../supabaseClient";

const GREEN = "#1F5132";
const GOLD = "#D4A64A";
const card = {
  background: "white",
  borderRadius: "16px",
  border: "1px solid #f0ede8",
  boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
};

const REASONS = ["Manual Adjustment", "Damaged / Waste", "Return", "Opening Stock", "Order Fulfilled"];

// ─── Circular Loader ─────────────────────────────────────────────────────────
function Loader({ text = "Loading..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "16px" }}>
      <div style={{ width: "44px", height: "44px", border: `4px solid rgba(31,81,50,0.15)`, borderTopColor: GREEN, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <div style={{ color: GREEN, fontWeight: "700", fontSize: "14px", animation: "pulse 1.5s ease-in-out infinite" }}>{text}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }`}</style>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, bg }) {
  return (
    <div style={{ ...card, padding: "18px", display: "flex", gap: "14px", alignItems: "center", minWidth: 0 }}>
      <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span className="material-symbols-outlined" style={{ fontSize: "24px", color }}>{icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div 
          style={{ 
            fontWeight: "800", 
            fontSize: String(value).length > 12 ? "14px" : String(value).length > 8 ? "17px" : "24px", 
            fontFamily: "'Poppins',sans-serif", 
            color: "#1C1C1C", 
            lineHeight: 1.2, 
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
          title={typeof value === 'string' || typeof value === 'number' ? String(value) : undefined}
        >
          {value}
        </div>
        <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Tab Button ──────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "7px",
        padding: "9px 18px", borderRadius: "10px", border: "none", cursor: "pointer",
        fontWeight: "700", fontSize: "13px",
        background: active ? GREEN : "transparent",
        color: active ? "white" : "#6b7280",
        transition: "all 0.18s",
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>{icon}</span>
      {label}
    </button>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ stock, minStock }) {
  let label, color, bg;
  if (stock === 0) { label = "Out of Stock"; color = "#ef4444"; bg = "#fef2f2"; }
  else if (stock < minStock) { label = "Low Stock"; color = "#f59e0b"; bg = "#fffbeb"; }
  else { label = "In Stock"; color = "#10b981"; bg = "#ecfdf5"; }
  return (
    <span style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: "700", background: bg, color }}>{label}</span>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function InventoryManager({ products = [], setProducts }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movLoading, setMovLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [movSearch, setMovSearch] = useState("");

  const now = new Date();
  const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const lastDayN = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const lastDayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(lastDayN).padStart(2, "0")}`;
  const [movDateRange, setMovDateRange] = useState({ start: firstDay, end: lastDayStr });

  // Adjust Modal
  const [adjustModal, setAdjustModal] = useState(null);
  const [adjustMode, setAdjustMode] = useState("add"); // add | remove
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("Manual Adjustment");
  const [adjustNote, setAdjustNote] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  // Min Stock Edit
  const [editingMin, setEditingMin] = useState({});

  // ── Fetch inventory from products ────────────────────────────────────────
  const syncInventory = useCallback(() => {
    setInventory(
      products.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || p.id,
        category: p.category || "General",
        stock: Number(p.stock) || 0,
        minStock: Number(p.min_stock) || 20,
        price: Number(p.wholesale_price || p.wholesalePrice || p.price || 0),
        value: Number(p.wholesale_price || p.wholesalePrice || p.price || 0) * (Number(p.stock) || 0),
        updatedAt: p.updated_at
          ? new Date(p.updated_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
          : "—",
      }))
    );
  }, [products]);

  // ── Fetch stock movements ────────────────────────────────────────────────
  const fetchMovements = useCallback(async () => {
    setMovLoading(true);
    const { data, error } = await supabase
      .from("stock_movements")
      .select("*, products(name, sku)")
      .gte("created_at", movDateRange.start + "T00:00:00.000Z")
      .lte("created_at", movDateRange.end + "T23:59:59.999Z")
      .order("created_at", { ascending: false });
    if (!error) setMovements(data || []);
    setMovLoading(false);
  }, [movDateRange]);

  useEffect(() => {
    syncInventory();
    setLoading(false);
  }, [syncInventory]);

  useEffect(() => {
    if (activeTab === "movements") fetchMovements();
  }, [activeTab, fetchMovements]);

  // ── Derived values ───────────────────────────────────────────────────────
  const categories = ["All", ...Array.from(new Set(inventory.map((i) => i.category).filter(Boolean)))];

  const filtered = inventory.filter((i) => {
    const q = (search || "").toLowerCase();
    const matchSearch =
      (i.name || "").toLowerCase().includes(q) ||
      String(i.sku || "").toLowerCase().includes(q);
    const matchCat = catFilter === "All" || i.category === catFilter;
    return matchSearch && matchCat;
  });

  const totalValue = inventory.reduce((s, i) => s + i.value, 0);
  const lowStockItems = inventory.filter((i) => i.stock > 0 && i.stock < i.minStock);
  const outOfStockItems = inventory.filter((i) => i.stock === 0);
  const chartData = inventory
    .slice()
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 12)
    .map((i) => ({
      name: String(i.name || "Unknown").split(" ").slice(0, 2).join(" "),
      stock: i.stock,
      min: i.minStock,
      isLow: i.stock < i.minStock,
      isOut: i.stock === 0,
    }));

  const filteredMovements = movements.filter((m) => {
    if (!movSearch) return true;
    const q = movSearch.toLowerCase();
    return (
      (m.products?.name || "").toLowerCase().includes(q) ||
      m.reason.toLowerCase().includes(q) ||
      (m.notes || "").toLowerCase().includes(q)
    );
  });

  // ── Adjust Stock Handler ─────────────────────────────────────────────────
  const handleAdjust = async () => {
    const qty = parseInt(adjustQty);
    if (isNaN(qty) || qty <= 0) return alert("Please enter a valid quantity.");
    const change = adjustMode === "add" ? qty : -qty;
    if (adjustMode === "remove" && adjustModal.stock + change < 0) {
      return alert(`Cannot remove more than current stock (${adjustModal.stock}).`);
    }
    setAdjusting(true);
    try {
      const { error } = await supabase.rpc("adjust_stock_and_log", {
        p_product_id: adjustModal.id,
        p_change_amount: change,
        p_reason: adjustReason,
        p_notes: adjustNote || null,
      });
      if (error) throw error;

      const newStock = Math.max(0, adjustModal.stock + change);
      if (setProducts) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === adjustModal.id ? { ...p, stock: newStock, updated_at: new Date().toISOString() } : p
          )
        );
      }
      setAdjustModal(null);
      setAdjustQty("");
      setAdjustNote("");
      setAdjustReason("Manual Adjustment");
    } catch (err) {
      alert("Error adjusting stock: " + err.message);
    }
    setAdjusting(false);
  };

  // ── Save Min Stock ───────────────────────────────────────────────────────
  const handleSaveMinStock = async (productId, newMin) => {
    const val = parseInt(newMin);
    if (isNaN(val) || val < 0) return;
    const { error } = await supabase.from("products").update({ min_stock: val }).eq("id", productId);
    if (!error) {
      if (setProducts) {
        setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, min_stock: val } : p)));
      }
      setEditingMin((prev) => ({ ...prev, [productId]: undefined }));
    } else {
      alert("Error saving: " + error.message);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  if (loading) return <Loader text="Loading Inventory..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "800", fontSize: "22px", color: "#1C1C1C", margin: 0 }}>
            Inventory Management
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "13px", margin: "4px 0 0" }}>
            Real-time stock tracking, movements &amp; alerts
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "white", padding: "5px 6px", borderRadius: "12px", border: "1px solid #f0ede8", flexWrap: "wrap" }}>
          <TabBtn active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon="dashboard" label="Overview" />
          <TabBtn active={activeTab === "stock"} onClick={() => setActiveTab("stock")} icon="inventory_2" label="Stock Table" />
          <TabBtn active={activeTab === "movements"} onClick={() => setActiveTab("movements")} icon="swap_vert" label="Movements" />
          <TabBtn active={activeTab === "settings"} onClick={() => setActiveTab("settings")} icon="tune" label="Min Stock" />
        </div>
      </div>

      {/* ── TAB 1: OVERVIEW ────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" }}>
              <StatCard icon="category" label="Total SKUs" value={inventory.length} color={GREEN} bg="rgba(31,81,50,0.08)" />
              <StatCard icon="payments" label="Total Stock Value" value={`₹${totalValue.toLocaleString("en-IN")}`} color="#8b5cf6" bg="rgba(139,92,246,0.08)" />
              <StatCard icon="warning" label="Low Stock Items" value={lowStockItems.length} color="#f59e0b" bg="#fffbeb" />
              <StatCard icon="remove_shopping_cart" label="Out of Stock" value={outOfStockItems.length} color="#ef4444" bg="#fef2f2" />
            </div>

            {/* Alerts */}
            {(outOfStockItems.length > 0 || lowStockItems.length > 0) && (
              <div style={{ ...card, padding: "16px 20px", display: "flex", gap: "14px", alignItems: "flex-start", borderLeft: "4px solid #f59e0b" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#f59e0b", flexShrink: 0, marginTop: "2px" }}>warning</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "700", fontSize: "14px", color: "#1C1C1C", marginBottom: "10px" }}>⚠ Stock Alerts — Immediate Action Required</div>
                  {outOfStockItems.length > 0 && (
                    <div style={{ marginBottom: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Out of Stock</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {outOfStockItems.map((i) => (
                          <span key={i.id} style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "700", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca" }}>
                            {i.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {lowStockItems.length > 0 && (
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Low Stock</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {lowStockItems.map((i) => (
                          <span key={i.id} style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "700", background: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" }}>
                            {i.name}: {i.stock} left (min: {i.minStock})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bar Chart */}
            <div style={{ ...card, padding: "22px" }}>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "15px", color: "#1C1C1C", margin: "0 0 4px" }}>
                Stock Levels vs. Minimum Threshold
              </h3>
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 18px" }}>
                Bottom 12 products by stock — green = healthy, amber = low, red = out of stock
              </p>
              {chartData.length === 0 ? (
                <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>No products found.</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart key={chartData.map(d=>d.stock).join(',')} data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #f0ede8", fontSize: "12px" }} />
                    <Bar dataKey="stock" name="Current Stock" radius={[6, 6, 0, 0]} barSize={20}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.isOut ? "#ef4444" : entry.isLow ? "#f59e0b" : GREEN} />
                      ))}
                    </Bar>
                    <Bar dataKey="min" name="Min. Required" fill="rgba(212,166,74,0.35)" radius={[6, 6, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category Summary */}
            <div style={{ ...card, padding: "22px" }}>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "15px", color: "#1C1C1C", margin: "0 0 14px" }}>
                Stock Value by Category
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
                {Array.from(new Set(inventory.map((i) => i.category))).map((cat) => {
                  const items = inventory.filter((i) => i.category === cat);
                  const val = items.reduce((s, i) => s + i.value, 0);
                  const totalStock = items.reduce((s, i) => s + i.stock, 0);
                  return (
                    <div key={cat} style={{ background: "#faf8f5", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0ede8" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>{cat}</div>
                      <div style={{ fontWeight: "800", fontSize: "16px", color: GREEN, fontFamily: "'Poppins',sans-serif" }}>₹{val.toLocaleString("en-IN")}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{totalStock.toLocaleString()} units · {items.length} SKUs</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB 2: STOCK TABLE ─────────────────────────────────────────── */}
        {activeTab === "stock" && (
          <motion.div key="stock" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Filters */}
            <div style={{ ...card, padding: "14px 18px", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
              <div style={{ position: "relative", flex: "1 1 220px", maxWidth: "320px" }}>
                <span className="material-symbols-outlined" style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "17px" }}>search</span>
                <input
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or SKU…"
                  style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white", boxSizing: "border-box" }}
                  onFocus={(e) => (e.target.style.borderColor = GREEN)} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {categories.map((c) => (
                  <button key={c} onClick={() => setCatFilter(c)}
                    style={{ padding: "6px 14px", borderRadius: "100px", border: "1.5px solid", fontSize: "12px", fontWeight: "700", cursor: "pointer", transition: "all 0.15s",
                      background: catFilter === c ? GREEN : "white", color: catFilter === c ? "white" : "#6b7280", borderColor: catFilter === c ? GREEN : "#e5e7eb" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ ...card, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "900px" }}>
                  <thead>
                    <tr style={{ background: "#faf8f5", borderBottom: "2px solid #f0ede8" }}>
                      {["Product", "SKU", "Category", "Stock", "Min Stock", "Stock Value", "Status", "Last Updated", "Action"].map((h) => (
                        <th key={h} style={{ textAlign: "left", padding: "12px 14px", color: "#6b7280", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan="9" style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>No products found.</td></tr>
                    ) : (
                      filtered.map((item) => (
                        <tr key={item.id} style={{ borderBottom: "1px solid #faf8f5", transition: "background 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#faf8f5")} onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                          <td style={{ padding: "14px", fontWeight: "700", color: "#1C1C1C" }}>{item.name}</td>
                          <td style={{ padding: "14px", fontFamily: "monospace", fontSize: "12px", color: "#6b7280" }}>{item.sku}</td>
                          <td style={{ padding: "14px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "600", background: "rgba(31,81,50,0.08)", color: GREEN }}>{item.category}</span>
                          </td>
                          <td style={{ padding: "14px" }}>
                            <div style={{ fontWeight: "800", fontSize: "17px", color: item.stock === 0 ? "#ef4444" : item.stock < item.minStock ? "#f59e0b" : "#1C1C1C" }}>{item.stock.toLocaleString()}</div>
                            <div style={{ fontSize: "10px", color: "#9ca3af" }}>units</div>
                          </td>
                          <td style={{ padding: "14px", color: "#6b7280", fontWeight: "600" }}>{item.minStock}</td>
                          <td style={{ padding: "14px", fontWeight: "700", color: "#1C1C1C" }}>₹{item.value.toLocaleString("en-IN")}</td>
                          <td style={{ padding: "14px" }}><StatusBadge stock={item.stock} minStock={item.minStock} /></td>
                          <td style={{ padding: "14px", fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap" }}>{item.updatedAt}</td>
                          <td style={{ padding: "14px" }}>
                            <motion.button
                              onClick={() => { setAdjustModal(item); setAdjustQty(""); setAdjustNote(""); setAdjustMode("add"); setAdjustReason("Manual Adjustment"); }}
                              style={{ padding: "7px 14px", borderRadius: "8px", border: "1.5px solid #f0ede8", background: "white", fontSize: "12px", fontWeight: "700", cursor: "pointer", color: GREEN, display: "flex", alignItems: "center", gap: "5px" }}
                              whileHover={{ borderColor: GREEN, background: "rgba(31,81,50,0.04)" }}>
                              <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>tune</span>
                              Adjust
                            </motion.button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB 3: MOVEMENTS ───────────────────────────────────────────── */}
        {activeTab === "movements" && (
          <motion.div key="movements" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Filters */}
            <div style={{ ...card, padding: "14px 18px", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
              <div style={{ position: "relative", flex: "1 1 200px", maxWidth: "280px" }}>
                <span className="material-symbols-outlined" style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "17px" }}>search</span>
                <input value={movSearch} onChange={(e) => setMovSearch(e.target.value)} placeholder="Search movements…"
                  style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white", boxSizing: "border-box" }}
                  onFocus={(e) => (e.target.style.borderColor = GREEN)} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#faf8f5", padding: "8px 14px", borderRadius: "10px", border: "1px solid #f0ede8" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#9ca3af" }}>calendar_month</span>
                <input type="date" max={todayStr} value={movDateRange.start} onChange={(e) => setMovDateRange({ ...movDateRange, start: e.target.value })}
                  style={{ border: "none", background: "transparent", fontSize: "13px", outline: "none", color: "#374151" }} />
                <span style={{ color: "#9ca3af", fontWeight: "600" }}>to</span>
                <input type="date" max={todayStr} value={movDateRange.end} onChange={(e) => setMovDateRange({ ...movDateRange, end: e.target.value })}
                  style={{ border: "none", background: "transparent", fontSize: "13px", outline: "none", color: "#374151" }} />
              </div>
              <motion.button onClick={fetchMovements} style={{ padding: "9px 18px", borderRadius: "10px", background: GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }} whileHover={{ opacity: 0.88 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>refresh</span>
                Apply
              </motion.button>
            </div>

            {movLoading ? <Loader text="Loading movements..." /> : (
              <div style={{ ...card, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "750px" }}>
                    <thead>
                      <tr style={{ background: "#faf8f5", borderBottom: "2px solid #f0ede8" }}>
                        {["Date & Time", "Product", "Reason", "Change", "Notes"].map((h) => (
                          <th key={h} style={{ textAlign: "left", padding: "12px 14px", color: "#6b7280", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMovements.length === 0 ? (
                        <tr><td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>No movements found for this period.</td></tr>
                      ) : (
                        filteredMovements.map((m) => {
                          const isPositive = m.change_amount > 0;
                          return (
                            <tr key={m.id} style={{ borderBottom: "1px solid #faf8f5", transition: "background 0.15s" }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "#faf8f5")} onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                              <td style={{ padding: "13px 14px", fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap" }}>
                                {new Date(m.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </td>
                              <td style={{ padding: "13px 14px", fontWeight: "700", color: "#1C1C1C" }}>{m.products?.name || m.product_id}</td>
                              <td style={{ padding: "13px 14px" }}>
                                <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "700",
                                  background: m.reason === "Production" ? "rgba(31,81,50,0.08)" : m.reason === "Damaged / Waste" ? "#fef2f2" : m.reason === "Order Fulfilled" ? "#eff6ff" : "#f5f3ff",
                                  color: m.reason === "Production" ? GREEN : m.reason === "Damaged / Waste" ? "#ef4444" : m.reason === "Order Fulfilled" ? "#3b82f6" : "#7c3aed",
                                }}>
                                  {m.reason}
                                </span>
                              </td>
                              <td style={{ padding: "13px 14px" }}>
                                <span style={{ fontWeight: "800", fontSize: "15px", color: isPositive ? "#10b981" : "#ef4444" }}>
                                  {isPositive ? "+" : ""}{m.change_amount.toLocaleString()}
                                </span>
                                <span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: "4px" }}>units</span>
                              </td>
                              <td style={{ padding: "13px 14px", fontSize: "12px", color: "#6b7280", fontStyle: m.notes ? "normal" : "italic" }}>
                                {m.notes || "—"}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── TAB 4: MIN STOCK SETTINGS ──────────────────────────────────── */}
        {activeTab === "settings" && (
          <motion.div key="settings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ ...card, padding: "18px 22px", borderLeft: "4px solid " + GOLD, display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <span className="material-symbols-outlined" style={{ color: GOLD, fontSize: "22px", marginTop: "2px" }}>info</span>
              <div>
                <div style={{ fontWeight: "700", fontSize: "14px", color: "#1C1C1C", marginBottom: "4px" }}>About Minimum Stock Thresholds</div>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: "1.5" }}>
                  The minimum stock level is the reorder point for each product. When stock falls below this number,
                  it will appear as a <strong>"Low Stock"</strong> alert in your dashboard and notifications.
                  Set it based on your average weekly/monthly sales volume.
                </p>
              </div>
            </div>

            <div style={{ ...card, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "600px" }}>
                  <thead>
                    <tr style={{ background: "#faf8f5", borderBottom: "2px solid #f0ede8" }}>
                      {["Product", "Category", "Current Stock", "Min. Stock (Reorder Point)", "Action"].map((h) => (
                        <th key={h} style={{ textAlign: "left", padding: "12px 14px", color: "#6b7280", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => {
                      const isEditing = editingMin[item.id] !== undefined;
                      return (
                        <tr key={item.id} style={{ borderBottom: "1px solid #faf8f5", transition: "background 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#faf8f5")} onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                          <td style={{ padding: "13px 14px", fontWeight: "700", color: "#1C1C1C" }}>{item.name}</td>
                          <td style={{ padding: "13px 14px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "600", background: "rgba(31,81,50,0.08)", color: GREEN }}>{item.category}</span>
                          </td>
                          <td style={{ padding: "13px 14px" }}>
                            <span style={{ fontWeight: "700", color: item.stock === 0 ? "#ef4444" : item.stock < item.minStock ? "#f59e0b" : "#1C1C1C" }}>
                              {item.stock.toLocaleString()}
                            </span>
                            <StatusBadge stock={item.stock} minStock={item.minStock} />
                          </td>
                          <td style={{ padding: "13px 14px" }}>
                            {isEditing ? (
                              <input
                                type="number" min="0"
                                value={editingMin[item.id]}
                                onChange={(e) => setEditingMin((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                style={{ width: "90px", padding: "7px 10px", borderRadius: "8px", border: `2px solid ${GREEN}`, fontSize: "13px", fontWeight: "700", outline: "none" }}
                                autoFocus
                              />
                            ) : (
                              <span style={{ fontWeight: "700", color: "#374151", fontSize: "15px" }}>{item.minStock}</span>
                            )}
                          </td>
                          <td style={{ padding: "13px 14px" }}>
                            {isEditing ? (
                              <div style={{ display: "flex", gap: "8px" }}>
                                <motion.button onClick={() => handleSaveMinStock(item.id, editingMin[item.id])}
                                  style={{ padding: "6px 14px", borderRadius: "8px", background: GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}
                                  whileHover={{ opacity: 0.88 }}>Save</motion.button>
                                <button onClick={() => setEditingMin((prev) => { const n = { ...prev }; delete n[item.id]; return n; })}
                                  style={{ padding: "6px 14px", borderRadius: "8px", background: "white", color: "#6b7280", border: "1.5px solid #e5e7eb", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <motion.button onClick={() => setEditingMin((prev) => ({ ...prev, [item.id]: String(item.minStock) }))}
                                style={{ padding: "7px 14px", borderRadius: "8px", border: "1.5px solid #f0ede8", background: "white", fontSize: "12px", fontWeight: "700", cursor: "pointer", color: GREEN, display: "flex", alignItems: "center", gap: "5px" }}
                                whileHover={{ borderColor: GREEN, background: "rgba(31,81,50,0.04)" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>edit</span>
                                Edit
                              </motion.button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ADJUST STOCK MODAL ────────────────────────────────────────────── */}
      <AnimatePresence>
        {adjustModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={(e) => { if (e.target === e.currentTarget) setAdjustModal(null); }}>
            <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
              style={{ background: "white", borderRadius: "22px", padding: "30px", maxWidth: "440px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "800", fontSize: "19px", color: "#1C1C1C", margin: "0 0 4px" }}>Adjust Stock</h3>
                  <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>{adjustModal.name} — Current: <strong style={{ color: "#1C1C1C" }}>{adjustModal.stock}</strong> units</p>
                </div>
                <button onClick={() => setAdjustModal(null)} style={{ background: "#faf8f5", border: "none", borderRadius: "10px", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#6b7280" }}>close</span>
                </button>
              </div>

              {/* Add / Remove Toggle */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "18px" }}>
                {["add", "remove"].map((mode) => (
                  <button key={mode} onClick={() => setAdjustMode(mode)}
                    style={{ padding: "10px", borderRadius: "12px", border: "2px solid", fontWeight: "700", fontSize: "13px", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      background: adjustMode === mode ? (mode === "add" ? "#ecfdf5" : "#fef2f2") : "white",
                      borderColor: adjustMode === mode ? (mode === "add" ? "#10b981" : "#ef4444") : "#e5e7eb",
                      color: adjustMode === mode ? (mode === "add" ? "#10b981" : "#ef4444") : "#6b7280",
                    }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>{mode === "add" ? "add_circle" : "remove_circle"}</span>
                    {mode === "add" ? "Add Stock" : "Remove Stock"}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "7px" }}>Quantity</label>
                <input type="number" min="1" value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} placeholder="Enter quantity"
                  style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1.5px solid #e5e7eb", fontSize: "15px", fontWeight: "700", outline: "none", boxSizing: "border-box", color: "#1C1C1C" }}
                  onFocus={(e) => (e.target.style.borderColor = GREEN)} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "7px" }}>Reason</label>
                <select value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", boxSizing: "border-box", color: "#374151", background: "white" }}>
                  {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "7px" }}>Notes (Optional)</label>
                <textarea value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} placeholder="Add a note about this adjustment…" rows={2}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", boxSizing: "border-box", resize: "vertical", color: "#374151" }}
                  onFocus={(e) => (e.target.style.borderColor = GREEN)} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
              </div>

              {adjustQty && parseInt(adjustQty) > 0 && (
                <div style={{ background: adjustMode === "add" ? "#ecfdf5" : "#fef2f2", borderRadius: "12px", padding: "12px 16px", marginBottom: "18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#374151", fontWeight: "600" }}>New Stock Will Be:</span>
                  <span style={{ fontWeight: "800", fontSize: "18px", color: adjustMode === "add" ? "#10b981" : "#ef4444", fontFamily: "'Poppins',sans-serif" }}>
                    {Math.max(0, adjustModal.stock + (adjustMode === "add" ? parseInt(adjustQty) : -parseInt(adjustQty))).toLocaleString()}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setAdjustModal(null)}
                  style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1.5px solid #e5e7eb", background: "white", fontWeight: "700", fontSize: "13px", cursor: "pointer", color: "#6b7280" }}>
                  Cancel
                </button>
                <motion.button onClick={handleAdjust} disabled={adjusting}
                  style={{ flex: 2, padding: "12px", borderRadius: "12px", background: GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: adjusting ? "not-allowed" : "pointer", opacity: adjusting ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  whileHover={!adjusting ? { opacity: 0.9 } : {}}>
                  {adjusting ? (
                    <><div style={{ width: "16px", height: "16px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Saving…</>
                  ) : (
                    <><span className="material-symbols-outlined" style={{ fontSize: "16px" }}>check_circle</span>Confirm Adjustment</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
