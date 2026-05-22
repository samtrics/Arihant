import React, { useState } from "react";

export default function Footer({ currentPage, onNavigate }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      setSubscribeError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setSubscribeError("Please enter a valid email address");
      return;
    }
    setSubscribeError("");
    setSubscribed(true);
  };

  // Distributor page has its own built-in footer — suppress the global one
  if (currentPage === "distributors") {
    return null;
  }

  if (currentPage === "products") {
    // Exact footer from product.html
    return (
      <footer className="w-full relative bottom-0 bg-surface-container-lowest border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-stack-xl max-w-container-max mx-auto">
          <div className="col-span-1">
            <p className="font-headline-md text-headline-md text-primary mb-6">ARIHANT</p>
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
                    onNavigate("products");
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
                    onNavigate("products");
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
                    onNavigate("products");
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
                    onNavigate("products");
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
                <a className="hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
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
                <a className="hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
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
                <a className="hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Return Policy
                </a>
              </li>
              <li>
                <a className="hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Quality Certification
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="px-margin-mobile md:px-margin-desktop py-6 border-t border-outline-variant max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center text-label-sm text-outline">
          <p>© 2024 ARIHANT FMCG. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-stack-xl max-w-container-max mx-auto">
          <div className="col-span-1 md:col-span-1">
            <div className="font-headline-md text-headline-md text-primary font-bold mb-stack-md">ARIHANT</div>
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
                    onNavigate("about");
                  }}
                  className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer"
                  href="#"
                >
                  About Us
                </a>
              </li>
              <li>
                <a className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Sustainability
                </a>
              </li>
              <li>
                <a className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface mb-stack-md uppercase tracking-wider">Support</h4>
            <ul className="space-y-stack-sm text-label-sm">
              <li>
                <a className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
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
                <a className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="px-margin-mobile md:px-margin-desktop py-stack-md border-t border-outline-variant max-w-container-max mx-auto text-center">
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70">
            © 2024 ARIHANT FMCG. All rights reserved. Crafted for purity.
          </p>
        </div>
      </footer>
    );
  }

  // Current general/home/contact/auth footer (matches home.html footer)
  return (
    <footer className="w-full relative bottom-0 bg-surface-container-lowest border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-stack-xl max-w-container-max mx-auto">
        <div className="space-y-6">
          <a
            onClick={(e) => {
              e.preventDefault();
              onNavigate("home");
            }}
            className="font-headline-md text-headline-md text-primary font-bold cursor-pointer"
            href="#"
          >
            ARIHANT
          </a>
          <p className="text-on-surface-variant text-label-md">
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
        <div>
          <h4 className="text-primary font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 font-label-md">
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("about");
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
                  onNavigate("products");
                }}
                className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer"
                href="#"
              >
                Products Range
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                Quality Standards
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                Store Locator
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                Bulk Inquiry
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
          <h4 className="text-primary font-bold mb-6">Support</h4>
          <ul className="space-y-4 font-label-md">
            <li>
              <a className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                Terms of Service
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                Sustainability
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-secondary hover:underline transition-all cursor-pointer" href="#">
                FAQs
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-primary font-bold mb-6">Newsletter</h4>
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
                  className="bg-primary text-white px-6 py-2.5 font-semibold hover:bg-opacity-90 transition-all whitespace-nowrap active:scale-95"
                >
                  Join
                </button>
              </div>
              {subscribeError && (
                <p className="text-label-sm text-error font-medium pl-1 animate-slide-in">{subscribeError}</p>
              )}
            </form>
          )}
        </div>

      </div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center text-label-sm text-on-surface-variant">
        <p>© 2024 ARIHANT FMCG. All rights reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0 items-center">
          <span>Designed for Modern Purity</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">location_on</span>
            Rajasthan, India
          </span>
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
