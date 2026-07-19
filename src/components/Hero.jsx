import React from "react";

export default function Hero({ onNavigate }) {
  return (
    <section className="relative bg-background flex items-center pt-2 pb-10 md:py-16 lg:py-6 overflow-hidden">
      <div className="grain-overlay absolute inset-0 pointer-events-none"></div>
      <div className="w-full px-margin-mobile md:px-margin-desktop grid grid-cols-12 items-center gap-6 md:gap-gutter relative z-10">
        <div className="col-span-12 md:col-span-6 z-10 text-center md:text-left flex flex-col items-center md:items-start mt-2 md:mt-0">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container font-label-sm text-xs md:text-label-sm rounded-full border border-secondary/20 shadow-sm">
              Sourced from Heritage Farms
            </span>
            <div className="hidden lg:block h-px w-12 bg-outline-variant"></div>
          </div>
          <h1 className="font-display-lg text-4xl sm:text-5xl md:text-4xl lg:text-display-lg text-primary mb-2 md:mb-4 leading-[1.1] tracking-tight">
            Purity in Every <br className="hidden sm:block" /> <span className="italic text-secondary">Golden Grain</span>
          </h1>
          <p className="font-body-lg text-sm sm:text-[1.05rem] leading-relaxed md:text-sm lg:text-body-lg text-on-surface-variant mb-5 md:mb-6 max-w-lg px-2 md:px-0">
            Bringing the rich legacy of Indian agriculture to your kitchen. Arihant staples are
            double-cleaned, hygienically packed, and nutrient-dense.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap w-full sm:w-auto gap-3 sm:gap-4 justify-center md:justify-start mt-4 md:mt-2">
            <button onClick={() => onNavigate('products')} className="w-full sm:w-auto px-8 py-3.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:shadow-lg transition-all active:scale-95 text-center shadow-md">
              Explore Collection
            </button>
            <button onClick={() => onNavigate('contact')} className="w-full sm:w-auto px-8 py-3.5 bg-transparent border-2 border-primary text-primary rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-all text-center">
              Bulk Inquiry
            </button>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 relative flex justify-center md:justify-end mt-8 md:mt-0 w-full px-2 pb-10 md:pb-0">
          <div className="relative w-full max-w-md aspect-square bg-secondary-fixed opacity-10 rounded-full blur-3xl absolute -right-10 -top-10 md:-right-20 md:-top-20"></div>
          
          <div className="relative z-10 flex -space-x-12 md:-space-x-10 lg:-space-x-6 w-full justify-center md:justify-end lg:justify-end items-center">
            
            {/* Left Card */}
            <div className="shrink-0 z-10 bg-surface-container-lowest p-3 md:p-3 lg:p-4 rounded-xl border border-outline-variant shadow-md -rotate-6 transform hover:rotate-0 hover:z-40 hover:-translate-y-2 transition-all duration-500 w-[130px] sm:w-[150px] md:w-36 lg:w-48 translate-y-4 md:translate-y-6 lg:translate-y-4">
              <img
                className="w-full aspect-[3/4] object-cover rounded-lg shadow-inner"
                alt="Arihant Daliya"
                src="/assets/images/hero-daliya.webp"
              />
              <p className="font-label-md mt-2 md:mt-2 lg:mt-3 text-center text-[10px] md:text-[10px] lg:text-sm truncate text-on-surface">Daliya</p>
            </div>
            
            {/* Center Card */}
            <div className="shrink-0 z-30 bg-surface-container-lowest p-3.5 md:p-3 lg:p-4 rounded-2xl border border-outline-variant shadow-2xl hover:-translate-y-4 transition-all duration-500 w-[150px] sm:w-[170px] md:w-44 lg:w-56 -mt-4 md:-mt-6 lg:-mt-4">
              <img fetchpriority="high"
                className="w-full aspect-[3/4] object-cover rounded-lg shadow-inner"
                alt="Arihant Chakki Atta"
                src="/assets/images/hero-atta.webp"
              />
              <p className="font-label-md mt-2 md:mt-2 lg:mt-3 text-center text-primary font-bold text-[11px] md:text-[11px] lg:text-base truncate">Chakki Atta</p>
            </div>
            
            {/* Right Card */}
            <div className="shrink-0 z-20 bg-surface-container-lowest p-3 md:p-3 lg:p-4 rounded-xl border border-outline-variant shadow-md rotate-6 transform hover:rotate-0 hover:z-40 hover:-translate-y-2 transition-all duration-500 w-[130px] sm:w-[150px] md:w-36 lg:w-48 translate-y-4 md:translate-y-6 lg:translate-y-4">
              <img
                className="w-full aspect-[3/4] object-cover rounded-lg shadow-inner"
                alt="Arihant Besan"
                src="/assets/images/hero-besan.webp"
              />
              <p className="font-label-md mt-2 md:mt-2 lg:mt-3 text-center text-[10px] md:text-[10px] lg:text-sm truncate text-on-surface">Besan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
