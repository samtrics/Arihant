import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BulkOrderPortal({ products, onOrderSuccess }) {
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState("");
  const activeProducts = products.filter(p => p.status !== "inactive" && p.name.toLowerCase().includes(search.toLowerCase()));

  const handleQtyChange = (id, val) => {
    const qty = parseInt(val, 10);
    setCart(prev => {
      const c = { ...prev };
      if (isNaN(qty) || qty <= 0) delete c[id];
      else c[id] = qty;
      return c;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    Object.keys(cart).forEach(id => {
      const p = activeProducts.find(prod => prod.id === id);
      if (p) {
        const price = p.offerPrice ? parseFloat(p.offerPrice) : parseFloat(p.price);
        total += (price * 0.85) * cart[id];
      }
    });
    return total;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "24px", fontWeight: "700", color: "#111827" }}>Place Bulk Order</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Build your requisition. All prices reflect your 15% wholesale discount.</p>
        </div>
        <div style={{ position: "relative", width: "300px" }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>search</span>
          <input 
            type="text" placeholder="Search catalog..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 10px 10px 40px", borderRadius: "10px", border: "1px solid #d1d5db", outline: "none" }}
          />
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", marginBottom: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <tr>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Product</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>SKU & Unit</th>
              <th style={{ padding: "16px", textAlign: "right", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Your Price</th>
              <th style={{ padding: "16px", textAlign: "center", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase", width: "150px" }}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {activeProducts.map(p => {
              const originalPrice = parseFloat(p.offerPrice || p.price);
              const discountPrice = originalPrice * 0.85;
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img src={p.imgSrc} alt={p.name} style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px", border: "1px solid #f3f4f6" }} />
                      <div>
                        <p style={{ fontWeight: "600", color: "#111827", fontSize: "14px" }}>{p.name}</p>
                        <span style={{ fontSize: "10px", fontWeight: "600", color: "#1F5132", background: "#ecfdf5", padding: "2px 6px", borderRadius: "4px" }}>{p.category}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px", fontSize: "13px", color: "#4b5563" }}>
                    <p style={{ fontFamily: "monospace", color: "#111827", fontWeight: "600" }}>{p.sku}</p>
                    <p>{p.weightValue} {p.weightUnit}</p>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>₹{discountPrice.toFixed(2)}</span>
                      <span style={{ fontSize: "12px", color: "#9ca3af", textDecoration: "line-through" }}>₹{originalPrice.toFixed(2)}</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f9fafb", padding: "4px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                      <button onClick={() => handleQtyChange(p.id, (cart[p.id] || 0) - 1)} style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "white", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer" }}>-</button>
                      <input 
                        type="number" min="0" value={cart[p.id] || ""} onChange={e => handleQtyChange(p.id, e.target.value)}
                        style={{ width: "40px", textAlign: "center", border: "none", background: "transparent", outline: "none", fontWeight: "600" }} 
                      />
                      <button onClick={() => handleQtyChange(p.id, (cart[p.id] || 0) + 1)} style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "white", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer" }}>+</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
        <div>
          <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Cart Summary</p>
          <p style={{ color: "#111827", fontSize: "14px" }}>{Object.keys(cart).length} item(s) selected.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Estimated Total</p>
            <p style={{ fontSize: "28px", fontWeight: "700", color: "#1F5132", fontFamily: "'Poppins',sans-serif", lineHeight: "1" }}>₹{calculateTotal().toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          </div>
          <button 
            onClick={() => { onOrderSuccess(); setCart({}); }}
            disabled={Object.keys(cart).length === 0}
            style={{ 
              padding: "16px 32px", borderRadius: "12px", border: "none", fontWeight: "700", fontSize: "15px",
              cursor: Object.keys(cart).length > 0 ? "pointer" : "not-allowed",
              background: Object.keys(cart).length > 0 ? "linear-gradient(135deg, #1F5132, #2d6b45)" : "#e5e7eb",
              color: Object.keys(cart).length > 0 ? "white" : "#9ca3af",
              boxShadow: Object.keys(cart).length > 0 ? "0 8px 20px rgba(31,81,50,0.25)" : "none",
              transition: "all 0.2s"
            }}
          >
            Submit Order
          </button>
        </div>
      </div>
    </motion.div>
  );
}
