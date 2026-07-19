import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";

const GREEN = "#1F5132";
const GOLD = "#D4A64A";
const card = { background: "white", borderRadius: "16px", border: "1px solid #f0ede8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" };

export default function CategoriesManager({ categories, setCategories }) {
  const [modal, setModal] = useState(null); // null | "add" | "edit" | "delete"
  const [activeCategory, setActiveCategory] = useState(null); // original name for edit/delete
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const openAdd = () => {
    setName("");
    setModal("add");
  };

  const openEdit = (cat) => {
    setActiveCategory(cat);
    setName(cat);
    setModal("edit");
  };

  const openDelete = (cat) => {
    setActiveCategory(cat);
    setModal("delete");
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      if (modal === "add") {
        const { error } = await supabase.from('product_categories').insert([{ name: name.trim() }]);
        if (error) {
          alert("Error adding category: " + error.message);
          return;
        }
        if (setCategories && !categories.includes(name.trim())) {
          setCategories(prev => [...prev, name.trim()]);
        }
      } else if (modal === "edit") {
        const { error } = await supabase.from('product_categories').update({ name: name.trim() }).eq('name', activeCategory);
        if (error) {
          alert("Error updating category: " + error.message);
          return;
        }
        if (setCategories) {
          setCategories(prev => prev.map(c => c === activeCategory ? name.trim() : c));
        }
      }
      setModal(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('product_categories').delete().eq('name', activeCategory);
      if (error) {
        alert("Error deleting category: " + error.message);
        return;
      }
      if (setCategories) {
        setCategories(prev => prev.filter(c => c !== activeCategory));
      }
      setModal(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "#1C1C1C", margin: 0 }}>Categories Manager</h2>
          <p style={{ color: "#9ca3af", fontSize: "12.5px", margin: "3px 0 0" }}>Manage dynamic product categories</p>
        </div>
        <motion.button onClick={openAdd} style={{ padding: "9px 18px", borderRadius: "10px", background: GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>
          <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>add</span>
          Add Category
        </motion.button>
      </div>

      <div style={{ ...card, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#faf8f5", borderBottom: "2px solid #f0ede8" }}>
              <th style={{ textAlign: "left", padding: "12px 14px", color: "#6b7280", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Category Name</th>
              <th style={{ textAlign: "right", padding: "12px 14px", color: "#6b7280", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #faf8f5", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#faf8f5"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                <td style={{ padding: "14px", fontWeight: "600", color: "#1C1C1C" }}>{cat}</td>
                <td style={{ padding: "14px", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
                    <motion.button onClick={() => openEdit(cat)} style={{ padding: "6px", borderRadius: "8px", border: "1px solid #f0ede8", background: "white", cursor: "pointer", color: "#6b7280", lineHeight: 1 }}
                      whileHover={{ background: "#eff6ff", color: "#3b82f6", borderColor: "#3b82f6" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</span>
                    </motion.button>
                    <motion.button onClick={() => openDelete(cat)} style={{ padding: "6px", borderRadius: "8px", border: "1px solid #f0ede8", background: "white", cursor: "pointer", color: "#6b7280", lineHeight: 1 }}
                      whileHover={{ background: "#fef2f2", color: "#ef4444", borderColor: "#ef4444" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
                    </motion.button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={2} style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>No categories found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {(modal === "add" || modal === "edit") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "400px", padding: "24px" }}>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "17px", margin: "0 0 16px 0" }}>
                {modal === "add" ? "Add Category" : "Edit Category"}
              </h3>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Category Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Snacks"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = "#e5e7eb"} autoFocus />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button onClick={() => setModal(null)} style={{ padding: "9px 20px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer", color: "#374151" }} disabled={isSaving}>Cancel</button>
                <motion.button onClick={handleSave} style={{ padding: "9px 24px", borderRadius: "10px", background: GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: isSaving ? "not-allowed" : "pointer", opacity: isSaving ? 0.7 : 1 }}
                  whileHover={!isSaving ? { opacity: 0.9 } : {}} whileTap={!isSaving ? { scale: 0.97 } : {}} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal === "delete" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              style={{ background: "white", borderRadius: "20px", padding: "28px", maxWidth: "360px", width: "100%", textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#ef4444" }}>delete_forever</span>
              </div>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "18px", marginBottom: "8px" }}>Delete Category?</h3>
              <p style={{ color: "#6b7280", fontSize: "13.5px", marginBottom: "22px", lineHeight: "1.5" }}>
                Are you sure you want to delete the category <strong>{activeCategory}</strong>? This might affect products using this category.
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setModal(null)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer" }} disabled={isSaving}>Cancel</button>
                <motion.button onClick={handleDelete} style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "#ef4444", color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: isSaving ? "not-allowed" : "pointer", opacity: isSaving ? 0.7 : 1 }}
                  whileHover={!isSaving ? { opacity: 0.88 } : {}} whileTap={!isSaving ? { scale: 0.97 } : {}} disabled={isSaving}>
                  {isSaving ? "Deleting..." : "Delete"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
