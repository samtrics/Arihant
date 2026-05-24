import React, { useState } from "react";
import { motion } from "framer-motion";

const GREEN = "#1F5132";
const card = { background: "white", borderRadius: "16px", border: "1px solid #f0ede8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" };
const typeColors = { order: "#3b82f6", inventory: "#f59e0b", distributor: GREEN, review: "#8b5cf6", default: "#6b7280" };
const typeBg = { order: "#eff6ff", inventory: "#fffbeb", distributor: "rgba(31,81,50,0.08)", review: "#f5f3ff", default: "#f3f4f6" };
const typeIcons = { order: "shopping_bag", inventory: "warehouse", distributor: "local_shipping", review: "star", default: "notifications" };

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "order", title: "New Order #ORD-8921", message: "A new order has been placed by Anjali Sharma for ₹1,250.", time: "10 mins ago", read: false },
    { id: 2, type: "inventory", title: "Low Stock Alert", message: "Sharbati Atta (5kg) is running low. Only 12 units remaining in stock.", time: "1 hour ago", read: false },
    { id: 3, type: "distributor", title: "Bulk Order Received", message: "Distributor 'Raman Traders' placed a bulk order for 500 units of Besan.", time: "3 hours ago", read: true },
    { id: 4, type: "review", title: "New 5-Star Review", message: "Rajiv Mehta left a 5-star review for Roasted Daliya.", time: "Yesterday", read: true },
    { id: 5, type: "order", title: "Payment Failed #ORD-8910", message: "Payment processing failed for order #ORD-8910. Customer has been notified.", time: "Yesterday", read: true }
  ]);
  const [filter, setFilter] = useState("All");

  const filtered = notifications.filter(n => filter === "All" || (filter === "Unread" ? !n.read : filter === n.type));
  const unread = notifications.filter(n => !n.read).length;

  const markRead = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const remove = (id) => setNotifications(ns => ns.filter(n => n.id !== id));

  const tabs = ["All", "Unread", "order", "inventory", "distributor", "review"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "#1C1C1C", margin: 0 }}>Notifications</h2>
          <p style={{ color: "#9ca3af", fontSize: "12.5px", margin: "3px 0 0" }}>{unread} unread notification{unread !== 1 ? "s" : ""}</p>
        </div>
        {unread > 0 && (
          <motion.button onClick={markAllRead} style={{ padding: "8px 16px", borderRadius: "10px", border: "1.5px solid #f0ede8", background: "white", fontWeight: "700", fontSize: "12.5px", cursor: "pointer", color: "#374151", display: "flex", alignItems: "center", gap: "6px" }}
            whileHover={{ borderColor: GREEN, color: GREEN }}>
            <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>done_all</span>
            Mark All Read
          </motion.button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <motion.button key={t} onClick={() => setFilter(t)}
            style={{ padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", border: "1.5px solid", cursor: "pointer", textTransform: "capitalize", borderColor: filter === t ? GREEN : "#e5e7eb", background: filter === t ? GREEN : "white", color: filter === t ? "white" : "#6b7280" }}>
            {t === "All" ? `All (${notifications.length})` : t === "Unread" ? `Unread (${unread})` : `${t.charAt(0).toUpperCase() + t.slice(1)}`}
          </motion.button>
        ))}
      </div>

      {/* Notification list */}
      <div style={{ ...card, overflow: "hidden" }}>
        {filtered.length === 0 && (
          <div style={{ padding: "48px", textAlign: "center", color: "#9ca3af" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", display: "block", marginBottom: "12px" }}>notifications_off</span>
            No notifications in this category
          </div>
        )}
        {filtered.map((n, i) => {
          const color = typeColors[n.type] || typeColors.default;
          const bg = typeBg[n.type] || typeBg.default;
          const icon = typeIcons[n.type] || typeIcons.default;
          return (
            <motion.div key={n.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              style={{ padding: "16px 20px", borderBottom: "1px solid #faf8f5", display: "flex", gap: "14px", alignItems: "flex-start", background: n.read ? "white" : "rgba(31,81,50,0.03)", transition: "background 0.15s", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "#faf8f5"} onMouseLeave={e => e.currentTarget.style.background = n.read ? "white" : "rgba(31,81,50,0.03)"}
              onClick={() => markRead(n.id)}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color }}>{icon}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: n.read ? "500" : "700", fontSize: "13.5px", color: "#1C1C1C", marginBottom: "4px" }}>{n.title}</div>
                <div style={{ fontSize: "12.5px", color: "#6b7280", marginBottom: "6px", lineHeight: "1.4" }}>{n.message}</div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>{n.time}</span>
                  <span style={{ padding: "2px 8px", borderRadius: "100px", fontSize: "10.5px", fontWeight: "600", background: bg, color, textTransform: "capitalize" }}>{n.type}</span>
                  {!n.read && <span style={{ fontSize: "10.5px", color: GREEN, fontWeight: "700" }}>● New</span>}
                </div>
              </div>
              <motion.button onClick={e => { e.stopPropagation(); remove(n.id); }}
                style={{ padding: "4px", borderRadius: "8px", border: "none", background: "none", cursor: "pointer", color: "#9ca3af", lineHeight: 1, flexShrink: 0 }}
                whileHover={{ background: "#fef2f2", color: "#ef4444" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
