import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabaseClient";

export default function InventoryAvailability() {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').order('name');
      if (!error && data) {
        const mappedData = data.map(p => {
          let status = "High Stock";
          if (p.stock === 0) status = "Out of Stock";
          else if (p.stock < 100) status = "Low Stock";
          
          return {
            id: p.id,
            sku: p.sku,
            name: p.name,
            stock: p.stock,
            warehouse: "Main Fulfillment Center",
            status: status
          };
        });
        setInventoryData(mappedData);
      }
      setLoading(false);
    };
    fetchInventory();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "24px", fontWeight: "700", color: "#111827" }}>Inventory Availability</h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Live stock visibility at your local warehouse hub.</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "550px" }}>
          <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <tr>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Product Code</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Name</th>
              <th style={{ padding: "16px", textAlign: "center", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Stock Level</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Warehouse Hub</th>
              <th style={{ padding: "16px", textAlign: "center", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: "24px", textAlign: "center", color: "#6b7280" }}>Loading inventory data...</td></tr>
            ) : (
              inventoryData.map(item => (
                <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "16px", fontWeight: "600", color: "#111827", fontSize: "13px", fontFamily: "monospace" }}>{item.sku}</td>
                  <td style={{ padding: "16px", color: "#374151", fontSize: "14px", fontWeight: "600" }}>{item.name}</td>
                  <td style={{ padding: "16px", textAlign: "center", color: "#4b5563", fontSize: "14px" }}>{item.stock} Units</td>
                  <td style={{ padding: "16px", color: "#6b7280", fontSize: "13px" }}>{item.warehouse}</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <span style={{ 
                      padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "700",
                      background: item.status === "High Stock" ? "#ecfdf5" : item.status === "Low Stock" ? "#fffbeb" : "#fef2f2",
                      color: item.status === "High Stock" ? "#059669" : item.status === "Low Stock" ? "#d97706" : "#dc2626"
                    }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </motion.div>
  );
}
