import React from "react";

const testimonials = [
  {
    id: 1,
    stars: 5,
    text: `"The quality of Arihant Atta is unparalleled. My rotis are softer than ever, and I feel good knowing it's 100% pure wheat with no additives."`,
    name: "Anjali Sharma",
    location: "Homemaker, Delhi",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVfddR4PUg2x5sTwxnbOMGVlkjWpgan-PxjpFqrugkPsSxp-SJv7IRleCvSLPj-UrOVcJLIsSpF1a5MhV2kL_SySgplL4jzwK-t4JJDzQgzcW8ArzAsSy7K1_eisHUsQgLg5hFb-gyCbLitAq-k9oHYhCqIt7Hr7Lf1hTIauCJ3jlDv8lldzOpija5L0l5zHC_SHvbr59WgP69qnixYkOC_1yeiDzUvu4lVgMEJT_rnMg816G5032ehTQebmkoWy1ggScYv-uFKvg",
    imgAlt: "Portrait of a satisfied Indian female consumer in a modern minimalist home setting. She is smiling naturally, conveying trust and happiness. The background is softly blurred with warm lighting, creating a high-quality, professional testimonial aesthetic for a food brand.",
  },
  {
    id: 2,
    stars: 5,
    text: `"As a health-conscious person, I swear by Arihant Daliya. The cleaning is perfect, and the golden grains cook up so beautifully every morning."`,
    name: "Rajiv Mehta",
    location: "Fitness Enthusiast, Mumbai",
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXEgTHgmsB1RcPRwRNuwtReMcP3ZmprVDCiJBR9iNJrw694qlUnkvtincsVFJMhPwcZxlKy7OCnHbbYxkrrcDFWJ-hPPrq11SwAKgh-kWcyP_qXk9YU5qMZVM1y-KtnS5P939wPjhUSZ86y43MZG8j0LgeZwAHRATRQN5T8mkrBScUfT62y1d23q_GEd_B2tYUR-IkHymj7ec86WkM3zq-D5-ATrfo-5gugasiFxR39rVdggN7AsvyMNTE8TW0YQeGWehNfqdnwOM",
    imgAlt: "Professional portrait of a middle-aged Indian man with a warm, confident expression. The lighting is studio-quality and clean, focusing on a sense of reliable consumer trust. Minimalist background with high-key lighting to match the modern corporate UI design system.",
  },
];

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
