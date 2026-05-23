import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import DashboardHome from "./sections/DashboardHome";
import ProductsManager from "./sections/ProductsManager";
import OrdersManager from "./sections/OrdersManager";
import CustomersManager from "./sections/CustomersManager";
import DistributorManager from "./sections/DistributorManager";
import InventoryManager from "./sections/InventoryManager";
import AnalyticsView from "./sections/AnalyticsView";
import CouponsManager from "./sections/CouponsManager";
import NotificationsPanel from "./sections/NotificationsPanel";
import SettingsPanel from "./sections/SettingsPanel";
import AdminUsersPanel from "./sections/AdminUsersPanel";
import { supabase } from "../supabaseClient";

const GREEN = "#1F5132";
const GOLD = "#D4A64A";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "grid_view" },
  { id: "products", label: "Products", icon: "inventory_2" },
  { id: "categories", label: "Categories", icon: "category" },
  { id: "orders", label: "Orders", icon: "shopping_bag" },
  { id: "customers", label: "Customers", icon: "group" },
  { id: "distributors", label: "Distributors", icon: "local_shipping" },
  { id: "inventory", label: "Inventory", icon: "warehouse" },
  { type: "divider" },
  { id: "analytics", label: "Analytics", icon: "bar_chart" },
  { id: "revenue", label: "Revenue", icon: "payments" },
  { id: "coupons", label: "Coupons", icon: "loyalty" },
  { id: "reviews", label: "Reviews", icon: "star_rate" },
  { id: "notifications", label: "Notifications", icon: "notifications", badge: 3 },
  { type: "divider" },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "admin-users", label: "Admin Users", icon: "admin_panel_settings" },
];

function ComingSoon({ section }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px", gap: "16px" }}>
      <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "rgba(31,81,50,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "36px", color: GREEN }}>construction</span>
      </div>
      <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "#1C1C1C", margin: 0 }}>
        {section.charAt(0).toUpperCase() + section.slice(1)} Module
      </h3>
      <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>This section is coming soon.</p>
    </div>
  );
}

export default function AdminDashboard({ adminUser, onLogout, products, setProducts }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Global State for Admin Panel Data
  const [orders, setOrders] = useState([]);
  const [b2bOrders, setB2bOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [distributors, setDistributors] = useState([]);

  useEffect(() => {
    // Initial fetch for dashboard stats
    supabase.from('orders').select('*').then(({ data }) => {
      if (data) {
        const mapped = data.map(o => ({
          ...o,
          id: o.order_number, // Use order_number as id in UI
          customer: o.customer_name,
          payment: o.payment_status,
          amountPaid: o.amount_paid || 0,
          date: o.date || (o.created_at ? o.created_at.split('T')[0] : null),
        }));
        setOrders(mapped.filter(o => !(o.order_number && String(o.order_number).startsWith('B2B'))));
        setB2bOrders(mapped.filter(o => o.order_number && String(o.order_number).startsWith('B2B')));
      }
    });
    supabase.from('distributors').select('*').then(({ data }) => {
      if (data) setDistributors(data);
    });

    // Realtime subscriptions
    const channel = supabase.channel('admin-dashboard-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        supabase.from('orders').select('*').then(({ data }) => {
          if (data) {
            const mapped = data.map(o => ({
              ...o,
              id: o.order_number,
              customer: o.customer_name,
              payment: o.payment_status,
              amountPaid: o.amount_paid || 0,
              date: o.date || (o.created_at ? o.created_at.split('T')[0] : null),
            }));
            setOrders(mapped.filter(o => !(o.order_number && String(o.order_number).startsWith('B2B'))));
            setB2bOrders(mapped.filter(o => o.order_number && String(o.order_number).startsWith('B2B')));
          }
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'distributors' }, () => {
        supabase.from('distributors').select('*').then(({ data }) => {
          if (data) setDistributors(data);
        });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const wrapSet = (key, setFunc) => {
    return (newValOrUpdater) => {
      setFunc(newValOrUpdater);
    };
  };

  const handleSetOrders = wrapSet('orders', setOrders);
  const handleSetB2bOrders = wrapSet('b2bOrders', setB2bOrders);
  const handleSetCustomers = wrapSet('customers', setCustomers);
  const handleSetDistributors = wrapSet('distributors', setDistributors);

  const SIDEBAR_W = collapsed ? 68 : 240;
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function onClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));

  const navigate = (id) => {
    setActiveSection(id);
    setMobileOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardHome orders={orders} b2bOrders={b2bOrders} customers={customers} distributors={distributors} />;
      case "products": return <ProductsManager products={products} setProducts={setProducts} />;
      case "orders": return <OrdersManager products={products} retailOrders={orders} setRetailOrders={handleSetOrders} b2bOrders={b2bOrders} setB2bOrders={handleSetB2bOrders} distributors={distributors} />;
      case "customers": return <CustomersManager customers={customers} setCustomers={handleSetCustomers} distributors={distributors} setDistributors={handleSetDistributors} orders={orders} b2bOrders={b2bOrders} />;
      case "distributors": return <DistributorManager distributors={distributors} setDistributors={handleSetDistributors} />;
      case "inventory": return <InventoryManager products={products} />;
      case "analytics":
      case "revenue": return <AnalyticsView orders={orders} b2bOrders={b2bOrders} />;
      case "coupons": return <CouponsManager />;
      case "notifications": return <NotificationsPanel />;
      case "settings": return <SettingsPanel />;
      case "admin-users": return <AdminUsersPanel />;
      default: return <ComingSoon section={activeSection} />;
    }
  };

  const activeLabel = NAV.find((n) => n.id === activeSection)?.label || "Dashboard";

  // ─── Sidebar ────────────────────────────────────────────────────
  const Sidebar = ({ mobile = false }) => (
    <div style={{
      width: mobile ? 240 : SIDEBAR_W,
      background: GREEN,
      display: "flex", flexDirection: "column",
      height: "100vh",
      flexShrink: 0,
      overflow: "hidden",
      transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
      position: mobile ? "relative" : "fixed",
      top: 0, left: 0, zIndex: 40,
    }}>
      {/* Logo row */}
      <div style={{ padding: "20px 16px 16px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg,#D4A64A,#c49030)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "17px", color: "#1C1C1C", fontFamily: "'Poppins',sans-serif", flexShrink: 0 }}>A</div>
        {(!collapsed || mobile) && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "white", fontWeight: "700", fontSize: "15px", fontFamily: "'Poppins',sans-serif", lineHeight: 1.1 }}>ARIHANT</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase" }}>Admin Panel</div>
          </div>
        )}
        {!mobile && (
          <button onClick={() => setCollapsed(!collapsed)}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: "4px", borderRadius: "6px", flexShrink: 0, lineHeight: 1 }}
            onMouseEnter={e => e.currentTarget.style.color = "white"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              {collapsed ? "chevron_right" : "chevron_left"}
            </span>
          </button>
        )}
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px", scrollbarWidth: "none" }}>
        {NAV.map((item, i) => {
          if (item.type === "divider") return <div key={i} style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "8px 8px" }} />;
          const isActive = activeSection === item.id;
          return (
            <motion.button key={item.id} onClick={() => navigate(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px",
                padding: collapsed && !mobile ? "10px" : "10px 12px",
                justifyContent: collapsed && !mobile ? "center" : "flex-start",
                borderRadius: "10px", border: "none", cursor: "pointer",
                background: isActive ? "rgba(212,166,74,0.18)" : "transparent",
                color: isActive ? GOLD : "rgba(255,255,255,0.68)",
                marginBottom: "2px",
                transition: "all 0.15s",
                position: "relative",
              }}
              whileHover={{ background: isActive ? "rgba(212,166,74,0.22)" : "rgba(255,255,255,0.08)", color: isActive ? GOLD : "white" }}
            >
              {isActive && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: "3px", height: "22px", background: GOLD, borderRadius: "0 3px 3px 0" }} />}
              <span className="material-symbols-outlined" style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</span>
              {(!collapsed || mobile) && (
                <span style={{ fontSize: "13.5px", fontWeight: isActive ? "600" : "500", flex: 1, textAlign: "left" }}>{item.label}</span>
              )}
              {(!collapsed || mobile) && item.badge && item.badge > 0 && (
                <span style={{ background: "#ef4444", color: "white", borderRadius: "100px", fontSize: "10px", fontWeight: "700", padding: "1px 6px", flexShrink: 0 }}>{item.badge}</span>
              )}
              {(collapsed && !mobile) && item.badge && item.badge > 0 && (
                <div style={{ position: "absolute", top: "6px", right: "6px", width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Logout */}
      <div style={{ padding: "12px 8px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
        <motion.button onClick={onLogout}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: collapsed && !mobile ? "10px" : "10px 12px", justifyContent: collapsed && !mobile ? "center" : "flex-start", borderRadius: "10px", border: "none", cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.5)", transition: "all 0.15s" }}
          whileHover={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px", flexShrink: 0 }}>logout</span>
          {(!collapsed || mobile) && <span style={{ fontSize: "13.5px", fontWeight: "500" }}>Logout</span>}
        </motion.button>
      </div>
    </div>
  );

  // ─── Top Navbar ─────────────────────────────────────────────────
  const TopNav = () => (
    <div style={{ height: "62px", background: "white", borderBottom: "1px solid #f0ede8", display: "flex", alignItems: "center", padding: "0 20px", gap: "12px", flexShrink: 0, position: "sticky", top: 0, zIndex: 30, boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(!mobileOpen)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "6px", borderRadius: "8px", display: "none" }}
        className="lg:hidden">
        <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>menu</span>
      </button>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>Admin</span>
        <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#d1d5db" }}>chevron_right</span>
        <span style={{ fontSize: "13px", fontWeight: "700", color: "#1C1C1C", fontFamily: "'Poppins',sans-serif" }}>{activeLabel}</span>
      </div>

      {/* Search */}
      <div style={{ position: "relative", width: "240px" }} className="hidden md:block">
        <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "17px" }}>search</span>
        <input placeholder="Search anything…" style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "10px", border: "1.5px solid #f0ede8", fontSize: "13px", outline: "none", background: "#faf8f5", color: "#1C1C1C", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = "#f0ede8"} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Notification bell */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <motion.button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            style={{ position: "relative", width: "38px", height: "38px", borderRadius: "10px", background: notifOpen ? "#f5f1ea" : "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            whileHover={{ background: "#f5f1ea" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "21px", color: "#374151" }}>notifications</span>
            {unread > 0 && (
              <div style={{ position: "absolute", top: "6px", right: "6px", width: "16px", height: "16px", borderRadius: "50%", background: "#ef4444", fontSize: "9px", fontWeight: "700", color: "white", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>
                {unread}
              </div>
            )}
          </motion.button>

          {/* Notification dropdown */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.18 }}
                style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "340px", background: "white", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #f0ede8", overflow: "hidden", zIndex: 100 }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0ede8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "700", fontSize: "14px", fontFamily: "'Poppins',sans-serif" }}>Notifications {unread > 0 && <span style={{ fontSize: "12px", background: "#fef2f2", color: "#ef4444", padding: "1px 6px", borderRadius: "100px" }}>{unread} new</span>}</span>
                  {unread > 0 && <button onClick={markAllRead} style={{ fontSize: "12px", color: GREEN, background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}>Mark all read</button>}
                </div>
                <div style={{ maxHeight: "340px", overflowY: "auto" }}>
                  {notifications.map((n) => {
                    const colors = { order: "#3b82f6", inventory: "#f59e0b", distributor: GREEN, review: "#8b5cf6" };
                    const icons = { order: "shopping_bag", inventory: "warehouse", distributor: "local_shipping", review: "star" };
                    return (
                      <div key={n.id} style={{ padding: "12px 16px", borderBottom: "1px solid #f9f8f6", background: n.read ? "white" : "rgba(31,81,50,0.03)", display: "flex", gap: "11px", alignItems: "flex-start", cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#faf8f5"} onMouseLeave={e => e.currentTarget.style.background = n.read ? "white" : "rgba(31,81,50,0.03)"}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: (colors[n.type] || "#6b7280") + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: colors[n.type] || "#6b7280" }}>{icons[n.type] || "info"}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: n.read ? "500" : "700", fontSize: "13px", color: "#1C1C1C", marginBottom: "3px" }}>{n.title}</div>
                          <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.4", marginBottom: "4px" }}>{n.message}</div>
                          <div style={{ fontSize: "11px", color: "#9ca3af" }}>{n.time}</div>
                        </div>
                        {!n.read && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: GREEN, flexShrink: 0, marginTop: "4px" }} />}
                      </div>
                    );
                  })}
                </div>
                <div style={{ padding: "10px", borderTop: "1px solid #f0ede8", textAlign: "center" }}>
                  <button onClick={() => { setActiveSection("notifications"); setNotifOpen(false); }} style={{ fontSize: "12.5px", color: GREEN, background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}>View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "28px", background: "#f0ede8" }} />

        {/* Profile dropdown */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <motion.button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 8px 4px 4px", borderRadius: "10px", border: "none", cursor: "pointer", background: "transparent" }}
            whileHover={{ background: "#f5f1ea" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#1F5132,#2d6b45)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "13px", flexShrink: 0 }}>
              {adminUser?.avatar || "SA"}
            </div>
            <div className="hidden sm:block" style={{ textAlign: "left" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#1C1C1C", lineHeight: 1.2 }}>{adminUser?.name || "Super Admin"}</div>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>Super Admin</div>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#9ca3af" }}>expand_more</span>
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.18 }}
                style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "210px", background: "white", borderRadius: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #f0ede8", overflow: "hidden", zIndex: 100 }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0ede8" }}>
                  <div style={{ fontWeight: "700", fontSize: "14px", color: "#1C1C1C" }}>{adminUser?.name}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>{adminUser?.email}</div>
                </div>
                {[["settings", "Settings", "settings"], ["admin_panel_settings", "My Profile", "admin-users"]].map(([icon, label, section]) => (
                  <button key={label} onClick={() => { setActiveSection(section); setProfileOpen(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#374151", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#faf8f5"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    <span className="material-symbols-outlined" style={{ fontSize: "17px", color: "#9ca3af" }}>{icon}</span>
                    {label}
                  </button>
                ))}
                <div style={{ borderTop: "1px solid #f0ede8" }}>
                  <button onClick={onLogout}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#ef4444", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>logout</span>
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F1EA", fontFamily: "'Inter',sans-serif" }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 39 }}
              onClick={() => setMobileOpen(false)} className="lg:hidden" />
            <motion.div initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ duration: 0.25 }}
              style={{ position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 40 }} className="lg:hidden">
              <Sidebar mobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:ml-[240px]"
        style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", minWidth: 0, marginLeft: 0 }}>
        <TopNav />
        <main style={{ flex: 1, padding: "20px", overflowX: "hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg\\:ml-\\[240px\\] { margin-left: ${SIDEBAR_W}px !important; transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1); }
          .lg\\:hidden { display: none !important; }
          .lg\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
}
