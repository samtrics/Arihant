import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";

const initialTestimonials = [
  {
    id: 1,
    stars: 5,
    text: "Arihant's double-cleaned grains have made a noticeable difference in our daily meals. The purity is unmatched, and I feel confident feeding my family.",
    imgSrc: "/avatars/avatar_homemaker_1784397561505.png",
    imgAlt: "Priya Sharma",
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra"
  },
  {
    id: 2,
    stars: 5,
    text: "As a professional chef, consistency and quality are non-negotiable. Arihant provides exactly that. Their organic range is truly exceptional.",
    imgSrc: "/avatars/avatar_chef_1784397576165.png",
    imgAlt: "Rahul Kapoor",
    name: "Rahul Kapoor",
    location: "New Delhi"
  },
  {
    id: 3,
    stars: 5,
    text: "I switched to Arihant when my baby started solids. The hygienic packing and nutrient-dense quality give me peace of mind every single day.",
    imgSrc: "/avatars/avatar_mother_1784397590288.png",
    imgAlt: "Ananya Desai",
    name: "Ananya Desai",
    location: "Bangalore, Karnataka"
  }
];

export default function Testimonials() {
  const [reviews, setReviews] = useState(initialTestimonials);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [formData, setFormData] = useState({
    name: "", location: "", email: "", orderId: "", rating: 5, text: ""
  });

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const fetchApprovedReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data && data.length > 0) {
        setReviews(data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      // fallback to initialTestimonials on error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    
    try {
      const newReview = {
        name: formData.name,
        location: formData.location,
        email: formData.email,
        orderId: formData.orderId,
        stars: formData.rating,
        text: formData.text,
        imgSrc: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
        status: 'pending' // pending admin approval
      };
      
      const { error } = await supabase.from('reviews').insert([newReview]);
      if (error) throw error;
      
      setSubmitStatus("success");
      
      setTimeout(() => {
        setIsFormOpen(false);
        setFormData({ name: "", location: "", email: "", orderId: "", rating: 5, text: "" });
        setSubmitStatus("idle");
      }, 3000);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Something went wrong while submitting your review. Please try again.");
      setSubmitStatus("idle");
    }
  };

  return (
    <section className="py-12 md:py-16 bg-surface-container-low overflow-hidden scroll-reveal">
      <div className="w-full px-margin-mobile md:px-margin-desktop">
        
        <div className="text-center mb-6 relative">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">
            Voice of Trust
          </h2>
          <p className="text-on-surface-variant mb-4">
            Over {(97 + reviews.length).toLocaleString()} households choose Arihant every day.
          </p>
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-highest text-primary font-semibold hover:bg-primary hover:text-on-primary transition-all duration-300 border border-primary/20 hover:border-primary shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isFormOpen ? "close" : "rate_review"}
            </span>
            {isFormOpen ? "Close Form" : "Write a Review"}
          </button>
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, overflow: "hidden" }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-2xl mx-auto mb-16 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-lg"
            >
              <h3 className="text-headline-sm font-headline-sm text-primary mb-2">Share Your Experience</h3>
              <div className="text-label-sm text-on-surface-variant mb-6 flex items-start gap-2 bg-secondary-container/30 p-4 rounded-lg border border-secondary/20">
                <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
                <p>To maintain authenticity, all reviews are verified against purchase records (Email / Order ID) before being permanently published. Your private details will not be shared.</p>
              </div>
              
              {submitStatus === "success" ? (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }} 
                   animate={{ opacity: 1, scale: 1 }} 
                   className="text-center py-8"
                 >
                   <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container mx-auto mb-4">
                     <span className="material-symbols-outlined text-3xl">check_circle</span>
                   </div>
                   <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Review Submitted!</h4>
                   <p className="text-on-surface-variant">Thank you! Your review has been added for demonstration and is pending permanent verification.</p>
                 </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-label-md text-on-surface mb-1">Name (Public)</label>
                      <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-surface p-3 rounded-lg border border-outline focus:border-primary outline-none transition-colors" placeholder="e.g. Jane Doe" />
                    </div>
                    <div>
                      <label className="block text-label-md text-on-surface mb-1">Location (Public)</label>
                      <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-surface p-3 rounded-lg border border-outline focus:border-primary outline-none transition-colors" placeholder="e.g. Mumbai, Maharashtra" />
                    </div>
                    <div>
                      <label className="block text-label-md text-on-surface mb-1">Email (Private)</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-surface p-3 rounded-lg border border-outline focus:border-primary outline-none transition-colors" placeholder="jane@example.com" />
                    </div>
                    <div>
                      <label className="block text-label-md text-on-surface mb-1">Order ID / Receipt No. (Private)</label>
                      <input required type="text" name="orderId" value={formData.orderId} onChange={handleChange} className="w-full bg-surface p-3 rounded-lg border border-outline focus:border-primary outline-none transition-colors" placeholder="e.g. ARH-12345" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-label-md text-on-surface mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} type="button" onClick={() => setFormData({...formData, rating: star})} className="text-3xl focus:outline-none hover:scale-110 transition-transform">
                          <span className={`material-symbols-outlined ${formData.rating >= star ? 'text-secondary' : 'text-outline-variant'}`} style={{ fontVariationSettings: formData.rating >= star ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-label-md text-on-surface mb-1">Review</label>
                    <textarea required name="text" value={formData.text} onChange={handleChange} rows="4" className="w-full bg-surface p-3 rounded-lg border border-outline focus:border-primary outline-none transition-colors" placeholder="Tell us about your experience..." />
                  </div>
                  <button type="submit" disabled={submitStatus === "submitting"} className="btn btn-primary w-full flex justify-center items-center gap-2 py-3 disabled:opacity-70 disabled:cursor-not-allowed">
                    {submitStatus === "submitting" ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : "Submit Review"}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full overflow-hidden pt-8 pb-4">
          {/* Fade masks for smooth entry/exit */}
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-surface-container-low to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-surface-container-low to-transparent z-10 pointer-events-none"></div>
          
          <motion.div 
            animate={{ x: ["0%", "-12.5%"] }}
            transition={{ ease: "linear", duration: reviews.length * 18, repeat: Infinity }}
            className="flex gap-6 w-max pl-6"
          >
            {Array(8).fill(reviews).flat().map((t, index) => (
              <div
                key={`${t.id}-${index}`}
                className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant relative group hover:shadow-md transition-shadow duration-300 w-[300px] md:w-[350px] shrink-0"
              >
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container shadow-sm">
                  <span className="material-symbols-outlined">format_quote</span>
                </div>
                <div className="flex gap-1 mb-4 text-secondary">
                  {[...Array(t.stars)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="italic text-on-surface mb-5 text-[15px] leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-surface-container rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                    <img loading="lazy"
                      className="w-full h-full object-cover"
                      alt={t.imgAlt}
                      src={t.imgSrc}
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-primary truncate max-w-[200px]">{t.name}</h5>
                    <p className="text-label-sm text-on-surface-variant truncate max-w-[200px]">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
