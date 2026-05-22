import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";


const GREEN = "#1F5132";
const GOLD = "#D4A64A";
const card = { background: "white", borderRadius: "16px", border: "1px solid #f0ede8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" };
const AVATARS = ["#1F5132", "#D4A64A", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444", "#f59e0b", "#06b6d4", "#ec4899", "#6366f1"];

export default function CustomersManager({ customers = [], setCustomers, distributors = [], setDistributors }) {
  const mappedDistributors = distributors.map(d => ({
    id: d.id,
    name: d.business,
    owner: d.owner,
    email: d.email,
    phone: d.phone,
    city: d.city,
    state: d.state,
    orders: d.orders,
    spent: d.revenue,
    joined: d.applied,
    status: d.status === "approved" ? "active" : "blocked",
    type: "B2B"
  }));
  
  const mappedCustomers = customers.map(c => ({ ...c, type: "B2C" }));
  const combinedUsers = [...mappedCustomers, ...mappedDistributors];
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [detail, setDetail] = useState(null);
  const [detailTab, setDetailTab] = useState("overview"); // overview, orders, financials
  const [orderSearch, setOrderSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER = 7;

  // Local state for modal orders so they can be edited
  const [modalOrders, setModalOrders] = useState([]);

  const filtered = combinedUsers.filter((c) => {
    const q = search.toLowerCase();
    return (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) &&
      (statusFilter === "All" || c.status === statusFilter) &&
      (typeFilter === "All" || c.type === typeFilter);
  });
  const totalPages = Math.ceil(filtered.length / PER);
  const paged = filtered.slice((page - 1) * PER, page * PER);

  const toggleBlock = (id, type) => {
    if (type === "B2C") {
      setCustomers((cs) => cs.map((c) => c.id === id ? { ...c, status: c.status === "active" ? "blocked" : "active" } : c));
    } else if (setDistributors) {
      setDistributors((ds) => ds.map((d) => d.id === id ? { ...d, status: d.status === "approved" ? "rejected" : "approved" } : d));
    }
    if (detail?.id === id) setDetail((d) => d ? { ...d, status: d.status === "active" ? "blocked" : "active" } : d);
  };

  const initials = (name) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const avatarColor = (id) => AVATARS[parseInt(id.replace(/[^0-9]/g, "") || "0") % AVATARS.length];

  // Generate mock orders exactly once when a customer is opened
  useEffect(() => {
    if (!detail) {
      setModalOrders([]);
      return;
    }
    const numOrders = detail.orders > 0 ? detail.orders : 0;
    let remainingSpent = detail.spent;
    const ordersList = [];
    const statuses = ["delivered", "shipped", "processing", "pending"];
    const today = new Date();
    
    for(let i=0; i<numOrders; i++) {
      const isLast = i === numOrders - 1;
      const amt = isLast ? remainingSpent : Math.floor(Math.random() * (remainingSpent * 0.4)) + 100;
      remainingSpent -= amt;
      
      const orderDate = new Date(today);
      orderDate.setDate(orderDate.getDate() - (i * 14) - Math.floor(Math.random()*5));
      
      const status = i === 0 ? statuses[Math.floor(Math.random() * statuses.length)] : "delivered";
      let paymentStatus = "paid";
      let amountPaid = amt;
      if (status === "pending" || status === "processing") {
        paymentStatus = Math.random() > 0.5 ? "pending" : "partial";
        amountPaid = paymentStatus === "pending" ? 0 : Math.floor(amt * 0.5);
      }
      
      ordersList.push({
        id: `ORD-${detail.type === "B2B" ? "B" : "R"}${Math.floor(1000 + Math.random()*9000)}`,
        date: orderDate.toISOString().split('T')[0],
        amount: amt,
        status: status,
        paymentStatus: paymentStatus,
        amountPaid: amountPaid
      });
    }
    setModalOrders(ordersList);
  }, [detail]);

  // Dynamically calculate financials based on modalOrders
  const financials = useMemo(() => {
    let totalBilled = 0;
    let totalPaid = 0;
    modalOrders.forEach(o => {
      totalBilled += o.amount;
      totalPaid += (o.amountPaid || 0);
    });
    return {
      totalBilled,
      totalPaid,
      balanceDue: totalBilled - totalPaid
    };
  }, [modalOrders]);

  const updateModalPayment = (id, newPayStatus, newAmountPaid) => {
    setModalOrders(prev => prev.map(o => o.id === id ? { ...o, paymentStatus: newPayStatus, amountPaid: newAmountPaid } : o));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "#1C1C1C", margin: 0 }}>Customers</h2>
          <p style={{ color: "#9ca3af", fontSize: "12.5px", margin: "3px 0 0" }}>{filtered.length} registered customers</p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {["All", "B2C", "B2B"].map((t) => (
              <motion.button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
                style={{ padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", border: "1.5px solid", cursor: "pointer", borderColor: typeFilter === t ? GOLD : "#e5e7eb", background: typeFilter === t ? GOLD : "white", color: typeFilter === t ? "white" : "#6b7280" }}
                whileHover={{ scale: 1.03 }}>
                {t === "All" ? "All Types" : t}
              </motion.button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {["All", "active", "blocked"].map((s) => (
              <motion.button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                style={{ padding: "7px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", border: "1.5px solid", cursor: "pointer", borderColor: statusFilter === s ? GREEN : "#e5e7eb", background: statusFilter === s ? GREEN : "white", color: statusFilter === s ? "white" : "#6b7280", textTransform: "capitalize" }}
                whileHover={{ scale: 1.03 }}>
                {s === "All" ? `All Status` : s}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ ...card, padding: "12px 16px" }}>
        <div style={{ position: "relative", maxWidth: "340px" }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "17px" }}>search</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, ID, email, or city…"
            style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white", color: "#1C1C1C", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#faf8f5", borderBottom: "2px solid #f0ede8" }}>
                {["Customer", "Contact", "Location", "Orders", "Total Spent", "Joined", "Status", "Action"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 13px", color: "#6b7280", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #faf8f5", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#faf8f5"} onMouseLeave={e => e.currentTarget.style.background = ""}
                  onClick={() => { setDetail(c); setDetailTab("overview"); setOrderSearch(""); }}>
                  <td style={{ padding: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: avatarColor(c.id), display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "13px", flexShrink: 0 }}>{initials(c.name)}</div>
                      <div>
                        <div style={{ fontWeight: "700", color: "#1C1C1C", display: "flex", alignItems: "center", gap: "6px" }}>
                          {c.name}
                          <span style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "4px", background: c.type === "B2B" ? GOLD : "#3b82f6", color: "white" }}>{c.type}</span>
                        </div>
                        <div style={{ fontSize: "11px", color: "#9ca3af" }}>{c.id} {c.owner ? `· ${c.owner}` : ""}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px" }}>
                    <div style={{ fontSize: "12.5px", color: "#374151" }}>{c.email}</div>
                    <div style={{ fontSize: "11.5px", color: "#9ca3af" }}>{c.phone}</div>
                  </td>
                  <td style={{ padding: "13px" }}>
                    <div style={{ fontWeight: "600", color: "#374151" }}>{c.city}</div>
                    <div style={{ fontSize: "11.5px", color: "#9ca3af" }}>{c.state}</div>
                  </td>
                  <td style={{ padding: "13px", textAlign: "center", fontWeight: "700", color: "#1C1C1C" }}>{c.orders}</td>
                  <td style={{ padding: "13px", fontWeight: "700", color: GREEN }}>₹{c.spent.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "13px", fontSize: "12px", color: "#6b7280" }}>{c.joined}</td>
                  <td style={{ padding: "13px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "600", background: c.status === "active" ? "#ecfdf5" : "#fef2f2", color: c.status === "active" ? "#10b981" : "#ef4444", textTransform: "capitalize" }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "13px" }}>
                    <motion.button onClick={e => { e.stopPropagation(); toggleBlock(c.id, c.type); }}
                      style={{ padding: "5px 12px", borderRadius: "8px", border: "1.5px solid", fontSize: "11px", fontWeight: "700", cursor: "pointer", background: "white", borderColor: c.status === "active" ? "#ef4444" : "#10b981", color: c.status === "active" ? "#ef4444" : "#10b981" }}
                      whileHover={{ scale: 1.04 }}>
                      {c.status === "active" ? "Block" : "Unblock"}
                    </motion.button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>No customers found</td></tr>
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
                  style={{ width: "30px", height: "30px", borderRadius: "8px", border: "1px solid #f0ede8", background: page === i + 1 ? GREEN : "white", color: page === i + 1 ? "white" : "#374151", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}>
                  {i + 1}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customer Detail Dashboard Modal */}
      <AnimatePresence>
        {detail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={(e) => { if (e.target === e.currentTarget) setDetail(null); }}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
              style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "900px", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              
              {/* Header */}
              <div style={{ padding: "24px", background: `linear-gradient(135deg, ${detail.type === "B2B" ? GOLD : GREEN}, ${detail.type === "B2B" ? "#b38836" : "#2d6b45"})`, display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "20px" }}>{initials(detail.name)}</div>
                <div>
                  <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "white", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    {detail.name}
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.2)", color: "white" }}>{detail.type}</span>
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12.5px", margin: "3px 0 0" }}>{detail.id} {detail.owner ? `· ${detail.owner}` : ""} · Joined {detail.joined}</p>
                </div>
                <button onClick={() => setDetail(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.8)" }} onMouseEnter={e=>e.currentTarget.style.color="white"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.8)"}>
                  <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>close</span>
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid #f0ede8", background: "#faf8f5", padding: "0 24px", gap: "24px", flexShrink: 0 }}>
                {[
                  { id: "overview", label: "Overview", icon: "person" },
                  { id: "orders", label: "Order History", icon: "receipt_long" },
                  { id: "financials", label: "Financials", icon: "account_balance" }
                ].map(t => (
                  <button key={t.id} onClick={() => { setDetailTab(t.id); setOrderSearch(""); }}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "14px 0", background: "none", border: "none", borderBottom: detailTab === t.id ? `3px solid ${detail.type === "B2B" ? GOLD : GREEN}` : "3px solid transparent", color: detailTab === t.id ? (detail.type === "B2B" ? GOLD : GREEN) : "#6b7280", fontWeight: "600", fontSize: "13px", cursor: "pointer", transition: "all 0.15s" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>
                
                {/* ── OVERVIEW TAB ── */}
                {detailTab === "overview" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "24px" }}>
                      {[["mail", "Email", detail.email], ["phone", "Phone", detail.phone], ["location_on", "Location", `${detail.city}, ${detail.state}`], ["shopping_bag", "Orders", `${detail.orders} orders`]].map(([icon, label, val]) => (
                        <div key={icon} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "12px", borderRadius: "10px", border: "1px solid #f0ede8" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f5f1ea", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{icon}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: "11px", color: "#9ca3af" }}>{label}</div>
                            <div style={{ fontSize: "13px", color: "#1C1C1C", fontWeight: "600" }}>{val}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                      <div style={{ padding: "16px", background: "#faf8f5", borderRadius: "12px", textAlign: "center", border: "1px solid #f0ede8" }}>
                        <div style={{ fontSize: "28px", fontWeight: "700", color: detail.type === "B2B" ? GOLD : GREEN, fontFamily: "'Poppins',sans-serif" }}>{detail.orders}</div>
                        <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" }}>Total Orders</div>
                      </div>
                      <div style={{ padding: "16px", background: "#faf8f5", borderRadius: "12px", textAlign: "center", border: "1px solid #f0ede8" }}>
                        <div style={{ fontSize: "28px", fontWeight: "700", color: detail.type === "B2B" ? GOLD : GREEN, fontFamily: "'Poppins',sans-serif" }}>₹{(detail.spent / 1000).toFixed(1)}K</div>
                        <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" }}>Total Spent</div>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "8px" }}>
                      <motion.button onClick={() => toggleBlock(detail.id, detail.type)}
                        style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1.5px solid", fontWeight: "700", fontSize: "13px", cursor: "pointer", background: "white", borderColor: detail.status === "active" ? "#ef4444" : "#10b981", color: detail.status === "active" ? "#ef4444" : "#10b981" }}
                        whileTap={{ scale: 0.97 }}>
                        {detail.status === "active" ? "Block Customer" : "Unblock Customer"}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ── ORDERS & FINANCIALS TABS ── */}
                {(detailTab === "orders" || detailTab === "financials") && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    
                    {detailTab === "financials" && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                        <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#64748b" }}>receipt</span>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Total Billed</span>
                          </div>
                          <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>₹{financials.totalBilled.toLocaleString("en-IN")}</div>
                        </div>

                        <div style={{ padding: "20px", background: "#ecfdf5", borderRadius: "16px", border: "1px solid #a7f3d0" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#10b981" }}>check_circle</span>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#059669", textTransform: "uppercase" }}>Total Paid</span>
                          </div>
                          <div style={{ fontSize: "24px", fontWeight: "800", color: "#047857" }}>₹{financials.totalPaid.toLocaleString("en-IN")}</div>
                        </div>

                        <div style={{ padding: "20px", background: "#fef2f2", borderRadius: "16px", border: "1px solid #fecaca" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#ef4444" }}>pending_actions</span>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#dc2626", textTransform: "uppercase" }}>Balance Due</span>
                          </div>
                          <div style={{ fontSize: "24px", fontWeight: "800", color: "#b91c1c" }}>₹{financials.balanceDue.toLocaleString("en-IN")}</div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1C1C1C", fontFamily: "'Poppins',sans-serif" }}>
                        {detailTab === "orders" ? "All Orders" : "Payment & Status Breakdown"}
                      </h4>
                      <div style={{ position: "relative", width: "260px" }}>
                        <span className="material-symbols-outlined" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "16px" }}>search</span>
                        <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="Search by Order ID or Date..."
                          style={{ width: "100%", padding: "7px 12px 7px 32px", borderRadius: "8px", border: "1.5px solid #e5e7eb", fontSize: "12px", outline: "none", background: "white", color: "#1C1C1C", boxSizing: "border-box" }} />
                      </div>
                    </div>
                    
                    {modalOrders.filter(o => o.id.toLowerCase().includes(orderSearch.toLowerCase()) || o.date.includes(orderSearch)).length > 0 ? (
                      <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                          <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                            <tr>
                              <th style={{ padding: "10px 14px", textAlign: "left", color: "#6b7280", fontWeight: "600", fontSize: "11px", textTransform: "uppercase" }}>Order ID</th>
                              {detailTab === "orders" && <th style={{ padding: "10px 14px", textAlign: "left", color: "#6b7280", fontWeight: "600", fontSize: "11px", textTransform: "uppercase" }}>Date</th>}
                              <th style={{ padding: "10px 14px", textAlign: "right", color: "#6b7280", fontWeight: "600", fontSize: "11px", textTransform: "uppercase" }}>Order Amount</th>
                              <th style={{ padding: "10px 14px", textAlign: "center", color: "#6b7280", fontWeight: "600", fontSize: "11px", textTransform: "uppercase" }}>Payment Status</th>
                              <th style={{ padding: "10px 14px", textAlign: "right", color: "#6b7280", fontWeight: "600", fontSize: "11px", textTransform: "uppercase" }}>Amount Paid</th>
                              <th style={{ padding: "10px 14px", textAlign: "right", color: "#6b7280", fontWeight: "600", fontSize: "11px", textTransform: "uppercase" }}>Balance</th>
                              {detailTab === "orders" && <th style={{ padding: "10px 14px", textAlign: "center", color: "#6b7280", fontWeight: "600", fontSize: "11px", textTransform: "uppercase" }}>Invoice</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {modalOrders.filter(o => o.id.toLowerCase().includes(orderSearch.toLowerCase()) || o.date.includes(orderSearch)).map((o, i, arr) => {
                              const bal = o.amount - (o.amountPaid || 0);
                              return (
                                <tr key={o.id} style={{ borderBottom: i === arr.length - 1 ? "none" : "1px solid #e5e7eb", background: "white" }}>
                                  <td style={{ padding: "12px 14px", fontWeight: "700", color: detail.type === "B2B" ? GOLD : GREEN }}>{o.id}</td>
                                  {detailTab === "orders" && <td style={{ padding: "12px 14px", color: "#6b7280" }}>{o.date}</td>}
                                  <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: "600", color: "#1C1C1C" }}>₹{o.amount.toLocaleString("en-IN")}</td>
                                  
                                  {/* Editable Payment Status */}
                                  <td style={{ padding: "12px 14px", textAlign: "center" }}>
                                    <select value={o.paymentStatus} onChange={e => {
                                        const newPay = e.target.value;
                                        let newAmt = o.amountPaid;
                                        if (newPay === "paid") newAmt = o.amount;
                                        if (newPay === "pending") newAmt = 0;
                                        updateModalPayment(o.id, newPay, newAmt);
                                      }}
                                      style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "11px", fontWeight: "600", cursor: "pointer", outline: "none", color: "#374151", background: o.paymentStatus==="paid"?"#ecfdf5":o.paymentStatus==="partial"?"#fffbeb":"#fef2f2" }}>
                                      <option value="pending">Pending</option>
                                      <option value="partial">Partial</option>
                                      <option value="paid">Full Paid</option>
                                    </select>
                                  </td>
                                  
                                  {/* Editable Amount Paid */}
                                  <td style={{ padding: "12px 14px", textAlign: "right" }}>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>₹</span>
                                      <input 
                                        type="number" min="0" max={o.amount}
                                        value={o.amountPaid === 0 ? "" : o.amountPaid}
                                        placeholder="0"
                                        onChange={e => {
                                          const val = parseInt(e.target.value, 10) || 0;
                                          let newPay = "partial";
                                          if (val <= 0) newPay = "pending";
                                          if (val >= o.amount) newPay = "paid";
                                          updateModalPayment(o.id, newPay, val);
                                        }}
                                        style={{ width: "70px", padding: "4px 6px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "12px", outline: "none", color: "#1C1C1C", fontWeight: "600", textAlign: "right" }}
                                        onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = "#d1d5db"}
                                      />
                                    </div>
                                  </td>

                                  <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: "700", color: bal > 0 ? "#ef4444" : "#10b981" }}>₹{bal.toLocaleString("en-IN")}</td>
                                  
                                  {detailTab === "orders" && (
                                    <td style={{ padding: "12px 14px", textAlign: "center" }}>
                                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }} onMouseEnter={e=>e.currentTarget.style.color=GREEN} onMouseLeave={e=>e.currentTarget.style.color="#9ca3af"}>
                                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>download</span>
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af", border: "1px dashed #d1d5db", borderRadius: "12px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "32px", marginBottom: "10px" }}>receipt_long</span>
                        <div>No matching orders found.</div>
                      </div>
                    )}
                  </motion.div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
