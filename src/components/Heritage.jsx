import React from "react";

export default function Heritage({ onNavigate }) {
  return (
    <section className="py-stack-xl bg-surface scroll-reveal overflow-hidden relative">
      <div className="w-full px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-fixed opacity-20 rounded-full blur-2xl"></div>
          <div className="relative rounded-3xl overflow-hidden border-8 border-surface-container shadow-2xl">
            <img loading="lazy"
              className="w-full aspect-[4/5] object-cover"
              alt="Panoramic cinematic shot of a vast golden wheat field in rural India during the golden hour. The sun is setting on the horizon, casting a warm orange glow over the landscape. The photography is professional and evocative, highlighting the natural origins and heritage of Arihant products with a clean, high-end editorial feel."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAynP-BAfIiAW7j0nk60QX9YRKOpqmgQgjScojX-paTFXQrBaDsKIsp97MDanHyPiuCmFiZTgpQI-UWoFrxSInRxE7fDZcR6GxYp8L_zyQeA20xFlwrQANX2e-_fQmjJy8rHPXn1KGqmXarU2YMYPghvxoSdp-E61zE4ni_O-reHgMOPn5p7FYXJ2cYAYd-fzarn-0pY-PKuhI7SNbnGd-MXTuV-pPNE7EmTVRUh__78f2WQmevwXVwrdXO9nJKmxqIaOEKmY5N4kg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-8">
              <div className="text-white">
                <p className="text-display-lg font-display-lg">30+</p>
                <p className="text-label-md font-label-md">Years of Agricultural Legacy</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className="text-secondary font-label-md tracking-widest uppercase mb-4 block">
            Our Story
          </span>
          <h2 className="font-display-lg text-display-lg text-primary mb-6">
            A Heritage of Pure <br /> Commitment
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
            The Arihant journey began in the fertile plains of India, where we recognized
            the need for staples that didn't just fill stomachs, but nourished souls. We
            believe that the purest food comes from a place of respect—for the farmer,
            the land, and the consumer.
          </p>
          <div className="space-y-6 mb-10">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <div>
                <h4 className="font-headline-md text-body-lg font-bold text-primary">
                  Direct Farmer Sourcing
                </h4>
                <p className="text-on-surface-variant">
                  Eliminating middlemen to ensure the freshest crop reach your home.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <div>
                <h4 className="font-headline-md text-body-lg font-bold text-primary">
                  State-of-the-Art Milling
                </h4>
                <p className="text-on-surface-variant">
                  Cold-press milling technology that retains every bit of natural
                  goodness.
                </p>
              </div>
            </div>
          </div>
          <button onClick={() => onNavigate('about')} className="px-8 py-4 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-opacity-90 transition-all">
            Read Full Story
          </button>
        </div>
      </div>
    </section>
  );
}
