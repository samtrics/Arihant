import React, { useState } from "react";

export default function Header({ currentPage, onNavigate, customerUser }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", page: "home", sectionId: null },
    { label: "Products", page: "products", sectionId: null },
    { label: "About Us", page: "about", sectionId: null },
    { label: "Distributors", page: "distributors", sectionId: null },
    { label: "Contact", page: "contact", sectionId: null },
  ];

  const handleLinkClick = (e, page, sectionId) => {
    e.preventDefault();
    onNavigate(page, sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full top-0 sticky z-50 bg-surface border-b border-outline-variant">
      <nav className="flex justify-between items-center h-20 px-4 md:px-8 max-w-full w-full mx-auto">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <a
            onClick={(e) => handleLinkClick(e, "home", null)}
            className="font-headline-md text-headline-md font-bold text-primary cursor-pointer"
            href="#"
          >
            ARIHANT
          </a>
        </div>

        {/* Center: Nav links */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-8 font-body-md text-body-md">
          {navLinks.map((link) => {
            const isActive =
              currentPage === link.page &&
              link.sectionId === null;
            
            return (
              <a
                key={link.label}
                onClick={(e) => handleLinkClick(e, link.page, link.sectionId)}
                className={
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1 font-semibold cursor-pointer"
                    : "text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                }
                href="#"
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right: Search and Icons */}
        <div className="flex items-center justify-end gap-6 flex-shrink-0">
          <div className="relative hidden lg:block transition-all duration-300 focus-within:scale-105">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="pl-12 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full w-80 text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Search for pure flours, grains..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:bg-surface-container-low p-2 rounded-full transition-all active:scale-95">
              <span className="material-symbols-outlined text-primary" data-icon="notifications">
                notifications
              </span>
            </button>
            <button className="hover:bg-surface-container-low p-2 rounded-full transition-all active:scale-95">
              <span className="material-symbols-outlined text-primary" data-icon="shopping_cart">
                shopping_cart
              </span>
            </button>
            <button 
              onClick={(e) => handleLinkClick(e, customerUser ? "customer-dashboard" : "login", null)}
              className="hover:bg-surface-container-low p-2 rounded-full transition-all active:scale-95 flex items-center justify-center gap-1"
              title={customerUser ? "My Dashboard" : "Login"}
            >
              <span className="material-symbols-outlined text-primary" data-icon="account_circle">
                account_circle
              </span>
              {customerUser && (
                <span className="text-sm font-semibold text-primary hidden lg:inline">
                  {customerUser.user_metadata?.full_name?.split(' ')[0] || "Profile"}
                </span>
              )}
            </button>
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden hover:bg-surface-container-low p-2 rounded-full transition-all active:scale-95 flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[28px] text-primary">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slider Menu Drawer */}
      <div
        className={`fixed inset-0 top-20 bg-surface border-t border-outline-variant z-40 transition-all duration-300 md:hidden flex flex-col justify-between py-8 px-margin-mobile shadow-2xl ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-5">
          {navLinks.map((link) => {
            const isActive =
              currentPage === link.page &&
              link.sectionId === null;
            
            return (
              <a
                key={link.label}
                onClick={(e) => handleLinkClick(e, link.page, link.sectionId)}
                className={`py-3 border-b border-outline-variant/30 flex items-center justify-between cursor-pointer text-body-lg ${
                  isActive
                    ? "text-primary font-bold pl-2 border-l-4 border-l-primary"
                    : "text-on-surface-variant font-semibold hover:text-primary"
                }`}
                href="#"
              >
                {link.label}
                <span className="material-symbols-outlined text-outline text-sm">arrow_forward</span>
              </a>
            );
          })}
        </div>
        <div className="space-y-6">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="pl-10 pr-4 py-3 bg-surface-container-low border-0 outline-none rounded-full w-full text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary transition-all text-body-md"
              placeholder="Search premium staples..."
              type="text"
            />
          </div>
          <p className="text-center text-label-sm text-on-surface-variant font-medium">
            ARIHANT | Cultivating Purity Since 1984
          </p>
        </div>
      </div>
    </header>
  );
}
