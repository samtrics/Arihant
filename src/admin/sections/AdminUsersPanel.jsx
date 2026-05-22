import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


const GREEN = "#1F5132";
const card = { background: "white", borderRadius: "16px", border: "1px solid #f0ede8", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" };
const inp = { width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "13px", outline: "none", background: "white", boxSizing: "border-box", color: "#1C1C1C" };

const ROLES = ["super_admin", "product_manager", "inventory_manager", "distributor_manager"];
const ROLE_LABELS = { super_admin: "Super Admin", product_manager: "Product Manager", inventory_manager: "Inventory Manager", distributor_manager: "Distributor Manager" };
const ROLE_COLORS = { super_admin: { bg: "rgba(31,81,50,0.1)", color: "#1F5132" }, product_manager: { bg: "#eff6ff", color: "#3b82f6" }, inventory_manager: { bg: "#fffbeb", color: "#f59e0b" }, distributor_manager: { bg: "#f5f3ff", color: "#8b5cf6" } };
const ROLE_PERMS = { super_admin: "Full system access — all modules", product_manager: "Products, Categories, Inventory", inventory_manager: "Inventory tracking, Stock updates", distributor_manager: "Distributors, Orders (view only)" };

const emptyForm = { name: "", email: "", role: "product_manager" };

export default function AdminUsersPanel() {
  const [admins, setAdmins] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    const na = { ...form, id: `ADM${String(admins.length + 1).padStart(3, "0")}`, roleLabel: ROLE_LABELS[form.role], permissions: ROLE_PERMS[form.role], lastLogin: "Never", status: "active", avatar: form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() };
    setAdmins([...admins, na]);
    setModal(false);
    setForm(emptyForm);
  };

  const toggleStatus = (id) => setAdmins(as => as.map(a => a.id === id && a.role !== "super_admin" ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "20px", color: "#1C1C1C", margin: 0 }}>Admin Users</h2>
          <p style={{ color: "#9ca3af", fontSize: "12.5px", margin: "3px 0 0" }}>{admins.filter(a => a.status === "active").length} active admins</p>
        </div>
        <motion.button onClick={() => setModal(true)} style={{ padding: "9px 18px", borderRadius: "10px", background: GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>
          <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>person_add</span>
          Add Admin
        </motion.button>
      </div>

      {/* Roles info */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
        {ROLES.map((role) => {
          const { bg, color } = ROLE_COLORS[role];
          return (
            <div key={role} style={{ ...card, padding: "14px 16px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color }}>admin_panel_settings</span>
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "13px", color: "#1C1C1C" }}>{ROLE_LABELS[role]}</div>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px", lineHeight: "1.4" }}>{ROLE_PERMS[role].split(" — ")[0]}</div>
                <div style={{ marginTop: "4px", fontWeight: "700", fontSize: "13px", color }}>{admins.filter(a => a.role === role).length}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin table */}
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#faf8f5", borderBottom: "2px solid #f0ede8" }}>
                {["Admin", "Email", "Role", "Permissions", "Last Login", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 14px", color: "#6b7280", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => {
                const { bg, color } = ROLE_COLORS[a.role] || ROLE_COLORS.product_manager;
                return (
                  <tr key={a.id} style={{ borderBottom: "1px solid #faf8f5", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#faf8f5"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}cc)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "13px", flexShrink: 0 }}>{a.avatar}</div>
                        <div style={{ fontWeight: "700", color: "#1C1C1C" }}>{a.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: "14px", color: "#6b7280", fontSize: "12.5px" }}>{a.email}</td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "700", background: bg, color }}>{a.roleLabel}</span>
                    </td>
                    <td style={{ padding: "14px", fontSize: "12px", color: "#6b7280", maxWidth: "200px" }}>{a.permissions}</td>
                    <td style={{ padding: "14px", fontSize: "12px", color: "#9ca3af" }}>{a.lastLogin}</td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "600", background: a.status === "active" ? "#ecfdf5" : "#f3f4f6", color: a.status === "active" ? "#10b981" : "#6b7280", textTransform: "capitalize" }}>{a.status}</span>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {a.role !== "super_admin" && (
                          <>
                            <motion.button onClick={() => toggleStatus(a.id)}
                              style={{ padding: "5px 10px", borderRadius: "8px", border: "1.5px solid", fontSize: "11px", fontWeight: "700", cursor: "pointer", background: "white", borderColor: a.status === "active" ? "#f59e0b" : "#10b981", color: a.status === "active" ? "#f59e0b" : "#10b981" }}>
                              {a.status === "active" ? "Suspend" : "Restore"}
                            </motion.button>
                            <motion.button onClick={() => setDeleteId(a.id)}
                              style={{ padding: "5px 8px", borderRadius: "8px", border: "1.5px solid #fecaca", background: "#fef2f2", cursor: "pointer", color: "#ef4444", lineHeight: 1 }}
                              whileHover={{ background: "#ef4444", color: "white" }}>
                              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>delete</span>
                            </motion.button>
                          </>
                        )}
                        {a.role === "super_admin" && (
                          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={(e) => { if (e.target === e.currentTarget) setModal(false); }}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
              style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "440px", overflow: "hidden" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid #f0ede8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "16px", margin: 0 }}>Add New Admin</h3>
                <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>close</span>
                </button>
              </div>
              <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {[["Full Name", "name", "text", "Admin full name"], ["Email Address", "email", "email", "admin@arihant.in"]].map(([label, key, type, ph]) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "7px" }}>{label}</label>
                    <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={ph} style={inp}
                      onFocus={e => e.target.style.borderColor = GREEN} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "7px" }}>Role</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inp}>
                    {ROLES.filter(r => r !== "super_admin").map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                </div>
                {/* Role permissions preview */}
                <div style={{ padding: "12px 14px", background: "rgba(31,81,50,0.06)", borderRadius: "10px", fontSize: "12px", color: "#374151" }}>
                  <strong style={{ color: GREEN }}>Permissions: </strong>{ROLE_PERMS[form.role]}
                </div>
              </div>
              <div style={{ padding: "14px 22px", borderTop: "1px solid #f0ede8", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button onClick={() => setModal(false)} style={{ padding: "9px 18px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                <motion.button onClick={handleAdd} style={{ padding: "9px 22px", borderRadius: "10px", background: GREEN, color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                  whileHover={{ opacity: 0.9 }}>Add Admin</motion.button>
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
                <span className="material-symbols-outlined" style={{ fontSize: "26px", color: "#ef4444" }}>person_off</span>
              </div>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "17px", marginBottom: "8px" }}>Remove Admin?</h3>
              <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "20px" }}>This admin will lose access immediately and their account will be permanently removed.</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1.5px solid #e5e7eb", background: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                <motion.button onClick={() => { setAdmins(as => as.filter(a => a.id !== deleteId)); setDeleteId(null); }}
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "#ef4444", color: "white", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>Remove</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
