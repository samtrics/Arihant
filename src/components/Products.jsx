import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const categories = [
  "All",
  "Flours (Atta)",
  "Grains & Pulses",
  "Spices (Masala)",
  "Roasted Daliya",
  "Rice Varieties"
];

export default function Products({ products, onNavigate, onProductClick, initialSearchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filters, setFilters] = useState({
    organic: false,
    heritage: false,
    bulk: false
  });
  const [sortBy, setSortBy] = useState("Featured First");
  const [dummyPage, setDummyPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const { addToCart } = useCart();

  React.useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const handleFilterToggle = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filter products based on search bar, category, and checkboxes
  const filteredProducts = products.filter((product) => {
    if (product.status === "inactive") return false;

    // 0. Search Query Matching
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name?.toLowerCase().includes(q);
      const matchDesc = product.desc?.toLowerCase().includes(q);
      const matchTags = Array.isArray(product.tags) ? product.tags.some(t => t.toLowerCase().includes(q)) : false;
      const matchTag = product.tag?.toLowerCase().includes(q);
      const matchPrice = product.price?.toString().includes(q);
      
      if (!matchName && !matchDesc && !matchTags && !matchTag && !matchPrice) {
        return false;
      }
    }

    // 1. Category Matching
    if (selectedCategory !== "All") {
      if (selectedCategory === "Flours (Atta)") {
        // Show products of category "Flours (Atta)" and Roasted Daliya to perfectly match product.html's default 6 flours/staples layout!
        if (product.category !== "Flours (Atta)" && product.name !== "Roasted Daliya") {
          return false;
        }
      } else if (product.category !== selectedCategory) {
        return false;
      }
    }

    // 2. Attribute checkbox filters
    if (filters.organic && !product.organic) return false;
    if (filters.heritage && !product.heritage) return false;
    if (filters.bulk && !product.bulk) return false;

    return true;
  });

  // Calculate active filter count
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") {
      return a.price - b.price;
    }
    if (sortBy === "Newest Arrivals") {
      return b.id - a.id;
    }
    // Featured First
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <div className="page-transition">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl flex flex-col lg:flex-row gap-gutter">
        {/* Sidebar Filters (Desktop only) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-stack-lg">
            <div>
              <h3 className="font-headline-md text-headline-md text-primary mb-stack-md">Categories</h3>
              <ul className="space-y-stack-sm">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-label-md text-label-md transition-all ${
                          isSelected
                            ? "bg-primary-container text-on-primary-container"
                            : "text-on-surface-variant hover:bg-surface-container-high"
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="pt-stack-lg border-t border-outline-variant">
              <h3 className="font-headline-md text-headline-md text-primary mb-stack-md">Filter By</h3>
              <div className="space-y-stack-md">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.organic}
                    onChange={() => handleFilterToggle("organic")}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-body-md group-hover:text-primary transition-colors">Organic Certified</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.heritage}
                    onChange={() => handleFilterToggle("heritage")}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-body-md group-hover:text-primary transition-colors">Heritage Series</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.bulk}
                    onChange={() => handleFilterToggle("bulk")}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-body-md group-hover:text-primary transition-colors">Bulk Packs</span>
                </label>
              </div>
            </div>
            <div className="bg-secondary-container p-6 rounded-xl relative overflow-hidden">
              <div className="texture-overlay absolute inset-0"></div>
              <p className="font-headline-md text-headline-md text-on-secondary-container mb-2">Bulk Inquiry</p>
              <p className="text-label-md text-on-secondary-container/80 mb-4">
                Planning for commercial orders? Get specialized pricing.
              </p>
              <button onClick={() => onNavigate('contact')} className="w-full py-2 bg-on-secondary-container text-white rounded-lg font-label-md transition-transform active:scale-95">
                Contact Sales
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid section */}
        <section className="flex-1">
          {/* Header text and responsive sorting dropdown */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-stack-lg">
            <div>
              <h1 className="font-display-lg text-display-lg text-primary">Flours &amp; Staples</h1>
              <p className="text-body-lg text-on-surface-variant max-w-2xl">
                Sourced directly from the fertile heartlands of India, our flours represent the pinnacle of purity and
                traditional milling excellence.
              </p>
            </div>

            {/* Controls Bar for filters/sort */}
            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto text-label-md border-t border-b md:border-none py-2 md:py-0 border-outline-variant">
              {/* Mobile Filter Trigger Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-primary font-semibold rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Local Search Input */}
              <div className="relative hidden md:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/70 text-sm">search</span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-9 pr-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary w-48"
                />
              </div>

              {/* Sorting Select Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-outline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none font-semibold text-primary focus:ring-0 cursor-pointer"
                >
                  <option value="Featured First">Featured First</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Newest Arrivals">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Categories Swiper (Horizontal Scroll) */}
          <div className="lg:hidden mb-6 overflow-x-auto scrollbar-none flex gap-2 pb-2 border-b border-outline-variant/30">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                  }}
                  className={`whitespace-nowrap px-4 py-2 rounded-full font-label-md text-label-md transition-all ${
                    isSelected
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Mobile Collapsible Filters Accordion */}
          {isMobileFiltersOpen && (
            <div className="lg:hidden mb-6 p-6 bg-surface-container-low/95 backdrop-blur-md rounded-2xl border border-outline-variant space-y-6 animate-slide-in">
              <div>
                <div className="mb-4 relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/70 text-sm">search</span>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <h3 className="font-headline-md text-headline-sm text-primary mb-4">Filter Products</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleFilterToggle("organic")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full font-label-md transition-colors ${
                      filters.organic
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {filters.organic ? "check_box" : "check_box_outline_blank"}
                    </span>
                    <span>Organic Certified</span>
                  </button>
                  <button
                    onClick={() => handleFilterToggle("heritage")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full font-label-md transition-colors ${
                      filters.heritage
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {filters.heritage ? "check_box" : "check_box_outline_blank"}
                    </span>
                    <span>Heritage Series</span>
                  </button>
                  <button
                    onClick={() => handleFilterToggle("bulk")}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full font-label-md transition-colors ${
                      filters.bulk
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {filters.bulk ? "check_box" : "check_box_outline_blank"}
                    </span>
                    <span>Bulk Packs</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-secondary-container/40 p-5 rounded-xl relative overflow-hidden">
                <div className="texture-overlay absolute inset-0"></div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="font-headline-md text-[18px] text-on-secondary-container mb-1">Bulk Inquiry</p>
                    <p className="text-label-sm text-on-secondary-container/85">
                      Planning for commercial orders? Get specialized pricing.
                    </p>
                  </div>
                  <button onClick={() => onNavigate('contact')} className="w-full sm:w-auto px-5 py-2.5 bg-on-secondary-container text-white rounded-lg font-label-md transition-transform active:scale-95 text-center whitespace-nowrap">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="product-card-hover relative group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
                onClick={() => onProductClick && onProductClick(product)}
              >
                {product.brandTag && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-bold animate-fade-in">
                      {product.brandTag}
                    </span>
                  </div>
                )}
                <div className="aspect-square bg-surface-container-low overflow-hidden">
                  <img loading="lazy"
                    alt={product.imgAlt}
                    className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-700"
                    data-alt={product.dataAlt}
                    src={product.imgSrc}
                  />
                </div>
                <div className="p-stack-md relative">
                  <div className="texture-overlay absolute inset-0 opacity-10"></div>
                  <p className="text-label-sm text-secondary font-bold tracking-widest mb-1">{product.tag}</p>
                  <h4 className="font-headline-md text-headline-md text-on-surface mb-2">{product.name}</h4>
                  <p className="text-label-sm text-on-surface-variant mb-4">{product.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display-sm text-2xl text-primary font-bold">
                      ₹{product.price.toFixed(2)}{" "}
                      {product.weight && <span className="text-label-sm text-outline font-normal">/ {product.weight}</span>}
                    </span>
                    <button 
                      className="bg-primary text-white p-3 rounded-full hover:bg-primary-container transition-colors flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                    >
                      <span className="material-symbols-outlined" data-icon="add_shopping_cart">
                        add_shopping_cart
                      </span>
                    </button>
                  </div>
                </div>
                {product.featured && (
                  <div className="add-to-cart-overlay absolute inset-0 bg-primary/90 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center pointer-events-none group-hover:pointer-events-auto">
                    <p className="text-white font-headline-md mb-4">{product.overlayTitle}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                      className="w-full py-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold hover:scale-105 transition-transform"
                    >
                      Add to Cart
                    </button>
                    {product.hasDetails && (
                      <button className="mt-4 text-white text-label-md hover:underline">Product Details</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-stack-xl flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <button
              onClick={() => setDummyPage((p) => Math.max(p - 1, 1))}
              className="p-2 border border-outline-variant rounded-full text-outline hover:bg-surface-container hover:text-primary transition-all flex-shrink-0"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              <button
                onClick={() => setDummyPage(1)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all ${
                  dummyPage === 1 ? "bg-primary text-white" : "border border-outline-variant hover:bg-surface-container"
                }`}
              >
                1
              </button>
              <button
                onClick={() => setDummyPage(2)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all ${
                  dummyPage === 2 ? "bg-primary text-white" : "border border-outline-variant hover:bg-surface-container"
                }`}
              >
                2
              </button>
              <button
                onClick={() => setDummyPage(3)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all ${
                  dummyPage === 3 ? "bg-primary text-white" : "border border-outline-variant hover:bg-surface-container"
                }`}
              >
                3
              </button>
              <span className="px-2">...</span>
              <button
                onClick={() => setDummyPage(12)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all ${
                  dummyPage === 12 ? "bg-primary text-white" : "border border-outline-variant hover:bg-surface-container"
                }`}
              >
                12
              </button>
            </div>
            <button
              onClick={() => setDummyPage((p) => (p === 12 ? 1 : p === 3 ? 12 : p + 1))}
              className="p-2 border border-outline-variant rounded-full text-outline hover:bg-surface-container hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
