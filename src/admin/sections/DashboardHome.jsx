import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const GREEN = "#1F5132";
const GOLD = "#D4A64A";

// (Removed AnimCounter component)

const card = { background: "white", borderRadius: "16px", padding: "20px", border: "1px solid #f0ede8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)", minWidth: 0 };

const customTooltipRevenue = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "white", border: "1px solid #f0ede8", borderRadius: "12px", padding: "12px 16px", boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}>
      <p style={{ fontWeight: "700", fontSize: "13px", marginBottom: "8px", color: "#1C1C1C" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "12px", marginBottom: "4px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color }} />
          <span style={{ color: "#6b7280" }}>{p.name}:</span>
          <span style={{ fontWeight: "600", color: "#1C1C1C" }}>{p.name === "Revenue" ? `₹${(p.value / 1000).toFixed(0)}K` : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const statusColors = { delivered: "#10b981", shipped: "#3b82f6", processing: "#f59e0b", pending: "#8b5cf6", cancelled: "#ef4444" };
const statusBg = { delivered: "#ecfdf5", shipped: "#eff6ff", processing: "#fffbeb", pending: "#f5f3ff", cancelled: "#fef2f2" };

import pptxgen from "pptxgenjs";

export default function DashboardHome({ products = [], orders = [], b2bOrders = [], customers = [], distributors = [], navigate }) {
  const [dateRange, setDateRange] = useState("this_month");
  const [revDateRange, setRevDateRange] = useState("12");

  const allOrders = [...orders, ...b2bOrders].sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0));
  const recentOrders = allOrders.slice(0, 6);

  const now = new Date();
  const filteredOrders = allOrders.filter(o => {
    if (dateRange === "all") return true;
    const d = new Date(o.created_at || o.date || Date.now());
    if (isNaN(d.getTime())) return true;

    if (dateRange === "this_month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    } else if (dateRange === "last_month") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
    } else if (dateRange === "last_3") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return d >= threeMonthsAgo;
    } else if (dateRange === "last_6") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      return d >= sixMonthsAgo;
    } else if (dateRange === "this_year") {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const totalRevenue = filteredOrders.filter(o => o.status !== "cancelled").reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalOrders = filteredOrders.length;

  const handleExport = () => {
    if (filteredOrders.length === 0) return alert("No data to export for this range.");

    const pres = new pptxgen();

    // Slide 1: Title
    let slide = pres.addSlide();
    slide.background = { color: "1F5132" };
    slide.addText("Arihant Admin Dashboard", { x: 1, y: 1.5, w: "80%", h: 1, fontSize: 36, color: "FFFFFF", bold: true, align: "center" });
    slide.addText(`Performance & Revenue Report`, { x: 1, y: 2.5, w: "80%", h: 0.5, fontSize: 24, color: "D4A64A", align: "center" });
    slide.addText(`Date Range: ${dateRange.replace(/_/g, ' ').toUpperCase()}`, { x: 1, y: 3.2, w: "80%", h: 0.5, fontSize: 16, color: "FFFFFF", align: "center" });

    // Slide 2: Summary Metrics
    slide = pres.addSlide();
    slide.background = { color: "F9FAFB" };
    slide.addText("Executive Summary", { x: 0.5, y: 0.5, w: "90%", h: 0.5, fontSize: 24, color: "1C1C1C", bold: true });

    const kpiData = [
      [
        { text: "Total Revenue", options: { bold: true, fontSize: 18, color: "1F5132" } },
        { text: `Rs. ${totalRevenue.toLocaleString("en-IN")}`, options: { bold: true, fontSize: 28, color: "1C1C1C" } }
      ],
      [
        { text: "Total Orders", options: { bold: true, fontSize: 18, color: "3B82F6" } },
        { text: `${totalOrders}`, options: { bold: true, fontSize: 28, color: "1C1C1C" } }
      ],
      [
        { text: "Avg Order Value", options: { bold: true, fontSize: 18, color: "D4A64A" } },
        { text: `Rs. ${(totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0).toLocaleString("en-IN")}`, options: { bold: true, fontSize: 28, color: "1C1C1C" } }
      ]
    ];

    slide.addTable(kpiData, { x: 0.5, y: 1.5, w: "90%", rowH: 1.2, fill: "FFFFFF", border: { pt: 1, color: "E5E7EB" }, align: "center", valign: "middle" });

    // Slide 3: Order Details (Auto-paginating Table)
    const headers = [
      { text: "Order ID", options: { bold: true, color: "FFFFFF", fill: "1F5132" } },
      { text: "Date", options: { bold: true, color: "FFFFFF", fill: "1F5132" } },
      { text: "Customer", options: { bold: true, color: "FFFFFF", fill: "1F5132" } },
      { text: "Amount (Rs)", options: { bold: true, color: "FFFFFF", fill: "1F5132" } },
      { text: "Status", options: { bold: true, color: "FFFFFF", fill: "1F5132" } },
      { text: "Payment", options: { bold: true, color: "FFFFFF", fill: "1F5132" } }
    ];

    const rows = filteredOrders.map(o => [
      o.id || o.order_number || "N/A",
      o.date || (o.created_at ? o.created_at.split('T')[0] : "N/A"),
      o.customer || o.customer_name || 'Unknown',
      o.amount ? o.amount.toLocaleString("en-IN") : "0",
      (o.status || "pending").toUpperCase(),
      (o.payment || o.payment_status || "pending").toUpperCase()
    ]);

    const tableData = [headers, ...rows];

    slide = pres.addSlide();
    slide.background = { color: "FFFFFF" };
    slide.addText("Order Details Breakdown", { x: 0.5, y: 0.3, w: "90%", h: 0.5, fontSize: 20, color: "1C1C1C", bold: true });

    slide.addTable(tableData, {
      x: 0.5, y: 1.0, w: 9.0,
      colW: [1.5, 1.2, 2.5, 1.3, 1.2, 1.3],
      border: { pt: 1, color: "E5E7EB" },
      fill: "FFFFFF",
      color: "374151",
      fontSize: 10,
      autoPage: true,
      autoPageSlideStartY: 1.0
    });

    pres.writeFile({ fileName: `Arihant_Report_${dateRange}.pptx` });
  };
  // All unique customers who have placed an order
  const activeCustomers = new Set(allOrders.map(o => o.customer).filter(Boolean)).size;
  const totalDistributors = distributors.filter(d => d.status === "approved").length;

  // Calculate this month's sales
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlySales = allOrders.filter(o => {
    const d = new Date(o.created_at || o.date || Date.now());
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && o.status !== "cancelled";
  }).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  // Generate dynamic 12-month Revenue Data
  const dynamicRevenueData = [];
  const dObj = new Date();
  dObj.setDate(1);
  for (let i = 11; i >= 0; i--) {
    const mDate = new Date(dObj);
    mDate.setMonth(dObj.getMonth() - i);
    const mStr = mDate.toLocaleString('default', { month: 'short' }) + " '" + mDate.getFullYear().toString().slice(2);
    dynamicRevenueData.push({ month: mStr, monthNum: mDate.getMonth(), yearNum: mDate.getFullYear(), revenue: 0, orders: 0 });
  }

  allOrders.forEach(o => {
    if (o.status === "cancelled") return;
    const od = new Date(o.created_at || o.date || Date.now());
    const match = dynamicRevenueData.find(m => m.monthNum === od.getMonth() && m.yearNum === od.getFullYear());
    if (match) {
      match.revenue += (Number(o.amount) || 0);
      match.orders += 1;
    }
  });

  // Generate dynamic Product Sales Data (Top 5)
  const productMap = {};
  allOrders.forEach(o => {
    if (o.status === "cancelled") return;
    if (Array.isArray(o.products)) {
      o.products.forEach(p => {
        const name = typeof p === "string" ? p : p.name;
        // Weight by qty or count 1 for B2C if qty missing
        const qty = p.qty || 1;
        productMap[name] = (productMap[name] || 0) + qty;
      });
    } else if (typeof o.products === 'string') {
      try {
        const parsed = JSON.parse(o.products);
        if (Array.isArray(parsed)) {
          parsed.forEach(p => {
            const name = typeof p === "string" ? p : p.name;
            const qty = p.qty || 1;
            productMap[name] = (productMap[name] || 0) + qty;
          });
        }
      } catch (e) { }
    }
  });
  const topColors = ["#1F5132", "#D4A64A", "#2d6b45", "#c49030", "#417a58"];
  const sortedProducts = Object.entries(productMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const totalPCount = sortedProducts.reduce((acc, curr) => acc + curr[1], 0);
  const dynamicProductSalesData = sortedProducts.map((p, i) => ({
    name: p[0],
    value: totalPCount > 0 ? Math.round((p[1] / totalPCount) * 100) : 0,
    color: topColors[i % topColors.length]
  }));

  const lowStockCount = products.filter(p => typeof p.stock === 'number' && p.stock < (p.min_stock ?? 20)).length;

  const statCards = [
    { label: `Revenue (${dateRange.replace(/_/g, ' ')})`, value: totalRevenue, prefix: "₹", icon: "payments", color: GREEN, bg: "rgba(31,81,50,0.08)", trend: "Live", trendUp: true },
    { label: `Orders (${dateRange.replace(/_/g, ' ')})`, value: totalOrders, prefix: "", suffix: "", icon: "shopping_bag", color: "#3b82f6", bg: "rgba(59,130,246,0.08)", trend: "Live", trendUp: true },
    { label: "Active Customers", value: activeCustomers, prefix: "", suffix: "", icon: "group", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", trend: "Live", trendUp: true },
    { label: "Total Distributors", value: totalDistributors, prefix: "", suffix: "", icon: "local_shipping", color: GOLD, bg: "rgba(212,166,74,0.1)", trend: "Live", trendUp: true },
    { label: "Monthly Sales", value: monthlySales, prefix: "₹", icon: "bar_chart", color: "#10b981", bg: "rgba(16,185,129,0.08)", trend: "Live", trendUp: true },
    { label: "Low Stock Items", value: lowStockCount, prefix: "", suffix: " items", icon: "warning", color: "#ef4444", bg: "rgba(239,68,68,0.08)", trend: "Action needed", trendUp: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Section header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "22px", color: "#1C1C1C", margin: 0 }}>Dashboard Overview</h2>
          <p style={{ color: "#9ca3af", fontSize: "13px", margin: "4px 0 0" }}>Welcome back, Super Admin! Here's what's happening today.</p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ padding: "8px 14px", borderRadius: "10px", border: "1.5px solid #f0ede8", background: "white", fontSize: "12px", fontWeight: "600", color: "#374151", cursor: "pointer", outline: "none" }}>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_3">Last 3 Months</option>
            <option value="last_6">Last 6 Months</option>
            <option value="this_year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <motion.button onClick={handleExport} style={{ padding: "8px 14px", borderRadius: "10px", border: "none", background: GREEN, fontSize: "12px", fontWeight: "600", color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
            Export Report
          </motion.button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ ...card, display: "flex", flexDirection: "column", gap: "12px" }}
            whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "22px", color: s.color }}>{s.icon}</span>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "600", color: s.trendUp ? "#10b981" : "#ef4444", background: s.trendUp ? "#ecfdf5" : "#fef2f2", padding: "3px 8px", borderRadius: "100px" }}>
                {s.trendUp ? "↑ " : ""}{s.trend}
              </span>
            </div>
            <div>
              <div style={{ fontSize: "24px", fontWeight: "700", fontFamily: "'Poppins',sans-serif", color: "#1C1C1C", lineHeight: 1.2 }}>
                {s.prefix}{Number(s.value).toLocaleString("en-IN")}{s.suffix || ""}
              </div>
              <div style={{ fontSize: "12.5px", color: "#6b7280", marginTop: "4px" }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Revenue + Product Sales ── */}
      <div className="dash-grid-2col">
        {/* Revenue Area Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "15px", color: "#1C1C1C", margin: 0 }}>Revenue Overview</h3>
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: "2px 0 0" }}>Last {revDateRange} months performance</p>
            </div>
            <select value={revDateRange} onChange={e => setRevDateRange(e.target.value)} style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #f0ede8", fontSize: "12px", color: "#374151", background: "white" }}>
              <option value="12">Last 12 Months</option>
              <option value="6">Last 6 Months</option>
              <option value="3">Last 3 Months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dynamicRevenueData.slice(-(parseInt(revDateRange)))} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GREEN} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `₹${v / 1000}K`} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltipRevenue} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={GREEN} strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: GREEN }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Product Sales Donut */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={card}>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "15px", color: "#1C1C1C", marginBottom: "4px" }}>Product Sales</h3>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "16px" }}>Share by product</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={dynamicProductSalesData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                {dynamicProductSalesData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
            {dynamicProductSalesData.map((p) => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11.5px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: p.color, flexShrink: 0 }} />
                <span style={{ flex: 1, color: "#374151" }}>{p.name}</span>
                <span style={{ fontWeight: "700", color: "#1C1C1C" }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Orders Bar + Recent Orders Table ── */}
      <div className="dash-grid-2col-rev">
        {/* Bar Chart: Monthly orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={card}>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "15px", color: "#1C1C1C", marginBottom: "4px" }}>Monthly Orders</h3>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "16px" }}>Order volume trend</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dynamicRevenueData.slice(-6)} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="orders" name="Orders" fill={GOLD} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Orders Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "15px", color: "#1C1C1C", margin: 0 }}>Recent Orders</h3>
            <span onClick={() => navigate && navigate("orders")} style={{ fontSize: "12px", color: GREEN, fontWeight: "600", cursor: "pointer" }}>View all →</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0ede8" }}>
                  {["Order ID", "Customer", "Amount", "Status"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px 10px", color: "#9ca3af", fontWeight: "600", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid #faf8f5", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#faf8f5"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "10px", color: GREEN, fontWeight: "600" }}>{o.id}</td>
                    <td style={{ padding: "10px", color: "#374151" }}>{o.customer}</td>
                    <td style={{ padding: "10px", fontWeight: "700", color: "#1C1C1C" }}>₹{o.amount.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "10px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "600", background: statusBg[o.status], color: statusColors[o.status], textTransform: "capitalize" }}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
