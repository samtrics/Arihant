import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";

const GREEN = "#1F5132";
const GOLD = "#D4A64A";
const card = { background: "white", borderRadius: "16px", border: "1px solid #f0ede8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" };

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];
const statusColors = { delivered: "#10b981", shipped: "#3b82f6", processing: "#f59e0b", pending: "#8b5cf6", cancelled: "#ef4444" };
const statusBg = { delivered: "#ecfdf5", shipped: "#eff6ff", processing: "#fffbeb", pending: "#f5f3ff", cancelled: "#fef2f2" };
const payColors = { paid: "#10b981", pending: "#f59e0b", refunded: "#6b7280" };
const payBg = { paid: "#ecfdf5", pending: "#fffbeb", refunded: "#f3f4f6" };

const TIMELINE = [
  { status: "pending", label: "Order Placed", icon: "shopping_bag" },
  { status: "processing", label: "Processing", icon: "settings_suggest" },
  { status: "shipped", label: "Shipped", icon: "local_shipping" },
  { status: "delivered", label: "Delivered", icon: "check_circle" },
];

const MOCK_DISTRIBUTORS = [
  { id: "DIS-001", name: "Patel Provision Store", city: "Surat" },
  { id: "DIS-002", name: "Sharma Wholesale", city: "Ahmedabad" },
  { id: "DIS-003", name: "Gupta Traders", city: "Jaipur" },
];

export default function OrdersManager({ products = [], retailOrders = [], setRetailOrders, b2bOrders = [], setB2bOrders, distributors = [] }) {
  const [activeTab, setActiveTab] = useState("retail");
  const [orders, setOrders] = useState(retailOrders);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [detail, setDetail] = useState(null);
  const [page, setPage] = useState(1);
  const PER = 8;

  const [isCreatingB2B, setIsCreatingB2B] = useState(false);
  const [newB2BOrder, setNewB2BOrder] = useState({ distributorId: "", cart: {} });

  useEffect(() => {
    setLoading(true);
    supabase.from('orders').select('*').order('date', { ascending: false }).then(({ data, error }) => {
      if (!error && data) setOrders(data);
      setLoading(false);
    });
  }, [activeTab]);

  const currentOrders = orders;

  const filtered = currentOrders.filter((o) => {
    const q = search.toLowerCase();
    const mQ = (o.id || '').toLowerCase().includes(q) || (o.customer || '').toLowerCase().includes(q);
    const mS = statusFilter === "All" || o.status === statusFilter;
    return mQ && mS;
  });
  const totalPages = Math.ceil(filtered.length / PER);
  const paged = filtered.slice((page - 1) * PER, page * PER);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      if (detail?.id === id) setDetail({ ...detail, status: newStatus });
    }
  };

  const timelineStep = (status) => {
    if (status === "cancelled") return -1;
    return STATUS_OPTIONS.indexOf(status);
  };

  const handleCreateB2BOrder = async () => {
    if (!newB2BOrder.distributorId || Object.keys(newB2BOrder.cart).length === 0) return;
    
    // We use the passed distributors prop, filtered for approved.
    const activeDistributors = distributors.filter(d => d.status === "approved");
    const dist = activeDistributors.find(d => d.id === newB2BOrder.distributorId) || MOCK_DISTRIBUTORS.find(d => d.id === newB2BOrder.distributorId);
    
    let totalAmt = 0;
    const finalProducts = [];
    
    Object.keys(newB2BOrder.cart).forEach(pid => {
      const p = products.find(x => x.id === pid);
      if (p) {
        const qty = newB2BOrder.cart[pid];
        const price = p.offerPrice ? parseFloat(p.offerPrice) : parseFloat(p.price);
        // Apply 15% wholesale discount
        const b2bPrice = price * 0.85;
        totalAmt += b2bPrice * qty;
        finalProducts.push({ name: p.name, qty, price: b2bPrice, total: b2bPrice * qty });
      }
    });

    const newOrder = {
      order_number: `B2B-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: dist.name || dist.business,
      amount: totalAmt,
      status: "pending",
      payment_status: "pending",
      products: finalProducts
    };

    const { data, error } = await supabase.from('orders').insert([newOrder]).select();

    if (!error && data) {
      // Add the local UI fields that are not in DB schema but used in rendering
      const insertedOrder = {
        ...data[0],
        id: data[0].id,
        order_number: data[0].order_number,
        customer: data[0].customer_name,
        city: dist.city, // Extracted locally since it's not in DB
        distributorId: dist.id,
        date: new Date().toISOString().split('T')[0],
        items: finalProducts.length,
        amount: data[0].amount,
        status: data[0].status,
        payment: data[0].payment_status,
        amountPaid: 0,
        products: finalProducts
      };

      setB2bOrders([insertedOrder, ...b2bOrders]);
      setIsCreatingB2B(false);
      setNewB2BOrder({ distributorId: "", cart: {} });
    } else {
      console.error("Failed to create B2B order", error);
    }
  };

  const updateNewOrderQty = (pid, qty) => {
    const val = parseInt(qty, 10);
    setNewB2BOrder(prev => {
      const c = { ...prev.cart };
      if (isNaN(val) || val <= 0) delete c[pid];
      else c[pid] = val;
      return { ...prev, cart: c };
    });
  };

  const inp = { padding: "9px 12px 9px 36px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white", color: "#1C1C1C" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      
      {/* ── Header & Tabs ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "10px", borderBottom: "2px solid #f0ede8", paddingBottom: "16px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "24px", color: "#1C1C1C", margin: 0 }}>Order Management</h2>
          <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
            <button 
              onClick={() => { setActiveTab("retail"); setPage(1); setStatusFilter("All"); setSearch(""); }}
              style={{ background: "none", border: "none", padding: "0 0 8px", fontSize: "15px", fontWeight: "700", cursor: "pointer", borderBottom: activeTab === "retail" ? `3px solid ${GREEN}` : "3px solid transparent", color: activeTab === "retail" ? GREEN : "#9ca3af", transition: "all 0.2s" }}>
              B2C Retail Orders
            </button>
            <button 
              onClick={() => { setActiveTab("b2b"); setPage(1); setStatusFilter("All"); setSearch(""); }}
              style={{ background: "none", border: "none", padding: "0 0 8px", fontSize: "15px", fontWeight: "700", cursor: "pointer", borderBottom: activeTab === "b2b" ? `3px solid ${GOLD}` : "3px solid transparent", color: activeTab === "b2b" ? GOLD : "#9ca3af", transition: "all 0.2s" }}>
              B2B Wholesale Orders
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
          {activeTab === "b2b" && (
            <motion.button onClick={() => setIsCreatingB2B(true)} style={{ padding: "9px 18px", borderRadius: "10px", border: "none", background: GOLD, color: "white", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }} whileHover={{ opacity: 0.9 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add_box</span>
              Create B2B Order
            </motion.button>
          )}
          <motion.button style={{ padding: "9px 18px", borderRadius: "10px", border: "1.5px solid #f0ede8", background: "white", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "#374151" }} whileHover={{ borderColor: GREEN, color: GREEN }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
            Export
          </motion.button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
        {["All", ...STATUS_OPTIONS].map((s) => (
          <motion.button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            style={{ padding: "7px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", border: "1.5px solid", cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize", borderColor: statusFilter === s ? (s === "All" ? (activeTab==="b2b"?GOLD:GREEN) : statusColors[s] || GREEN) : "#e5e7eb", background: statusFilter === s ? (s === "All" ? (activeTab==="b2b"?GOLD:GREEN) : statusColors[s] + "18") : "white", color: statusFilter === s ? (s === "All" ? "white" : statusColors[s]) : "#6b7280" }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {s === "All" ? `All (${currentOrders.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${currentOrders.filter(o => o.status === s).length})`}
          </motion.button>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ ...card, padding: "12px 16px" }}>
        <div style={{ position: "relative", maxWidth: "400px" }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "17px" }}>search</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder={`Search ${activeTab.toUpperCase()} order ID, customer or code…`} style={inp} />
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#faf8f5", borderBottom: "2px solid #f0ede8" }}>
                {["Order ID", activeTab === "b2b" ? "Distributor" : "Customer", "Date", "Items", "Amount", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 13px", color: "#6b7280", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid #faf8f5", transition: "background 0.15s", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#faf8f5"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}
                  onClick={() => setDetail(o)}>
                  <td style={{ padding: "13px", fontWeight: "700", color: activeTab === "b2b" ? GOLD : GREEN }}>{o.id}</td>
                  <td style={{ padding: "13px" }}>
                    <div style={{ fontWeight: "600", color: "#1C1C1C" }}>{o.customer}</div>
                    <div style={{ fontSize: "11px", color: "#9ca3af" }}>{activeTab === "b2b" ? `Code: ${o.distributorId} | ${o.city}` : o.city}</div>
                  </td>
                  <td style={{ padding: "13px", color: "#6b7280", fontSize: "12px" }}>{o.date}</td>
                  <td style={{ padding: "13px", fontWeight: "600" }}>{o.items} {activeTab === "b2b" ? "SKUs" : ""}</td>
                  <td style={{ padding: "13px", fontWeight: "700", color: "#1C1C1C" }}>₹{o.amount.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "13px" }}>
                    <select value={o.status} onChange={e => { e.stopPropagation(); updateStatus(o.id, e.target.value); }}
                      style={{ padding: "4px 8px", borderRadius: "8px", border: "1.5px solid", fontSize: "11px", fontWeight: "600", cursor: "pointer", background: statusBg[o.status], color: statusColors[o.status], borderColor: statusColors[o.status] + "44", textTransform: "capitalize" }}
                      onClick={e => e.stopPropagation()}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s} style={{ background: "white", color: "#1C1C1C", textTransform: "capitalize" }}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "13px" }}>
                    <motion.button onClick={e => { e.stopPropagation(); setDetail(o); }}
                      style={{ padding: "6px", borderRadius: "8px", border: "1px solid #f0ede8", background: "white", cursor: "pointer", color: "#6b7280", lineHeight: 1 }}
                      whileHover={{ background: "#eff6ff", color: "#3b82f6", borderColor: "#3b82f6" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>open_in_new</span>
                    </motion.button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid #f0ede8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Showing {(page - 1) * PER + 1}–{Math.min(page * PER, filtered.length)} of {filtered.length}</span>
            <div style={{ display: "flex", gap: "6px" }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <motion.button key={i} onClick={() => setPage(i + 1)}
                  style={{ width: "30px", height: "30px", borderRadius: "8px", border: "1px solid #f0ede8", background: page === i + 1 ? (activeTab==="b2b"?GOLD:GREEN) : "white", color: page === i + 1 ? "white" : "#374151", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}>
                  {i + 1}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Order Detail Modal ── */}
      <AnimatePresence>
        {detail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={(e) => { if (e.target === e.currentTarget) setDetail(null); }}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "560px", overflow: "hidden" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid #f0ede8", display: "flex", justifyContent: "space-between", alignItems: "center", background: activeTab === "b2b" ? "rgba(212,166,74,0.05)" : "transparent" }}>
                <div>
                  <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "18px", margin: 0, color: activeTab === "b2b" ? GOLD : GREEN }}>{detail.id}</h3>
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: "2px 0 0" }}>Placed on {detail.date} {activeTab === "b2b" && <span style={{ padding: "2px 6px", background: GOLD, color: "white", borderRadius: "4px", fontSize: "10px", marginLeft: "6px", fontWeight: "700" }}>B2B</span>}</p>
                </div>
                <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>close</span>
                </button>
              </div>
              <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "18px" }}>
                {/* Customer info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#9ca3af", marginTop: "1px" }}>{activeTab === "b2b" ? "storefront" : "person"}</span>
                    <div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>{activeTab === "b2b" ? "Distributor" : "Customer"}</div>
                      <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#1C1C1C" }}>{detail.customer}</div>
                      {activeTab === "b2b" && <div style={{ fontSize: "11px", color: "#6b7280" }}>Code: {detail.distributorId}</div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#9ca3af", marginTop: "1px" }}>calendar_today</span>
                    <div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>Order Date</div>
                      <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#1C1C1C" }}>{detail.date}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#9ca3af", marginTop: "1px" }}>location_on</span>
                    <div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>Delivery Location</div>
                      <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#1C1C1C" }}>{detail.city}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#9ca3af", marginTop: "1px" }}>receipt_long</span>
                    <div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>Order Total</div>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "#1C1C1C" }}>₹{detail.amount.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </div>

                {/* Products & Bill Breakdown */}
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "8px" }}>Products & Bill Summary</div>
                  
                  {activeTab === "retail" ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {detail.products?.map((p, i) => (
                        <span key={i} style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", background: "rgba(31,81,50,0.08)", color: GREEN }}>{p}</span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                        <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                          <tr>
                            <th style={{ padding: "8px 12px", textAlign: "left", color: "#6b7280", fontWeight: "600", fontSize: "11px" }}>Product</th>
                            <th style={{ padding: "8px 12px", textAlign: "center", color: "#6b7280", fontWeight: "600", fontSize: "11px" }}>Qty</th>
                            <th style={{ padding: "8px 12px", textAlign: "right", color: "#6b7280", fontWeight: "600", fontSize: "11px" }}>Price</th>
                            <th style={{ padding: "8px 12px", textAlign: "right", color: "#6b7280", fontWeight: "600", fontSize: "11px" }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.products?.map((p, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                              <td style={{ padding: "8px 12px", fontWeight: "600", color: "#374151" }}>{p.name}</td>
                              <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: "700", color: "#1C1C1C" }}>{p.qty}</td>
                              <td style={{ padding: "8px 12px", textAlign: "right", color: "#6b7280" }}>₹{(p.price || 0).toLocaleString("en-IN")}</td>
                              <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "600", color: "#1C1C1C" }}>₹{(p.total || 0).toLocaleString("en-IN")}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot style={{ background: "#faf8f5" }}>
                          <tr>
                            <td colSpan={3} style={{ padding: "10px 12px", textAlign: "right", fontWeight: "700", fontSize: "12px", color: "#6b7280", textTransform: "uppercase" }}>Total Bill Generate:</td>
                            <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: "800", fontSize: "15px", color: GOLD }}>₹{detail.amount.toLocaleString("en-IN")}</td>
                          </tr>
                          <tr>
                            <td colSpan={3} style={{ padding: "6px 12px", textAlign: "right", fontWeight: "600", fontSize: "11px", color: "#6b7280", textTransform: "uppercase" }}>Amount Paid:</td>
                            <td style={{ padding: "6px 12px", textAlign: "right", fontWeight: "700", fontSize: "13px", color: "#10b981" }}>₹{(detail.amountPaid || 0).toLocaleString("en-IN")}</td>
                          </tr>
                          <tr>
                            <td colSpan={3} style={{ padding: "6px 12px 10px", textAlign: "right", fontWeight: "600", fontSize: "11px", color: "#6b7280", textTransform: "uppercase" }}>Balance Due:</td>
                            <td style={{ padding: "6px 12px 10px", textAlign: "right", fontWeight: "700", fontSize: "13px", color: "#ef4444" }}>₹{(detail.amount - (detail.amountPaid || 0)).toLocaleString("en-IN")}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                {detail.status !== "cancelled" && (
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "14px" }}>Order Progress</div>
                    <div style={{ display: "flex", gap: "0" }}>
                      {TIMELINE.map((t, i) => {
                        const current = timelineStep(detail.status);
                        const done = i <= current;
                        const ACTIVE_COLOR = activeTab === "b2b" ? GOLD : GREEN;
                        return (
                          <div key={t.status} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                            {i < TIMELINE.length - 1 && (
                              <div style={{ position: "absolute", top: "18px", left: "50%", width: "100%", height: "2px", background: done && i < current ? ACTIVE_COLOR : "#e5e7eb" }} />
                            )}
                            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: done ? ACTIVE_COLOR : "white", border: `2px solid ${done ? ACTIVE_COLOR : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, flexShrink: 0 }}>
                              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: done ? "white" : "#9ca3af" }}>{t.icon}</span>
                            </div>
                            <div style={{ fontSize: "10px", fontWeight: "600", color: done ? ACTIVE_COLOR : "#9ca3af", marginTop: "6px", textAlign: "center" }}>{t.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Update status & payment */}
                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "10px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1, minWidth: "200px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#374151", whiteSpace: "nowrap" }}>Update Status:</span>
                    <select value={detail.status} onChange={e => updateStatus(detail.id, e.target.value)}
                      style={{ flex: 1, padding: "8px 12px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white", color: "#1C1C1C" }}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                  
                  {activeTab === "b2b" && (
                    <div style={{ display: "flex", gap: "16px", alignItems: "center", flex: 2, minWidth: "320px", flexWrap: "wrap", background: "#f9fafb", padding: "8px 12px", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</span>
                        <select value={detail.payment || "pending"} onChange={e => {
                          const newPay = e.target.value;
                          let newAmt = detail.amountPaid || 0;
                          if (newPay === "paid") newAmt = detail.amount;
                          if (newPay === "pending") newAmt = 0;
                          setB2bOrders(b2bOrders.map(o => o.id === detail.id ? { ...o, payment: newPay, amountPaid: newAmt } : o));
                          setDetail({ ...detail, payment: newPay, amountPaid: newAmt });
                        }}
                          style={{ padding: "6px 8px", borderRadius: "6px", border: "1.5px solid #d1d5db", fontSize: "12px", outline: "none", background: "white", color: "#1C1C1C", fontWeight: "600" }}>
                          <option value="pending">Pending</option>
                          <option value="partial">Partial</option>
                          <option value="paid">Full Paid</option>
                        </select>
                      </div>
                      
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>Amount Paid: ₹</span>
                        <input 
                          type="number" min="0" max={detail.amount}
                          value={detail.amountPaid || ""}
                          onChange={e => {
                            const val = parseInt(e.target.value, 10) || 0;
                            let newPay = "partial";
                            if (val <= 0) newPay = "pending";
                            if (val >= detail.amount) newPay = "paid";
                            setB2bOrders(b2bOrders.map(o => o.id === detail.id ? { ...o, payment: newPay, amountPaid: val } : o));
                            setDetail({ ...detail, payment: newPay, amountPaid: val });
                          }}
                          style={{ width: "90px", padding: "6px 8px", borderRadius: "6px", border: "1.5px solid #d1d5db", fontSize: "13px", outline: "none", background: "white", color: "#1C1C1C", fontWeight: "700", textAlign: "right" }}
                          onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = "#d1d5db"}
                        />
                        <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600" }}>/ {detail.amount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ padding: "14px 22px", borderTop: "1px solid #f0ede8", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <motion.button onClick={() => setDetail(null)} style={{ padding: "8px 20px", borderRadius: "10px", background: activeTab === "b2b" ? GOLD : GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "12.5px", cursor: "pointer" }}
                  whileHover={{ opacity: 0.9 }}>Close</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Create B2B Order Modal ── */}
      <AnimatePresence>
        {isCreatingB2B && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "700px", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid #f0ede8", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(212,166,74,0.05)" }}>
                <div>
                  <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "18px", margin: 0, color: GOLD }}>Create Wholesale Order</h3>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0" }}>Draft a new B2B order on behalf of a distributor.</p>
                </div>
                <button onClick={() => setIsCreatingB2B(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>close</span>
                </button>
              </div>
              
              <div style={{ padding: "20px 22px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Select Distributor */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>Select Distributor</label>
                  <select 
                    value={newB2BOrder.distributorId} 
                    onChange={e => setNewB2BOrder({ ...newB2BOrder, distributorId: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white" }}>
                    <option value="">-- Choose a Distributor --</option>
                    {(distributors.filter(d => d.status === "approved").length > 0 
                      ? distributors.filter(d => d.status === "approved") 
                      : MOCK_DISTRIBUTORS
                    ).map(d => (
                      <option key={d.id} value={d.id}>{d.business || d.name} ({d.id}) - {d.city}</option>
                    ))}
                  </select>
                </div>

                {/* Product List */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>Add Products (Wholesale Quantities)</label>
                  <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                        <tr>
                          <th style={{ padding: "10px 12px", textAlign: "left", color: "#6b7280", fontWeight: "600", fontSize: "11px" }}>Product</th>
                          <th style={{ padding: "10px 12px", textAlign: "left", color: "#6b7280", fontWeight: "600", fontSize: "11px" }}>SKU</th>
                          <th style={{ padding: "10px 12px", textAlign: "center", color: "#6b7280", fontWeight: "600", fontSize: "11px", width: "100px" }}>Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.filter(p => p.status !== "inactive").map((p, i) => (
                          <tr key={p.id} style={{ borderBottom: i === products.length - 1 ? "none" : "1px solid #e5e7eb" }}>
                            <td style={{ padding: "8px 12px", fontWeight: "600", color: "#1C1C1C" }}>{p.name} <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: "400" }}>({p.weightValue}{p.weightUnit})</span></td>
                            <td style={{ padding: "8px 12px", color: "#6b7280", fontFamily: "monospace", fontSize: "11px" }}>{p.sku}</td>
                            <td style={{ padding: "8px 12px" }}>
                              <input 
                                type="number" min="0" placeholder="0"
                                value={newB2BOrder.cart[p.id] || ""}
                                onChange={e => updateNewOrderQty(p.id, e.target.value)}
                                style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid #d1d5db", textAlign: "center", outline: "none", fontSize: "13px" }}
                                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = "#d1d5db"}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div style={{ padding: "14px 22px", borderTop: "1px solid #f0ede8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>{Object.keys(newB2BOrder.cart).length} unique SKUs selected</span>
                <div style={{ display: "flex", gap: "10px" }}>
                  <motion.button onClick={() => setIsCreatingB2B(false)} style={{ padding: "10px 20px", borderRadius: "10px", background: "white", border: "1px solid #d1d5db", color: "#374151", fontWeight: "600", fontSize: "13px", cursor: "pointer" }} whileHover={{ background: "#f9fafb" }}>Cancel</motion.button>
                  <motion.button 
                    onClick={handleCreateB2BOrder}
                    disabled={!newB2BOrder.distributorId || Object.keys(newB2BOrder.cart).length === 0}
                    style={{ padding: "10px 24px", borderRadius: "10px", background: GOLD, color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: (!newB2BOrder.distributorId || Object.keys(newB2BOrder.cart).length === 0) ? "not-allowed" : "pointer", opacity: (!newB2BOrder.distributorId || Object.keys(newB2BOrder.cart).length === 0) ? 0.5 : 1 }} 
                    whileHover={{ opacity: 0.9 }}>
                    Draft & Submit Order
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
