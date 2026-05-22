import React from "react";
import { motion } from "framer-motion";

export default function GenericPlaceholder({ title, description, icon }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "24px", fontWeight: "700", color: "#111827" }}>{title}</h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>{description}</p>
      </div>
      <div style={{ background: "white", padding: "64px", borderRadius: "16px", border: "1px solid #e5e7eb", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "#9ca3af" }}>{icon}</span>
        </div>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "20px", fontWeight: "700", color: "#374151", marginBottom: "12px" }}>Coming Soon</h3>
        <p style={{ color: "#6b7280", maxWidth: "400px", margin: "0 auto", lineHeight: "1.6" }}>
          This premium module is currently being finalized. Check back soon for updates to your partner dashboard.
        </p>
      </div>
    </motion.div>
  );
}
