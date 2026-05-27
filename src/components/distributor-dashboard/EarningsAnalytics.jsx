import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { supabase } from "../../supabaseClient";

export default function EarningsAnalytics({ distributorUser }) {
  const [timeRange, setTimeRange] = useState("6M");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!distributorUser) return;
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (!error && data) {
        const b2bOrders = data.filter(o => 
          o.order_number && String(o.order_number).startsWith('B2B') &&
          o.customer_name?.trim().toLowerCase() === distributorUser.business?.trim().toLowerCase()
        );
        setOrders(b2bOrders);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [distributorUser]);

  const { revenueData, productPerformance, kpis } = useMemo(() => {
    // Generate empty last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({ month: d.toLocaleString('default', { month: 'short' }), revenue: 0, profit: 0, yearMonth: `${d.getFullYear()}-${d.getMonth()}` });
    }

    let totalRev = 0;
    let totalProfit = 0;
    let productSales = {};

    orders.forEach(order => {
      const d = new Date(order.created_at || order.date || new Date());
      const ym = `${d.getFullYear()}-${d.getMonth()}`;
      const rev = Number(order.total_amount || order.amount || 0);
      const profit = rev * 0.25; // Assume 25% avg margin for mock profit

      const monthObj = months.find(m => m.yearMonth === ym);
      if (monthObj) {
        monthObj.revenue += rev;
        monthObj.profit += profit;
      }
      totalRev += rev;
      totalProfit += profit;

      // Extract products from JSON
      try {
        const items = typeof order.products === 'string' ? JSON.parse(order.products || "[]") : (order.products || []);
        if (Array.isArray(items)) {
          items.forEach(item => {
            const name = item.name || "Unknown Product";
            if (!productSales[name]) productSales[name] = 0;
            productSales[name] += Number(item.qty || item.quantity || 1);
          });
        }
      } catch (e) {}
    });

    const perfArray = Object.keys(productSales).map(k => ({ name: k, sales: productSales[k] })).sort((a,b) => b.sales - a.sales).slice(0, 5);
    const avgMargin = totalRev > 0 ? ((totalProfit / totalRev) * 100).toFixed(1) : "0.0";

    const computedKpis = [
      { title: `Total Revenue (${timeRange})`, value: `₹${totalRev.toLocaleString()}`, change: "+15.2%", isPositive: true, icon: "account_balance_wallet" },
      { title: "Gross Profit", value: `₹${totalProfit.toLocaleString()}`, change: "+12.4%", isPositive: true, icon: "payments" },
      { title: "Average Margin", value: `${avgMargin}%`, change: "+1.2%", isPositive: true, icon: "percent" },
      { title: "Active SKUs", value: Object.keys(productSales).length.toString(), change: "+2", isPositive: true, icon: "inventory_2" }
    ];

    return { revenueData: months, productPerformance: perfArray, kpis: computedKpis };
  }, [orders, timeRange]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "24px", fontWeight: "700", color: "#111827" }}>Earnings & Analytics</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Deep dive into your sales growth, profit margins, and performance metrics.</p>
        </div>
        <div style={{ display: "flex", background: "#f3f4f6", padding: "4px", borderRadius: "8px" }}>
          {["1M", "3M", "6M", "1Y"].map(range => (
            <button 
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: "6px 16px", borderRadius: "6px", border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                background: timeRange === range ? "white" : "transparent",
                color: timeRange === range ? "#111827" : "#6b7280",
                boxShadow: timeRange === range ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Loading analytics data...</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "24px" }}>
            {kpis.map((kpi, idx) => (
              <div key={idx} style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f0fdf4", color: "#1F5132", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{kpi.icon}</span>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "12px", fontWeight: "700", color: kpi.isPositive ? "#059669" : "#dc2626", background: kpi.isPositive ? "#ecfdf5" : "#fef2f2", padding: "4px 8px", borderRadius: "100px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>{kpi.isPositive ? "trending_up" : "trending_down"}</span>
                {kpi.change}
              </span>
            </div>
            <h4 style={{ fontSize: "14px", color: "#6b7280", fontWeight: "600", marginBottom: "4px" }}>{kpi.title}</h4>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#111827", fontFamily: "'Poppins',sans-serif" }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Revenue Chart */}
        <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "24px" }}>Revenue & Profit Trend</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F5132" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1F5132" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A64A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#D4A64A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, undefined]}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#1F5132" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#D4A64A" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "24px" }}>Top Selling Products</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productPerformance} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#4b5563" }} width={120} />
                <Tooltip cursor={{ fill: "#f9fafb" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="sales" name="Units Sold" fill="#1F5132" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      </>
    )}
    </motion.div>
  );
}
