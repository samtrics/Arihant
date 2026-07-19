import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Footer({ currentPage, onNavigate }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      setSubscribeError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setSubscribeError("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    setSubscribeError("");

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: email.trim().toLowerCase() }]);

      if (error) {
        // 23505 is PostgreSQL unique violation code (meaning already subscribed)
        if (error.code === '23505') {
          setSubscribeError("This email is already subscribed!");
          return;
        }
        throw error;
      }

      setSubscribed(true);
    } catch (err) {
      console.error("Newsletter error:", err);
      setSubscribeError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Distributor page has its own built-in footer — suppress the global one
  if (currentPage === "distributors") {
    return null;
  }

  if (currentPage === "products") {
    // Exact footer from product.html
    return (
      <footer className="w-full relative bottom-0 bg-surface-container-lowest border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-10 gap-x-gutter px-margin-mobile md:px-margin-desktop py-10 md:py-stack-xl max-w-container-max mx-auto">
          <div className="col-span-1">
            <img loading="lazy" src="/logo-opt.webp" alt="Arihant Logo" className="h-28 md:h-36 w-auto object-contain -mt-10 -mb-10" />
            <p className="text-label-md text-on-surface-variant mb-8">
              Pioneering the future of Indian staples through traditional milling wisdom and modern quality standards.
            </p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform">
                social_leaderboard
              </span>
              <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform">
                language
              </span>
              <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform">
                chat
              </span>
            </div>
          </div>
          <div>
            <p className="font-label-md text-label-md text-primary mb-6 uppercase tracking-widest">Products</p>
            <ul className="space-y-4 text-label-sm text-on-surface-variant">
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-secondary hover:underline transition-all cursor-pointer"
                  href="#"
                >
                  Whole Wheat Flours
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-secondary hover:underline transition-all cursor-pointer"
                  href="#"
                >
                  Specialty Pulses
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-secondary hover:underline transition-all cursor-pointer"
                  href="#"
                >
                  Organic Heritage Series
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-secondary hover:underline transition-all cursor-pointer"
                  href="#"
                >
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-label-md text-label-md text-primary mb-6 uppercase tracking-widest">Support</p>
            <ul className="space-y-4 text-label-sm text-on-surface-variant">
              <li>
                <a onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} className="hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Bulk Inquiry
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("distributor-login");
                  }}
                  className="hover:text-secondary hover:underline transition-all cursor-pointer"
                  href="#"
                >
                  Distributor Login
                </a>
              </li>
              <li>
                <a onClick={(e) => { e.preventDefault(); onNavigate("about"); }} className="hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Sustainability
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("contact");
                  }}
                  className="hover:text-secondary hover:underline transition-all cursor-pointer"
                  href="#"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-label-md text-label-md text-primary mb-6 uppercase tracking-widest">Policies</p>
            <ul className="space-y-4 text-label-sm text-on-surface-variant">
              <li>
                <a onClick={(e) => { e.preventDefault(); onNavigate("about"); }} className="hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a onClick={(e) => { e.preventDefault(); onNavigate("about"); }} className="hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Terms of Service
                </a>
              </li>
              <li>
                <a onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} className="hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Return Policy
                </a>
              </li>
              <li>
                <a onClick={(e) => { e.preventDefault(); onNavigate("about"); }} className="hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Quality Certification
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="px-margin-mobile md:px-margin-desktop py-6 border-t border-outline-variant max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center text-label-sm text-outline text-center md:text-left gap-4 md:gap-0">
          <p>© 2024 ARIHANT FMCG. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-2 md:mt-0 items-center">
            <span className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full text-primary font-medium tracking-wide shadow-sm">
              Designed by <a href="#" className="font-bold hover:underline">Samtrics</a>
            </span>
            <span>Certified Pure Quality</span>
            <span>Direct From Farmer Sourcing</span>
          </div>
        </div>
      </footer>
    );
  }

  if (currentPage === "about") {
    // Exact footer from About.html
    return (
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-10 gap-x-gutter px-margin-mobile md:px-margin-desktop py-10 md:py-stack-xl max-w-container-max mx-auto">
          <div className="col-span-1 md:col-span-1">
            <img loading="lazy" src="/logo-opt.webp" alt="Arihant Logo" className="h-28 md:h-36 w-auto object-contain -mt-10 -mb-10" />
            <p className="font-body-md text-body-md text-on-surface-variant">
              Pioneering the future of pure, ethical FMCG products for the modern world.
            </p>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface mb-stack-md uppercase tracking-wider">Company</h4>
            <ul className="space-y-stack-sm text-label-sm">
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer"
                  href="#"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" 
                  href="#"
                >
                  Sustainability
                </a>
              </li>
              <li>
                <a 
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" 
                  href="#"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface mb-stack-md uppercase tracking-wider">Support</h4>
            <ul className="space-y-stack-sm text-label-sm">
              <li>
                <a 
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("contact");
                  }}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" 
                  href="#"
                >
                  Bulk Inquiry
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("contact");
                  }}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer"
                  href="#"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("distributors");
                  }}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer"
                  href="#"
                >
                  Distribution
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("distributor-login");
                  }}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer"
                  href="#"
                >
                  Distributor Login
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface mb-stack-md uppercase tracking-wider">Legal</h4>
            <ul className="space-y-stack-sm text-label-sm">
              <li>
                <a 
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" 
                  href="#"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" 
                  href="#"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="px-margin-mobile md:px-margin-desktop py-stack-md border-t border-outline-variant max-w-container-max mx-auto text-center flex flex-col items-center gap-4">
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70">
            © 2024 ARIHANT FMCG. All rights reserved.
          </p>
          <span className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full text-primary font-medium tracking-wide text-label-sm shadow-sm">
            Designed by <a href="#" className="font-bold hover:underline">Samtrics</a>
          </span>
        </div>
      </footer>
    );
  }

  // Current general/home/contact/auth footer (matches home.html footer)
  return (
    <footer className="w-full relative bottom-0 bg-surface-container-lowest border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10 md:gap-y-12 px-margin-mobile md:px-margin-desktop py-10 md:py-stack-xl max-w-container-max mx-auto">
        
        {/* Column 1: Brand & Newsletter (Span 4) */}
        <div className="md:col-span-4 space-y-8">
          <div className="space-y-6">
            <a
              onClick={(e) => {
                e.preventDefault();
                onNavigate("home");
              }}
              className="cursor-pointer inline-block -mt-10 -mb-10"
              href="#"
            >
              <img loading="lazy" src="/logo-opt.webp" alt="Arihant Logo" className="h-28 md:h-36 w-auto object-contain" />
            </a>
            <p className="text-on-surface-variant text-label-md leading-relaxed">
              Modernizing the Indian pantry with purity, tradition, and uncompromising quality standards since 1994.
            </p>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                href="#"
              >
                <span className="material-symbols-outlined text-sm">public</span>
              </a>
              <a
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                href="#"
              >
                <span className="material-symbols-outlined text-sm">thumb_up</span>
              </a>
              <a
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                href="#"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </a>
            </div>
          </div>
          
          <div className="pt-6 border-t border-outline-variant/50">
            <h4 className="text-primary font-bold mb-3">Newsletter</h4>
            <p className="text-label-sm text-on-surface-variant mb-4">Subscribe for recipes and purity updates.</p>
            {subscribed ? (
              <div className="bg-primary-container/20 text-primary border border-primary-container/30 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in font-label-md">
                <span className="material-symbols-outlined text-[20px] text-primary">check_circle</span>
                <span>Subscribed for purity updates!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all duration-200">
                  <input
                    className="flex-grow px-4 py-2.5 bg-transparent border-0 text-on-surface text-body-md placeholder-on-surface-variant/50 outline-none focus:ring-0 focus:outline-none min-w-0"
                    placeholder="Your email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (subscribeError) setSubscribeError("");
                    }}
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-primary text-white px-6 py-2.5 font-semibold transition-all whitespace-nowrap ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90 active:scale-95'}`}
                  >
                    {isSubmitting ? '...' : 'Join'}
                  </button>
                </div>
                {subscribeError && (
                  <p className="text-label-sm text-error font-medium pl-1 animate-slide-in">{subscribeError}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Column 2: Quick Links (Span 2) */}
        <div className="md:col-span-2 md:pl-4">
          <h4 className="text-primary font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 font-label-md">
            <li>
              <a onClick={(e) => { e.preventDefault(); onNavigate("about"); }} className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">About Us</a>
            </li>
            <li>
              <a onClick={(e) => { e.preventDefault(); onNavigate("products"); }} className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">Products Range</a>
            </li>
            <li>
              <a onClick={(e) => { e.preventDefault(); onNavigate("about"); }} className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">Quality Standards</a>
            </li>
            <li>
              <a onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">Store Locator</a>
            </li>
            <li>
              <a onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">Bulk Inquiry</a>
            </li>
            <li>
              <a onClick={(e) => { e.preventDefault(); onNavigate("distributor-login"); }} className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">Distributor Login</a>
            </li>
          </ul>
        </div>
        
        {/* Column 3: Support (Span 2) */}
        <div className="md:col-span-2">
          <h4 className="text-primary font-bold mb-6">Support</h4>
          <ul className="space-y-4 font-label-md">
            <li>
              <a onClick={(e) => { e.preventDefault(); onNavigate("about"); }} className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">Privacy Policy</a>
            </li>
            <li>
              <a onClick={(e) => { e.preventDefault(); onNavigate("about"); }} className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">Terms of Service</a>
            </li>
            <li>
              <a onClick={(e) => { e.preventDefault(); onNavigate("about"); }} className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">Sustainability</a>
            </li>
            <li>
              <a onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">FAQs</a>
            </li>
          </ul>
        </div>

        {/* Column 4: Map (Span 4) */}
        <div className="md:col-span-4 h-full flex flex-col min-h-[300px]">
          <h4 className="text-primary font-bold mb-6">Our Location</h4>
          <div className="rounded-xl overflow-hidden border border-outline-variant shadow-sm flex-grow relative group w-full h-full min-h-[250px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.37877239203!2d75.71350615562723!3d26.88514167923769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="absolute inset-0 w-full h-full transition-all duration-700"
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Arihant HQ Location"
            ></iframe>
          </div>
        </div>

      </div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center text-label-sm text-on-surface-variant text-center md:text-left gap-4 md:gap-0">
        <p>© 2024 ARIHANT FMCG. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-2 md:mt-0 items-center">
          <span className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full text-primary font-medium tracking-wide shadow-sm">
            Designed by <a href="#" className="font-bold hover:underline">Samtrics</a>
          </span>
          <a href="https://maps.google.com/?q=Jaipur,Rajasthan,India" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-xs">location_on</span>
            Rajasthan, India
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("admin", null); }}
            className="flex items-center gap-1 hover:text-primary transition-colors" style={{ opacity: 0.5 }}>
            <span className="material-symbols-outlined text-xs">admin_panel_settings</span>
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
