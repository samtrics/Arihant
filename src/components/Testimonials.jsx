import React from "react";

const testimonials = [];

export default function Testimonials() {
  return (
    <section className="py-stack-xl bg-surface-container-low overflow-hidden scroll-reveal">
      <div className="w-full px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-4">
            Voice of Trust
          </h2>
          <p className="text-on-surface-variant">
            Over 500,000 households choose Arihant every day.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-gutter">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant max-w-sm relative group"
            >
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container shadow-md">
                <span className="material-symbols-outlined">format_quote</span>
              </div>
              <div className="flex gap-1 mb-4 text-secondary">
                {[...Array(t.stars)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="italic text-on-surface mb-8">{t.text}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    className="w-full h-full object-cover"
                    alt={t.imgAlt}
                    src={t.imgSrc}
                  />
                </div>
                <div>
                  <h5 className="font-bold text-primary">{t.name}</h5>
                  <p className="text-label-sm text-on-surface-variant">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
