import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";


const GREEN = "#1F5132";
const GOLD = "#D4A64A";
const card = { background: "white", borderRadius: "16px", border: "1px solid #f0ede8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" };
const CATS = ["All", "Flours (Atta)", "Grains & Pulses", "Spices (Masala)", "Roasted Daliya", "Rice Varieties", "Cooking Oils", "Ready to Cook", "Organic Staples"];

const emptyForm = { name: "", sku: "", category: "Flours (Atta)", price: "", offerPrice: "", stock: "", weightValue: "", weightUnit: "kg", desc: "", tags: "", status: "active", imgSrc: "" };

export default function ProductsManager({ products, setProducts }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [modal, setModal] = useState(null); // null | "add" | "edit" | "delete"
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const PER = 6;

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchQ = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const matchC = cat === "All" || p.category === cat;
    return matchQ && matchC;
  });
  const totalPages = Math.ceil(filtered.length / PER);
  const paged = filtered.slice((page - 1) * PER, page * PER);

  const openAdd = () => { setForm({ ...emptyForm, sku: `ARI-${Math.random().toString(36).substr(2, 6).toUpperCase()}` }); setModal("add"); };
  const openEdit = (p) => { 
    const match = p.weight ? String(p.weight).match(/^([\d.]+)(.*)$/) : null;
    const wv = match ? match[1] : p.weight || "";
    const wu = match ? match[2].trim() || "kg" : "kg";
    setForm({ ...p, tags: p.tags.join(", "), offerPrice: p.offerPrice ?? "", weightValue: wv, weightUnit: wu }); 
    setEditId(p.id); 
    setModal("edit"); 
  };
  const openDelete = (id) => { setDeleteId(id); setModal("delete"); };

  const handleImageUpload = async (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);
        
      setForm({ ...form, imgSrc: data.publicUrl });
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const newWeight = form.weightValue ? `${form.weightValue}${form.weightUnit}` : "";
    const payload = {
      name: form.name,
      sku: form.sku,
      category: form.category,
      price: +form.price,
      offer_price: form.offerPrice ? +form.offerPrice : null,
      stock: +form.stock,
      weight: newWeight,
      status: form.status,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [],
      emoji: form.emoji || "🌾",
      description: form.desc || form.description || "",
      tag: form.tag || "NEW",
      img_src: form.imgSrc || form.img_src || "",
      bestseller: form.bestseller || false,
      featured: form.featured || false,
      organic: form.organic || false,
    };

    if (modal === "add") {
      const newId = `PRD${String(products.length + 1).padStart(3, "0")}`;
      const { error } = await supabase.from('products').insert([{ id: newId, ...payload }]);
      if (error) { alert("Error saving product: " + error.message); return; }
    } else {
      const { error } = await supabase.from('products').update(payload).eq('id', editId);
      if (error) { alert("Error updating product: " + error.message); return; }
    }
    // Realtime subscription in App.jsx will update products state automatically
    setModal(null);
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('products').delete().eq('id', deleteId);
    if (error) { alert("Error deleting product: " + error.message); return; }
    setModal(null);
  };

  const inp = { width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white", boxSizing: "border-box", color: "#1C1C1C" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "#1C1C1C", margin: 0 }}>Products</h2>
          <p style={{ color: "#9ca3af", fontSize: "12.5px", margin: "3px 0 0" }}>{filtered.length} products found</p>
        </div>
        <motion.button onClick={openAdd} style={{ padding: "9px 18px", borderRadius: "10px", background: GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>
          <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>add</span>
          Add Product
        </motion.button>
      </div>

      {/* Filters */}
      <div style={{ ...card, padding: "14px 16px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1", minWidth: "180px" }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "17px" }}>search</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or SKU…"
            style={{ ...inp, paddingLeft: "38px" }} />
        </div>
        <select value={cat} onChange={e => { setCat(e.target.value); setPage(1); }} style={{ ...inp, width: "auto", minWidth: "160px" }}>
          {CATS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <motion.button style={{ padding: "9px 14px", borderRadius: "10px", border: "1.5px solid #f0ede8", background: "white", fontSize: "12px", fontWeight: "600", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          whileHover={{ borderColor: GREEN, color: GREEN }}>
          <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>download</span>
          Export CSV
        </motion.button>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#faf8f5", borderBottom: "2px solid #f0ede8" }}>
                {["Product", "SKU", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 14px", color: "#6b7280", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => {
                const isLow = p.stock > 0 && p.stock < 80;
                const isOut = p.stock === 0;
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #faf8f5", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#faf8f5"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#faf8f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{p.emoji}</div>
                        <div>
                          <div style={{ fontWeight: "700", color: "#1C1C1C" }}>{p.name}</div>
                          <div style={{ fontSize: "11.5px", color: "#9ca3af" }}>{p.desc?.slice(0, 36)}…</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px", color: "#6b7280", fontFamily: "monospace", fontSize: "12px" }}>{p.sku}</td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "600", background: "rgba(31,81,50,0.08)", color: GREEN }}>{p.category}</span>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <div style={{ fontWeight: "700", color: "#1C1C1C" }}>₹{p.price}</div>
                      {p.offerPrice && <div style={{ fontSize: "11px", color: "#10b981" }}>Offer: ₹{p.offerPrice}</div>}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <div style={{ fontWeight: "700", color: isOut ? "#ef4444" : isLow ? "#f59e0b" : "#1C1C1C" }}>{p.stock}</div>
                      {isOut && <div style={{ fontSize: "10px", color: "#ef4444", fontWeight: "600" }}>OUT OF STOCK</div>}
                      {isLow && !isOut && <div style={{ fontSize: "10px", color: "#f59e0b", fontWeight: "600" }}>LOW STOCK</div>}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "600", background: p.status === "active" ? "#ecfdf5" : "#f3f4f6", color: p.status === "active" ? "#10b981" : "#6b7280", textTransform: "capitalize" }}>{p.status}</span>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <motion.button onClick={() => openEdit(p)} style={{ padding: "6px", borderRadius: "8px", border: "1px solid #f0ede8", background: "white", cursor: "pointer", color: "#6b7280", lineHeight: 1 }}
                          whileHover={{ background: "#eff6ff", color: "#3b82f6", borderColor: "#3b82f6" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</span>
                        </motion.button>
                        <motion.button onClick={() => openDelete(p.id)} style={{ padding: "6px", borderRadius: "8px", border: "1px solid #f0ede8", background: "white", cursor: "pointer", color: "#6b7280", lineHeight: 1 }}
                          whileHover={{ background: "#fef2f2", color: "#ef4444", borderColor: "#ef4444" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "14px 16px", borderTop: "1px solid #f0ede8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Showing {(page - 1) * PER + 1}–{Math.min(page * PER, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <motion.button key={i} onClick={() => setPage(i + 1)}
                  style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #f0ede8", background: page === i + 1 ? GREEN : "white", color: page === i + 1 ? "white" : "#374151", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}
                  whileHover={{ borderColor: GREEN }}>
                  {i + 1}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {(modal === "add" || modal === "edit") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0ede8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "17px", margin: 0 }}>{modal === "add" ? "Add New Product" : "Edit Product"}</h3>
                <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "4px", borderRadius: "8px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>close</span>
                </button>
              </div>
              <div style={{ overflowY: "auto", padding: "20px 24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  {[["name", "Product Name", "text"], ["sku", "SKU Code", "text"], ["price", "Price (₹)", "number"], ["offerPrice", "Offer Price (₹)", "number"], ["stock", "Stock Quantity", "number"]].map(([field, label, type]) => (
                    <div key={field}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>{label}</label>
                      <input type={type} value={form[field] || ""} onChange={e => setForm({ ...form, [field]: e.target.value })} placeholder={label}
                        style={inp} onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Weight</label>
                      <input type="number" value={form.weightValue || ""} onChange={e => setForm({ ...form, weightValue: e.target.value })} placeholder="e.g. 5" style={inp} onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                    </div>
                    <div style={{ width: "80px" }}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Unit</label>
                      <select value={form.weightUnit || "kg"} onChange={e => setForm({ ...form, weightUnit: e.target.value })} style={inp}>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="L">L</option>
                        <option value="ml">ml</option>
                        <option value="pcs">pcs</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Product Image</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      {form.imgSrc && (
                        <img src={form.imgSrc} alt="Preview" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <input type="text" value={form.imgSrc || ""} onChange={e => setForm({ ...form, imgSrc: e.target.value })} placeholder="Image URL..." style={{ ...inp, marginBottom: "8px" }} />
                        <div style={{ position: "relative", overflow: "hidden", display: "inline-block" }}>
                          <button style={{ padding: "6px 12px", borderRadius: "6px", background: "#f3f4f6", border: "1px solid #e5e7eb", fontSize: "12px", fontWeight: "600", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>upload</span>
                            {uploading ? "Uploading..." : "Upload from Computer"}
                          </button>
                          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ position: "absolute", top: 0, left: 0, opacity: 0, cursor: "pointer", height: "100%", width: "100%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...inp }}>
                      {CATS.slice(1).map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Description</label>
                    <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={3} style={{ ...inp, resize: "none" }} placeholder="Product description…" />
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Tags (comma-separated)</label>
                    <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="e.g. premium, bestseller" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inp}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "1/-1", display: "flex", gap: "16px", marginTop: "8px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "#374151", cursor: "pointer" }}>
                      <input type="checkbox" checked={form.bestseller || false} onChange={e => setForm({ ...form, bestseller: e.target.checked })} style={{ width: "16px", height: "16px", accentColor: GREEN }} />
                      Mark as Bestseller
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "#374151", cursor: "pointer" }}>
                      <input type="checkbox" checked={form.featured || false} onChange={e => setForm({ ...form, featured: e.target.checked })} style={{ width: "16px", height: "16px", accentColor: GREEN }} />
                      Show on Home Page (Featured)
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ padding: "16px 24px", borderTop: "1px solid #f0ede8", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button onClick={() => setModal(null)} style={{ padding: "9px 20px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer", color: "#374151" }}>Cancel</button>
                <motion.button onClick={handleSave} style={{ padding: "9px 24px", borderRadius: "10px", background: GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                  whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>
                  {modal === "add" ? "Add Product" : "Save Changes"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ── */}
      <AnimatePresence>
        {modal === "delete" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              style={{ background: "white", borderRadius: "20px", padding: "28px", maxWidth: "360px", width: "100%", textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#ef4444" }}>delete_forever</span>
              </div>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "18px", marginBottom: "8px" }}>Delete Product?</h3>
              <p style={{ color: "#6b7280", fontSize: "13.5px", marginBottom: "22px", lineHeight: "1.5" }}>This action cannot be undone. The product will be permanently removed.</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setModal(null)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                <motion.button onClick={handleDelete} style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "#ef4444", color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                  whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.97 }}>Delete</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
