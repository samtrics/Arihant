import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";

// Demo credentials removed. Now using Supabase DB for authentication.

export default function DistributorLogin({ onNavigate, onLogin }) {
  const [distributorId, setDistributorId] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!distributorId.trim()) { setError("Distributor ID is required."); return; }
    if (!password) { setError("Password is required."); return; }

    setIsLoading(true);

    try {
      const queryId = distributorId.trim();
      const queryPass = password.trim();
      
      // 1. Fetch the distributor's email from their ID
      const { data: distData, error: dbError } = await supabase
        .from('distributors')
        .select('*')
        .eq('distributor_id', queryId)
        .maybeSingle();

      if (dbError || !distData) {
        throw new Error("Invalid Distributor ID.");
      }
      if (distData.status !== 'approved') {
        throw new Error("Your account has not been approved yet.");
      }

      // 2. Verify password directly against the database
      if (distData.password !== queryPass) {
        throw new Error("Invalid login credentials");
      }

      const data = distData;

      setSuccess(true);
      setTimeout(() => {
        if (onLogin) onLogin(data);
        else onNavigate("distributor-dashboard");
      }, 1000);
    } catch (err) {
      setError(`Login failed. (${err.message})`);
    } finally {
      setIsLoading(false);
    }
  };

  const inp = {
    width: "100%", padding: "13px 16px 13px 46px", borderRadius: "12px",
    border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none",
    background: "white", boxSizing: "border-box", transition: "border-color 0.2s",
    color: "#1C1C1C",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter',sans-serif", background: "#F5F1EA" }}>
      {/* ── LEFT BRAND PANEL ── */}
      <motion.div
        initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex"
        style={{ width: "44%", background: "linear-gradient(145deg,#071a0e 0%,#0d2b1a 25%,#1F5132 65%,#2a6040 100%)", position: "relative", overflow: "hidden", flexDirection: "column", justifyContent: "space-between", padding: "48px", flexShrink: 0 }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 0.5px,transparent 0.5px)", backgroundSize: "10px 10px", opacity: 0.05, pointerEvents: "none" }} />
        {[{ s: 520, t: -170, r: -170, o: 0.08 }, { s: 320, b: -100, l: -80, o: 0.1 }, { s: 180, t: "38%", r: "12%", o: 0.06 }].map((c, i) => (
          <motion.div key={i} style={{ position: "absolute", width: c.s, height: c.s, borderRadius: "50%", background: "radial-gradient(circle,#D4A64A,transparent)", top: c.t, bottom: c.b, left: c.l, right: c.r, opacity: c.o }}
            animate={{ scale: [1, 1.06, 1], rotate: [0, 6, -4, 0] }} transition={{ duration: 7 + i * 2, repeat: Infinity, ease: "easeInOut" }} />
        ))}

        <div>
          <button onClick={() => onNavigate("home")} style={{ display: "flex", alignItems: "center", gap: "7px", color: "rgba(255,255,255,0.55)", fontSize: "13px", background: "none", border: "none", cursor: "pointer", marginBottom: "44px", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.9)"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>
            <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>arrow_back</span>
            Back to main site
          </button>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "8px 14px", background: "rgba(212,166,74,0.14)", border: "1px solid rgba(212,166,74,0.3)", borderRadius: "12px", marginBottom: "28px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "linear-gradient(135deg,#D4A64A,#c49030)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "16px", color: "#1C1C1C", fontFamily: "'Poppins',sans-serif" }}>A</div>
            <span style={{ color: "white", fontWeight: "700", fontSize: "17px", fontFamily: "'Poppins',sans-serif" }}>ARIHANT</span>
            <span style={{ fontSize: "10px", color: "#D4A64A", background: "rgba(212,166,74,0.18)", padding: "2px 8px", borderRadius: "100px", fontWeight: "700", letterSpacing: "1px" }}>PARTNER</span>
          </div>

          <h1 style={{ color: "white", fontWeight: "700", fontSize: "clamp(26px,2.8vw,38px)", lineHeight: "1.2", marginBottom: "16px", fontFamily: "'Poppins',sans-serif" }}>
            Distributor<br />
            <span style={{ background: "linear-gradient(90deg,#D4A64A,#f0c060)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Portal Access</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "14.5px", lineHeight: "1.65", maxWidth: "360px", marginBottom: "40px" }}>
            Log in to manage your wholesale orders, track bulk shipments, and access specialized pricing margins.
          </p>
        </div>
      </motion.div>

      {/* ── RIGHT FORM PANEL ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px", overflowY: "auto" }}>
        <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} style={{ width: "100%", maxWidth: "440px" }}>
          
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "48px 24px" }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
                  style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg,#1F5132,#2d6b45)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <span className="material-symbols-outlined" style={{ color: "white", fontSize: "42px" }}>check_circle</span>
                </motion.div>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "24px", color: "#1F5132", marginBottom: "10px" }}>Login Successful!</h3>
                <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>Redirecting to Distributor Portal…</p>
                <div style={{ width: "32px", height: "32px", border: "3px solid #1F5132", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
              </motion.div>
            ) : (
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ marginBottom: "28px" }}>
                  <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "30px", color: "#1C1C1C", marginBottom: "8px", lineHeight: "1.2" }}>Partner Login 🤝</h2>
                  <p style={{ color: "#6b7280", fontSize: "14.5px" }}>Sign in to the B2B Wholesale Portal.</p>
                </div>

                <div style={{ padding: "12px 14px", background: "rgba(212,166,74,0.1)", border: "1px solid rgba(212,166,74,0.3)", borderRadius: "12px", marginBottom: "22px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span className="material-symbols-outlined" style={{ color: "#D4A64A", fontSize: "17px", flexShrink: 0, marginTop: "2px" }}>info</span>
                  <div style={{ fontSize: "12px", color: "#785600", lineHeight: "1.55" }}>
                    Sign in with your Distributor ID (e.g., DIS-001) and password.
                  </div>
                </div>

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Distributor ID</label>
                    <div style={{ position: "relative" }}>
                      <span className="material-symbols-outlined" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "19px" }}>badge</span>
                      <input type="text" value={distributorId} onChange={e => { setDistributorId(e.target.value); setError(""); }} placeholder="DIS-001" style={inp}
                        onFocus={e => e.target.style.borderColor = "#1F5132"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Password</label>
                    <div style={{ position: "relative" }}>
                      <span className="material-symbols-outlined" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "19px" }}>lock</span>
                      <input type={showPwd ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="••••••••"
                        style={{ ...inp, paddingRight: "46px" }}
                        onFocus={e => e.target.style.borderColor = "#1F5132"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                      <button type="button" onClick={() => setShowPwd(!showPwd)}
                        style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, lineHeight: 1 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "19px" }}>{showPwd ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ padding: "11px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", color: "#dc2626", fontSize: "13px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>error</span>
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button type="submit" disabled={isLoading}
                    style={{ padding: "14px", borderRadius: "12px", background: "linear-gradient(135deg,#1F5132,#2d6b45)", color: "white", border: "none", fontWeight: "700", fontSize: "14.5px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "9px", marginTop: "4px" }}
                    whileHover={{ scale: 1.015, boxShadow: "0 8px 28px rgba(31,81,50,0.38)" }}
                    whileTap={{ scale: 0.975 }}>
                    {isLoading
                      ? <><span style={{ width: "17px", height: "17px", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block", flexShrink: 0 }} /> Authenticating…</>
                      : <><span className="material-symbols-outlined" style={{ fontSize: "17px" }}>login</span> Login to Portal</>}
                  </motion.button>
                </form>

                <p style={{ textAlign: "center", fontSize: "11.5px", color: "#9ca3af", marginTop: "22px" }}>
                  Not a distributor yet? <button onClick={() => onNavigate("distributors")} style={{ color: "#1F5132", fontWeight: "600", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>Apply here</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
