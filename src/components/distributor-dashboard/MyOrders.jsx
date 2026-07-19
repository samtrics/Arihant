import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";

export default function MyOrders({ distributorUser }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    if (!distributorUser) return;
    
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        // RLS secures the data, so we just filter for B2B order types
        const b2bOrders = data.filter(o => 
          o.order_number && 
          String(o.order_number).startsWith('B2B')
        );
        setOrders(b2bOrders);
      }
      setLoading(false);
    };
    
    fetchOrders();
  }, [distributorUser]);

  const filteredOrders = orders.filter(o => 
    filterStatus === "All" || (o.status || "pending").toLowerCase() === filterStatus.toLowerCase()
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "24px", fontWeight: "700", color: "#111827" }}>My Orders</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Track past shipments and view order details.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: "8px 16px", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer", color: "#374151", outline: "none" }}
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped / In Transit</option>
            <option value="delivered">Delivered / Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button style={{ padding: "8px 16px", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer", color: "#374151" }}>Export CSV</button>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
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
            {loading ? (
              <tr><td colSpan="6" style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>Loading orders...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>{filterStatus === "All" ? "No orders found. Place a bulk order to get started!" : `No orders found with status '${filterStatus}'.`}</td></tr>
            ) : (
              filteredOrders.map(order => {
                let itemsCount = 0;
                try {
                  const products = typeof order.products === "string" ? JSON.parse(order.products || "[]") : (order.products || []);
                  itemsCount = products.length;
                } catch(e) {}
                
                return (
                  <tr key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    style={{ borderBottom: "1px solid #e5e7eb", cursor: "pointer", transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "16px", fontWeight: "700", color: "#1F5132", fontSize: "14px", fontFamily: "monospace" }}>{order.order_number}</td>
                    <td style={{ padding: "16px", color: "#4b5563", fontSize: "14px" }}>{new Date(order.created_at || order.date).toLocaleString('en-IN', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}</td>
                    <td style={{ padding: "16px", textAlign: "center", color: "#4b5563", fontSize: "14px" }}>{itemsCount} Skus</td>
                    <td style={{ padding: "16px", textAlign: "right", fontWeight: "600", color: "#111827" }}>₹{Number(order.total_amount || order.amount).toLocaleString("en-IN", {minimumFractionDigits: 2})}</td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      {(() => {
                        const s = (order.status || "pending").toLowerCase();
                        const isGreen = s === "delivered" || s === "completed";
                        const isBlue = s === "shipped" || s === "in transit";
                        const isOrange = s === "processing";
                        const isRed = s === "cancelled";
                        
                        const bg = isGreen ? "#ecfdf5" : isBlue ? "#eff6ff" : isOrange ? "#fffbeb" : isRed ? "#fef2f2" : "#f5f3ff";
                        const fg = isGreen ? "#059669" : isBlue ? "#2563eb" : isOrange ? "#d97706" : isRed ? "#dc2626" : "#8b5cf6";
                        return (
                          <span style={{ 
                            padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "700",
                            background: bg, color: fg, textTransform: "capitalize"
                          }}>
                            {order.status || "Pending"}
                          </span>
                        );
                      })()}
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <button onClick={() => setSelectedOrder(order)} style={{ background: "none", border: "none", cursor: "pointer", color: "#1F5132" }} title="View Order Info">
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
              style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "600px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: "24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9fafb" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}>
                    Order Details <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#1F5132", background: "#ecfdf5", padding: "4px 8px", borderRadius: "6px" }}>{selectedOrder.order_number}</span>
                  </h3>
                  <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>Placed on {new Date(selectedOrder.created_at || selectedOrder.date).toLocaleString('en-IN', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div style={{ padding: "24px", maxHeight: "60vh", overflowY: "auto" }}>
                {/* Timeline */}
                {(() => {
                  const s = (selectedOrder.status || "pending").toLowerCase();
                  if (s === "cancelled") {
                    return (
                      <div style={{ padding: "16px", background: "#fef2f2", borderRadius: "12px", border: "1px solid #fecaca", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px", color: "#dc2626" }}>
                        <span className="material-symbols-outlined">cancel</span>
                        <span style={{ fontWeight: "600", fontSize: "14px" }}>This order has been cancelled.</span>
                      </div>
                    );
                  }
                  const TIMELINE = [
                    { id: "pending", label: "Order Placed", icon: "shopping_bag" },
                    { id: "processing", label: "Processing", icon: "settings_suggest" },
                    { id: "shipped", label: "Shipped", icon: "local_shipping" },
                    { id: "delivered", label: "Delivered", icon: "check_circle" }
                  ];
                  const currentStep = s === "delivered" || s === "completed" ? 3 : s === "shipped" || s === "in transit" ? 2 : s === "processing" ? 1 : 0;
                  
                  // Dynamic color based on current status
                  const ACTIVE_COLOR = s === "delivered" || s === "completed" ? "#10b981" : 
                                       s === "shipped" || s === "in transit" ? "#3b82f6" : 
                                       s === "processing" ? "#f59e0b" : "#8b5cf6";
                  
                  return (
                    <div style={{ marginBottom: "28px" }}>
                      <h4 style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Order Progress</h4>
                      <div style={{ display: "flex", position: "relative" }}>
                        {TIMELINE.map((step, i) => {
                          const isDone = i <= currentStep;
                          const isActive = i === currentStep;
                          return (
                            <div key={step.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                              {i < TIMELINE.length - 1 && (
                                <div style={{ position: "absolute", top: "18px", left: "50%", width: "100%", height: "3px", background: isDone && i < currentStep ? ACTIVE_COLOR : "#e5e7eb", zIndex: 0 }} />
                              )}
                              <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: isDone ? ACTIVE_COLOR : "white", border: `2px solid ${isDone ? ACTIVE_COLOR : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, flexShrink: 0, boxShadow: isActive ? `0 0 0 4px ${ACTIVE_COLOR}33` : "none" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: isDone ? "white" : "#9ca3af" }}>{step.icon}</span>
                              </div>
                              <div style={{ fontSize: "11px", fontWeight: isDone ? "700" : "500", color: isDone ? ACTIVE_COLOR : "#9ca3af", marginTop: "8px", textAlign: "center" }}>{step.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Order Information Section */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ background: "#f9fafb", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                    <h4 style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}><span className="material-symbols-outlined" style={{ fontSize: "16px" }}>local_shipping</span> Delivery Details</h4>
                    <p style={{ fontSize: "14px", color: "#111827", fontWeight: "500" }}>{selectedOrder.customer_name}</p>
                    <p style={{ fontSize: "13px", color: "#4b5563", marginTop: "4px" }}>{selectedOrder.city || "Address not provided"}</p>
                  </div>
                  <div style={{ background: "#f9fafb", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                    <h4 style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}><span className="material-symbols-outlined" style={{ fontSize: "16px" }}>payments</span> Payment Info</h4>
                    <p style={{ fontSize: "14px", color: "#111827", fontWeight: "500", textTransform: "capitalize" }}>Status: {selectedOrder.payment_status || "Pending (B2B Terms)"}</p>
                    <p style={{ fontSize: "13px", color: "#4b5563", marginTop: "4px" }}>Amount Paid: ₹{Number(selectedOrder.amount_paid || 0).toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Items Ordered</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {(() => {
                    try {
                      const prods = typeof selectedOrder.products === "string" ? JSON.parse(selectedOrder.products || "[]") : (selectedOrder.products || []);
                      if (prods.length === 0) return <p style={{ fontSize: "14px", color: "#6b7280" }}>No item details available.</p>;
                      return prods.map((p, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "12px" }}>
                          <div>
                            <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{p.name}</p>
                            <p style={{ fontSize: "13px", color: "#6b7280" }}>{p.qty} × ₹{Number(p.price).toLocaleString()} <span style={{ color: "#9ca3af", fontSize: "12px" }}>({p.unit || 'unit'})</span></p>
                          </div>
                          <div style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>
                            ₹{(p.qty * p.price).toLocaleString("en-IN", {minimumFractionDigits: 2})}
                          </div>
                        </div>
                      ));
                    } catch(e) {
                      return <p style={{ fontSize: "14px", color: "#6b7280" }}>Could not load item details.</p>;
                    }
                  })()}
                </div>

                <div style={{ marginTop: "24px", borderTop: "1px dashed #d1d5db", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "14px", color: "#4b5563", fontWeight: "600" }}>Total Amount Billed</p>
                  <p style={{ fontSize: "20px", fontWeight: "800", color: "#1F5132" }}>
                    ₹{Number(selectedOrder.total_amount || selectedOrder.amount).toLocaleString("en-IN", {minimumFractionDigits: 2})}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
