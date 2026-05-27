import React, { useState } from "react";
import { motion } from "framer-motion";

import { supabase } from "../../supabaseClient";

export default function WholesalePricing() {
  const [calculatorQty, setCalculatorQty] = useState(15);
  const [pricingData, setPricingData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expectedSellingPrice, setExpectedSellingPrice] = useState("");

  React.useEffect(() => {
    if (selectedProduct) {
      setExpectedSellingPrice(selectedProduct.mrp.toString());
    }
  }, [selectedProduct]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        const mappedData = data.map(p => {
          const mrp = p.price;
          // Use explicit wholesale_price if available, else standard price
          const basePrice = p.wholesale_price || p.offer_price || p.price; 
          return {
            id: p.id,
            sku: p.sku,
            name: p.name,
            mrp: mrp,
            basePrice: basePrice,
            moq: 15,
            category: p.category
          };
        });
        setPricingData(mappedData);
        if (mappedData.length > 0) setSelectedProduct(mappedData[0]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const parsedSellingPrice = parseFloat(expectedSellingPrice);
  const activeSellingPrice = (isNaN(parsedSellingPrice) || expectedSellingPrice === "" || parsedSellingPrice === 0) 
                             ? (selectedProduct ? selectedProduct.mrp : 0) 
                             : parsedSellingPrice;
  const totalCost = selectedProduct ? selectedProduct.basePrice * calculatorQty : 0;
  const totalRevenue = selectedProduct ? activeSellingPrice * calculatorQty : 0;
  const grossProfit = totalRevenue - totalCost;
  const marginPercent = totalRevenue ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "24px", fontWeight: "700", color: "#111827" }}>Wholesale Pricing</h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>View your confidential partner rates, margins, and MOQ requirements.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "24px", alignItems: "start" }}>
        
        {/* Pricing Table */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#374151" }}>Current Rates Catalog</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ borderBottom: "1px solid #e5e7eb" }}>
              <tr>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Product</th>
                <th style={{ padding: "12px 20px", textAlign: "right", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>MRP</th>
                <th style={{ padding: "12px 20px", textAlign: "right", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Your Price</th>
                <th style={{ padding: "12px 20px", textAlign: "center", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>MOQ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>Loading pricing catalog...</td></tr>
              ) : (
                pricingData.map(item => {
                  const isSelected = selectedProduct?.id === item.id;
                  return (
                    <tr 
                      key={item.id} 
                      onClick={() => setSelectedProduct(item)}
                      style={{ 
                        borderBottom: "1px solid #e5e7eb", cursor: "pointer", transition: "all 0.2s",
                        background: isSelected ? "#f0fdf4" : "white"
                      }}
                    >
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: "600", color: isSelected ? "#1F5132" : "#111827", fontSize: "14px" }}>{item.name}</div>
                        <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>SKU: {item.sku}</div>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right", color: "#6b7280", fontSize: "14px", textDecoration: "line-through" }}>
                        ₹{item.mrp.toFixed(2)}
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <span style={{ fontWeight: "700", color: "#1F5132", fontSize: "15px" }}>
                          ₹{item.basePrice.toFixed(2)}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center", color: "#374151", fontSize: "14px", fontWeight: "500" }}>
                        {item.moq}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Profit Calculator */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #1F5132", overflow: "hidden", boxShadow: "0 10px 25px -5px rgba(31,81,50,0.1)", position: "sticky", top: "24px" }}>
          <div style={{ padding: "20px", background: "#1F5132", color: "white" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>calculate</span>
              Profit Calculator
            </h3>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>Select a product from the table to estimate your retail margins.</p>
          </div>
          
          <div style={{ padding: "24px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", marginBottom: "8px" }}>Selected Product</label>
              <div style={{ fontWeight: "600", color: "#111827", fontSize: "15px" }}>{selectedProduct?.name || "Loading..."}</div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", marginBottom: "8px" }}>Order Volume (Units)</label>
              <input 
                type="number" 
                value={calculatorQty}
                onChange={(e) => setCalculatorQty(Math.max(1, parseInt(e.target.value) || 0))}
                style={{ width: "100%", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", fontWeight: "600", color: "#111827", outline: "none" }}
              />
              {selectedProduct && calculatorQty < selectedProduct.moq && (
                <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>warning</span>
                  Below MOQ of {selectedProduct.moq}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", marginBottom: "8px" }}>Your Expected Selling Price</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "12px", color: "#6b7280", fontWeight: "600", fontSize: "16px" }}>₹</span>
                <input 
                  type="number" 
                  value={expectedSellingPrice}
                  onChange={(e) => setExpectedSellingPrice(e.target.value)}
                  placeholder={selectedProduct?.mrp || ""}
                  style={{ width: "100%", padding: "12px 12px 12px 32px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "16px", fontWeight: "600", color: "#111827", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "6px", display: "flex", justifyContent: "space-between" }}>
                <span>Buying at: ₹{selectedProduct?.basePrice}</span>
                <span>Default Web MRP: ₹{selectedProduct?.mrp}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "20px", borderTop: "1px dashed #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "#6b7280" }}>Total Investment</span>
                <span style={{ fontWeight: "600", color: "#374151" }}>₹{totalCost.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "#6b7280" }}>Expected Revenue</span>
                <span style={{ fontWeight: "600", color: "#374151" }}>₹{totalRevenue.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", padding: "12px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                <span style={{ fontWeight: "700", color: "#059669", fontSize: "15px" }}>Gross Profit</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "800", color: "#059669", fontSize: "18px" }}>₹{grossProfit.toLocaleString()}</div>
                  <div style={{ fontSize: "11px", color: "#047857", fontWeight: "700" }}>{marginPercent}% MARGIN</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}
