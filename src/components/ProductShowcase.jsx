import React from "react";

export default function ProductShowcase({ products, onProductClick, onNavigate }) {
  const showcaseProducts = products.filter((p) => (p.bestseller || p.featured) && p.status !== "inactive").slice(0, 5);
  return (
    <section id="products-showcase" className="py-stack-xl bg-surface relative scroll-reveal">
      <div className="w-full px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0 mb-8 md:mb-12">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">
              Our Pure Staples
            </h2>
            <p className="text-on-surface-variant">
              The foundation of every healthy Indian meal.
            </p>
          </div>
          <button onClick={() => onNavigate('products')} className="flex items-center gap-2 text-primary font-label-md hover:underline w-full md:w-auto justify-center md:justify-end border border-primary md:border-none p-3 md:p-0 rounded-lg md:rounded-none">
            View All Products{" "}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-gutter">
          {showcaseProducts.map((product) => {
            const cardClasses = product.bestseller
              ? "group bg-surface-container-lowest border border-outline-variant rounded-xl p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden scale-105 shadow-md border-primary/20 cursor-pointer"
              : "group bg-surface-container-lowest border border-outline-variant rounded-xl p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer";

            return (
              <div key={product.id} className={cardClasses} onClick={() => onProductClick && onProductClick(product)}>
                {product.bestseller && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-primary text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold">
                      Bestseller
                    </span>
                  </div>
                )}
                <div className="wheat-texture absolute inset-0"></div>
                <div className="aspect-square bg-surface-container-low rounded-lg mb-4 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={product.imgAlt}
                    src={product.imgSrc}
                  />
                </div>
                <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest">
                  {product.tag}
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface mt-1">
                  {product.name}
                </h3>
                <p className="text-label-sm text-on-surface-variant mb-4">
                  {product.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">
                    ₹{product.price} {product.weight && <span className="text-xs text-outline font-normal">/ {product.weight}</span>}
                  </span>
                  <button 
                    className="bg-secondary-fixed text-on-secondary-fixed px-3 py-2 rounded-lg hover:bg-secondary-container transition-colors active:scale-90"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="material-symbols-outlined">
                      {product.icon || "add_shopping_cart"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
