import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";

const fallbackNotifications = [
  { id: 1, type: "offer", title: "Diwali Wholesale Bonus!", message: "Get an extra 5% margin on all Basmati Rice bulk orders above 500kg. Valid till Oct 30.", time: "2 hours ago", unread: true, icon: "local_offer", color: "#d97706", bg: "#fef3c7" },
  { id: 2, type: "alert", title: "Low Stock Alert: Organic Toor Dal", message: "Inventory at your primary hub is critically low. Place a replenishment order soon to avoid stockouts.", time: "5 hours ago", unread: true, icon: "warning", color: "#dc2626", bg: "#fef2f2" },
  { id: 3, type: "delivery", title: "Shipment Dispatched", orderRef: "B2B-109283", message: "Your order B2B-109283 has been dispatched from Mumbai Central Hub. ETA: Today 4:30 PM.", time: "Yesterday", unread: false, icon: "local_shipping", color: "#059669", bg: "#ecfdf5" },
  { id: 4, type: "system", title: "Credit Limit Upgraded", message: "Congratulations! Your partner credit limit has been increased to ₹15,00,000 based on your quarterly performance.", time: "Oct 22", unread: false, icon: "credit_score", color: "#4338ca", bg: "#e0e7ff" }
];

export default function NotificationsPanel({ distributorUser }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!distributorUser) return;
    const fetchNotifs = async () => {
      setLoading(true);
      const email = distributorUser.email || distributorUser.business;
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('distributor_email', email)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        // Fallback to mock data if table missing or empty
        setNotifications(fallbackNotifications);
      } else {
        const mapped = data.map(n => ({
          ...n,
          time: new Date(n.created_at).toLocaleDateString()
        }));
        setNotifications(mapped);
      }
      setLoading(false);
    };
    fetchNotifs();
  }, [distributorUser]);

  const handleMarkAllRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    const email = distributorUser?.email || distributorUser?.business;
    if (email) {
      await supabase.from('notifications').update({ unread: false }).eq('distributor_email', email);
    }
  };

  const handleDismiss = async (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    if (typeof id === 'string') { // real DB uuid
      await supabase.from('notifications').delete().eq('id', id);
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === "unread") return n.unread;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "24px", fontWeight: "700", color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}>
            Notifications
            {notifications.filter(n => n.unread).length > 0 && (
              <span style={{ background: "#ef4444", color: "white", fontSize: "12px", padding: "2px 8px", borderRadius: "100px", fontWeight: "700" }}>
                {notifications.filter(n => n.unread).length} New
              </span>
            )}
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Stay updated with system alerts, stock warnings, and exclusive offers.</p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px", outline: "none", cursor: "pointer", background: "white" }}
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
          </select>
          <button 
            onClick={handleMarkAllRead}
            style={{ padding: "8px 16px", background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#374151", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
        {filteredNotifs.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center", color: "#6b7280" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", opacity: 0.5, marginBottom: "16px" }}>notifications_off</span>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>No notifications</h3>
            <p style={{ fontSize: "14px" }}>You're all caught up! Check back later.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <AnimatePresence>
              {filteredNotifs.map(notification => (
                <motion.div 
                  key={notification.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ 
                    display: "flex", padding: "20px 24px", borderBottom: "1px solid #e5e7eb", gap: "16px",
                    background: notification.unread ? "#f8fafc" : "white",
                    position: "relative"
                  }}
                >
                  {notification.unread && (
                    <div style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: "4px", background: "#1F5132" }} />
                  )}
                  
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: notification.bg, color: notification.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>{notification.icon}</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: notification.unread ? "700" : "600", color: "#111827" }}>
                        {notification.title}
                        {notification.orderRef && <span style={{ marginLeft: "8px", fontSize: "12px", fontWeight: "600", background: "#f3f4f6", color: "#4b5563", padding: "2px 6px", borderRadius: "4px" }}>Ref: {notification.orderRef}</span>}
                      </h4>
                      <span style={{ fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap" }}>{notification.time}</span>
                    </div>
                    <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.5", marginBottom: "12px" }}>
                      {notification.message}
                    </p>
                    {notification.type === "offer" && (
                      <button style={{ background: "#1F5132", color: "white", padding: "6px 16px", borderRadius: "6px", border: "none", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                        View Catalog
                      </button>
                    )}
                    {notification.type === "delivery" && (
                      <button style={{ background: "white", color: "#1F5132", border: "1px solid #1F5132", padding: "6px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                        Track Order
                      </button>
                    )}
                  </div>

                  <button 
                    onClick={() => handleDismiss(notification.id)}
                    style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "flex-start", padding: "4px" }}
                    title="Dismiss"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
