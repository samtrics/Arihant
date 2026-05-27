import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabaseClient";

export default function DocumentsInvoices({ distributorUser }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (!distributorUser) return;
    const fetchDocuments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_name', distributorUser.business)
        .order('created_at', { ascending: false });

      if (!error && data) {
        let docs = [];
        data.filter(o => o.order_number && String(o.order_number).startsWith('B2B')).forEach(order => {
          const dateStr = new Date(order.created_at).toLocaleDateString();
          const amtStr = `₹${order.total_amount?.toLocaleString()}`;
          
          docs.push({
            id: `INV-${order.id.toString().slice(0, 4)}-${Math.floor(Math.random() * 1000)}`,
            type: "Tax Invoice",
            orderRef: order.order_number,
            date: dateStr,
            amount: amtStr,
            status: "Generated"
          });

          if (order.status !== "Processing") {
            docs.push({
              id: `REC-${order.id.toString().slice(0, 4)}-${Math.floor(Math.random() * 1000)}`,
              type: "Payment Receipt",
              orderRef: order.order_number,
              date: dateStr,
              amount: amtStr,
              status: order.payment_method === "CREDIT" ? "Credit Settlement" : "Paid via UPI"
            });
          }
        });
        
        // Add a general SOA
        docs.push({
          id: `SOA-Q${Math.ceil((new Date().getMonth() + 1) / 3)}-${new Date().getFullYear()}`,
          type: "Statement of Account",
          orderRef: "-",
          date: new Date().toLocaleDateString(),
          amount: "-",
          status: "Quarterly"
        });

        setDocuments(docs);
      }
      setLoading(false);
    };
    fetchDocuments();
  }, [distributorUser]);

  const handleDownload = (id) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      // Mock download action
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "24px", fontWeight: "700", color: "#111827" }}>Documents & Invoices</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Download your GST tax invoices, receipts, and account statements.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{ display: "flex", alignItems: "center", gap: "6px", background: "white", border: "1px solid #d1d5db", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#374151", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>filter_list</span>
            Filter by Date
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: "6px", background: "#1F5132", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "white", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>download</span>
            Export CSV
          </button>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
          <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <tr>
              <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Document ID</th>
              <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Type</th>
              <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Order Ref</th>
              <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Date</th>
              <th style={{ padding: "16px 24px", textAlign: "right", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Amount</th>
              <th style={{ padding: "16px 24px", textAlign: "center", fontSize: "12px", fontWeight: "700", color: "#4b5563", textTransform: "uppercase" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Loading documents...</td></tr>
            ) : documents.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>No documents found.</td></tr>
            ) : documents.map((doc, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={e => e.currentTarget.style.background = "white"}>
                <td style={{ padding: "16px 24px", fontWeight: "600", color: "#111827", fontSize: "14px", fontFamily: "monospace" }}>
                  {doc.id}
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: doc.type === "Tax Invoice" ? "#059669" : doc.type === "Credit Note" ? "#dc2626" : "#D4A64A" }}>
                      {doc.type === "Tax Invoice" ? "receipt_long" : doc.type === "Credit Note" ? "account_balance_wallet" : "description"}
                    </span>
                    {doc.type}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginLeft: "26px", marginTop: "2px" }}>{doc.status}</div>
                </td>
                <td style={{ padding: "16px 24px", color: "#6b7280", fontSize: "14px" }}>
                  {doc.orderRef}
                </td>
                <td style={{ padding: "16px 24px", color: "#4b5563", fontSize: "14px" }}>
                  {doc.date}
                </td>
                <td style={{ padding: "16px 24px", textAlign: "right", fontWeight: doc.amount !== "-" ? "700" : "400", color: "#111827", fontSize: "14px" }}>
                  {doc.amount}
                </td>
                <td style={{ padding: "16px 24px", textAlign: "center" }}>
                  <button 
                    onClick={() => handleDownload(doc.id)}
                    disabled={downloadingId === doc.id}
                    style={{ 
                      background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", width: "36px", height: "36px",
                      display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#1F5132",
                      cursor: downloadingId === doc.id ? "not-allowed" : "pointer",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "all 0.2s"
                    }}
                    onMouseEnter={e => { if(downloadingId !== doc.id) { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.borderColor = "#1F5132"; } }}
                    onMouseLeave={e => { if(downloadingId !== doc.id) { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e5e7eb"; } }}
                  >
                    {downloadingId === doc.id ? (
                      <span className="material-symbols-outlined" style={{ fontSize: "18px", animation: "spin 1s linear infinite" }}>autorenew</span>
                    ) : (
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>download</span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </motion.div>
  );
}
