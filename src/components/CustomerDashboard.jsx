import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const statusColors = { delivered: "#10b981", shipped: "#3b82f6", processing: "#f59e0b", pending: "#8b5cf6", cancelled: "#ef4444" };
const statusBg = { delivered: "#ecfdf5", shipped: "#eff6ff", processing: "#fffbeb", pending: "#f5f3ff", cancelled: "#fef2f2" };

export default function CustomerDashboard({ user, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [paymentModalOrder, setPaymentModalOrder] = useState(null);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  
  // Profile State
  const [profileData, setProfileData] = useState({
    full_name: user?.user_metadata?.full_name || "",
    phone: user?.user_metadata?.phone || "",
    address: user?.user_metadata?.address || ""
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

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
      .ilike('customer_name', `%${user.email}%`)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setOrders(data);
        else setOrders([]);
        setOrdersLoading(false);
      });
  }, [activeTab, user]);

  const handlePaymentSubmit = async () => {
    if (!upiTxnId.trim()) return;
    setIsPaying(true);
    
    const newStatus = `Paid (UPI Txn: ${upiTxnId.trim()})`;
    
    try {
      const { error } = await supabase.from('orders')
        .update({ payment_status: newStatus })
        .eq('id', paymentModalOrder.id);
        
      if (!error) {
        setOrders(prev => prev.map(o => o.id === paymentModalOrder.id ? { ...o, payment_status: newStatus } : o));
        setPaymentModalOrder(null);
        setUpiTxnId("");
      } else {
        alert("There was an error updating your payment. Please contact support.");
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setIsPaying(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setProfileSuccess(false);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.full_name,
          phone: profileData.phone,
          address: profileData.address
        }
      });
      if (!error) {
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        alert("Failed to update profile: " + error.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

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
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address <span className="text-gray-400 normal-case font-normal">(Cannot be changed)</span></label>
                    <input 
                      type="text" 
                      readOnly 
                      value={user?.email || ""} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none cursor-not-allowed font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.full_name} 
                      onChange={e => setProfileData({...profileData, full_name: e.target.value})}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-[#1F5132] focus:ring-1 focus:ring-[#1F5132] transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mobile Number</label>
                    <input 
                      type="tel" 
                      value={profileData.phone} 
                      onChange={e => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="e.g., +91 9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-[#1F5132] focus:ring-1 focus:ring-[#1F5132] transition-all" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Delivery Address</label>
                    <textarea 
                      value={profileData.address} 
                      onChange={e => setProfileData({...profileData, address: e.target.value})}
                      placeholder="Enter your complete delivery address"
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-[#1F5132] focus:ring-1 focus:ring-[#1F5132] transition-all resize-none" 
                    ></textarea>
                  </div>
                  <div className="md:col-span-2 mt-2 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      {profileSuccess && (
                        <span className="text-[#10b981] font-semibold text-sm flex items-center gap-1 animate-fade-in">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> Profile updated successfully!
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="px-8 py-3 bg-[#1F5132] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSavingProfile ? (
                        <><span className="material-symbols-outlined text-[18px] animate-spin">autorenew</span> Saving...</>
                      ) : (
                        "Save Changes"
                      )}
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
                    {orders.map(order => {
                      const isExpanded = expandedOrder === order.id;
                      const productsList = Array.isArray(order.products) ? order.products : JSON.parse(order.products || '[]');
                      return (
                      <div 
                        key={order.id} 
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className={`border ${isExpanded ? 'border-[#1F5132]/30 shadow-md bg-white' : 'border-gray-100 bg-white hover:border-gray-200'} rounded-xl transition-all cursor-pointer overflow-hidden`}
                      >
                        <div className="p-5 flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-[#1F5132] text-white' : 'bg-gray-50 text-gray-400'}`}>
                              <span className="material-symbols-outlined">{isExpanded ? 'keyboard_arrow_up' : 'receipt_long'}</span>
                            </div>
                            <div>
                              <div className="font-bold text-[#1F5132] text-sm">{order.order_number || order.id}</div>
                              <div className="text-xs text-gray-500 mt-1">{order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'N/A'}</div>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div>
                              <div className="font-bold text-gray-800 text-lg">₹{Number(order.amount || 0).toLocaleString('en-IN')}</div>
                              <span style={{ background: statusBg[order.status] || "#f3f4f6", color: statusColors[order.status] || "#6b7280" }} className="text-xs font-bold px-3 py-1 rounded-full capitalize">{order.status || "processing"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 bg-gray-50/50 p-5 cursor-default" onClick={e => e.stopPropagation()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              {/* Left: Delivery Address */}
                              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[16px]">local_shipping</span> Delivery Details
                                </h4>
                                <div className="text-sm text-gray-700 leading-relaxed">
                                  {order.city ? (
                                    <>
                                      <p className="font-medium text-gray-900">{order.customer_name?.split(' | ')[0]}</p>
                                      {order.city.split(' | Phone:').map((line, i) => (
                                        <p key={i} className={i === 1 ? 'font-medium mt-1' : ''}>
                                          {i === 1 ? `Phone: ${line}` : line}
                                        </p>
                                      ))}
                                    </>
                                  ) : (
                                    <p className="text-gray-400 italic">No delivery address provided.</p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Right: Payment Details */}
                              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[16px]">payments</span> Payment Summary
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between text-gray-600">
                                    <span>Payment Status</span>
                                    <span className="font-bold capitalize text-gray-900">{order.payment_status || "Pending"}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{Number(order.amount || 0).toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                                    <span>Total Paid</span>
                                    <span className={order.payment_status?.toLowerCase().includes("paid") ? "text-green-600" : "text-gray-900"}>
                                      ₹{order.payment_status?.toLowerCase().includes("paid") ? Number(order.amount || 0).toLocaleString('en-IN') : "0"}
                                    </span>
                                  </div>
                                </div>
                                {order.payment_status?.toLowerCase().includes("pending") && (
                                  <button onClick={() => { setPaymentModalOrder(order); setUpiTxnId(""); }} className="mt-4 w-full py-2 bg-[#1F5132]/10 text-[#1F5132] font-bold rounded-lg hover:bg-[#1F5132]/20 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                                    Pay via UPI Now
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Products Table */}
                            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider p-4 border-b border-gray-100 bg-gray-50">
                                Ordered Items ({productsList.length})
                              </h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                  <thead className="text-xs text-gray-500 bg-white border-b border-gray-50">
                                    <tr>
                                      <th className="px-4 py-3 font-medium">Product</th>
                                      <th className="px-4 py-3 font-medium text-center">Qty</th>
                                      <th className="px-4 py-3 font-medium text-right">Price</th>
                                      <th className="px-4 py-3 font-medium text-right">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-50">
                                    {productsList.map((p, i) => (
                                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                          {typeof p === 'string' ? p : (p.name || "Unknown Product")}
                                          {p.unit && <div className="text-xs text-gray-500 font-normal mt-0.5">{p.unit}</div>}
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-600 bg-gray-50/30">
                                          {p.qty || p.quantity || 1}x
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-600">
                                          ₹{Number(p.price || 0).toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-[#1F5132]">
                                          ₹{(Number(p.price || 0) * Number(p.qty || p.quantity || 1)).toLocaleString('en-IN')}
                                        </td>
                                      </tr>
                                    ))}
                                    {productsList.length === 0 && (
                                      <tr><td colSpan="4" className="px-4 py-6 text-center text-gray-400 italic">No products found for this order.</td></tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                              <button onClick={() => alert("Downloading invoice...")} className="flex items-center gap-2 px-5 py-2.5 bg-[#D4A64A] text-white rounded-lg font-semibold text-sm hover:shadow-md transition-all active:scale-95">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Download Invoice
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      );
                    })}
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
      
      {/* UPI Payment Modal */}
      {paymentModalOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-fade-in text-center relative">
            <button onClick={() => setPaymentModalOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Complete Payment</h3>
            <p className="text-sm text-gray-500 mb-6">Order #{paymentModalOrder.order_number || paymentModalOrder.id}</p>
            
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 inline-block mb-4 shadow-inner">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=merchant@upi&pn=Arihant&am=${paymentModalOrder.amount}&cu=INR`)}`} alt="UPI QR Code" className="w-48 h-48" />
            </div>
            <p className="text-2xl font-bold text-[#1F5132] mb-1">₹{Number(paymentModalOrder.amount || 0).toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider font-semibold">Scan to Pay via any UPI app</p>
            
            <div className="text-left mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Transaction ID *</label>
              <input 
                type="text" 
                placeholder="Enter 12-digit UTR/Txn ID" 
                value={upiTxnId}
                onChange={(e) => setUpiTxnId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-[#1F5132] focus:ring-1 focus:ring-[#1F5132] transition-all font-medium" 
              />
            </div>
            
            <button 
              onClick={handlePaymentSubmit}
              disabled={isPaying || !upiTxnId.trim()}
              className="w-full py-3.5 bg-[#1F5132] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPaying ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              )}
              {isPaying ? "Verifying..." : "Confirm Payment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
