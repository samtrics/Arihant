import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";

const DEMO_EMAIL = "admin@arihant.in";
const DEMO_PASSWORD = "Admin@1234";

export default function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (attempts >= 5) { setError("Account locked. Contact super admin."); return; }
    if (!email.trim()) { setError("Email is required."); return; }
    if (!password) { setError("Password is required."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address."); return; }

    setIsLoading(true);

    let ip = "Unknown IP";
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const json = await res.json();
      ip = json.ip;
    } catch(e) {}

    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (err) throw err;

      // Verify admin status
      const { data: adminData, error: adminErr } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (adminErr || !adminData) {
        await supabase.auth.signOut();
        throw new Error("Access Denied: You do not have admin privileges.");
      }

      // Log Real Success Activity
      const logEntry = {
        id: Date.now(),
        user: adminData.name || data.user.user_metadata?.full_name || "Admin",
        email: email.trim(),
        ip,
        time: new Date().toLocaleString(),
        status: "Success"
      };
      const existingLogs = JSON.parse(localStorage.getItem("arihant_admin_logs") || "[]");
      localStorage.setItem("arihant_admin_logs", JSON.stringify([logEntry, ...existingLogs]));

      setSuccess(true);
      setTimeout(() => onLogin({ name: data.user.user_metadata?.full_name || adminData.name || "Admin", email: data.user.email, role: adminData.role || "super_admin", avatar: data.user.email.charAt(0).toUpperCase() }), 900);
    } catch (err) {
      const na = attempts + 1;
      setAttempts(na);

      // Log Real Failure Activity
      const logEntry = {
        id: Date.now(),
        user: "Unknown",
        email: email.trim(),
        ip,
        time: new Date().toLocaleString(),
        status: `Failed (${err.message.substring(0, 25)}...)`
      };
      const existingLogs = JSON.parse(localStorage.getItem("arihant_admin_logs") || "[]");
      localStorage.setItem("arihant_admin_logs", JSON.stringify([logEntry, ...existingLogs]));

      if (na >= 5) setError("🔒 Account locked after 5 failed attempts.");
      else setError(`Login failed. ${5 - na} attempt${5 - na === 1 ? "" : "s"} remaining. (${err.message})`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) { setError("Enter a valid email."); return; }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setForgotSent(true);
    setError("");
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
        {/* Grain */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 0.5px,transparent 0.5px)", backgroundSize: "10px 10px", opacity: 0.05, pointerEvents: "none" }} />

        {/* Glow circles */}
        {[{ s: 520, t: -170, r: -170, o: 0.08 }, { s: 320, b: -100, l: -80, o: 0.1 }, { s: 180, t: "38%", r: "12%", o: 0.06 }].map((c, i) => (
          <motion.div key={i} style={{ position: "absolute", width: c.s, height: c.s, borderRadius: "50%", background: "radial-gradient(circle,#D4A64A,transparent)", top: c.t, bottom: c.b, left: c.l, right: c.r, opacity: c.o }}
            animate={{ scale: [1, 1.06, 1], rotate: [0, 6, -4, 0] }} transition={{ duration: 7 + i * 2, repeat: Infinity, ease: "easeInOut" }} />
        ))}

        <div>
          {/* Back link */}
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "7px", color: "rgba(255,255,255,0.55)", fontSize: "13px", background: "none", border: "none", cursor: "pointer", marginBottom: "44px", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.9)"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>
            <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>arrow_back</span>
            Back to main site
          </button>

          {/* Logo block */}
          <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px 4px 6px", background: "rgba(212,166,74,0.14)", border: "1px solid rgba(212,166,74,0.3)", borderRadius: "12px", marginBottom: "28px" }}>
            <div style={{ width: "110px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <img src="/logo.png" alt="Arihant" style={{ height: "100px", objectFit: "contain" }} />
            </div>
            <span style={{ fontSize: "10px", color: "#D4A64A", background: "rgba(212,166,74,0.18)", padding: "2px 8px", borderRadius: "100px", fontWeight: "700", letterSpacing: "1px", marginLeft: "4px" }}>ADMIN</span>
          </div>

          <h1 style={{ color: "white", fontWeight: "700", fontSize: "clamp(26px,2.8vw,38px)", lineHeight: "1.2", marginBottom: "16px", fontFamily: "'Poppins',sans-serif" }}>
            Manage Your<br />
            <span style={{ background: "linear-gradient(90deg,#D4A64A,#f0c060)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FMCG Empire</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "14.5px", lineHeight: "1.65", maxWidth: "360px", marginBottom: "40px" }}>
            Secure admin portal for managing products, orders, distributors, and real-time business analytics.
          </p>

          {/* Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[["analytics", "Real-time sales & revenue analytics"], ["inventory_2", "Full inventory & stock control"], ["group", "Customer & distributor management"], ["security", "Enterprise security & role access"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(212,166,74,0.14)", border: "1px solid rgba(212,166,74,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: "#D4A64A", fontSize: "18px" }}>{icon}</span>
                </div>
                <span style={{ color: "rgba(255,255,255,0.78)", fontSize: "13.5px" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>© 2024 Arihant FMCG</span>
          <div style={{ display: "flex", gap: "16px" }}>
            {["Privacy", "Terms", "Support"].map((l) => (
              <span key={l} style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>{l}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT FORM PANEL ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px", overflowY: "auto" }}>
        <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} style={{ width: "100%", maxWidth: "440px" }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "32px" }}>
            <div style={{ width: "110px", height: "44px", display: "flex", alignItems: "center", justifyContent: "flex-start", overflow: "hidden", marginLeft: "-10px" }}>
              <img src="/logo.png" alt="Arihant" style={{ height: "100px", objectFit: "contain", transform: "scale(1.1)" }} />
            </div>
            <span style={{ fontWeight: "700", fontSize: "17px", color: "#1F5132", fontFamily: "'Poppins',sans-serif" }}>ADMIN</span>
          </div>

          <AnimatePresence mode="wait">
            {/* ── SUCCESS STATE ── */}
            {success ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "48px 24px" }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
                  style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg,#1F5132,#2d6b45)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <span className="material-symbols-outlined" style={{ color: "white", fontSize: "42px" }}>check_circle</span>
                </motion.div>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "24px", color: "#1F5132", marginBottom: "10px" }}>Login Successful!</h3>
                <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>Redirecting to your dashboard…</p>
                <div style={{ width: "32px", height: "32px", border: "3px solid #1F5132", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
              </motion.div>

            ) : mode === "forgot" ? (
              /* ── FORGOT PASSWORD ── */
              <motion.div key="forgot" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                <button onClick={() => { setMode("login"); setError(""); setForgotSent(false); setForgotEmail(""); }}
                  style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "13px", background: "none", border: "none", cursor: "pointer", marginBottom: "28px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span> Back to login
                </button>
                <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "28px", color: "#1C1C1C", marginBottom: "8px" }}>Reset Password</h2>
                <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>Enter your admin email to receive a password reset link.</p>
                {forgotSent ? (
                  <div style={{ padding: "24px", background: "rgba(31,81,50,0.07)", border: "1px solid rgba(31,81,50,0.2)", borderRadius: "16px", textAlign: "center" }}>
                    <span className="material-symbols-outlined" style={{ color: "#1F5132", fontSize: "44px", display: "block", marginBottom: "12px" }}>mark_email_read</span>
                    <p style={{ color: "#1F5132", fontWeight: "700", fontSize: "15px" }}>Reset link sent!</p>
                    <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "6px" }}>Check your inbox at {forgotEmail}</p>
                  </div>
                ) : (
                  <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Admin Email</label>
                      <div style={{ position: "relative" }}>
                        <span className="material-symbols-outlined" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "19px" }}>mail</span>
                        <input type="email" value={forgotEmail} onChange={e => { setForgotEmail(e.target.value); setError(""); }} placeholder="admin@arihant.in" style={inp}
                          onFocus={e => e.target.style.borderColor = "#1F5132"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                      </div>
                    </div>
                    {error && <p style={{ fontSize: "13px", color: "#dc2626", padding: "10px 14px", background: "#fef2f2", borderRadius: "10px" }}>{error}</p>}
                    <motion.button type="submit" disabled={isLoading}
                      style={{ padding: "13px", borderRadius: "12px", background: "linear-gradient(135deg,#1F5132,#2d6b45)", color: "white", border: "none", fontWeight: "700", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                      {isLoading ? <><span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.5)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Sending…</> : "Send Reset Link"}
                    </motion.button>
                  </form>
                )}
              </motion.div>

            ) : (
              /* ── LOGIN FORM ── */
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ marginBottom: "28px" }}>
                  <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: "700", fontSize: "30px", color: "#1C1C1C", marginBottom: "8px", lineHeight: "1.2" }}>Welcome back, Admin 👋</h2>
                  <p style={{ color: "#6b7280", fontSize: "14.5px" }}>Sign in to access the Arihant Admin Portal.</p>
                </div>

                {/* Hint */}
                <div style={{ padding: "12px 14px", background: "rgba(212,166,74,0.1)", border: "1px solid rgba(212,166,74,0.3)", borderRadius: "12px", marginBottom: "22px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span className="material-symbols-outlined" style={{ color: "#D4A64A", fontSize: "17px", flexShrink: 0, marginTop: "2px" }}>info</span>
                  <div style={{ fontSize: "12px", color: "#785600", lineHeight: "1.55" }}>
                    Sign in with your Supabase registered administrator email.
                  </div>
                </div>

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {/* Email */}
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Admin Email</label>
                    <div style={{ position: "relative" }}>
                      <span className="material-symbols-outlined" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "19px" }}>mail</span>
                      <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="admin@arihant.in" style={inp}
                        onFocus={e => e.target.style.borderColor = "#1F5132"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                    </div>
                  </div>

                  {/* Password */}
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

                  {/* Remember + Forgot */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ width: "15px", height: "15px", accentColor: "#1F5132" }} />
                      <span style={{ fontSize: "13px", color: "#374151" }}>Remember me</span>
                    </label>
                    <button type="button" onClick={() => { setMode("forgot"); setError(""); }}
                      style={{ fontSize: "13px", color: "#1F5132", background: "none", border: "none", cursor: "pointer", fontWeight: "600" }}>
                      Forgot password?
                    </button>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ padding: "11px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", color: "#dc2626", fontSize: "13px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>error</span>
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button type="submit" disabled={isLoading || attempts >= 5}
                    style={{ padding: "14px", borderRadius: "12px", background: attempts >= 5 ? "#9ca3af" : "linear-gradient(135deg,#1F5132,#2d6b45)", color: "white", border: "none", fontWeight: "700", fontSize: "14.5px", cursor: attempts >= 5 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "9px", marginTop: "4px" }}
                    whileHover={attempts < 5 ? { scale: 1.015, boxShadow: "0 8px 28px rgba(31,81,50,0.38)" } : {}}
                    whileTap={attempts < 5 ? { scale: 0.975 } : {}}>
                    {isLoading
                      ? <><span style={{ width: "17px", height: "17px", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block", flexShrink: 0 }} /> Authenticating…</>
                      : <><span className="material-symbols-outlined" style={{ fontSize: "17px" }}>lock_open</span> Secure Login</>}
                  </motion.button>

                  {/* Divider */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
                    <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "500" }}>OR</span>
                    <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
                  </div>

                  {/* Google */}
                  <motion.button type="button"
                    style={{ padding: "13px", borderRadius: "12px", background: "white", border: "1.5px solid #e5e7eb", fontWeight: "600", fontSize: "13.5px", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                    whileHover={{ scale: 1.01, borderColor: "#d1d5db", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }} whileTap={{ scale: 0.98 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </motion.button>
                </form>

                <p style={{ textAlign: "center", fontSize: "11.5px", color: "#9ca3af", marginTop: "22px" }}>
                  🔒 Protected by Arihant Enterprise Auth. Admin access only.
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
