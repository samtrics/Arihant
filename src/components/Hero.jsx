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
        <div className="col-span-12 lg:col-span-6 relative h-full flex justify-center lg:justify-end mt-12 lg:mt-0 w-full">
          <div className="relative w-full max-w-md aspect-square bg-secondary-fixed opacity-10 rounded-full blur-3xl absolute -right-20 -top-20"></div>
          <div className="relative z-10 grid grid-cols-3 gap-2 w-full md:flex md:gap-0 md:-space-x-6 lg:space-x-4 md:items-end md:justify-center">
            <div className="col-span-1 bg-surface-container-lowest p-2 md:p-4 rounded-xl border border-outline-variant shadow-sm md:-rotate-6 transform hover:rotate-0 transition-all duration-500 w-full md:w-48 flex flex-col justify-end">
              <img
                className="w-full aspect-[3/4] md:h-64 object-cover rounded-lg shadow-inner"
                alt="Close up studio shot of a premium packaging bag of Arihant Daliya with golden wheat graphics on a clean white minimalist background. The lighting is soft and bright, emphasizing a high-end FMCG grocery aesthetic. Natural wheat grains are scattered artistically around the base of the bag, creating a professional food photography vibe."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSOZ3nwfNCH7HJ8PiW_ZSJPaI83wHM9Lo0g78L4S54TIWJ-Qj4G1cORcigHTq36gl2BAWDAjPJUUrkJ39782YaxOf8y71Rr3na7bNjYwzwDR_cS5-KD-PjGXysPq2pRQoDgvjRqAZ6PZae_uvEKI36Xz3o_3dTt2Fm1QHPwC0ql1c7iby3w4uKaHoXiZxmXdyhZkTzPByXRRMqWfU5xiI4dTN7FoZwMF_Jee8e6X4b83YUDwRDmqPahsoRwZNVyL_tpRmyIB7va0A"
              />
              <p className="font-label-md mt-2 md:mt-3 text-center text-xs md:text-base truncate">Daliya</p>
            </div>
            <div className="col-span-1 bg-surface-container-lowest p-2 md:p-4 rounded-xl border border-outline-variant shadow-md md:scale-110 hover:-translate-y-4 transition-all duration-500 w-full md:w-56 flex flex-col justify-end">
              <img
                className="w-full aspect-[3/4] md:h-72 object-cover rounded-lg shadow-inner"
                alt="A premium high-fidelity package of Arihant Atta positioned centrally on a cream white background with a subtle wheat grain texture overlay. The packaging features elegant typography and a deep green brand color. The lighting is soft-key and editorial, showcasing the fine texture of the whole wheat flour. The overall mood is professional, clean, and organic."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBojOZe1ST9XQ8Jg84wbJF-BqyK1iiDP7uEAn8abGPTuGQRpYmIKTnTKIbSy-Y7c0QQDLLnmpw-ByAoNMMC8fq5TrFG-j1iH_zPkWvwj_DVXxrdjXj_vGyAqCco4SWjnkjVWTDQFYcKBNxV8A5v6rOXvDx7QZAUhY9_VKdvTzAVmeQhHvd6ZKKF-oThUEv-yeNqa9OrGcy81CYwHt7huaGsNU5XvgU73LIoKa2uZrW3QxKsPmf79pa4KFVBjrZo2LQCjgYb_cAa2UQ"
              />
              <p className="font-label-md mt-2 md:mt-3 text-center text-primary font-bold text-[10px] md:text-base leading-tight">Chakki Atta</p>
            </div>
            <div className="col-span-1 bg-surface-container-lowest p-2 md:p-4 rounded-xl border border-outline-variant shadow-sm md:rotate-6 transform hover:rotate-0 transition-all duration-500 w-full md:w-48 flex flex-col justify-end">
              <img
                className="w-full aspect-[3/4] md:h-64 object-cover rounded-lg shadow-inner"
                alt="Studio food photography of Arihant Besan packaging against a minimalist cream background. The bag is neatly arranged with vibrant yellow flour accents around it. The visual style is modern Indian retail, highlighting purity and traditional trust through contemporary design. High-key lighting creates a fresh and premium look suitable for a luxury FMCG brand."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmkPU99blJd00i52f0Bv1aSUvFkI6cDsej2iCDSGwTYq6idHWOB74ccR6WGSWhwazqj_kdnXNd6n9pQpnm8G2fs4v5t1qpSyMRjQ98P6qgHeijfrKPQrn-evroe9ce4hOXqM7y0FpD8YJwu6piR0feHQ0m6l7QkLN6-BIKo38AFdqy-D3OFcr7z6oF8NFoRIEj8GcTiHT9bZXanAszOtYKhR9K9s5MWk0hCIiQYF9IdccvgOgN0R6CEfC3hOGFZISM6uJGKvPnPKc"
              />
              <p className="font-label-md mt-2 md:mt-3 text-center text-xs md:text-base truncate">Besan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
