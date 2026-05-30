import React from "react";

export default function About({ onNavigate }) {
  return (
    <div className="relative w-full overflow-hidden page-transition">
      <div className="grain-overlay"></div>

      {/* Hero Section */}
      <section className="relative h-[640px] md:h-[819px] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-40">
          <img loading="lazy"
            className="w-full h-full object-cover animate-fade-in duration-1000"
            alt="A cinematic, wide-angle landscape shot of lush green wheat fields swaying gently under a golden sunset. The lighting is ethereal and warm, emphasizing the organic and pure origins of Arihant staples."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwkqp22XvRBrZyQtYr77Xj0qbJmbj5-nxVI1rcd_d16Z6GmCu_dudYeBZLKx-gY4j89O1xaLF2Se6qX4MeOEKWPpMQscbhiT8eCn9I-5d_uWHsIAppweBiTywMut-6bdjooXAcn_ujKWgcZMnaxogpk4bCMxqwG5bvzjD_XSjSh6Silv_nO_qQQ0Iv9AFRt3vRg6J6H5xGkKsYbELkQ0ugFWPtVlDaYemzxjrxy6j2P-Ch-eCQ7Pd4IyCn_dS1Ag-ZrVVSIxpp__4"
          />
        </div>
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop w-full text-white">
          <span className="font-label-md text-label-md uppercase tracking-[0.2em] mb-stack-sm block text-primary-fixed">
            Our Heritage
          </span>
          <h1 className="font-display-lg text-display-lg mb-stack-lg max-w-2xl leading-tight">
            Cultivating Purity <br />
            Since 1984
          </h1>
          <p className="font-body-lg text-body-lg max-w-xl opacity-90 leading-relaxed">
            From the fertile heartlands of India to your kitchen table, Arihant is more than an
            FMCG brand—it is a promise of uncompromising quality and ancestral trust.
          </p>
        </div>
      </section>

      {/* The Narrative Section */}
      <section className="py-stack-xl px-margin-mobile md:px-margin-desktop w-full scroll-reveal">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-4">
            <h2 className="font-headline-lg text-headline-lg text-primary lg:sticky lg:top-28">
              A Legacy Rooted in Quality
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="editorial-text font-body-lg text-body-lg text-on-surface-variant space-y-stack-md leading-relaxed">
              <p>
                Founded on the principle that modern convenience should never come at the cost of
                traditional purity, Arihant began as a small regional milling operation. We
                understood early on that the foundation of a healthy life is the quality of the
                ingredients we consume daily.
              </p>
              <p>
                As we scaled into a diversified FMCG enterprise, we maintained a rigorous oversight
                of our entire supply chain. By partnering directly with farmers and implementing
                state-of-the-art cold-press and cleaning technologies, we ensure that every grain
                of pulse, every drop of oil, and every spice blend retains its essential nutrients.
              </p>
              <p>
                Today, Arihant stands as a beacon of "Modern Indian Purity." We bridge the gap
                between rural agricultural excellence and urban dietary needs, delivering products
                that are clean, ethical, and superior in taste. Our journey is one of continuous
                evolution, yet our core values remain as steady as the fields we cultivate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="py-stack-xl bg-surface-container-low w-full scroll-reveal">
        <div className="px-margin-mobile md:px-margin-desktop w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Mission */}
            <div className="bg-surface p-6 md:p-stack-xl rounded-xl border border-outline-variant hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-stack-lg">
                <span className="material-symbols-outlined">eco</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-stack-md">
                Our Mission
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                To democratize access to premium, high-purity food products while supporting
                sustainable agricultural practices that empower the Indian farming community. We
                aim to be the most trusted name in every household pantry.
              </p>
            </div>
            {/* Vision */}
            <div className="bg-surface p-6 md:p-stack-xl rounded-xl border border-outline-variant hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-stack-lg">
                <span className="material-symbols-outlined">visibility</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-secondary mb-stack-md">
                Our Vision
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                To lead the global shift toward "Conscious Consumption" by blending ancestral
                Indian wisdom with cutting-edge manufacturing technology, ensuring a healthier
                future for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-stack-xl px-margin-mobile md:px-margin-desktop w-full scroll-reveal">
        <div className="flex flex-col lg:flex-row gap-gutter items-center bg-primary rounded-3xl overflow-hidden shadow-2xl">
          <div className="w-full lg:w-1/2 h-[320px] md:h-[600px] relative">
            <img loading="lazy"
              className="w-full h-full object-cover"
              alt="Sambhav Jain, visionary founder of Arihant, in a professional suit, set in a modern warmly lit office space reflecting ethical commerce, ancestral heritage, and corporate trust."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtefbVQ3wZCfEIF026zbZhVfMrKM2fqbCJXx1-jVw8bNk_6mB8szM-NpaXXoG62irz8uWK0RCIGQnsszLZCQhAuu2P-bsoNvOGPpfD8bCRJMHWY-R4L2ci42N-lpnHXRQcbJO1SgTI7cgeRQnPOJslO0b3rdxe0hWAz7bMTxiqu4Lt2l0KBfxYhZInc-ijVr2gY8ExU2cLhHns1oUhiKfSgu7yrj9g0STdnFCPVFX8HBrmIKzPrEYNOXuaPdOFPS7iYO3OMu3nzVo"
            />
          </div>
          <div className="w-full lg:w-1/2 p-6 md:p-stack-xl lg:pr-margin-desktop text-white">
            <span className="font-label-md text-label-md text-primary-fixed uppercase tracking-widest mb-stack-sm block">
              Founder's Note
            </span>
            <h2 className="font-display-lg text-display-lg mb-stack-lg leading-tight">
              Sambhav Jain
            </h2>
            <blockquote className="font-body-lg text-body-lg italic mb-stack-lg leading-relaxed opacity-90 border-l-4 border-secondary-fixed-dim pl-stack-md">
              "Purity is not a destination, but a relentless standard of discipline. At Arihant,
              we don't just sell products; we offer our customers a piece of the integrity that
              our farmers pour into the soil."
            </blockquote>
            <p className="font-body-md text-body-md opacity-80 mb-stack-lg leading-relaxed">
              Under Sambhav's leadership, Arihant has transformed from a regional powerhouse into a
              national symbol of ethical commerce and manufacturing excellence. His commitment to
              'Modern Indian Purity' drives every innovation in our labs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={() => onNavigate("home", "products-showcase")}
                className="w-full sm:w-auto bg-secondary text-white px-8 py-3 rounded-full font-label-md hover:scale-105 active:scale-95 transition-transform text-center"
              >
                Explore Collection
              </button>
              <button className="w-full sm:w-auto border border-white/30 text-white px-8 py-3 rounded-full font-label-md hover:bg-white/10 active:scale-95 transition-all text-center">
                LinkedIn Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Timeline */}
      <section className="py-stack-xl bg-surface w-full scroll-reveal">
        <div className="px-margin-mobile md:px-margin-desktop w-full">
          <div className="text-center mb-stack-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Our Milestone Heritage
            </h2>
          </div>
          <div className="relative space-y-stack-xl before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-outline-variant">
            {/* Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="material-symbols-outlined text-[18px]">history</span>
              </div>
              <div className="w-[calc(100%-3.5rem)] md:w-[45%] bg-white p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-headline-md text-headline-md text-primary font-bold">1984</div>
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant">
                  Founding of the first Arihant Milling unit in Indore, focusing on high-grade wheat
                  processing.
                </div>
              </div>
            </div>
            {/* Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="material-symbols-outlined text-[18px]">expand</span>
              </div>
              <div className="w-[calc(100%-3.5rem)] md:w-[45%] bg-white p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-headline-md text-headline-md text-primary font-bold">2005</div>
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant">
                  Expansion into organic pulses and premium oils, establishing direct farmer-to-shelf
                  supply chains.
                </div>
              </div>
            </div>
            {/* Item 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div className="w-[calc(100%-3.5rem)] md:w-[45%] bg-white p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-headline-md text-headline-md text-primary font-bold">2018</div>
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant">
                  Inauguration of the Modern Research &amp; Development hub for high-purity
                  extraction techniques.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate HQ Details */}
      <section id="corporate-hq" className="py-stack-xl px-margin-mobile md:px-margin-desktop w-full scroll-reveal">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant">
          <div className="p-6 md:p-stack-xl space-y-stack-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-stack-sm font-bold">
                Corporate Headquarters
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                The nerve center of Arihant’s innovation and global operations.
              </p>
            </div>
            <div className="space-y-stack-md">
              <div className="flex items-start gap-stack-md">
                <span className="material-symbols-outlined text-primary mt-1">location_on</span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">
                    Arihant Tower, 12th Floor
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Business District, South Mumbai, MH 400001, India
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-stack-md">
                <span className="material-symbols-outlined text-primary mt-1">call</span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Toll-Free Helpline</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    1800-456-7890 (Mon-Sat, 9AM-6PM)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-stack-md">
                <span className="material-symbols-outlined text-primary mt-1">mail</span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Corporate Relations</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    hq@arihant-fmcg.com
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-stack-md border-t border-outline-variant">
              <h4 className="font-label-md text-label-md text-primary mb-stack-sm">
                Global Presence
              </h4>
              <div className="flex flex-wrap gap-stack-sm">
                <span className="px-3 py-1 bg-surface rounded-full border border-outline-variant text-[12px] font-semibold text-primary">
                  INDORE
                </span>
                <span className="px-3 py-1 bg-surface rounded-full border border-outline-variant text-[12px] font-semibold text-primary">
                  MUMBAI
                </span>
                <span className="px-3 py-1 bg-surface rounded-full border border-outline-variant text-[12px] font-semibold text-primary">
                  DUBAI
                </span>
                <span className="px-3 py-1 bg-surface rounded-full border border-outline-variant text-[12px] font-semibold text-primary">
                  LONDON
                </span>
              </div>
            </div>
          </div>
          <div className="h-[300px] lg:h-full min-h-[300px] relative">
            <img loading="lazy"
              className="w-full h-full object-cover"
              alt="A clean, minimalist aerial view of a modern glass corporate headquarters building reflecting the bright morning sky, embodying professional stability and warm corporate environment."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNsSIjFwvQoqYS-KI4f-ryVVZ2JqytmR4I1mwhO5y5xbj99t5bPu-P3s26kLyEx_122gPMj3EHkau0V5KTrHrE3T69YKrnZM8nNOCvf0BOR2vNGWDcPyJJxhG4iF5E5hdS7ks4RLi-2B5H1nzr3CmCMIMukwPV7-RRR0mCRwtukPjHbYxQ3-XSu9hp98ygtNNaD40x7R7qola0Y-eHxhh6SJaX_LRjEiOWX8nwlEkJJsupBO4JPSkGYwrhjHllZBe0BGSpMj2wy1g"
            />
            {/* Subtle Map Overlay Action */}
            <div className="absolute bottom-6 right-6">
              <button 
                onClick={() => onNavigate("contact", "mumbai-map")}
                className="bg-primary text-white flex items-center gap-2 px-stack-lg py-stack-sm rounded-full shadow-lg hover:bg-opacity-90 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined">map</span>
                View on Map
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
