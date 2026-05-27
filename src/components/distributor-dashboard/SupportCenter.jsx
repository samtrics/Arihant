import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabaseClient";

const faqs = [
  { q: "How do I request a return for damaged goods?", a: "Please raise a ticket below with photographic evidence within 48 hours of delivery. Our QA team will arrange a reverse pickup and issue a credit note." },
  { q: "What is the standard delivery SLA?", a: "Metro cities: 24-48 hours. Tier 2 cities: 3-5 business days. Rural hubs: Up to 7 days depending on the dispatch schedule." },
  { q: "How can I increase my credit limit?", a: "Credit limits are automatically reviewed every quarter based on your payment history and order volume. For an immediate increase, please contact your Account Manager." }
];

export default function SupportCenter({ distributorUser }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [ticketSubmitting, setTicketSubmitting] = useState(false);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!distributorUser) {
      alert("Error: You must be logged in to submit a ticket.");
      return;
    }
    
    setTicketSubmitting(true);
    const form = e.target;
    const payload = {
      distributor_email: distributorUser.email || distributorUser.business,
      category: form.category.value,
      order_ref: form.orderRef.value || null,
      description: form.description.value,
      status: 'open'
    };

    const { error } = await supabase.from('support_tickets').insert([payload]);
    
    if (error) {
      console.error(error);
      alert("Failed to submit ticket. Please make sure the 'support_tickets' table exists in your database.");
    } else {
      alert("Ticket submitted successfully! A support agent will contact you within 2-4 hours.");
      form.reset();
    }
    setTicketSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: "24px", fontWeight: "700", color: "#111827" }}>Partner Support Center</h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>We're here to help you scale your business.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "24px" }}>
        
        {/* Left Column: Create Ticket & FAQs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "32px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ color: "#1F5132" }}>support_agent</span>
              Raise a Support Ticket
            </h3>
            
            <form onSubmit={handleSubmitTicket} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "6px" }}>Issue Category</label>
                  <select name="category" required style={{ width: "100%", padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", outline: "none", background: "#f9fafb" }}>
                    <option value="">Select Category</option>
                    <option value="delivery">Delivery Delay / Tracking</option>
                    <option value="damage">Damaged Goods / Returns</option>
                    <option value="billing">Billing & Invoicing</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "6px" }}>Related Order ID (Optional)</label>
                  <input name="orderRef" type="text" placeholder="e.g. B2B-109283" style={{ width: "100%", padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", outline: "none" }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4b5563", marginBottom: "6px" }}>Issue Description</label>
                <textarea name="description" required rows="4" placeholder="Please describe your issue in detail..." style={{ width: "100%", padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", outline: "none", resize: "none" }}></textarea>
              </div>

              <button type="submit" disabled={ticketSubmitting} style={{ background: "#1F5132", color: "white", padding: "14px", borderRadius: "8px", border: "none", fontSize: "15px", fontWeight: "700", cursor: ticketSubmitting ? "not-allowed" : "pointer", opacity: ticketSubmitting ? 0.7 : 1 }}>
                {ticketSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </form>
          </div>

          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "32px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ color: "#D4A64A" }}>lightbulb</span>
              Frequently Asked Questions
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    style={{ width: "100%", padding: "16px", background: "#f9fafb", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}
                  >
                    {faq.q}
                    <span className="material-symbols-outlined" style={{ transition: "transform 0.2s", transform: openFaq === idx ? "rotate(180deg)" : "rotate(0)" }}>expand_more</span>
                  </button>
                  {openFaq === idx && (
                    <div style={{ padding: "16px", background: "white", fontSize: "14px", color: "#6b7280", lineHeight: "1.6", borderTop: "1px solid #e5e7eb" }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Account Manager */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ background: "linear-gradient(135deg, #1F5132, #143521)", borderRadius: "16px", padding: "32px", color: "white", boxShadow: "0 10px 25px -5px rgba(31,81,50,0.3)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "24px" }}>Dedicated Account Manager</h3>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#D4A64A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "700", color: "white", border: "4px solid rgba(255,255,255,0.2)" }}>
                RP
              </div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "2px" }}>Rahul Patel</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>Senior Partner Success Manager</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              <a href="mailto:rahul.p@arihantb2b.com" style={{ display: "flex", alignItems: "center", gap: "12px", color: "white", textDecoration: "none", fontSize: "14px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>mail</span>
                </div>
                rahul.p@arihantb2b.com
              </a>
              <a href="tel:+919876543210" style={{ display: "flex", alignItems: "center", gap: "12px", color: "white", textDecoration: "none", fontSize: "14px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>call</span>
                </div>
                +91 98765 43210
              </a>
            </div>

            <button style={{ width: "100%", background: "#25D366", color: "white", padding: "14px", borderRadius: "8px", border: "none", fontSize: "15px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>chat</span>
              Message on WhatsApp
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
