import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";

const GREEN = "#1F5132";
const GOLD = "#D4A64A";
const card = { background: "white", borderRadius: "16px", border: "1px solid #f0ede8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" };
const emptyForm = { code: "", type: "percentage", value: "", minOrder: "", maxDiscount: "", maxUsage: "", expiry: "" };
const inp = { width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white", boxSizing: "border-box", color: "#1C1C1C" };

export default function CouponsManager() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    supabase.from('coupons').select('*').order('id').then(({ data, error }) => {
      if (!error && data) setCoupons(data.map(c => ({ ...c, usage: c.usage_count, maxUsage: c.max_usage, minOrder: c.min_order, maxDiscount: c.max_discount })));
      setLoading(false);
    });
  }, []);

  const handleCreate = async () => {
    const payload = { code: form.code, type: form.type, value: +form.value, min_order: +form.minOrder, max_discount: +form.maxDiscount, max_usage: +form.maxUsage, expiry: form.expiry, usage_count: 0, status: 'active' };
    const newId = `CPN${String(coupons.length + 1).padStart(3, "0")}`;
    const { data, error } = await supabase.from('coupons').insert([{ id: newId, ...payload }]).select();
    if (!error && data) {
      setCoupons([{ ...data[0], usage: 0, maxUsage: data[0].max_usage, minOrder: data[0].min_order, maxDiscount: data[0].max_discount }, ...coupons]);
      setModal(false);
      setForm(emptyForm);
    } else {
      alert('Error creating coupon: ' + error.message);
    }
  };

  const toggleStatus = async (id) => {
    const coupon = coupons.find(c => c.id === id);
    const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
    const { error } = await supabase.from('coupons').update({ status: newStatus }).eq('id', id);
    if (!error) setCoupons(cs => cs.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const isExpired = (expiry) => new Date(expiry) < new Date();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "#1C1C1C", margin: 0 }}>Coupons & Offers</h2>
          <p style={{ color: "#9ca3af", fontSize: "12.5px", margin: "3px 0 0" }}>{coupons.filter(c => c.status === "active").length} active coupons</p>
        </div>
        <motion.button onClick={() => setModal(true)} style={{ padding: "9px 18px", borderRadius: "10px", background: GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>
          <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>add</span>
          Create Coupon
        </motion.button>
      </div>

      {/* Coupons Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
        {coupons.map((c) => {
          const expired = isExpired(c.expiry);
          const statusColor = c.status === "active" && !expired ? "#10b981" : "#6b7280";
          const statusBg = c.status === "active" && !expired ? "#ecfdf5" : "#f3f4f6";
          const usage_pct = Math.min(100, (c.usage / c.maxUsage) * 100);
          return (
            <motion.div key={c.id} style={{ ...card, padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}
              whileHover={{ y: -3, boxShadow: "0 10px 35px rgba(0,0,0,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "monospace", fontWeight: "900", fontSize: "18px", color: GREEN, letterSpacing: "2px", marginBottom: "4px" }}>{c.code}</div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#1C1C1C" }}>
                    {c.type === "percentage" ? `${c.value}% OFF` : `₹${c.value} Flat OFF`}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#6b7280", marginTop: "2px" }}>Min. order ₹{c.minOrder} · Max discount ₹{c.maxDiscount}</div>
                </div>
                <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "700", background: statusBg, color: statusColor }}>
                  {expired ? "Expired" : c.status}
                </span>
              </div>

              {/* Usage bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "11.5px", color: "#6b7280" }}>
                  <span>Usage</span>
                  <span style={{ fontWeight: "700", color: "#1C1C1C" }}>{c.usage} / {c.maxUsage}</span>
                </div>
                <div style={{ height: "6px", borderRadius: "100px", background: "#f0ede8", overflow: "hidden" }}>
                  <motion.div style={{ height: "100%", borderRadius: "100px", background: usage_pct >= 90 ? "#ef4444" : GREEN }}
                    initial={{ width: 0 }} animate={{ width: `${usage_pct}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11.5px", color: "#9ca3af" }}>Expires: {c.expiry}</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <motion.button onClick={() => toggleStatus(c.id)}
                    style={{ padding: "5px 12px", borderRadius: "8px", border: "1.5px solid", fontSize: "11.5px", fontWeight: "700", cursor: "pointer", background: "white", borderColor: c.status === "active" ? "#f59e0b" : GREEN, color: c.status === "active" ? "#f59e0b" : GREEN }}>
                    {c.status === "active" ? "Deactivate" : "Activate"}
                  </motion.button>
                  <motion.button onClick={() => setDeleteId(c.id)}
                    style={{ padding: "5px 10px", borderRadius: "8px", border: "1.5px solid #fecaca", background: "#fef2f2", cursor: "pointer", color: "#ef4444", lineHeight: 1 }}
                    whileHover={{ background: "#ef4444", color: "white" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>delete</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={(e) => { if (e.target === e.currentTarget) setModal(false); }}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
              style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "500px", overflow: "hidden" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid #f0ede8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "16px", margin: 0 }}>Create New Coupon</h3>
                <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>close</span>
                </button>
              </div>
              <div style={{ padding: "20px 22px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Coupon Code</label>
                    <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. SAVE20" style={{ ...inp, fontFamily: "monospace", letterSpacing: "2px", fontWeight: "700" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Discount Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Discount Value</label>
                    <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder={form.type === "percentage" ? "10" : "50"} style={inp} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Min. Order (₹)</label>
                    <input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} placeholder="500" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Max Discount (₹)</label>
                    <input type="number" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: e.target.value })} placeholder="200" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Usage Limit</label>
                    <input type="number" value={form.maxUsage} onChange={e => setForm({ ...form, maxUsage: e.target.value })} placeholder="500" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Expiry Date</label>
                    <input type="date" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} style={inp} />
                  </div>
                </div>
              </div>
              <div style={{ padding: "14px 22px", borderTop: "1px solid #f0ede8", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button onClick={() => setModal(false)} style={{ padding: "9px 18px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                <motion.button onClick={handleCreate} style={{ padding: "9px 22px", borderRadius: "10px", background: GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                  whileHover={{ opacity: 0.9 }}>Create Coupon</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              style={{ background: "white", borderRadius: "20px", padding: "28px", maxWidth: "340px", width: "100%", textAlign: "center" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "26px", color: "#ef4444" }}>delete_forever</span>
              </div>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "17px", marginBottom: "8px" }}>Delete Coupon?</h3>
              <p style={{ color: "#6b7280", fontSize: "13.5px", marginBottom: "20px" }}>This coupon will be permanently removed and can no longer be used.</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                <motion.button onClick={async () => { 
                    const { error } = await supabase.from('coupons').delete().eq('id', deleteId);
                    if (!error) setCoupons(cs => cs.filter(c => c.id !== deleteId));
                    setDeleteId(null); 
                  }}
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "#ef4444", color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                  whileHover={{ opacity: 0.88 }}>Delete</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
