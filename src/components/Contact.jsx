import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Contact({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Full Name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) {
      tempErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = "Message must be at least 10 characters long";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, _general: "" }));
    
    try {
      const { error } = await supabase.from('contact_inquiries').insert([{
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      }]);
      
      if (error) throw error;
      
      setIsSubmitted(true);
    } catch (err) {
      setErrors(prev => ({ ...prev, _general: err.message || "Failed to submit inquiry. Please try again." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "General Inquiry",
      message: ""
    });
    setIsSubmitted(false);
  };

  return (
    <div className="bg-background min-h-screen text-on-surface page-transition">
      {/* Contact Hero Banner */}
      <section className="relative bg-primary overflow-hidden min-h-[320px] flex items-center py-stack-xl">
        <div className="grain-overlay"></div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full relative z-10 text-white">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-full">
              Get In Touch
            </span>
            <div className="h-px w-12 bg-outline-variant opacity-30"></div>
          </div>
          <h1 className="font-display-lg text-display-lg mb-4">
            Connect With <span className="italic text-secondary-container">Arihant</span>
          </h1>
          <p className="font-body-lg text-body-lg max-w-xl opacity-90 leading-relaxed">
            Have questions about our traditional milling process, bulk inquiries, or distribution channels? We are here to help.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl flex flex-col lg:flex-row gap-gutter">
        {/* Contact Information & Map */}
        <aside className="w-full lg:w-[45%] flex-shrink-0 space-y-stack-lg">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Our Offices</h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              We look forward to partnering with conscious consumers and commercial entities globally.
            </p>
          </div>

          <div className="space-y-stack-md">
            {/* HQ */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <div>
                <h4 className="font-headline-md text-[18px] text-primary mb-1">Corporate Headquarters</h4>
                <p className="font-label-md text-on-surface font-semibold mb-0.5">Arihant Tower, 12th Floor</p>
                <p className="text-body-md text-on-surface-variant">Business District, South Mumbai, MH 400001, India</p>
              </div>
            </div>

            {/* Helpline */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">call</span>
              </div>
              <div>
                <h4 className="font-headline-md text-[18px] text-secondary mb-1">Toll-Free Helpline</h4>
                <p className="font-label-md text-on-surface font-semibold mb-0.5">1800-456-7890</p>
                <p className="text-body-md text-on-surface-variant">Monday to Saturday, 9:00 AM – 6:00 PM IST</p>
              </div>
            </div>

            {/* Email Nodes */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">mail</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-headline-md text-[18px] text-primary mb-1">Corporate Emails</h4>
                <p className="text-body-md text-on-surface-variant flex items-center gap-1.5">
                  <strong className="text-on-surface font-semibold">General Relations:</strong> hq@arihant-fmcg.com
                </p>
                <p className="text-body-md text-on-surface-variant flex items-center gap-1.5">
                  <strong className="text-on-surface font-semibold">Distributor Relations:</strong> sales@arihant-fmcg.com
                </p>
                <p className="text-body-md text-on-surface-variant flex items-center gap-1.5">
                  <strong className="text-on-surface font-semibold">Careers:</strong> careers@arihant-fmcg.com
                </p>
              </div>
            </div>
          </div>

          {/* Embedded Mock Map */}
          <div id="mumbai-map" className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant shadow-sm relative h-[280px]">
            {/* Visual Map Layout */}
            <div className="absolute inset-0 bg-[#fbf9f4] p-6 flex flex-col justify-between overflow-hidden">
              <div className="wheat-texture absolute inset-0 opacity-10"></div>
              {/* Map Graphics representation */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary font-bold text-headline-md">
                    <span className="material-symbols-outlined">map</span>
                    <span>Mumbai Office Map</span>
                  </div>
                  <p className="text-label-sm text-on-surface-variant max-w-xs mt-1">
                    Located near the financial district, overlooking Backbay Reclamation.
                  </p>
                </div>
                {/* Visual indicator of office location */}
                <div className="flex justify-center items-center h-24 relative">
                  <div className="w-4 h-4 bg-primary rounded-full animate-ping absolute"></div>
                  <div className="w-4 h-4 bg-primary rounded-full relative z-10 border border-white"></div>
                  {/* Mock Map Streets */}
                  <div className="absolute w-full h-[2px] bg-outline-variant/30 rotate-12"></div>
                  <div className="absolute w-full h-[2px] bg-outline-variant/30 -rotate-45"></div>
                  <div className="absolute h-full w-[2px] bg-outline-variant/30 left-1/3"></div>
                  <div className="absolute h-full w-[2px] bg-outline-variant/30 right-1/4"></div>
                </div>
                <div className="flex justify-between items-center bg-white/85 backdrop-blur-sm p-3 rounded-lg border border-outline-variant/50">
                  <span className="text-label-sm text-on-surface font-semibold">18°56'06"N 72°49'32"E</span>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-label-sm text-primary font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>Google Maps</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Inquiry Form */}
        <section className="flex-1 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-md relative overflow-hidden">
          <div className="texture-overlay absolute inset-0 opacity-10"></div>
          
          {!isSubmitted ? (
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Send us a Message</h3>
                <p className="text-body-md text-on-surface-variant mb-6">
                  Please fill out the form below. Our response time is typically within 24 business hours.
                </p>
                {errors._general && (
                  <div className="mb-6 p-3 bg-error-container text-on-error-container rounded-lg flex items-start gap-2 border border-error/20">
                    <span className="material-symbols-outlined text-[20px]">error</span>
                    <span className="text-label-md font-medium">{errors._general}</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
                {/* Full Name */}
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-label-md text-on-surface font-semibold">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 rounded-lg bg-surface-container-low border text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.name ? "border-error" : "border-outline-variant"
                    }`}
                  />
                  {errors.name && <p className="text-label-sm text-error font-medium">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-label-md text-on-surface font-semibold">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-lg bg-surface-container-low border text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.email ? "border-error" : "border-outline-variant"
                    }`}
                  />
                  {errors.email && <p className="text-label-sm text-error font-medium">{errors.email}</p>}
                </div>

                {/* Subject / Inquiry Type */}
                <div className="space-y-1">
                  <label htmlFor="subject" className="block text-label-md text-on-surface font-semibold">
                    Inquiry Type
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-all"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Bulk Orders">Commercial &amp; Bulk Orders</option>
                    <option value="Dealership Inquiry">Dealership &amp; Distribution</option>
                    <option value="Feedback">Customer Feedback</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label htmlFor="message" className="block text-label-md text-on-surface font-semibold">
                    Message <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="How can we assist you today? (Minimum 10 characters)"
                    className={`w-full px-4 py-3 rounded-lg bg-surface-container-low border text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none ${
                      errors.message ? "border-error" : "border-outline-variant"
                    }`}
                  ></textarea>
                  {errors.message && <p className="text-label-sm text-error font-medium">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:shadow-lg transition-all active:scale-95 disabled:opacity-85 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
              <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/5">
                <span className="material-symbols-outlined text-[48px]">check_circle</span>
              </div>
              <h3 className="font-display-lg text-primary mb-3">Message Sent!</h3>
              <p className="font-body-md text-on-surface-variant max-w-md mb-8 leading-relaxed">
                Thank you, <strong className="text-on-surface font-semibold">{formData.name}</strong>. Your inquiry about <strong>{formData.subject}</strong> has been transmitted successfully. Our executive relations team will contact you shortly at <strong>{formData.email}</strong>.
              </p>
              <button
                onClick={resetForm}
                className="px-8 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold hover:scale-105 transition-transform shadow-md"
              >
                Send Another Message
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
