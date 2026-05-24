import React, { useState } from "react";
import { motion } from "framer-motion";

const GREEN = "#1F5132";
const card = { background: "white", borderRadius: "16px", border: "1px solid #f0ede8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" };
const inp = { width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white", boxSizing: "border-box", color: "#1C1C1C" };

const TABS = ["General", "Payment", "Shipping", "SEO", "Permissions"];

const SETTINGS = {
  General: [
    { key: "siteName", label: "Site Name", value: "Arihant FMCG", type: "text" },
    { key: "tagline", label: "Tagline", value: "Cultivating Purity Since 1984", type: "text" },
    { key: "email", label: "Support Email", value: "support@arihant.in", type: "email" },
    { key: "phone", label: "Support Phone", value: "+91 1800-456-7890", type: "text" },
    { key: "address", label: "Head Office Address", value: "Jaipur, Rajasthan, India", type: "text" },
    { key: "currency", label: "Currency", value: "INR (₹)", type: "select", options: ["INR (₹)", "USD ($)", "EUR (€)"] },
  ],
  Payment: [
    { key: "razorpay", label: "Razorpay Key ID", value: "rzp_live_XXXXXXXXXX", type: "text" },
    { key: "razorpaySecret", label: "Razorpay Secret", value: "••••••••••••••", type: "password" },
    { key: "cod", label: "Cash on Delivery", value: true, type: "toggle" },
    { key: "upi", label: "UPI Payments", value: true, type: "toggle" },
    { key: "netBanking", label: "Net Banking", value: true, type: "toggle" },
    { key: "minOrder", label: "Minimum Order Value (₹)", value: "199", type: "number" },
  ],
  Shipping: [
    { key: "freeShipping", label: "Free Shipping Threshold (₹)", value: "499", type: "number" },
    { key: "shippingCharge", label: "Standard Shipping Charge (₹)", value: "49", type: "number" },
    { key: "expressShipping", label: "Express Shipping Charge (₹)", value: "99", type: "number" },
    { key: "partner", label: "Logistics Partner", value: "Delhivery", type: "select", options: ["Delhivery", "Shiprocket", "BlueDart", "DTDC", "India Post"] },
    { key: "codAvailable", label: "COD Available Nationwide", value: true, type: "toggle" },
    { key: "returnPolicy", label: "Return Window (Days)", value: "7", type: "number" },
  ],
  SEO: [
    { key: "metaTitle", label: "Meta Title", value: "Arihant FMCG — Pure Indian Staples Since 1984", type: "text" },
    { key: "metaDesc", label: "Meta Description", value: "Premium stone-ground flours, daliyas and staples from Arihant FMCG. Shop 100% natural packaged food.", type: "textarea" },
    { key: "keywords", label: "Keywords", value: "arihant atta, sharbati atta, besan, daliya, fmcg india", type: "text" },
    { key: "gTag", label: "Google Analytics Tag", value: "G-XXXXXXXXXX", type: "text" },
    { key: "fbPixel", label: "Facebook Pixel ID", value: "12345678901234", type: "text" },
  ],
  Permissions: [
    { key: "reg2FA", label: "Require 2FA for Admin Login", value: false, type: "toggle" },
    { key: "sessionTimeout", label: "Session Timeout (minutes)", value: "60", type: "number" },
    { key: "auditLog", label: "Enable Audit Logging", value: true, type: "toggle" },
    { key: "emailAlerts", label: "Email Alerts for Low Stock", value: true, type: "toggle" },
    { key: "orderAlerts", label: "Email Alerts for New Orders", value: true, type: "toggle" },
    { key: "maxAdmins", label: "Max Admin Users", value: "10", type: "number" },
  ],
};

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("General");
  const [saved, setSaved] = useState(false);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem("arihant_admin_settings");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return SETTINGS;
  };

  const [settings, setSettings] = useState(loadSettings());

  const updateSetting = (tab, key, value) => {
    setSettings((s) => ({ ...s, [tab]: s[tab].map((item) => item.key === key ? { ...item, value } : item) }));
  };

  const handleSave = () => {
    localStorage.setItem("arihant_admin_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const currentSettings = settings[activeTab];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "#1C1C1C", margin: 0 }}>Settings</h2>
          <p style={{ color: "#9ca3af", fontSize: "12.5px", margin: "3px 0 0" }}>Manage your platform configuration</p>
        </div>
        <motion.button onClick={handleSave}
          style={{ padding: "9px 20px", borderRadius: "10px", background: saved ? "#10b981" : GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.3s" }}
          whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>
          <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>{saved ? "check" : "save"}</span>
          {saved ? "Saved!" : "Save Changes"}
        </motion.button>
      </div>

      <div style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
        {/* Tab sidebar */}
        <div style={{ ...card, padding: "12px", width: "180px", flexShrink: 0 }}>
          {TABS.map((tab) => (
            <motion.button key={tab} onClick={() => setActiveTab(tab)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer", background: activeTab === tab ? "rgba(31,81,50,0.08)" : "transparent", color: activeTab === tab ? GREEN : "#374151", fontWeight: activeTab === tab ? "700" : "500", fontSize: "13px", marginBottom: "2px", textAlign: "left" }}
              whileHover={{ background: "rgba(31,81,50,0.05)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "17px", color: activeTab === tab ? GREEN : "#9ca3af" }}>
                {{ General: "settings", Payment: "payments", Shipping: "local_shipping", SEO: "language", Permissions: "security" }[tab]}
              </span>
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Settings form */}
        <div style={{ flex: 1, ...card, padding: "22px" }}>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "16px", color: "#1C1C1C", marginBottom: "20px" }}>{activeTab} Settings</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {currentSettings.map((item) => (
              <div key={item.key}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "7px" }}>{item.label}</label>
                {item.type === "toggle" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <motion.div onClick={() => updateSetting(activeTab, item.key, !item.value)}
                      style={{ width: "46px", height: "26px", borderRadius: "100px", background: item.value ? GREEN : "#e5e7eb", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                      <motion.div animate={{ left: item.value ? "22px" : "2px" }} transition={{ duration: 0.2 }}
                        style={{ position: "absolute", top: "2px", width: "22px", height: "22px", borderRadius: "50%", background: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
                    </motion.div>
                    <span style={{ fontSize: "13px", color: item.value ? GREEN : "#9ca3af", fontWeight: "600" }}>{item.value ? "Enabled" : "Disabled"}</span>
                  </div>
                ) : item.type === "select" ? (
                  <select value={item.value} onChange={e => updateSetting(activeTab, item.key, e.target.value)} style={inp}>
                    {item.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : item.type === "textarea" ? (
                  <textarea value={item.value} onChange={e => updateSetting(activeTab, item.key, e.target.value)} rows={3} style={{ ...inp, resize: "none" }} />
                ) : item.type === "password" ? (
                  <input type="password" value={item.value} onChange={e => updateSetting(activeTab, item.key, e.target.value)} style={inp} />
                ) : (
                  <input type={item.type || "text"} value={item.value} onChange={e => updateSetting(activeTab, item.key, e.target.value)} style={inp}
                    onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
