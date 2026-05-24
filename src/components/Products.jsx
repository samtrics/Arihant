import React, { useState } from "react";

const productsData = [
  {
    id: 1,
    name: "Sharbati Atta",
    category: "Flours (Atta)",
    tag: "PREMIUM WHEAT",
    desc: "Stone-ground, 100% Whole Wheat from Sehore",
    price: 549.00,
    unit: "5kg",
    brandTag: "HERITAGE GOLD",
    featured: true,
    overlayTitle: "Purely Sourced, Freshly Packed",
    hasDetails: true,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFlXi6HM0fZPoImdBCxmwfUUVxmyOoErebMN2pWSCYkW2pIHEV9qt56AjLKYXHO3Ax8ygC-ilWK-tSgH14n1oynPDSQce4kWfiUp3glpd8bC5JrMKL6KSXq_SGh8Mj91fV781JMSxKiuMSkd3AuZ3YlrPlYeJG4Lm_2x-C86VFoinEL1-zrhvHjxVAusT3XomBbaNCjwlnamTf-u3mey3mKibDGMJwGWsQdakDt5qF155N-MSgf7xXAgrCkQqwrQph5QCZAiuY1DI",
    imgAlt: "Sharbati Atta",
    dataAlt: "A high-end editorial product shot of a premium Sharbati Atta flour sack, placed on a rustic wooden surface with a handful of golden wheat grains scattered around. The background is a soft, warm cream white with artistic soft-focus studio lighting. The aesthetic is clean, professional, and evocative of traditional Indian agricultural purity, utilizing a palette of deep greens and wheat gold.",
    organic: false,
    heritage: true,
    bulk: false
  },
  {
    id: 2,
    name: "Chana Besan",
    category: "Flours (Atta)",
    tag: "GRAM FLOUR",
    desc: "Triple-sieved for extra fine texture",
    price: 125.00,
    unit: "1kg",
    featured: true,
    overlayTitle: "The Secret to Perfect Snacks",
    hasDetails: false,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYlrFsgmD9lQFPpq2FUTquel45pepN70m1HPPr43zJzRObELoBCjVT21oVVSUaLOyr2-YVz_zI4qOkqJsHXoNwt8PGsLbyd6q4L3v7vGGDMrqC4O306dfSwKe5M_TjX9wSeFdhDvc6VaA2bMghFtnPkLvW1siGN29uRBZlM90jtiqOQJhSVjLdX2qfJWZRKsbjd5pf0V84srH5CKlmcV3FttTzF_HPIsno0HzSXwNZZ6ITfc6q7mmwdQfD3pjFoEWGWBUo__DLXOk",
    imgAlt: "Chana Besan",
    dataAlt: "A macro studio photograph of fine, yellow Chana Besan flour spilling from a ceramic bowl. Beside it are whole roasted chickpeas, all set against a minimalist cream background. The lighting is soft and bright, emphasizing the smooth texture of the flour and the earthy tones of the pulses. The design style is modern corporate FMCG, highlighting quality and nutritional density.",
    organic: false,
    heritage: true,
    bulk: false
  },
  {
    id: 3,
    name: "Roasted Daliya",
    category: "Roasted Daliya",
    tag: "HEALTH STAPLE",
    desc: "Slow-roasted broken wheat for wellness",
    price: 85.00,
    unit: "500g",
    featured: true,
    overlayTitle: "Nutritious Daily Breakfast",
    hasDetails: false,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7YHG5xGwLVNRidsIt-0Rac2nDzpCrSiPW6uXVGdN7SxEpj_DBPTZva00-U6UWq1TKaGW5Rahjigy6Q_vQO-WFVsHbW2SMgunKsHDFO3zieUzbxJwB2Qa4QINXYSfTns61K695ntnUiwCJH9SFpIrQL7fijv1-uXaoKkVIxrszM_zfU6ftE78p0WQg8c5sHwYJcmtP6QVgqcRIjreTOfaRIeQz7989v69f1HM1XIB2rv6Kw86_kCpXKqYrdOG4vVUcwsJKJnrCEUo",
    imgAlt: "Roasted Daliya",
    dataAlt: "A top-down editorial shot of golden roasted wheat daliya in a handcrafted wooden bowl. Natural daylight streams from the side, creating soft shadows that emphasize the granular texture of the daliya. The surrounding space is clean and minimalist, decorated with a small branch of wheat. The image has a calm, organic feeling, reinforcing the brand's message of modern Indian purity.",
    organic: false,
    heritage: true,
    bulk: false
  },
  {
    id: 4,
    name: "Premium Maida",
    category: "Flours (Atta)",
    tag: "REFINED FLOUR",
    desc: "Baking-grade, super-refined white flour",
    price: 65.00,
    unit: "1kg",
    featured: false,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUQlZgUtRPY21eJe44pA_jRVtSlm9DSGA199y3f8Dlrx-96iZcxqDPHrAFakPgFQQCntsp1Mn9uvTlYPRy3sw6IaOPHS5k5lO_OkjJLd241KWQmW3FBk3s2PAF0vbpZK2mhCbg2iYEMFp73zom3AjprWfsk-yJX_Y1kMzA0C79IIl6B2eml11EKWwzTaFgBxrwSgDatSisi-iv7jfSLW8uYDzfJAgAKFWVWtoWVElKuLLCV1yeJcqJYHRedkUtjAn4Igz3FcbxpNs",
    imgAlt: "Premium Maida",
    dataAlt: "An elegant presentation of pure white maida flour on a marble surface. Sifting tools are placed artistically in the background. The lighting is crisp and bright, creating a clean light-mode aesthetic. The focus is on the incredible fine texture and snowy whiteness of the flour, symbolizing purity and premium quality in high-end baking staples.",
    organic: false,
    heritage: true,
    bulk: false
  },
  {
    id: 5,
    name: "Multigrain Atta",
    category: "Flours (Atta)",
    tag: "HEALTH BLEND",
    desc: "9-Grain power blend for high fiber",
    price: 420.00,
    unit: "5kg",
    featured: false,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkYx8ICd9lnc23xJC6wHeeRUj4AZGOaz6GIWTjdlxox5LWaEkGkwR6ZfCzdkc53OA9wjER8H0uBWK7naWWk1hXFrlDz95HOYD1sk5vedfWkS5qFUAQY4dj6WFHmAL7CCWhcFPO0jLTFUcoWAdzdyTsE1wbviSgC9foVk0dIxCkmAgthWEtLqI9vDyPuvL3BHodI_zL00IcU2Lofw_AYzZfiLX5x3jiu0Mbx4x4JJNFZFyaVpI2io_i6TSxixosVWIAbVI5mVA6bnQ",
    imgAlt: "Multigrain Atta",
    dataAlt: "A diverse arrangement of different grains—oats, barley, corn, and soy—blending into a rich, textured multigrain flour. The composition is artistic and editorial, featuring a clean cream-white background with professional studio lighting. The color palette is earthy and wholesome, emphasizing the health benefits and varied nutritional sources of the product.",
    organic: true,
    heritage: true,
    bulk: false
  },
  {
    id: 6,
    name: "Missi Atta",
    category: "Flours (Atta)",
    tag: "TRADITIONAL",
    desc: "Gram & Wheat blend with aromatic spices",
    price: 180.00,
    unit: "1kg",
    featured: false,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9qcenzscxdgorF5458DN07v1c4dG5glxe24ngRVIzNmVwlQp-iwf9hOHeMNrDUeGUY8vdyp5hlpNE4ZLLkr1J5rSKEYTtMslVmEYIGh4s-ceqy3vl8xgw6TtMmUzXXkR8rQ3WUAjmaDBq2dnO8NxcFK0SUM9s5sZiDIneHkWq2TwJA9otXlD5dyKTXy-dGeCtebWKUkf44hU1u45N4T0V8lrl8fecsib-pY9bgxYES7Yye40emSBnAyWs-hdSi2i4Vwk_LZ0jNBg",
    imgAlt: "Missi Atta",
    dataAlt: "A warm, inviting studio photograph showcasing Missi Atta—a traditional blend of gram flour and wheat. The flour is presented in an earthen pot with fresh green chilies and spices nearby to suggest its culinary use. The lighting is soft and golden, creating a sense of heritage and authentic Indian flavor. The background remains a sophisticated, clean cream white.",
    organic: false,
    heritage: true,
    bulk: false
  }
];

const categories = [
  "All",
  "Flours (Atta)",
  "Grains & Pulses",
  "Spices (Masala)",
  "Roasted Daliya",
  "Rice Varieties"
];

export default function Products({ products, onNavigate, onProductClick }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filters, setFilters] = useState({
    organic: false,
    heritage: false,
    bulk: false
  });
  const [sortBy, setSortBy] = useState("Featured First");
  const [dummyPage, setDummyPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleFilterToggle = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filter products based on search bar, category, and checkboxes
  const filteredProducts = products.filter((product) => {
    if (product.status === "inactive") return false;

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
                  <img
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
                      onClick={(e) => e.stopPropagation()}
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
                    <button className="w-full py-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold hover:scale-105 transition-transform">
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
          <div className="mt-stack-xl flex items-center justify-center gap-4">
            <button
              onClick={() => setDummyPage((p) => Math.max(p - 1, 1))}
              className="p-2 border border-outline-variant rounded-full text-outline hover:bg-surface-container hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex items-center gap-2">
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
