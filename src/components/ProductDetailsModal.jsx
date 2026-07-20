import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "./SEO";

export default function ProductDetailsModal({ product, onClose, onCategorySelect }) {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    // Prevent scrolling on body when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!product) return null;

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const currentPrice = product.offerPrice ? product.offerPrice : product.price;
  const images = product.images && product.images.length > 0 ? product.images : (product.imgSrc ? [product.imgSrc] : []);

  // Auto slideshow effect like Amazon
  useEffect(() => {
    if (images.length <= 1 || isHovering) return;
    
    const intervalId = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    
    return () => clearInterval(intervalId);
  }, [images.length, isHovering]);

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": images,
    "description": product.desc,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brandTag || "Arihant"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": currentPrice,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <SEO 
        title={product.name} 
        description={product.desc} 
        image={images[0] || product.imgSrc} 
        schemaMarkup={schemaMarkup} 
      />
      <div 
        className="relative w-full max-w-4xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button aria-label="close" 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high/60 hover:bg-surface-container-highest text-on-surface backdrop-blur-md transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Image Section */}
        <div 
          className="w-full md:w-1/2 bg-surface-container-low relative flex-shrink-0 flex flex-col"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="w-full aspect-[3/4] relative overflow-hidden flex items-center justify-center">
            <div className="texture-overlay absolute inset-0 opacity-20 pointer-events-none z-10"></div>
            {product.brandTag && (
              <div className="absolute top-6 left-6 z-20">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-bold shadow-sm">
                  {product.brandTag}
                </span>
              </div>
            )}
            
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImageIndex}
                loading="lazy" 
                src={images[activeImageIndex] || product.imgSrc} 
                alt={product.imgAlt || product.name} 
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto bg-surface-container-lowest border-t border-outline-variant/30 scrollbar-none relative z-20">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-primary scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
          <div className="mb-6">
            <span 
              className="text-label-sm text-secondary font-bold tracking-widest uppercase mb-2 block cursor-pointer hover:underline w-max"
              onClick={() => {
                if (onCategorySelect) onCategorySelect(product.category || product.tag || "All");
              }}
            >
              {product.category || product.tag}
            </span>
            <h2 className="font-display-sm text-display-sm text-primary mb-2">
              {product.name}
            </h2>
            <div className="flex items-center gap-3 text-label-md text-on-surface-variant">
              <span>SKU: <span className="font-mono text-outline">{product.sku}</span></span>
              <span>•</span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">
                {product.weight}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-end gap-3 mb-2">
              <span className="font-display-sm text-[32px] text-primary font-bold leading-none">
                ₹{Number(currentPrice).toFixed(2)}
              </span>
              {product.offerPrice && (
                <span className="text-outline line-through text-lg mb-1">
                  ₹{Number(product.price).toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-label-sm text-on-surface-variant">Inclusive of all taxes</p>
          </div>

          <div className="mb-8 flex-1">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">About this product</h3>
            <p className="text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap">
              {product.desc}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags && product.tags.map(t => (
                <span key={t} className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs uppercase tracking-wide font-bold">
                  {t}
                </span>
              ))}
              {product.organic && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs uppercase tracking-wide font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">eco</span> Organic
                </span>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-6 border-t border-outline-variant mt-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden h-[48px]">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-surface-container text-primary transition-colors font-bold text-lg"
                >-</button>
                <input 
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) {
                      setQuantity(val);
                    }
                  }}
                  className="px-2 font-bold text-on-surface w-16 text-center bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded hide-number-arrows"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-surface-container text-primary transition-colors font-bold text-lg"
                >+</button>
              </div>
              <button 
                onClick={() => {
                  addToCart(product, quantity);
                  onClose();
                }}
                className={`flex-1 h-[48px] rounded-lg font-bold flex items-center justify-center gap-2 transition-transform ${
                  product.stock !== undefined && product.stock <= 0 
                    ? "bg-surface-container-high text-outline cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-container active:scale-[0.98]" 
                }`}
                disabled={product.stock !== undefined && product.stock <= 0}
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                {product.stock !== undefined && product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
            
            {product.stock <= 0 && (
              <p className="text-red-500 text-sm font-bold mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">error</span> Currently Out of Stock
              </p>
            )}
            {product.stock > 0 && product.stock < 50 && (
              <p className="text-amber-600 text-sm font-bold mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">warning</span> Only {product.stock} left in stock!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
