import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";

const GREEN = "#1F5132";
const GOLD = "#D4A64A";
const card = { background: "white", borderRadius: "16px", border: "1px solid #f0ede8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" };
const tabs = ["All", "pending", "approved", "rejected"];
const statusColors = { approved: "#10b981", pending: "#f59e0b", rejected: "#ef4444" };
const statusBg = { approved: "#ecfdf5", pending: "#fffbeb", rejected: "#fef2f2" };

export default function DistributorManager({ distributors: propDistributors = [], setDistributors: setPropDistributors }) {
  const [distributors, setDistributors] = useState(propDistributors);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const [detailTab, setDetailTab] = useState("overview");
  const [orderSearch, setOrderSearch] = useState("");
  const [modalOrders, setModalOrders] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Initial fetch
    supabase.from('distributors').select('*').order('applied', { ascending: false }).then(({ data, error }) => {
      if (!error && data) setDistributors(data);
      setLoading(false);
    });

    // Listen for realtime updates from Supabase
    const channel = supabase
      .channel('distributors-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'distributors' }, () => {
        supabase.from('distributors').select('*').order('applied', { ascending: false }).then(({ data }) => {
          if (data) setDistributors(data);
        });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const filtered = distributors.filter((d) => {
    const q = search.toLowerCase();
    const mQ = (d.business || '').toLowerCase().includes(q) || (d.owner || '').toLowerCase().includes(q) || (d.city || '').toLowerCase().includes(q);
    const mT = tab === "All" || d.status === tab;
    return mQ && mT;
  });

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('distributors').update({ status }).eq('id', id);
    if (!error) {
      setDistributors(ds => ds.map(d => d.id === id ? { ...d, status } : d));
      if (detail?.id === id) setDetail(d => d ? { ...d, status } : d);
    }
  };

  const countByStatus = (s) => distributors.filter((d) => d.status === s).length;

  // Generate mock orders for approved distributors
  useEffect(() => {
    if (!detail || detail.status !== "approved" || detail.orders <= 0) {
      setModalOrders([]);
      return;
    }
    const numOrders = detail.orders;
    let remainingSpent = detail.revenue;
    const ordersList = [];
    const statuses = ["delivered", "shipped", "processing", "pending"];
    const today = new Date();
    
    for(let i=0; i<numOrders; i++) {
      const isLast = i === numOrders - 1;
      const amt = isLast ? remainingSpent : Math.floor(Math.random() * (remainingSpent * 0.4)) + 1000;
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
        id: `ORD-B${Math.floor(1000 + Math.random()*9000)}`,
        date: orderDate.toISOString().split('T')[0],
        amount: amt,
        status: status,
        paymentStatus: paymentStatus,
        amountPaid: amountPaid
      });
    }
    setModalOrders(ordersList);
  }, [detail]);

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
      {/* Header */}
      <div>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "#1C1C1C", margin: 0 }}>Distributor Applications</h2>
        <p style={{ color: "#9ca3af", fontSize: "12.5px", margin: "3px 0 0" }}>Manage and approve distributor partnership applications</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
        {[["All Applications", distributors.length, "#6b7280", "#f3f4f6", "group"], ["Pending", countByStatus("pending"), "#f59e0b", "#fffbeb", "pending_actions"], ["Approved", countByStatus("approved"), "#10b981", "#ecfdf5", "check_circle"], ["Rejected", countByStatus("rejected"), "#ef4444", "#fef2f2", "cancel"]].map(([label, val, color, bg, icon]) => (
          <motion.div key={label} style={{ ...card, padding: "16px", display: "flex", gap: "12px", alignItems: "center" }}
            whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.07)" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px", color }}>{icon}</span>
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "22px", fontFamily: "'Poppins',sans-serif", color: "#1C1C1C" }}>{val}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>{label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs + search */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {tabs.map((t) => (
            <motion.button key={t} onClick={() => setTab(t)}
              style={{ padding: "7px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", border: "1.5px solid", cursor: "pointer", textTransform: "capitalize", borderColor: tab === t ? (t === "All" ? GREEN : statusColors[t] || GREEN) : "#e5e7eb", background: tab === t ? (t === "All" ? GREEN : statusColors[t] + "18") : "white", color: tab === t ? (t === "All" ? "white" : statusColors[t]) : "#6b7280" }}>
              {t}
            </motion.button>
          ))}
        </div>
        <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "16px" }}>search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by business, owner, city…"
            style={{ width: "100%", padding: "8px 12px 8px 34px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Applications list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((d) => (
          <motion.div key={d.id} style={{ ...card, padding: "18px 20px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", cursor: "pointer" }}
            whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.07)" }}
            onClick={() => { setDetail(d); setDetailTab("overview"); setOrderSearch(""); }}>
            {/* Avatar */}
            <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: `linear-gradient(135deg, ${GOLD}, #b38836)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "16px", flexShrink: 0 }}>
              {d.business[0]}
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: "200px" }}>
              <div style={{ fontWeight: "700", fontSize: "14.5px", color: "#1C1C1C", marginBottom: "3px" }}>{d.business}</div>
              <div style={{ fontSize: "12.5px", color: "#6b7280" }}>{d.owner} · {d.city}, {d.state || ''} · {d.biz_type || d.bizType || ''}</div>
              <div style={{ fontSize: "11.5px", color: "#9ca3af", marginTop: "2px" }}>Applied: {d.applied} · GST: {d.gst || ''} · {d.years_experience || d.years || '0'} experience</div>
            </div>
            {/* Status + actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <span style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "11.5px", fontWeight: "700", background: statusBg[d.status], color: statusColors[d.status], textTransform: "capitalize" }}>{d.status}</span>
              {d.status === "pending" && (
                <>
                  <motion.button onClick={e => { e.stopPropagation(); updateStatus(d.id, "approved"); }}
                    style={{ padding: "6px 14px", borderRadius: "8px", background: "#ecfdf5", border: "1.5px solid #10b981", color: "#10b981", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}
                    whileHover={{ background: "#10b981", color: "white" }}>Approve</motion.button>
                  <motion.button onClick={e => { e.stopPropagation(); updateStatus(d.id, "rejected"); }}
                    style={{ padding: "6px 14px", borderRadius: "8px", background: "#fef2f2", border: "1.5px solid #ef4444", color: "#ef4444", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}
                    whileHover={{ background: "#ef4444", color: "white" }}>Reject</motion.button>
                </>
              )}
              {d.status === "approved" && (
                <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "#6b7280" }}>
                  <span>📦 {d.orders} orders</span>
                  <span>₹{(d.revenue / 1000).toFixed(0)}K revenue</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div style={{ ...card, padding: "40px", textAlign: "center", color: "#9ca3af" }}>No applications found</div>
        )}
      </div>

      {/* Distributor Detail Mini-Dashboard */}
      <AnimatePresence>
        {detail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={(e) => { if (e.target === e.currentTarget) setDetail(null); }}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
              style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "900px", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              
              {/* Header */}
              <div style={{ padding: "24px", background: `linear-gradient(135deg, ${GOLD}, #b38836)`, display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "20px" }}>{detail.business[0]}</div>
                <div>
                  <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "white", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    {detail.business}
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.2)", color: "white", textTransform: "capitalize" }}>{detail.status}</span>
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12.5px", margin: "3px 0 0" }}>{detail.id} · Applied {detail.applied}</p>
                </div>
                <button onClick={() => setDetail(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.8)" }} onMouseEnter={e=>e.currentTarget.style.color="white"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.8)"}>
                  <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>close</span>
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid #f0ede8", background: "#faf8f5", padding: "0 24px", gap: "24px", flexShrink: 0 }}>
                {[
                  { id: "overview", label: "Overview", icon: "assignment" },
                  { id: "orders", label: "Order History", icon: "receipt_long" },
                  { id: "financials", label: "Financials", icon: "account_balance" }
                ].map(t => (
                  <button key={t.id} onClick={() => { setDetailTab(t.id); setOrderSearch(""); }}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "14px 0", background: "none", border: "none", borderBottom: detailTab === t.id ? `3px solid ${GOLD}` : "3px solid transparent", color: detailTab === t.id ? GOLD : "#6b7280", fontWeight: "600", fontSize: "13px", cursor: "pointer", transition: "all 0.15s" }}>
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
                      {[["person", "Owner", detail.owner], ["phone", "Phone", detail.phone], ["mail", "Email", detail.email], ["location_on", "Location", `${detail.city}, ${detail.state || ''}`], ["home_pin", "Shop Address", detail.address || "N/A"], ["receipt", "GST Number", detail.gst || "Not Provided"], ["storefront", "Business Type", detail.biz_type || detail.bizType], ["schedule", "Experience", detail.years_experience || detail.years]].map(([icon, label, val]) => (
                        <div key={label} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "12px", borderRadius: "10px", border: "1px solid #f0ede8" }}>
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
                    
                    {detail.status === "approved" && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                        <div style={{ padding: "16px", background: "#faf8f5", borderRadius: "12px", textAlign: "center", border: "1px solid #f0ede8" }}>
                          <div style={{ fontSize: "28px", fontWeight: "700", color: GOLD, fontFamily: "'Poppins',sans-serif" }}>{detail.orders}</div>
                          <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" }}>Total Wholesale Orders</div>
                        </div>
                        <div style={{ padding: "16px", background: "#faf8f5", borderRadius: "12px", textAlign: "center", border: "1px solid #f0ede8" }}>
                          <div style={{ fontSize: "28px", fontWeight: "700", color: GOLD, fontFamily: "'Poppins',sans-serif" }}>₹{(detail.revenue / 1000).toFixed(1)}K</div>
                          <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" }}>Total Revenue Generated</div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "10px" }}>
                      {detail.status === "pending" && (
                        <>
                          <motion.button onClick={() => { updateStatus(detail.id, "approved"); setDetail(null); }}
                            style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "#ecfdf5", border: "1.5px solid #10b981", color: "#10b981", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                            whileHover={{ background: "#10b981", color: "white" }}>✓ Approve Application</motion.button>
                          <motion.button onClick={() => { updateStatus(detail.id, "rejected"); setDetail(null); }}
                            style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "#fef2f2", border: "1.5px solid #ef4444", color: "#ef4444", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                            whileHover={{ background: "#ef4444", color: "white" }}>✕ Reject</motion.button>
                        </>
                      )}
                      {detail.status === "approved" && (
                        <motion.button onClick={() => { updateStatus(detail.id, "rejected"); setDetail(null); }}
                          style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "white", border: "1.5px solid #ef4444", color: "#ef4444", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                          whileHover={{ background: "#ef4444", color: "white" }}>Revoke Approval</motion.button>
                      )}
                      {detail.status === "rejected" && (
                        <motion.button onClick={() => { updateStatus(detail.id, "pending"); setDetail(null); }}
                          style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "white", border: "1.5px solid #f59e0b", color: "#f59e0b", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                          whileHover={{ background: "#f59e0b", color: "white" }}>Move to Pending</motion.button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── ORDERS & FINANCIALS TABS ── */}
                {(detailTab === "orders" || detailTab === "financials") && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    
                    {detail.status !== "approved" ? (
                      <div style={{ padding: "60px 40px", textAlign: "center", color: "#9ca3af", border: "1px dashed #d1d5db", borderRadius: "12px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "40px", marginBottom: "12px", color: "#d1d5db" }}>block</span>
                        <h4 style={{ margin: "0 0 4px 0", color: "#374151" }}>No Active Account</h4>
                        <div>Distributor must be <strong>Approved</strong> to place orders or generate financials.</div>
                      </div>
                    ) : (
                      <>
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
                            {detailTab === "orders" ? "Wholesale Orders" : "Payment Tracking"}
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
                                      <td style={{ padding: "12px 14px", fontWeight: "700", color: GOLD }}>{o.id}</td>
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
                                            onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = "#d1d5db"}
                                          />
                                        </div>
                                      </td>

                                      <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: "700", color: bal > 0 ? "#ef4444" : "#10b981" }}>₹{bal.toLocaleString("en-IN")}</td>
                                      
                                      {detailTab === "orders" && (
                                        <td style={{ padding: "12px 14px", textAlign: "center" }}>
                                          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }} onMouseEnter={e=>e.currentTarget.style.color=GOLD} onMouseLeave={e=>e.currentTarget.style.color="#9ca3af"}>
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
                            <div>No matching wholesale orders found.</div>
                          </div>
                        )}
                      </>
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
