import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";

export default function ProfileSettings({ distributorUser }) {
  const [formData, setFormData] = useState({
    business: distributorUser?.business || "",
    phone: distributorUser?.phone || "",
    email: distributorUser?.email || "",
    address: distributorUser?.address || "",
    gstin: distributorUser?.gstin || "",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMsg("");
  };

  const handleSave = async () => {
    if (!distributorUser) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('distributors')
        .update({
          business: formData.business,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          gstin: formData.gstin
        })
        .eq('distributor_id', distributorUser.distributor_id); // use distributor_id column

      if (error) throw error;
      
      setSuccessMsg("Profile updated successfully!");
      
      // We ideally want to update the local session, but next login will fetch it.
    } catch (err) {
      alert("Error saving profile: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "8px", 
    border: "1px solid #d1d5db", outline: "none", fontSize: "14px",
    background: "#f9fafb", transition: "border 0.2s"
  };
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "24px", fontWeight: "700", color: "#111827" }}>Profile Settings</h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Update your business details, contact information, and GSTIN.</p>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="dist-profile-grid">
        {/* Form Section */}
        <div style={{ background: "white", padding: "32px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "24px" }}>Business Information</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={labelStyle}>Business Name</label>
              <input type="text" name="business" value={formData.business} onChange={handleChange} style={inputStyle} onFocus={e => e.target.style.borderColor = "#1F5132"} onBlur={e => e.target.style.borderColor = "#d1d5db"} />
            </div>
            <div>
              <label style={labelStyle}>GSTIN Number</label>
              <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} style={inputStyle} onFocus={e => e.target.style.borderColor = "#1F5132"} onBlur={e => e.target.style.borderColor = "#d1d5db"} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} onFocus={e => e.target.style.borderColor = "#1F5132"} onBlur={e => e.target.style.borderColor = "#d1d5db"} />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} onFocus={e => e.target.style.borderColor = "#1F5132"} onBlur={e => e.target.style.borderColor = "#d1d5db"} />
            </div>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label style={labelStyle}>Registered Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows="3" style={{ ...inputStyle, resize: "vertical" }} onFocus={e => e.target.style.borderColor = "#1F5132"} onBlur={e => e.target.style.borderColor = "#d1d5db"} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              style={{ 
                padding: "12px 24px", borderRadius: "8px", border: "none", fontWeight: "600", fontSize: "14px",
                background: "linear-gradient(135deg, #1F5132, #2d6b45)", color: "white", cursor: isSaving ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: "8px"
              }}
            >
              {isSaving ? "Saving..." : <><span className="material-symbols-outlined" style={{ fontSize: "18px" }}>save</span> Save Changes</>}
            </button>
            <AnimatePresence>
              {successMsg && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ color: "#10b981", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>check_circle</span>
                  {successMsg}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ background: "linear-gradient(135deg, #D4A64A, #b38836)", padding: "24px", borderRadius: "16px", color: "white" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>workspace_premium</span>
            </div>
            <h4 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>Partner Tier: {distributorUser?.tier || "Partner"}</h4>
            <p style={{ fontSize: "13px", opacity: 0.9, lineHeight: "1.5" }}>You are currently enjoying a standard 15% wholesale discount. Increase monthly purchases to upgrade your tier.</p>
          </div>

          <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
            <h4 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>Account Details</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", fontWeight: "700" }}>Distributor ID</span>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#1F5132", fontFamily: "monospace" }}>{distributorUser?.distributor_id || distributorUser?.id || "N/A"}</p>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", fontWeight: "700" }}>Member Since</span>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{distributorUser?.applied || "N/A"}</p>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", fontWeight: "700" }}>Account Status</span>
                <p style={{ display: "inline-block", fontSize: "11px", fontWeight: "700", color: "#10b981", background: "#ecfdf5", padding: "4px 8px", borderRadius: "100px", textTransform: "capitalize", marginTop: "4px" }}>{distributorUser?.status || "active"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
