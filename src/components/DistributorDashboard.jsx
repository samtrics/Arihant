import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
// Import Sub-Components
import DashboardHome from "./distributor-dashboard/DashboardHome";
import MyOrders from "./distributor-dashboard/MyOrders";
import BulkOrderPortal from "./distributor-dashboard/BulkOrderPortal";
import InventoryAvailability from "./distributor-dashboard/InventoryAvailability";
import ProfileSettings from "./distributor-dashboard/ProfileSettings";
import GenericPlaceholder from "./distributor-dashboard/GenericPlaceholder";
import WholesalePricing from "./distributor-dashboard/WholesalePricing";
import DeliveryTracking from "./distributor-dashboard/DeliveryTracking";
import SupportCenter from "./distributor-dashboard/SupportCenter";
import NotificationsPanel from "./distributor-dashboard/NotificationsPanel";
import DocumentsInvoices from "./distributor-dashboard/DocumentsInvoices";

const mockNotifications = [];

export default function DistributorDashboard({ distributorUser, products = [], onLogout }) {
  console.log("DistributorDashboard Rendered with user:", distributorUser?.business);
  const [activeTab, setActiveTab] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const partnerProfile = { 
    avatar: distributorUser?.business ? distributorUser.business[0] : "A", 
    businessName: distributorUser?.business || "Distributor Profile", 
    tier: distributorUser?.tier || "Partner" 
  };

  
  const MENU_ITEMS = [
    { id: "home", icon: "dashboard", label: "Dashboard" },
    { id: "orders", icon: "history", label: "My Orders" },
    { id: "bulk", icon: "inventory_2", label: "Place Bulk Order" },
    { id: "catalog", icon: "menu_book", label: "Products Catalog" },
    { id: "pricing", icon: "request_quote", label: "Wholesale Pricing" },
    { id: "inventory", icon: "warehouse", label: "Inventory Status" },
    { id: "tracking", icon: "local_shipping", label: "Delivery Tracking" },
    { id: "support", icon: "support_agent", label: "Support Center" },
    { id: "notifications", icon: "notifications", label: "Notifications" },
    { id: "docs", icon: "description", label: "Documents & Invoices" },
    { id: "profile", icon: "person", label: "Profile Settings" },
  ];

  const unreadNotifs = mockNotifications.filter(n => !n.read).length;

  const navigate = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <DashboardHome key="home" distributorUser={distributorUser} />;
      case "orders": return <MyOrders key="orders" distributorUser={distributorUser} />;
      case "bulk": return <BulkOrderPortal key="bulk" distributorUser={distributorUser} products={products} onOrderSuccess={() => setActiveTab("orders")} />;
      case "catalog": return <GenericPlaceholder key="catalog" title="Products Catalog" description="Download PDF catalogs and view high-res product specifications." icon="menu_book" />;
      case "pricing": return <WholesalePricing key="pricing" distributorUser={distributorUser} />;
      case "inventory": return <InventoryAvailability key="inventory" distributorUser={distributorUser} />;
      case "tracking": return <DeliveryTracking key="tracking" distributorUser={distributorUser} />;
      case "support": return <SupportCenter key="support" distributorUser={distributorUser} />;
      case "notifications": return <NotificationsPanel key="notifications" distributorUser={distributorUser} />;
      case "docs": return <DocumentsInvoices key="docs" distributorUser={distributorUser} />;
      case "profile": return <ProfileSettings key="profile" distributorUser={distributorUser} />;
      default: return <DashboardHome key="default" distributorUser={distributorUser} />;
    }
  };

  const activeLabel = MENU_ITEMS.find(m => m.id === activeTab)?.label || "Dashboard";

  // Shared sidebar content
  const SidebarContent = () => (
    <>
      {/* Brand Area */}
      <div style={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg,#D4A64A,#c49030)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "16px", color: "#1C1C1C", fontFamily: "'Poppins',sans-serif" }}>A</div>
          <span style={{ fontWeight: "700", fontSize: "17px", fontFamily: "'Poppins',sans-serif", color: "#1F5132", letterSpacing: "0.5px" }}>ARIHANT B2B</span>
        </div>
        <div style={{ background: "rgba(212,166,74,0.15)", padding: "10px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#D4A64A", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700" }}>{partnerProfile.avatar}</div>
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span style={{ fontSize: "12px", color: "#1F5132", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{partnerProfile.businessName}</span>
            <span style={{ fontSize: "10px", color: "#6b7280" }}>{partnerProfile.tier}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", padding: "8px 12px", marginBottom: "4px" }}>Menu</p>
        {MENU_ITEMS.map(tab => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "10px", border: "none", cursor: "pointer",
              fontWeight: "600", fontSize: "13px", transition: "all 0.2s",
              background: activeTab === tab.id ? "linear-gradient(90deg, rgba(31,81,50,0.1) 0%, transparent 100%)" : "transparent",
              color: activeTab === tab.id ? "#1F5132" : "#4b5563",
              borderLeft: activeTab === tab.id ? "4px solid #1F5132" : "4px solid transparent"
            }}
            onMouseEnter={e => { if(activeTab !== tab.id) e.currentTarget.style.background = "#f3f4f6" }}
            onMouseLeave={e => { if(activeTab !== tab.id) e.currentTarget.style.background = "transparent" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px", color: activeTab === tab.id ? "#1F5132" : "#9ca3af" }}>{tab.icon}</span>
              {tab.label}
            </div>
            {tab.id === "notifications" && unreadNotifs > 0 && (
              <span style={{ background: "#ef4444", color: "white", fontSize: "10px", padding: "2px 6px", borderRadius: "100px", fontWeight: "700" }}>{unreadNotifs}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "20px", borderTop: "1px solid #e5e7eb" }}>
        <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontWeight: "600", fontSize: "13px", borderRadius: "10px" }} onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>logout</span>
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="dist-dashboard-layout">
      
      {/* ── DESKTOP SIDEBAR (hidden on mobile via CSS) ── */}
      <aside className="dist-sidebar">
        <SidebarContent />
      </aside>

      {/* ── MOBILE HEADER (visible on mobile only via CSS) ── */}
      <div className="dist-mobile-header">
        <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#374151" }}>menu</span>
        </button>
        <span style={{ fontWeight: "700", fontSize: "15px", fontFamily: "'Poppins',sans-serif", color: "#1F5132" }}>{activeLabel}</span>
        <button onClick={() => navigate("notifications")} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", position: "relative" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "#4b5563" }}>notifications</span>
          {unreadNotifs > 0 && <span style={{ position: "absolute", top: "0", right: "0", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%" }} />}
        </button>
      </div>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {mobileOpen && <div className="dist-mobile-overlay" onClick={() => setMobileOpen(false)} />}
      
      {/* ── MOBILE DRAWER ── */}
      <div className={`dist-mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <SidebarContent />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="dist-main-content">
        
        {/* DESKTOP TOP NAVBAR (hidden on mobile via CSS) */}
        <header className="dist-desktop-header">
          <div style={{ position: "relative", width: "320px", maxWidth: "100%" }}>
            <span className="material-symbols-outlined" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "20px" }}>search</span>
            <input type="text" placeholder="Search orders, invoices, products..." style={{ width: "100%", padding: "10px 10px 10px 42px", borderRadius: "100px", border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", background: "#25D366", color: "white", border: "none", padding: "8px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chat</span>
              WhatsApp Support
            </button>
            <div style={{ width: "1px", height: "24px", background: "#e5e7eb" }} />
            <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }} onClick={() => navigate("notifications")}>
              <span className="material-symbols-outlined" style={{ color: "#4b5563" }}>notifications</span>
              {unreadNotifs > 0 && <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%" }} />}
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
