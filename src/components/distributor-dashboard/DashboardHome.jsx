import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
const dashboardStats = { totalOrders: 0, monthlyPurchases: 0, pendingDeliveries: 0, totalEarnings: 0, activeProducts: 0, currentDiscount: 0 };
const monthlyRevenueData = [];
const partnerProfile = { ownerName: "Distributor", tier: "Partner" };

export default function DashboardHome() {
  const stats = [
    { label: "Total Orders", value: dashboardStats.totalOrders, icon: "inventory_2", color: "#D4A64A", bg: "rgba(212,166,74,0.15)" },
    { label: "Monthly Purchases", value: dashboardStats.monthlyPurchases, icon: "account_balance_wallet", color: "#1F5132", bg: "rgba(31,81,50,0.15)" },
    { label: "Pending Deliveries", value: dashboardStats.pendingDeliveries, icon: "local_shipping", color: "#f59e0b", bg: "#fffbeb" },
    { label: "Total Earnings", value: dashboardStats.totalEarnings, icon: "trending_up", color: "#10b981", bg: "#ecfdf5" },
    { label: "Active Products", value: dashboardStats.activeProducts, icon: "category", color: "#6366f1", bg: "#e0e7ff" },
    { label: "Current Discounts", value: dashboardStats.currentDiscount, icon: "sell", color: "#ec4899", bg: "#fce7f3" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
            Welcome back, {partnerProfile.ownerName}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "15px" }}>Here is what's happening with your wholesale business today.</p>
        </div>
        <div style={{ padding: "8px 16px", background: "linear-gradient(135deg, #1F5132, #2d6b45)", color: "white", borderRadius: "100px", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#D4A64A" }}>workspace_premium</span>
          {partnerProfile.tier}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}
            whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}
          >
            <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: stat.bg, color: stat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>{stat.icon}</span>
            </div>
            <div>
              <p style={{ color: "#6b7280", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</p>
              <p style={{ color: "#111827", fontSize: "24px", fontWeight: "700", fontFamily: "'Poppins',sans-serif", marginTop: "4px" }}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "40px" }}>
        
        {/* Revenue Chart */}
        <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "24px" }}>Purchase Trends</h3>
          <div style={{ height: "300px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F5132" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1F5132" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", fontWeight: "600" }} 
                  formatter={(value) => [`₹${value.toLocaleString()}`, "Purchases"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1F5132" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Action / Notice */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ background: "linear-gradient(135deg, #1F5132, #2d6b45)", borderRadius: "16px", padding: "32px", color: "white", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#D4A64A" }}>campaign</span>
            </div>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Seasonal Offer Available!</h3>
            <p style={{ opacity: 0.85, fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
              Pre-book your Diwali inventory now and get an additional 5% margin on Premium Maida and Besan bulk orders.
            </p>
            <button style={{ padding: "12px 20px", background: "white", color: "#1F5132", borderRadius: "8px", border: "none", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              View Offers
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
