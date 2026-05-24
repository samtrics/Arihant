import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const GREEN = "#1F5132";
const GOLD = "#D4A64A";
const card = { background: "white", borderRadius: "16px", border: "1px solid #f0ede8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" };

export default function AnalyticsView({ orders = [], b2bOrders = [] }) {
  const [dateRange, setDateRange] = useState("12");

  const allOrders = useMemo(() => [...orders, ...b2bOrders].filter(o => o.status !== "cancelled"), [orders, b2bOrders]);

  const revenueData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const data = [];
    for(let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({ month: months[d.getMonth()], revenue: 0, orders: 0, customers: 0 });
    }
    
    allOrders.forEach(o => {
      const date = new Date(o.created_at || o.date || Date.now());
      if (isNaN(date.getTime())) return;
      
      const m = months[date.getMonth()];
      const idx = data.findIndex(d => d.month === m);
      if(idx !== -1) {
        data[idx].revenue += Number(o.amount || 0);
        data[idx].orders += 1;
        data[idx].customers += 1; 
      }
    });
    return data;
  }, [allOrders]);

  const productSalesData = useMemo(() => {
    const pMap = {};
    allOrders.forEach(o => {
      let prods = [];
      if (Array.isArray(o.products)) {
        prods = o.products;
      } else if (typeof o.products === 'string') {
        try {
          prods = JSON.parse(o.products || '[]');
        } catch(e) {
          prods = [];
        }
      }
      prods.forEach(p => {
        const name = typeof p === "string" ? p : p?.name || "Unknown Product";
        const qty = p?.qty || 1;
        pMap[name] = (pMap[name] || 0) + qty;
      });
    });
    const total = Object.values(pMap).reduce((a,b)=>a+b, 0);
    const sorted = Object.entries(pMap).sort((a,b)=>b[1]-a[1]).slice(0, 5);
    const colors = ["#1F5132", "#D4A64A", "#8b5cf6", "#3b82f6", "#10b981"];
    return sorted.map((s, i) => ({
      name: s[0],
      value: total > 0 ? Math.round((s[1] / total) * 100) : 0,
      color: colors[i] || "#9ca3af"
    }));
  }, [allOrders]);

  const orderStatusData = useMemo(() => {
    const sMap = { "delivered": 0, "processing": 0, "shipped": 0, "cancelled": 0 };
    const allIncludingCancelled = [...orders, ...b2bOrders];
    allIncludingCancelled.forEach(o => {
      const s = o.status || "processing";
      sMap[s] = (sMap[s] || 0) + 1;
    });
    const total = allIncludingCancelled.length || 1;
    const colors = { "delivered": "#10b981", "processing": "#f59e0b", "shipped": "#3b82f6", "cancelled": "#ef4444" };
    return Object.entries(sMap).map(([k, v]) => ({
      name: k.charAt(0).toUpperCase() + k.slice(1),
      value: Math.round((v / total) * 100),
      color: colors[k] || "#9ca3af"
    })).filter(x => x.value > 0);
  }, [orders, b2bOrders]);

  const totalRev = allOrders.reduce((a,b)=>a+Number(b.amount||0), 0);
  const avgOrder = allOrders.length ? Math.round(totalRev / allOrders.length) : 0;
  
  const kpis = [
    { label: "Total Revenue", val: `₹${totalRev.toLocaleString("en-IN")}`, change: "+0.0%", up: true, icon: "payments" },
    { label: "Avg Order Value", val: `₹${avgOrder.toLocaleString("en-IN")}`, change: "+0.0%", up: true, icon: "receipt" },
    { label: "Total Orders", val: allOrders.length.toString(), change: "+0.0%", up: true, icon: "shopping_bag" },
    { label: "Total Customers", val: new Set(allOrders.map(o => o.customer)).size.toString(), change: "+0.0%", up: true, icon: "groups" },
  ];

  const slicedData = revenueData.slice(-(parseInt(dateRange)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "#1C1C1C", margin: 0 }}>Analytics & Revenue</h2>
          <p style={{ color: "#9ca3af", fontSize: "12.5px", margin: "3px 0 0" }}>Detailed business performance overview</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white", color: "#374151" }}>
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="12">Last 12 Months</option>
          </select>
          <motion.button style={{ padding: "8px 16px", borderRadius: "10px", background: GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "12.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>download</span>
            Export Report
          </motion.button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            style={{ ...card, padding: "18px", display: "flex", gap: "12px", alignItems: "flex-start" }}
            whileHover={{ y: -3, boxShadow: "0 10px 35px rgba(0,0,0,0.07)" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(31,81,50,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px", color: GREEN }}>{k.icon}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "11.5px", color: "#9ca3af", marginBottom: "4px" }}>{k.label}</div>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "#1C1C1C", lineHeight: 1.1 }}>{k.val}</div>
              <div style={{ fontSize: "11px", fontWeight: "600", color: k.up ? "#10b981" : "#ef4444", marginTop: "4px" }}>
                {k.up ? "↑" : "↓"} {k.change} vs last period
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Area Chart */}
      <div style={{ ...card, padding: "22px" }}>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "15px", color: "#1C1C1C", marginBottom: "4px" }}>Revenue & Order Trend</h3>
        <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>Monthly revenue and order count</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={slicedData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={GREEN} stopOpacity={0.2} />
                <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cstG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={GOLD} stopOpacity={0.2} />
                <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tickFormatter={v => `₹${v / 1000}K`} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v, n) => [n === "Revenue" ? `₹${v.toLocaleString("en-IN")}` : v, n]} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke={GREEN} strokeWidth={2.5} fill="url(#revG)" dot={false} activeDot={{ r: 5 }} />
            <Area yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke={GOLD} strokeWidth={2} fill="url(#cstG)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Product + Order Status charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Product Performance Bar */}
        <div style={{ ...card, padding: "20px" }}>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "15px", color: "#1C1C1C", marginBottom: "4px" }}>Product Performance</h3>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "16px" }}>Sales share by product (%)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={productSalesData} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: "#374151" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip formatter={v => [`${v}%`, "Share"]} />
              <Bar dataKey="value" name="Share %" radius={[0, 6, 6, 0]}>
                {productSalesData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div style={{ ...card, padding: "20px" }}>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "15px", color: "#1C1C1C", marginBottom: "4px" }}>Order Status Distribution</h3>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Breakdown of order statuses</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={42} outerRadius={70} paddingAngle={3} dataKey="value">
                {orderStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
            {orderStatusData.map((s) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: s.color, flexShrink: 0 }} />
                <span style={{ color: "#374151" }}>{s.name}: <strong>{s.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Growth Line Chart */}
      <div style={{ ...card, padding: "20px" }}>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "15px", color: "#1C1C1C", marginBottom: "4px" }}>Customer Growth</h3>
        <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "16px" }}>New customers acquired each month</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={slicedData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="customers" name="Customers" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: "#8b5cf6" }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
