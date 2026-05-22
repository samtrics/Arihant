import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { partnerProfile, mockNotifications } from "./distributor-dashboard/mockData";

// Import Sub-Components
import DashboardHome from "./distributor-dashboard/DashboardHome";
import MyOrders from "./distributor-dashboard/MyOrders";
import BulkOrderPortal from "./distributor-dashboard/BulkOrderPortal";
import InventoryAvailability from "./distributor-dashboard/InventoryAvailability";
import GenericPlaceholder from "./distributor-dashboard/GenericPlaceholder";

export default function DistributorDashboard({ products = [], onLogout }) {
  const [activeTab, setActiveTab] = useState("home");
  
  const MENU_ITEMS = [
    { id: "home", icon: "dashboard", label: "Dashboard" },
    { id: "orders", icon: "history", label: "My Orders" },
    { id: "bulk", icon: "inventory_2", label: "Place Bulk Order" },
    { id: "catalog", icon: "menu_book", label: "Products Catalog" },
    { id: "pricing", icon: "request_quote", label: "Wholesale Pricing" },
    { id: "inventory", icon: "warehouse", label: "Inventory Status" },
    { id: "earnings", icon: "monitoring", label: "Earnings & Analytics" },
    { id: "tracking", icon: "local_shipping", label: "Delivery Tracking" },
    { id: "support", icon: "support_agent", label: "Support Center" },
    { id: "notifications", icon: "notifications", label: "Notifications" },
    { id: "docs", icon: "description", label: "Documents & Invoices" },
    { id: "profile", icon: "person", label: "Profile Settings" },
  ];

  const unreadNotifs = mockNotifications.filter(n => !n.read).length;

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <DashboardHome />;
      case "orders": return <MyOrders />;
      case "bulk": return <BulkOrderPortal products={products} onOrderSuccess={() => setActiveTab("orders")} />;
      case "catalog": return <GenericPlaceholder title="Products Catalog" description="Download PDF catalogs and view high-res product specifications." icon="menu_book" />;
      case "pricing": return <GenericPlaceholder title="Wholesale Pricing" description="View base prices, MOQ requirements, and calculate profit margins." icon="request_quote" />;
      case "inventory": return <InventoryAvailability />;
      case "earnings": return <GenericPlaceholder title="Earnings & Analytics" description="Deep dive into your sales growth, profit margins, and performance charts." icon="monitoring" />;
      case "tracking": return <GenericPlaceholder title="Delivery Tracking" description="Real-time GPS tracking of your active wholesale shipments." icon="local_shipping" />;
      case "support": return <GenericPlaceholder title="Support Center" description="Raise tickets, access FAQs, or contact your dedicated account manager via WhatsApp." icon="support_agent" />;
      case "notifications": return <GenericPlaceholder title="Notifications" description="View system alerts, low stock warnings, and promotional offers." icon="notifications" />;
      case "docs": return <GenericPlaceholder title="Documents & Invoices" description="Download past GST invoices, receipts, and order summaries." icon="description" />;
      case "profile": return <GenericPlaceholder title="Profile Settings" description="Update your business details, GSTIN, and view your Partner Tier progress." icon="person" />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f9fafb", fontFamily: "'Inter',sans-serif" }}>
      
      {/* ── SIDEBAR ── */}
      <aside style={{ width: "260px", background: "white", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Brand Area */}
        <div style={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg,#D4A64A,#c49030)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "16px", color: "#1C1C1C", fontFamily: "'Poppins',sans-serif" }}>A</div>
            <span style={{ fontWeight: "700", fontSize: "17px", fontFamily: "'Poppins',sans-serif", color: "#1F5132", letterSpacing: "0.5px" }}>ARIHANT B2B</span>
          </div>
          <div style={{ background: "rgba(212,166,74,0.15)", padding: "10px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#D4A64A", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700" }}>{partnerProfile.avatar}</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "12px", color: "#1F5132", fontWeight: "700" }}>{partnerProfile.businessName}</span>
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
              onClick={() => setActiveTab(tab.id)}
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
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        
        {/* TOP NAVBAR */}
        <header style={{ height: "72px", background: "white", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
          <div style={{ position: "relative", width: "320px" }}>
            <span className="material-symbols-outlined" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "20px" }}>search</span>
            <input type="text" placeholder="Search orders, invoices, products..." style={{ width: "100%", padding: "10px 10px 10px 42px", borderRadius: "100px", border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: "13px", outline: "none" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", background: "#25D366", color: "white", border: "none", padding: "8px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chat</span>
              WhatsApp Support
            </button>
            <div style={{ width: "1px", height: "24px", background: "#e5e7eb" }} />
            <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }} onClick={() => setActiveTab("notifications")}>
              <span className="material-symbols-outlined" style={{ color: "#4b5563" }}>notifications</span>
              {unreadNotifs > 0 && <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%" }} />}
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
