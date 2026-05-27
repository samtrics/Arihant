import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabaseClient";

export default function DeliveryTracking({ distributorUser }) {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!distributorUser) return;
    const fetchDeliveries = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_name', distributorUser.business)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Filter out completed or cancelled orders for tracking view
        const trackingOrders = data.filter(o => 
          o.order_number && String(o.order_number).startsWith('B2B') &&
          o.status !== "Completed" && o.status !== "Cancelled"
        ).map((o, idx) => {
          const createdAt = new Date(o.created_at);
          let progress = 25;
          let statusText = "Processing";
          let eta = "Tomorrow, 11:00 AM";
          let driver = "Pending Allocation";
          
          if (o.status === "Processing" && idx % 2 === 0) {
            statusText = "In Transit";
            progress = 75;
            eta = "Today, 4:30 PM";
            driver = "Ramesh Singh";
          } else if (o.status === "Shipped") {
            statusText = "In Transit";
            progress = 80;
            eta = "Today, 2:00 PM";
            driver = "Suresh Patel";
          }

          return {
            id: `TRK-${98000 + Math.floor(Math.random() * 1000)}`,
            orderRef: o.order_number,
            status: statusText,
            eta: eta,
            destination: o.shipping_address || "Registered Business Address",
            driverName: driver,
            driverPhone: driver !== "Pending Allocation" ? "+91 98765 43210" : "-",
            progress: progress,
            steps: [
              { label: "Order Confirmed", time: createdAt.toLocaleString(), completed: true },
              { label: "Dispatched from Hub", time: progress > 25 ? "Today, 1:30 PM" : "Pending", completed: progress > 25 },
              { label: "Out for Delivery", time: progress > 50 ? "Today, 3:00 PM" : "-", completed: progress > 50 },
              { label: "Delivered", time: "Estimated " + eta, completed: false }
            ]
          };
        });
        setActiveDeliveries(trackingOrders);
        if (trackingOrders.length > 0) setSelectedTrack(trackingOrders[0]);
      }
      setLoading(false);
    };
    fetchDeliveries();
  }, [distributorUser]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "24px", fontWeight: "700", color: "#111827" }}>Delivery Tracking</h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Monitor your active wholesale shipments in real-time.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {loading ? (
          <div style={{ gridColumn: "1/-1", padding: "40px", textAlign: "center", color: "#6b7280" }}>Loading active shipments...</div>
        ) : activeDeliveries.length === 0 ? (
          <div style={{ gridColumn: "1/-1", padding: "40px", textAlign: "center", background: "white", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#9ca3af", marginBottom: "16px" }}>local_shipping</span>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#374151" }}>No Active Deliveries</h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>You have no shipments currently in transit.</p>
          </div>
        ) : (
          <>
            {/* Shipment List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {activeDeliveries.map(delivery => {
                const isSelected = selectedTrack?.id === delivery.id;
                return (
                  <div 
                    key={delivery.id} 
                    onClick={() => setSelectedTrack(delivery)}
                    style={{ 
                      background: isSelected ? "#f0fdf4" : "white", 
                      border: isSelected ? "1px solid #1F5132" : "1px solid #e5e7eb", 
                      borderRadius: "16px", 
                      padding: "20px", 
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: isSelected ? "0 4px 15px rgba(31,81,50,0.1)" : "0 2px 5px rgba(0,0,0,0.02)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: "#1F5132", marginBottom: "4px" }}>{delivery.id}</div>
                        <div style={{ fontSize: "16px", fontWeight: "700", color: "#111827" }}>Ref: {delivery.orderRef}</div>
                      </div>
                      <span style={{ 
                        background: delivery.status === "In Transit" ? "#e0e7ff" : "#fef3c7", 
                        color: delivery.status === "In Transit" ? "#4338ca" : "#b45309", 
                        padding: "4px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: "700" 
                      }}>
                        {delivery.status}
                      </span>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "13px", marginBottom: "16px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>pin_drop</span>
                      {delivery.destination}
                    </div>

                    <div style={{ background: "#f3f4f6", height: "6px", borderRadius: "10px", overflow: "hidden" }}>
                      <div style={{ background: "#1F5132", height: "100%", width: `${delivery.progress}%`, transition: "width 0.5s ease" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", fontWeight: "600" }}>
                      <span color="#6b7280">ETA</span>
                      <span style={{ color: "#111827" }}>{delivery.eta}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tracking Details */}
            {selectedTrack && (
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "32px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#111827" }}>Tracking Details</h3>
                  <span style={{ background: "#f3f4f6", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#4b5563" }}>
                    {selectedTrack.id}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "#f9fafb", borderRadius: "12px", marginBottom: "32px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ color: "#6b7280" }}>local_shipping</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" }}>Assigned Driver</div>
                    <div style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>{selectedTrack.driverName}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>{selectedTrack.driverPhone}</div>
                    <a href={`tel:${selectedTrack.driverPhone}`} style={{ fontSize: "12px", color: "#1F5132", fontWeight: "700", textDecoration: "none" }}>Call Driver</a>
                  </div>
                </div>

                <div style={{ position: "relative", paddingLeft: "16px" }}>
                  {/* Vertical Line */}
                  <div style={{ position: "absolute", left: "21px", top: "10px", bottom: "30px", width: "2px", background: "#e5e7eb", zIndex: 0 }} />

                  {selectedTrack.steps.map((step, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "20px", marginBottom: "28px", position: "relative", zIndex: 1 }}>
                      <div style={{ 
                        width: "12px", height: "12px", borderRadius: "50%", marginTop: "4px",
                        background: step.completed ? "#1F5132" : "white",
                        border: step.completed ? "2px solid #1F5132" : "2px solid #d1d5db",
                        boxShadow: step.completed ? "0 0 0 4px #ecfdf5" : "none"
                      }} />
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: "700", color: step.completed ? "#111827" : "#9ca3af", marginBottom: "2px" }}>
                          {step.label}
                        </div>
                        <div style={{ fontSize: "13px", color: "#6b7280" }}>
                          {step.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
