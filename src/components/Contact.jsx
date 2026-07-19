import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Contact({ onNavigate, siteSettings }) {
  const corp = siteSettings?.corporate_info || {};
  const phone = corp.phone || "1800-456-7890";
  const email = corp.email || "hq@arihant-fmcg.com";
  const hqLine1 = corp.addressLine1 || "Arihant Tower, 12th Floor";
  const hqLine2 = corp.addressLine2 || "Business District, South Mumbai, MH 400001, India";
  
  // Get map URL from the first Global Presence location, or default to Jaipur
  const googleMapSrc = (corp.locations && corp.locations.length > 0 && corp.locations[0].mapUrl) 
    ? corp.locations[0].mapUrl 
    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.37877239203!2d75.71350615562723!3d26.88514167923769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";
  
  const addressQuery = `${hqLine1}, ${hqLine2}`;
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
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(addressQuery)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group block"
                >
                  <p className="font-label-md text-on-surface font-semibold mb-0.5 group-hover:text-primary transition-colors flex items-center gap-1">
                    {hqLine1}
                    <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                  </p>
                  <p className="text-body-md text-on-surface-variant group-hover:text-primary/80 transition-colors">{hqLine2}</p>
                </a>
              </div>
            </div>

            {/* Helpline */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">call</span>
              </div>
              <div>
                <h4 className="font-headline-md text-[18px] text-secondary mb-1">Toll-Free Helpline</h4>
                <p className="font-label-md text-on-surface font-semibold mb-0.5">
                  <a href={`tel:${phone}`} className="hover:text-primary transition-colors hover:underline">{phone}</a>
                </p>
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
                  <strong className="text-on-surface font-semibold">General Relations:</strong> 
                  <a href={`mailto:${email}`} className="hover:text-primary transition-colors hover:underline">{email}</a>
                </p>
                <p className="text-body-md text-on-surface-variant flex items-center gap-1.5">
                  <strong className="text-on-surface font-semibold">Distributor Relations:</strong> 
                  <a href={`mailto:sales@${email.split('@')[1] || 'arihant-fmcg.com'}`} className="hover:text-primary transition-colors hover:underline">sales@{email.split('@')[1] || 'arihant-fmcg.com'}</a>
                </p>
                <p className="text-body-md text-on-surface-variant flex items-center gap-1.5">
                  <strong className="text-on-surface font-semibold">Careers:</strong> 
                  <a href={`mailto:careers@${email.split('@')[1] || 'arihant-fmcg.com'}`} className="hover:text-primary transition-colors hover:underline">careers@{email.split('@')[1] || 'arihant-fmcg.com'}</a>
                </p>
              </div>
            </div>
          </div>

          {/* Embedded Real Map */}
          <div id="contact-map" className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant shadow-sm relative h-[280px]">
            <iframe 
              src={googleMapSrc}
              className="absolute inset-0 w-full h-full transition-all duration-700"
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Arihant HQ Location"
            ></iframe>
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
