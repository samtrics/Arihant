import React from "react";

const promises = [
  {
    id: 1,
    icon: "verified",
    iconClasses: "w-16 h-16 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container mx-auto mb-6",
    title: "Double Cleaned",
    desc: "Our grains undergo rigorous cleaning processes to remove every impurity.",
  },
  {
    id: 2,
    icon: "eco",
    iconClasses: "w-16 h-16 bg-secondary-fixed rounded-full flex items-center justify-center text-on-secondary-fixed mx-auto mb-6",
    title: "100% Organic",
    desc: "Sourced directly from certified farms that respect the earth.",
  },
  {
    id: 3,
    icon: "sanitizer",
    iconClasses: "w-16 h-16 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container mx-auto mb-6",
    title: "Hygienic Packing",
    desc: "Untouched by hands, our automated facility ensures zero contamination.",
  },
  {
    id: 4,
    icon: "nutrition",
    iconClasses: "w-16 h-16 bg-secondary-fixed rounded-full flex items-center justify-center text-on-secondary-fixed mx-auto mb-6",
    title: "Nutrient Dense",
    desc: "Slow-grinding process preserves the natural fiber and nutrients.",
  },
];

export default function Promise() {
  return (
    <section className="py-stack-xl bg-surface-container-low scroll-reveal">
      <div className="w-full px-margin-mobile md:px-margin-desktop text-center">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-4">
          The Arihant Promise
        </h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto mb-16">
          We combine traditional wisdom with modern technology to ensure the highest
          standards of food safety and nutrition.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
          {promises.map((p) => (
            <div
              key={p.id}
              className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant hover:-translate-y-2 transition-transform duration-300"
            >
              <div className={p.iconClasses}>
                <span className="material-symbols-outlined text-3xl" data-icon={p.icon}>
                  {p.icon}
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-3 text-primary">
                {p.title}
              </h3>
              <p className="text-label-md text-on-surface-variant">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
