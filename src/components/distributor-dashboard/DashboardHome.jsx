import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "../../supabaseClient";

export default function DashboardHome({ distributorUser }) {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, monthlyPurchases: 0, pendingDeliveries: 0, totalEarnings: 0, activeProducts: 0, currentDiscount: 5 });
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);

  useEffect(() => {
    if (!distributorUser) return;
    
    const fetchOrdersAndProducts = async () => {
      const { data: b2bOrdersData, error: ordersError } = await supabase
        .from('orders')
        .select('*');
        
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (!ordersError && b2bOrdersData) {
        const b2bOrders = b2bOrdersData.filter(o => 
          o.order_number && 
          String(o.order_number).startsWith('B2B') && 
          o.customer_name?.trim().toLowerCase() === distributorUser.business?.trim().toLowerCase()
        );
        
        setOrders(b2bOrders);
        
        const pending = b2bOrders.filter(o => {
          const s = (o.status || "").toLowerCase();
          return s !== "delivered" && s !== "completed" && s !== "cancelled";
        }).length;
        
        const totalPurchases = b2bOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
        
        // Calculate real active products
        const activeProductsList = productsData ? productsData.filter(p => p.status !== 'inactive') : [];
        const activeProd = activeProductsList.length;
        
        // Calculate real average discount
        let totalDiscountPercent = 0;
        let discountCount = 0;
        activeProductsList.forEach(p => {
          const orig = parseFloat(p.offer_price || p.price || 0);
          const wholesale = parseFloat(p.wholesale_price || p.wholesalePrice);
          if (orig > 0) {
            if (wholesale && wholesale < orig) {
              totalDiscountPercent += ((orig - wholesale) / orig) * 100;
              discountCount++;
            } else if (!wholesale) {
              totalDiscountPercent += 15; // default fallback 15% discount
              discountCount++;
            }
          }
        });
        const avgDiscount = discountCount > 0 ? Math.round(totalDiscountPercent / discountCount) : 15;
        
        // Calculate monthly data for the chart
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = {};
        
        b2bOrders.forEach(o => {
          const date = new Date(o.created_at || o.date);
          const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
          if (!monthlyData[monthYear]) monthlyData[monthYear] = 0;
          monthlyData[monthYear] += Number(o.amount) || 0;
        });
        
        const chartData = Object.keys(monthlyData).map(k => ({
          name: k,
          revenue: monthlyData[k]
        })).slice(-6); // last 6 months
        
        setMonthlyRevenueData(chartData.length > 0 ? chartData : [{name: "This Month", revenue: 0}]);
        
        setStats({
          totalOrders: b2bOrders.length,
          monthlyPurchases: totalPurchases,
          pendingDeliveries: pending,
          totalEarnings: totalPurchases * 0.15, // Approx margins saved
          activeProducts: activeProd,
          currentDiscount: avgDiscount
        });
      }
    };
    
    fetchOrdersAndProducts();
  }, [distributorUser]);

  const statsArray = [
    { label: "Total Orders", value: stats.totalOrders, icon: "inventory_2", color: "#D4A64A", bg: "rgba(212,166,74,0.15)" },
    { label: "Total Purchases", value: `₹${stats.monthlyPurchases.toLocaleString("en-IN")}`, icon: "account_balance_wallet", color: "#1F5132", bg: "rgba(31,81,50,0.15)" },
    { label: "Pending Deliveries", value: stats.pendingDeliveries, icon: "local_shipping", color: "#f59e0b", bg: "#fffbeb" },
    { label: "Est. Margins Saved", value: `₹${stats.totalEarnings.toLocaleString("en-IN")}`, icon: "trending_up", color: "#10b981", bg: "#ecfdf5" },
    { label: "Active Products", value: stats.activeProducts, icon: "category", color: "#6366f1", bg: "#e0e7ff" },
    { label: "Current Discount", value: `${stats.currentDiscount}%`, icon: "sell", color: "#ec4899", bg: "#fce7f3" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
            Welcome back, {distributorUser?.business || "Partner"}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "15px" }}>Here is what's happening with your wholesale business today.</p>
        </div>
        <div style={{ padding: "8px 16px", background: "linear-gradient(135deg, #1F5132, #2d6b45)", color: "white", borderRadius: "100px", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#D4A64A" }}>workspace_premium</span>
          {distributorUser?.tier || "Partner"}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {statsArray.map((stat, i) => (
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
      <div style={{ marginBottom: "40px" }}>
        
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
      </div>
    </motion.div>
  );
}
