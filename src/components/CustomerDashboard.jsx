import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const statusColors = { delivered: "#10b981", shipped: "#3b82f6", processing: "#f59e0b", pending: "#8b5cf6", cancelled: "#ef4444" };
const statusBg = { delivered: "#ecfdf5", shipped: "#eff6ff", processing: "#fffbeb", pending: "#f5f3ff", cancelled: "#fef2f2" };

export default function CustomerDashboard({ user, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const getInitials = (email) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  useEffect(() => {
    if (activeTab !== "orders" || !user) return;
    setOrdersLoading(true);
    supabase.from('orders')
      .select('*')
      .eq('customer_email', user.email)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setOrders(data);
        else setOrders([]);
        setOrdersLoading(false);
      });
  }, [activeTab, user]);

  return (
    <div className="bg-[#FAF7F0] min-h-screen pt-24 pb-16 px-4 md:px-8 font-['Inter',sans-serif]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1F5132] font-['Poppins',sans-serif]">My Account</h1>
            <p className="text-gray-500 mt-1">Manage your profile, orders, and preferences.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 self-start">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[#1F5132] text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
                {getInitials(user?.email)}
              </div>
              <h2 className="text-lg font-bold text-gray-800">{user?.user_metadata?.full_name || "Customer"}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === 'profile' ? 'bg-[#1F5132]/10 text-[#1F5132] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
                Profile Info
              </button>
              <button 
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === 'orders' ? 'bg-[#1F5132]/10 text-[#1F5132] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                My Orders
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === 'settings' ? 'bg-[#1F5132]/10 text-[#1F5132] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span className="material-symbols-outlined text-[20px]">settings</span>
                Settings
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 font-['Poppins',sans-serif]">Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={user?.email || ""} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 outline-none cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={user?.user_metadata?.full_name || ""} 
                      placeholder="Not provided"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 outline-none cursor-not-allowed" 
                    />
                  </div>
                  <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <button className="px-6 py-2.5 bg-[#1F5132] text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-95">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 font-['Poppins',sans-serif]">Order History</h3>
                  <button 
                    onClick={() => onNavigate("products", null)}
                    className="text-[#D4A64A] font-semibold text-sm hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
                
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-16 text-gray-400">
                    <span className="material-symbols-outlined text-[40px] animate-spin mr-3">autorenew</span>
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-gray-400">
                      <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-700">No orders yet</h4>
                    <p className="text-gray-500 mt-2 max-w-sm">When you buy products from our store, they will appear here with real-time tracking.</p>
                    <button 
                      onClick={() => onNavigate("products", null)}
                      className="mt-6 px-8 py-3 bg-[#1F5132] text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                      Browse Store
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div>
                            <div className="font-bold text-[#1F5132] text-sm">{order.order_number || order.id}</div>
                            <div className="text-xs text-gray-500 mt-1">{order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : 'N/A'}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-800 text-lg">₹{Number(order.amount || 0).toLocaleString('en-IN')}</div>
                            <span style={{ background: statusBg[order.status] || "#f3f4f6", color: statusColors[order.status] || "#6b7280" }} className="text-xs font-bold px-3 py-1 rounded-full capitalize">{order.status || "processing"}</span>
                          </div>
                        </div>
                        {order.products && (
                          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                            {(Array.isArray(order.products) ? order.products : JSON.parse(order.products || '[]')).map((p, i) => (
                              <span key={i} className="text-xs px-3 py-1 bg-[#1F5132]/08 text-[#1F5132] rounded-full font-medium" style={{background:'rgba(31,81,50,0.08)'}}>
                                {typeof p === 'string' ? p : p.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 font-['Poppins',sans-serif]">Account Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div>
                      <h4 className="font-semibold text-gray-800">Email Notifications</h4>
                      <p className="text-sm text-gray-500 mt-1">Receive updates about your order status</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1F5132]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div>
                      <h4 className="font-semibold text-gray-800">Marketing Emails</h4>
                      <p className="text-sm text-gray-500 mt-1">Receive offers, discounts, and news</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1F5132]"></div>
                    </label>
                  </div>
                  
                  <div className="pt-4">
                    <button className="text-red-600 font-medium text-sm hover:underline">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
