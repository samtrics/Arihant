import React from "react";

export default function Hero({ onNavigate }) {
  return (
    <section className="relative bg-background overflow-hidden min-h-[640px] flex items-center">
      <div className="grain-overlay"></div>
      <div className="w-full px-margin-mobile md:px-margin-desktop grid grid-cols-12 items-center gap-gutter py-stack-xl">
        <div className="col-span-12 lg:col-span-6 z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-full">
              Sourced from Heritage Farms
            </span>
            <div className="h-px w-12 bg-outline-variant"></div>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary mb-6 leading-tight">
            Purity in Every <br /> <span className="italic text-secondary">Golden Grain</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-lg">
            Bringing the rich legacy of Indian agriculture to your kitchen. Arihant staples are
            double-cleaned, hygienically packed, and nutrient-dense.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <button onClick={() => onNavigate('products')} className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:shadow-lg transition-all active:scale-95 text-center">
              Explore Collection
            </button>
            <button onClick={() => onNavigate('contact')} className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-all text-center">
              Bulk Inquiry
            </button>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 relative h-full flex justify-start lg:justify-end mt-12 lg:mt-0 w-full">
          <div className="relative w-full max-w-md aspect-square bg-secondary-fixed opacity-10 rounded-full blur-3xl absolute -right-20 -top-20"></div>
          <div className="relative z-10 flex gap-2 md:gap-0 md:-space-x-6 lg:space-x-4 w-full md:w-auto items-end justify-start md:justify-center">
            <div className="shrink-0 z-10 bg-surface-container-lowest p-2 md:p-4 rounded-xl border border-outline-variant shadow-sm md:-rotate-6 transform hover:rotate-0 transition-all duration-500 w-24 md:w-48">
              <img
                className="w-full h-32 md:h-64 object-cover rounded-lg shadow-inner"
                alt="Close up studio shot of a premium packaging bag of Arihant Daliya with golden wheat graphics on a clean white minimalist background. The lighting is soft and bright, emphasizing a high-end FMCG grocery aesthetic. Natural wheat grains are scattered artistically around the base of the bag, creating a professional food photography vibe."
                src="/assets/images/hero-daliya.webp"
              />
              <p className="font-label-md mt-1 md:mt-3 text-center text-[10px] md:text-base truncate">Daliya</p>
            </div>
            <div className="shrink-0 z-30 bg-surface-container-lowest p-2 md:p-4 rounded-xl border border-outline-variant shadow-md md:scale-110 hover:-translate-y-4 transition-all duration-500 w-28 md:w-56">
              <img fetchpriority="high"
                className="w-full h-40 md:h-72 object-cover rounded-lg shadow-inner"
                alt="A premium high-fidelity package of Arihant Atta positioned centrally on a cream white background with a subtle wheat grain texture overlay. The packaging features elegant typography and a deep green brand color. The lighting is soft-key and editorial, showcasing the fine texture of the whole wheat flour. The overall mood is professional, clean, and organic."
                src="/assets/images/hero-atta.webp"
              />
              <p className="font-label-md mt-1 md:mt-3 text-center text-primary font-bold text-[10px] md:text-base truncate">Chakki Atta</p>
            </div>
            <div className="shrink-0 z-20 bg-surface-container-lowest p-2 md:p-4 rounded-xl border border-outline-variant shadow-sm md:rotate-6 transform hover:rotate-0 transition-all duration-500 w-24 md:w-48">
              <img
                className="w-full h-32 md:h-64 object-cover rounded-lg shadow-inner"
                alt="Studio food photography of Arihant Besan packaging against a minimalist cream background. The bag is neatly arranged with vibrant yellow flour accents around it. The visual style is modern Indian retail, highlighting purity and traditional trust through contemporary design. High-key lighting creates a fresh and premium look suitable for a luxury FMCG brand."
                src="/assets/images/hero-besan.webp"
              />
              <p className="font-label-md mt-1 md:mt-3 text-center text-[10px] md:text-base truncate">Besan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
