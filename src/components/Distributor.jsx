import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";

/* ─── Animation Helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

function ScrollReveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated Counter ─── */
function Counter({ target, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Data ─── */
const whyCards = [
  { icon: "verified", title: "Premium Quality Products", desc: "ISI-certified, stone-ground, 100% natural staples with no additives or bleaching agents." },
  { icon: "trending_up", title: "Attractive Margins", desc: "Industry-leading margins with structured pricing tiers for wholesalers and retailers." },
  { icon: "local_shipping", title: "Fast & Reliable Delivery", desc: "Pan-India logistics with 24–48 hour dispatch timelines for approved distributors." },
  { icon: "workspace_premium", title: "Trusted Brand", desc: "Heritage brand since 1984 with loyal consumer recall across Rajasthan, Gujarat & MP." },
  { icon: "support_agent", title: "Dedicated Distributor Support", desc: "Your own relationship manager, onboarding kit, and real-time order tracking portal." },
  { icon: "bar_chart", title: "Growing Market Demand", desc: "Packaged staples segment growing at 18% CAGR — a proven high-velocity category." },
];

const benefits = [
  { icon: "price_check", label: "Wholesale Pricing", desc: "Tiered pricing across 3 volume brackets giving you maximum cost advantage on every order." },
  { icon: "inventory_2", label: "Bulk Order Support", desc: "Single-window ordering portal for bulk requisitions with real-time stock confirmations." },
  { icon: "campaign", label: "Marketing Assistance", desc: "Arihant branding kits, in-store POP materials, and co-branded digital campaign support." },
  { icon: "warehouse", label: "Reliable Stock Supply", desc: "Consistent production throughput with forward stock planning for peak seasons." },
  { icon: "rocket_launch", label: "Business Growth", desc: "Exclusive territory rights and access to new product launches before open market rollouts." },
  { icon: "headset_mic", label: "Dedicated Support", desc: "24×7 distributor helpline plus regional rep visits to address queries at ground level." },
];

const stats = [
  { value: 500, suffix: "+", label: "Active Distributors" },
  { value: 18, suffix: "%", label: "Annual Growth" },
  { value: 28, suffix: "+", label: "States Covered" },
  { value: 1984, suffix: "", label: "Est. Year" },
];

const products = [
  { name: "Sharbati Atta", category: "Whole Wheat Flour", emoji: "🌾", color: "from-amber-50 to-amber-100", accent: "#D4A64A", tag: "BESTSELLER" },
  { name: "Chana Besan", category: "Gram Flour", emoji: "🟡", color: "from-yellow-50 to-yellow-100", accent: "#D4A64A", tag: "HIGH DEMAND" },
  { name: "Roasted Daliya", category: "Broken Wheat", emoji: "🌿", color: "from-green-50 to-emerald-100", accent: "#1F5132", tag: "HEALTH PICK" },
  { name: "Fine Suji", category: "Semolina", emoji: "⚡", color: "from-orange-50 to-orange-100", accent: "#D4A64A", tag: "FAST MOVING" },
  { name: "Premium Maida", category: "Refined Flour", emoji: "❄️", color: "from-slate-50 to-slate-100", accent: "#1F5132", tag: "PREMIUM" },
];

const processSteps = [
  { num: 1, title: "Submit Application", desc: "Fill the online form with your business details and GST information." },
  { num: 2, title: "Team Review", desc: "Our regional team reviews your application within 48 business hours." },
  { num: 3, title: "Verification", desc: "Field verification of your business premises and trade references." },
  { num: 4, title: "Approval", desc: "Receive your distributor code, pricing sheet, and onboarding kit." },
  { num: 5, title: "Start Distribution", desc: "Place your first order, receive stock, and start selling Arihant!" },
];


const faqs = [
  { q: "How do I become an Arihant distributor?", a: "Simply fill out our online application form below with your business details, GST number, and preferred territory. Our regional team will contact you within 48 hours to begin the verification process." },
  { q: "What is the minimum order quantity (MOQ)?", a: "The minimum order quantity for new distributors is 2 metric tonnes per SKU per order, or a mixed assortment of ₹1.5 lakh value. Volume discounts apply from 5 MT onwards." },
  { q: "Which cities and states are currently supported?", a: "We currently have active distribution networks in Rajasthan, Gujarat, Madhya Pradesh, Maharashtra, and UP. We are actively onboarding partners in all other states — apply now to secure your territory." },
  { q: "How long does the approval process take?", a: "From form submission to receiving your distributor code typically takes 7–10 working days, subject to field verification and document submission turnaround from your side." },
  { q: "Is GST registration mandatory to apply?", a: "Yes, a valid GSTIN is required for all business distributor applications. Retailers with a turnover below the GST threshold may apply under a special retail partnership programme — contact us to know more." },
];

/* ─── Business Type Options ─── */
const bizTypes = [
  "Wholesaler / Stockist",
  "Retail Chain",
  "General Trade Distributor",
  "Kirana / Grocery Store",
  "Modern Trade Partner",
  "E-Commerce Seller",
];

const indianStates = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const defaultTestimonials = [
  {
    name: "Rajesh Patel",
    city: "Surat, Gujarat",
    initials: "RP",
    color: "#1F5132",
    stars: 5,
    review: "Arihant's support team has been exceptional from day one. The margins are among the best in the packaged flour segment, and stock is always available on time.",
    years: "Partner since 2018",
  },
  {
    name: "Sunita Sharma",
    city: "Jaipur, Rajasthan",
    initials: "SS",
    color: "#D4A64A",
    stars: 5,
    review: "We expanded our coverage to 3 districts within 8 months of joining Arihant. The brand recall is incredible — customers specifically ask for Arihant Atta.",
    years: "Partner since 2021",
  },
  {
    name: "Mohammed Iqbal",
    city: "Bhopal, M.P.",
    initials: "MI",
    color: "#7b5800",
    stars: 5,
    review: "The wholesale pricing and marketing support is unmatched. Our grocery retail revenue grew by 35% in the first year alone. Strongly recommend to every retailer.",
    years: "Partner since 2019",
  },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Distributor({ onNavigate, siteSettings }) {
  const contactPhone = siteSettings?.phone || "1800-456-7890";
  const contactEmail = siteSettings?.email || "distributors@arihant.in";
  const waPhone = contactPhone.replace(/\D/g, ''); 
  const contactLocation = siteSettings?.hq_address ? siteSettings.hq_address.split(',').slice(-3, -1).join(', ') : "Jaipur, Rajasthan";

  const [formData, setFormData] = useState({
    businessName: "", ownerName: "", phone: "", email: "",
    address: "", city: "", state: "", gst: "", bizType: "", yearsInBusiness: "", message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewSubmitStatus, setReviewSubmitStatus] = useState("idle");
  const [reviewData, setReviewData] = useState({
    name: "", city: "", email: "", phone: "", rating: 5, text: "", years: "Partner since 2024"
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .eq('type', 'distributor')
        .order('created_at', { ascending: false })
        .limit(10);
      if (!error && data && data.length > 0) {
        setTestimonials(data.map(r => ({
          name: r.name,
          city: r.location,
          initials: r.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
          color: ['#1F5132', '#D4A64A', '#7b5800'][Math.floor(Math.random() * 3)],
          stars: r.stars || 5,
          review: r.text,
          years: r.years || 'Partner'
        })));
      }
    };
    
    fetchTestimonials();

    const channel = supabase
      .channel('public:reviews')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => {
        fetchTestimonials();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitStatus("submitting");
    
    try {
      const newReview = {
        name: reviewData.name,
        location: reviewData.city,
        email: reviewData.email,
        orderId: reviewData.phone,
        stars: reviewData.rating,
        text: reviewData.text,
        type: 'distributor',
        years: reviewData.years,
        status: 'pending'
      };
      
      const { error } = await supabase.from('reviews').insert([newReview]);
      if (error) throw error;
      
      setReviewSubmitStatus("success");
      
      setTimeout(() => {
        setReviewFormOpen(false);
        setReviewData({ name: "", city: "", email: "", phone: "", rating: 5, text: "", years: "Partner since 2024" });
        setReviewSubmitStatus("idle");
      }, 3000);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Something went wrong while submitting your review. Please try again.");
      setReviewSubmitStatus("idle");
    }
  };

  const validate = () => {
    const e = {};
    if (!formData.businessName.trim()) e.businessName = "Business name is required";
    if (!formData.ownerName.trim()) e.ownerName = "Owner name is required";
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone.trim())) e.phone = "Valid 10-digit mobile number required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) e.email = "Valid email required";
    if (!formData.city.trim()) e.city = "City is required";
    if (!formData.state) e.state = "Please select a state";
    if (!formData.address.trim()) e.address = "Full address is required";
    if (!formData.bizType) e.bizType = "Please select your business type";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, _general: "" }));
    
    try {
      const newId = `DST-${Date.now()}`;
      const { error } = await supabase.from('distributors').insert([{
        id: newId,
        business: formData.businessName,
        owner: formData.ownerName,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        state: formData.state,
        pincode: formData.pincode,
        biz_type: formData.bizType,
        years_experience: formData.yearsInBusiness || "0",
        gst: formData.gst
      }]);
      
      if (error) throw error;
      
      setSubmitted(true);
    } catch (err) {
      setErrors(prev => ({ ...prev, _general: err.message || "Failed to submit application. Please try again." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMsg = () => {
    const msg = encodeURIComponent(`Hi Arihant Team! I'm interested in becoming a distributor.\n\nBusiness: ${formData.businessName || "[Not filled]"}\nOwner: ${formData.ownerName || "[Not filled]"}\nCity: ${formData.city || "[Not filled]"}, ${formData.state || ""}\nPhone: ${formData.phone || "[Not filled]"}`);
    window.open(`https://wa.me/919876543210?text=${msg}`, "_blank");
  };

  /* ─── Input Styles Helper ─── */
  const inputCls = (field) =>
    `w-full px-4 py-3.5 rounded-xl border text-sm text-gray-800 placeholder-gray-400 bg-white/80 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#1F5132]/30 ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 focus:border-[#1F5132]"
    }`;

  return (
    <div className="bg-[#FAF7F0] text-[#1C1C1C] font-['Inter',sans-serif] overflow-x-hidden">

      {/* ══════════════════════════════════════ 1. HERO ══════════════════════════════════════ */}
      <section
        className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a2718 0%, #1F5132 40%, #2d6b45 70%, #1a4528 100%)",
        }}
      >
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(#fff 0.8px, transparent 0.8px)", backgroundSize: "14px 14px" }} />

        {/* Floating wheat motif circles */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #D4A64A 0%, transparent 70%)" }} />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #D4A64A 0%, transparent 70%)" }} />

        {/* Floating product emojis */}
        {["🌾", "🟡", "🌿"].map((e, i) => (
          <motion.div key={i}
            className="absolute text-5xl select-none"
            style={{
              top: `${[18, 55, 75][i]}%`,
              right: `${[8, 14, 5][i]}%`,
              opacity: 0.18,
            }}
            animate={{ y: [0, -18, 0], rotate: [0, 8, -4, 0] }}
            transition={{ duration: 5 + i * 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {e}
          </motion.div>
        ))}

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-16 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left content */}
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
                style={{ background: "rgba(212,166,74,0.15)", color: "#D4A64A", border: "1px solid rgba(212,166,74,0.35)" }}>
                Distributor Partnership Programme
              </span>
            </motion.div>

            <motion.h1
              className="text-[clamp(2.2rem,6vw,3.8rem)] font-bold leading-tight text-white mb-6"
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Become an{" "}
              <span style={{
                background: "linear-gradient(90deg, #D4A64A, #f0c060)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Arihant
              </span>{" "}
              Distributor
            </motion.h1>

            <motion.p
              className="text-lg text-white/75 max-w-xl leading-relaxed mb-10"
              variants={fadeUp} initial="hidden" animate="visible" custom={2}
            >
              Partner with a trusted packaged grocery brand and grow your business with quality products and strong support.
            </motion.p>

            <motion.div className="flex flex-wrap gap-4" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
              <motion.button
                onClick={() => document.getElementById("distributor-form")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all"
                style={{ background: "linear-gradient(135deg, #D4A64A, #c49030)", color: "#1C1C1C" }}
                whileHover={{ scale: 1.04, y: -2, boxShadow: "0 12px 30px rgba(212,166,74,0.4)" }}
                whileTap={{ scale: 0.97 }}
              >
                Apply Now — It's Free
              </motion.button>
              <motion.button
                onClick={() => document.getElementById("dist-contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 rounded-xl font-bold text-sm tracking-wide border text-white transition-all"
                style={{ borderColor: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.08)" }}
                whileHover={{ scale: 1.04, y: -2, background: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.97 }}
              >
                Contact Our Team
              </motion.button>
              <motion.button
                onClick={() => onNavigate("distributor-login")}
                className="px-8 py-4 rounded-xl font-bold text-sm tracking-wide border text-white transition-all flex items-center gap-2"
                style={{ borderColor: "rgba(255,255,255,0.3)", background: "rgba(31, 81, 50, 0.4)" }}
                whileHover={{ scale: 1.04, y: -2, background: "rgba(31, 81, 50, 0.6)" }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                Partner Login
              </motion.button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="flex flex-wrap gap-6 mt-12"
              variants={fadeUp} initial="hidden" animate="visible" custom={4}
            >
              {[["500+", "Distributors"], ["28+", "States"], ["40 Yrs", "Heritage"]].map(([val, lbl]) => (
                <div key={lbl} className="flex flex-col">
                  <span className="font-bold text-2xl" style={{ color: "#D4A64A", fontFamily: "'Poppins',sans-serif" }}>{val}</span>
                  <span className="text-white/60 text-xs tracking-wider uppercase">{lbl}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Premium floating card */}
          <motion.div
            className="hidden lg:flex flex-col items-center"
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
          >
            <motion.div
              className="relative w-full max-w-sm"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="rounded-3xl p-8 shadow-2xl"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "linear-gradient(135deg, #D4A64A, #f0c060)" }}>
                    <span className="material-symbols-outlined text-4xl text-white">storefront</span>
                  </div>
                  <h3 className="text-white font-bold text-xl" style={{ fontFamily: "'Poppins',sans-serif" }}>Partner Benefits</h3>
                  <p className="text-white/60 text-sm mt-1">At a glance</p>
                </div>
                {[
                  ["check_circle", "Exclusive territory rights"],
                  ["check_circle", "Wholesale pricing tiers"],
                  ["check_circle", "Marketing material kit"],
                  ["check_circle", "Dedicated account manager"],
                  ["check_circle", "Priority stock allocation"],
                ].map(([icon, text]) => (
                  <div key={text} className="flex items-center gap-3 py-2.5 border-b border-white/10 last:border-0">
                    <span className="material-symbols-outlined text-[20px]" style={{ color: "#D4A64A" }}>{icon}</span>
                    <span className="text-white/85 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════ 2. WHY PARTNER ══════════════════════════════════════ */}
      <section id="distributor-benefits" className="py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full" style={{ background: "#fff8ed", color: "#D4A64A" }}>
              Why Us
            </span>
            <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight" style={{ fontFamily: "'Poppins',sans-serif", color: "#1F5132" }}>
              Why Partner With Arihant?
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
              Six strong reasons why India's fastest-growing FMCG distributors choose Arihant over the competition.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyCards.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 0.1}>
              <motion.div
                className="rounded-2xl p-8 cursor-default h-full"
                style={{
                  background: "white",
                  border: "1px solid #f0ede8",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
                }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 50px rgba(31,81,50,0.12)",
                  borderColor: "#D4A64A",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "linear-gradient(135deg, #1F5132, #2d6b45)" }}>
                  <span className="material-symbols-outlined text-2xl text-white">{card.icon}</span>
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Poppins',sans-serif", color: "#1C1C1C" }}>
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════ 3. BENEFITS + STATS ══════════════════════════════════════ */}
      <section className="py-24 px-4 md:px-16" style={{ background: "linear-gradient(135deg, #0d2b1a 0%, #1F5132 100%)" }}>
        <div className="max-w-[1280px] mx-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {stats.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-1" style={{ fontFamily: "'Poppins',sans-serif", color: "#D4A64A" }}>
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-white/60 text-sm tracking-wider uppercase">{s.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Two-column benefits layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal>
              <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full"
                style={{ background: "rgba(212,166,74,0.15)", color: "#D4A64A", border: "1px solid rgba(212,166,74,0.3)" }}>
                Distributor Benefits
              </span>
              <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-tight text-white mb-6"
                style={{ fontFamily: "'Poppins',sans-serif" }}>
                Everything You Need to Succeed as an Arihant Partner
              </h2>
              <p className="text-white/65 text-base leading-relaxed mb-8">
                We don't just sell you products — we invest in your business growth. From pricing to marketing to logistics, Arihant's distributor programme is built for long-term partnership.
              </p>
              <motion.button
                onClick={() => document.getElementById("distributor-form")?.scrollIntoView({ behavior: "smooth" })}
                className="px-7 py-3.5 rounded-xl font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #D4A64A, #c49030)", color: "#1C1C1C" }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Start Your Application
              </motion.button>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <ScrollReveal key={b.label} delay={i * 0.08}>
                  <div className="p-5 rounded-2xl h-full"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: "rgba(212,166,74,0.2)" }}>
                      <span className="material-symbols-outlined text-xl" style={{ color: "#D4A64A" }}>{b.icon}</span>
                    </div>
                    <h4 className="font-bold text-sm text-white mb-1" style={{ fontFamily: "'Poppins',sans-serif" }}>{b.label}</h4>
                    <p className="text-white/55 text-xs leading-relaxed">{b.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ 4. PRODUCT SHOWCASE ══════════════════════════════════════ */}
      <section className="py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full" style={{ background: "#fff8ed", color: "#D4A64A" }}>
              Our Products
            </span>
            <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight" style={{ fontFamily: "'Poppins',sans-serif", color: "#1F5132" }}>
              Products You'll Be Distributing
            </h2>
            <p className="mt-4 text-gray-500 max-w-lg mx-auto text-base leading-relaxed">
              Premium, high-velocity staples that fly off shelves — proven consumer favourites across Indian households.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {products.map((product, i) => (
            <ScrollReveal key={product.name} delay={i * 0.1}>
              <motion.div
                className={`rounded-2xl p-6 text-center cursor-default bg-gradient-to-b ${product.color} border border-white`}
                style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.05)" }}
                whileHover={{ y: -10, scale: 1.03, boxShadow: `0 20px 50px rgba(0,0,0,0.12)` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="text-5xl mb-4 flex items-center justify-center h-16">{product.emoji}</div>
                <div className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest mb-3 inline-block"
                  style={{ background: product.accent + "22", color: product.accent }}>
                  {product.tag}
                </div>
                <h4 className="font-bold text-sm leading-tight mb-1" style={{ fontFamily: "'Poppins',sans-serif" }}>{product.name}</h4>
                <p className="text-gray-400 text-xs">{product.category}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════ 5. REGISTRATION FORM ══════════════════════════════════════ */}
      <section id="distributor-form" className="py-24 px-4 md:px-16" style={{ background: "linear-gradient(135deg, #f5f0e8, #faf7f0)" }}>
        <div className="max-w-[900px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full" style={{ background: "#fff8ed", color: "#D4A64A" }}>
                Apply Now
              </span>
              <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight" style={{ fontFamily: "'Poppins',sans-serif", color: "#1F5132" }}>
                Distributor Registration
              </h2>
              <p className="mt-4 text-gray-500 max-w-lg mx-auto text-base leading-relaxed">
                Fill in your business details below and our team will reach out within 48 hours to take it forward.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="rounded-3xl overflow-hidden shadow-2xl relative"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(212,166,74,0.2)",
              }}>
              {/* Top accent bar */}
              <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #1F5132, #D4A64A, #1F5132)" }} />

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 px-8 text-center"
                  >
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                      style={{ background: "linear-gradient(135deg, #1F5132, #2d6b45)" }}>
                      <span className="material-symbols-outlined text-5xl text-white">check_circle</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Poppins',sans-serif", color: "#1F5132" }}>
                      Application Submitted!
                    </h3>
                    <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
                      Thank you, {formData.ownerName}! Your application for <strong>{formData.businessName}</strong> has been received. Our regional team will contact you at {formData.phone} within 48 hours.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setFormData({ businessName:"",ownerName:"",phone:"",email:"",address:"",city:"",state:"",gst:"",bizType:"",yearsInBusiness:"",message:"" }); }}
                      className="px-6 py-3 rounded-xl font-bold text-sm text-white"
                      style={{ background: "linear-gradient(135deg, #1F5132, #2d6b45)" }}
                    >
                      Submit Another Application
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="p-8 md:p-12"
                    noValidate
                  >
                    {errors._general && (
                      <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2 border border-red-200">
                        <span className="material-symbols-outlined text-[20px]">error</span>
                        <span className="text-sm font-medium">{errors._general}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Business Name */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold tracking-wider text-gray-600 uppercase mb-2">Business / Shop Name *</label>
                        <input name="businessName" value={formData.businessName} onChange={handleChange}
                          className={inputCls("businessName")} placeholder="Your registered business or shop name" />
                        {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
                      </div>

                      {/* Owner Name */}
                      <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-600 uppercase mb-2">Owner / Contact Name *</label>
                        <input name="ownerName" value={formData.ownerName} onChange={handleChange}
                          className={inputCls("ownerName")} placeholder="Full name" />
                        {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-600 uppercase mb-2">Mobile Number *</label>
                        <input name="phone" value={formData.phone} onChange={handleChange}
                          className={inputCls("phone")} placeholder="10-digit mobile" maxLength={10} type="tel" />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-600 uppercase mb-2">Email Address *</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange}
                          className={inputCls("email")} placeholder="business@email.com" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      {/* Address */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold tracking-wider text-gray-600 uppercase mb-2">Full Address of Shop *</label>
                        <input name="address" value={formData.address} onChange={handleChange}
                          className={inputCls("address")} placeholder="Complete street address" />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-600 uppercase mb-2">City *</label>
                        <input name="city" value={formData.city} onChange={handleChange}
                          className={inputCls("city")} placeholder="Your city" />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-600 uppercase mb-2">State *</label>
                        <select name="state" value={formData.state} onChange={handleChange} className={inputCls("state")}>
                          <option value="">Select State</option>
                          {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                      </div>

                      {/* GST */}
                      <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-600 uppercase mb-2">GST Number (Optional)</label>
                        <input name="gst" value={formData.gst} onChange={handleChange}
                          className={inputCls("gst")} placeholder="22AAAAA0000A1Z5" maxLength={15} />
                      </div>

                      {/* Business Type */}
                      <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-600 uppercase mb-2">Business Type *</label>
                        <select name="bizType" value={formData.bizType} onChange={handleChange} className={inputCls("bizType")}>
                          <option value="">Select Type</option>
                          {bizTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {errors.bizType && <p className="text-red-500 text-xs mt-1">{errors.bizType}</p>}
                      </div>

                      {/* Years in Business */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold tracking-wider text-gray-600 uppercase mb-2">Years in Business</label>
                        <div className="flex flex-wrap gap-3">
                          {["< 1 Year", "1–3 Years", "3–5 Years", "5–10 Years", "10+ Years"].map((y) => (
                            <button
                              key={y} type="button"
                              onClick={() => setFormData((p) => ({ ...p, yearsInBusiness: y }))}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                                formData.yearsInBusiness === y
                                  ? "text-white border-transparent"
                                  : "text-gray-600 border-gray-200 hover:border-[#1F5132] bg-white"
                              }`}
                              style={formData.yearsInBusiness === y ? { background: "linear-gradient(135deg, #1F5132, #2d6b45)" } : {}}
                            >
                              {y}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold tracking-wider text-gray-600 uppercase mb-2">Additional Message</label>
                        <textarea name="message" value={formData.message} onChange={handleChange}
                          rows={4} className={inputCls("message") + " resize-none"}
                          placeholder="Tell us about your distribution network, coverage area, or any specific requirements..." />
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <motion.button
                        type="submit" disabled={isSubmitting}
                        className="flex-1 py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
                        style={{ background: "linear-gradient(135deg, #1F5132, #2d6b45)" }}
                        whileHover={{ scale: 1.02, y: -2, boxShadow: "0 12px 30px rgba(31,81,50,0.35)" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">send</span>
                            Submit Application
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        type="button" onClick={whatsappMsg}
                        className="flex-1 sm:flex-none sm:px-8 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                        style={{ background: "#25D366", color: "white" }}
                        whileHover={{ scale: 1.02, y: -2, boxShadow: "0 12px 30px rgba(37,211,102,0.35)" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        WhatsApp Inquiry
                      </motion.button>
                    </div>

                    <p className="text-center text-gray-400 text-xs mt-4">
                      🔒 Your information is secure and will not be shared with third parties.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════ 6. PROCESS TIMELINE ══════════════════════════════════════ */}
      <section className="py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full" style={{ background: "#fff8ed", color: "#D4A64A" }}>
              How It Works
            </span>
            <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight" style={{ fontFamily: "'Poppins',sans-serif", color: "#1F5132" }}>
              Your Path to Becoming a Distributor
            </h2>
          </div>
        </ScrollReveal>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:flex items-start justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 mx-16" style={{ background: "linear-gradient(90deg, #1F5132, #D4A64A)" }} />

          {processSteps.map((step, i) => (
            <ScrollReveal key={step.num} delay={i * 0.12} className="flex-1 flex flex-col items-center text-center px-4 relative">
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-5 relative z-10"
                style={{
                  background: "linear-gradient(135deg, #1F5132, #2d6b45)",
                  boxShadow: "0 8px 25px rgba(31,81,50,0.3)",
                  fontFamily: "'Poppins',sans-serif",
                }}
                whileHover={{ scale: 1.15, boxShadow: "0 12px 35px rgba(212,166,74,0.5)" }}
              >
                {step.num}
              </motion.div>
              <h4 className="font-bold text-base mb-2" style={{ fontFamily: "'Poppins',sans-serif", color: "#1C1C1C" }}>
                {step.title}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden space-y-0">
          {processSteps.map((step, i) => (
            <ScrollReveal key={step.num} delay={i * 0.1}>
              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                    style={{ background: "linear-gradient(135deg, #1F5132, #2d6b45)", fontFamily: "'Poppins',sans-serif" }}>
                    {step.num}
                  </div>
                  {i < processSteps.length - 1 && (
                    <div className="w-0.5 flex-1 my-2" style={{ background: "linear-gradient(180deg, #1F5132, #D4A64A)" }} />
                  )}
                </div>
                <div className="pb-8">
                  <h4 className="font-bold text-base mb-1" style={{ fontFamily: "'Poppins',sans-serif", color: "#1C1C1C" }}>{step.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════ 7. TESTIMONIALS ══════════════════════════════════════ */}
      <section className="py-24 px-4 md:px-16" style={{ background: "#F5F0E8" }}>
        <div className="max-w-[1280px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16 relative">
              <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full" style={{ background: "#fff8ed", color: "#D4A64A" }}>
                Testimonials
              </span>
              <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight mb-4" style={{ fontFamily: "'Poppins',sans-serif", color: "#1F5132" }}>
                Trusted by Distributors Across India
              </h2>
              <button 
                onClick={() => setReviewFormOpen(!reviewFormOpen)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border shadow-sm hover:-translate-y-0.5"
                style={{ 
                  background: reviewFormOpen ? "white" : "rgba(31,81,50,0.05)", 
                  color: "#1F5132",
                  borderColor: reviewFormOpen ? "#1F5132" : "rgba(31,81,50,0.2)"
                }}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {reviewFormOpen ? "close" : "rate_review"}
                </span>
                {reviewFormOpen ? "Close Form" : "Share Your Experience"}
              </button>
            </div>
          </ScrollReveal>

          <AnimatePresence>
            {reviewFormOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-2xl mx-auto mb-16 p-8 rounded-2xl shadow-lg"
                style={{ background: "white", border: "1px solid #f0ede8" }}
              >
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Poppins',sans-serif", color: "#1F5132" }}>Partner Testimonial</h3>
                <div className="text-sm mb-6 flex items-start gap-2 p-4 rounded-lg" style={{ background: "#fff8ed", color: "#7b5800", border: "1px solid rgba(212,166,74,0.3)" }}>
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  <p>All testimonials are verified by our team before being published. Your private details (Email / Phone) will not be shared publicly.</p>
                </div>
                
                {reviewSubmitStatus === "success" ? (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }} 
                     animate={{ opacity: 1, scale: 1 }} 
                     className="text-center py-8"
                   >
                     <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(31,81,50,0.1)", color: "#1F5132" }}>
                       <span className="material-symbols-outlined text-3xl">check_circle</span>
                     </div>
                     <h4 className="text-xl font-bold mb-2" style={{ fontFamily: "'Poppins',sans-serif", color: "#1F5132" }}>Testimonial Submitted!</h4>
                     <p className="text-gray-500">Thank you! Your feedback has been received and is pending verification.</p>
                   </motion.div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-5 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Name (Public)</label>
                        <input required type="text" name="name" value={reviewData.name} onChange={handleReviewChange} className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200 outline-none focus:border-[#1F5132] transition-colors text-sm" placeholder="e.g. Rajesh Patel" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">City (Public)</label>
                        <input required type="text" name="city" value={reviewData.city} onChange={handleReviewChange} className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200 outline-none focus:border-[#1F5132] transition-colors text-sm" placeholder="e.g. Surat, Gujarat" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email (Private)</label>
                        <input required type="email" name="email" value={reviewData.email} onChange={handleReviewChange} className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200 outline-none focus:border-[#1F5132] transition-colors text-sm" placeholder="partner@business.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone Number (Private)</label>
                        <input required type="text" name="phone" value={reviewData.phone} onChange={handleReviewChange} className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200 outline-none focus:border-[#1F5132] transition-colors text-sm" placeholder="e.g. 9876543210" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Association Timeline</label>
                        <input required type="text" name="years" value={reviewData.years} onChange={handleReviewChange} className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200 outline-none focus:border-[#1F5132] transition-colors text-sm" placeholder="e.g. Partner since 2021" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Rating</label>
                        <div className="flex gap-2 mt-2">
                          {[1,2,3,4,5].map(star => (
                            <button key={star} type="button" onClick={() => setReviewData({...reviewData, rating: star})} className="text-3xl focus:outline-none hover:scale-110 transition-transform">
                              <span className="material-symbols-outlined" style={{ color: reviewData.rating >= star ? "#D4A64A" : "#e5e7eb", fontVariationSettings: reviewData.rating >= star ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Testimonial</label>
                      <textarea required name="text" value={reviewData.text} onChange={handleReviewChange} rows="4" className="w-full bg-gray-50 p-3 rounded-lg border border-gray-200 outline-none focus:border-[#1F5132] transition-colors text-sm resize-none" placeholder="Tell us about your experience partnering with Arihant..." />
                    </div>
                    <button type="submit" disabled={reviewSubmitStatus === "submitting"} className="w-full flex justify-center items-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed" style={{ background: "linear-gradient(135deg, #1F5132, #2d6b45)" }}>
                      {reviewSubmitStatus === "submitting" ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> : "Submit Testimonial"}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative w-full overflow-hidden pt-8 pb-4">
            {/* Fade masks for smooth entry/exit */}
            <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#F5F0E8] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#F5F0E8] to-transparent z-10 pointer-events-none"></div>
            
            <motion.div 
              animate={{ x: ["0%", "-12.5%"] }}
              transition={{ ease: "linear", duration: testimonials.length > 0 ? testimonials.length * 12 : 40, repeat: Infinity }}
              className="flex gap-6 w-max pl-6"
            >
              {Array(8).fill(testimonials).flat().map((t, index) => (
                <div
                  key={`${t.name}-${index}`}
                  className="rounded-2xl p-8 flex flex-col justify-between w-[300px] md:w-[350px] shrink-0"
                  style={{ background: "white", border: "1px solid #f0ede8", boxShadow: "0 4px 30px rgba(0,0,0,0.05)" }}
                >
                  {/* Stars */}
                  <div>
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: t.stars }).map((_, s) => (
                        <span key={s} className="text-[#D4A64A] text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed italic mb-6">"{t.review}"</p>
                  </div>
                  <div className="flex items-center gap-3 pt-5 border-t border-gray-100 mt-auto">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ background: t.color }}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-bold text-sm truncate max-w-[200px]" style={{ fontFamily: "'Poppins',sans-serif" }}>{t.name}</p>
                      <p className="text-gray-400 text-xs truncate max-w-[200px]">{t.city}</p>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: "#1F5132" }}>{t.years}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ 8. FAQ ══════════════════════════════════════ */}
      <section id="distributor-faq" className="py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full" style={{ background: "#fff8ed", color: "#D4A64A" }}>
              FAQ
            </span>
            <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight" style={{ fontFamily: "'Poppins',sans-serif", color: "#1F5132" }}>
              Frequently Asked Questions
            </h2>
          </div>
        </ScrollReveal>

        <div className="max-w-[720px] mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div className="rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${openFaq === i ? "#D4A64A" : "#e8e3da"}`, background: "white" }}>
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ background: openFaq === i ? "#fff8ed" : "white" }}
                >
                  <span className="font-bold text-sm pr-4" style={{ fontFamily: "'Poppins',sans-serif", color: "#1C1C1C" }}>
                    {faq.q}
                  </span>
                  <motion.span
                    className="material-symbols-outlined text-xl shrink-0"
                    style={{ color: "#D4A64A" }}
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    expand_more
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════ 9. CONTACT ══════════════════════════════════════ */}
      <section id="dist-contact" className="py-24 px-4 md:px-16" style={{ background: "linear-gradient(135deg, #0d2b1a 0%, #1F5132 100%)" }}>
        <div className="max-w-[1280px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full"
                style={{ background: "rgba(212,166,74,0.15)", color: "#D4A64A", border: "1px solid rgba(212,166,74,0.3)" }}>
                Get In Touch
              </span>
              <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight text-white"
                style={{ fontFamily: "'Poppins',sans-serif" }}>
                Have Questions? We're Here.
              </h2>
              <p className="mt-4 text-white/60 text-base max-w-lg mx-auto leading-relaxed">
                Our distributor support team is available Monday–Saturday, 9 AM – 6 PM IST.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "chat", label: "WhatsApp", value: contactPhone, sub: "Chat instantly", href: `https://wa.me/91${waPhone.substring(waPhone.length - 10)}`, color: "#25D366" },
              { icon: "phone", label: "Phone", value: contactPhone, sub: "Toll-free support", href: `tel:${contactPhone}`, color: "#D4A64A" },
              { icon: "mail", label: "Email", value: contactEmail, sub: "24hr response", href: `mailto:${contactEmail}`, color: "#D4A64A" },
              { icon: "location_on", label: "Office", value: contactLocation, sub: "Head Office, India", href: "#", color: "#D4A64A" },
            ].map((c, i) => (
              <ScrollReveal key={c.label} delay={i * 0.1}>
                <motion.a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="block rounded-2xl p-7 text-center no-underline transition-all"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                  whileHover={{ y: -6, background: "rgba(255,255,255,0.12)" }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: c.color + "22" }}>
                    <span className="material-symbols-outlined text-2xl" style={{ color: c.color }}>{c.icon}</span>
                  </div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">{c.label}</p>
                  <p className="text-white font-bold text-sm mb-0.5" style={{ fontFamily: "'Poppins',sans-serif" }}>{c.value}</p>
                  <p className="text-white/40 text-xs">{c.sub}</p>
                </motion.a>
              </ScrollReveal>
            ))}
          </div>

          {/* Social Media */}
          <ScrollReveal delay={0.3}>
            <div className="flex items-center justify-center gap-4 mt-12">
              {[
                { icon: "language", label: "Website" },
                { icon: "thumb_up", label: "Facebook" },
                { icon: "photo_camera", label: "Instagram" },
                { icon: "play_circle", label: "YouTube" },
              ].map((s) => (
                <motion.a key={s.label} href="#"
                  className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                  whileHover={{ scale: 1.15, background: "rgba(212,166,74,0.25)" }}
                  whileTap={{ scale: 0.95 }}
                  title={s.label}
                >
                  <span className="material-symbols-outlined text-xl text-white">{s.icon}</span>
                </motion.a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════ 10. MINI FOOTER ══════════════════════════════════════ */}
      <footer style={{ background: "#0a1f12" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand col */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins',sans-serif" }}>ARIHANT</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-5">
                Pioneering the future of Indian staples through traditional milling wisdom and modern quality standards since 1984.
              </p>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(212,166,74,0.15)", color: "#D4A64A" }}>
                  Since 1984
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
                  ISI Certified
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>Quick Links</h4>
              <ul className="space-y-3">
                {["Home", "About Us", "Products", "Contact"].map((l) => (
                  <li key={l}>
                    <a href="#"
                      onClick={(e) => { 
                        e.preventDefault(); 
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        onNavigate(l.toLowerCase().replace(" us", "").replace(" ", ""), null); 
                      }}
                      className="text-white/50 text-sm hover:text-white transition-colors cursor-pointer">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>Products</h4>
              <ul className="space-y-3">
                {["Sharbati Atta", "Chana Besan", "Roasted Daliya", "Fine Suji", "Premium Maida"].map((p) => (
                  <li key={p}>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      onNavigate("products");
                    }} className="text-white/50 text-sm hover:text-white transition-colors cursor-pointer">{p}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Distributor Links */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>Distributors</h4>
              <ul className="space-y-3">
                {["Apply Now", "Partner Benefits", "Distributor Login", "Support Portal", "Distributor FAQ"].map((l) => (
                  <li key={l}>
                    <a href="#" onClick={(e) => { 
                      e.preventDefault(); 
                      if (l === "Apply Now") document.getElementById("distributor-form")?.scrollIntoView({ behavior: "smooth" }); 
                      else if (l === "Partner Benefits") document.getElementById("distributor-benefits")?.scrollIntoView({ behavior: "smooth" });
                      else if (l === "Distributor FAQ") document.getElementById("distributor-faq")?.scrollIntoView({ behavior: "smooth" });
                      else if (l === "Support Portal") document.getElementById("dist-contact")?.scrollIntoView({ behavior: "smooth" });
                      else if (l === "Distributor Login") {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        onNavigate("distributor-login");
                      }
                    }}
                      className="text-white/50 text-sm hover:text-white transition-colors cursor-pointer">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-white/40 text-xs">© 2024 Arihant FMCG. All rights reserved. · Crafted for purity.</p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Return Policy"].map((l) => (
                <a key={l} href="#" onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onNavigate("about");
                }} className="text-white/40 text-xs hover:text-white/70 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
