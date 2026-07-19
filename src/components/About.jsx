import React, { useState, useEffect } from "react";

export default function About({ onNavigate, siteSettings }) {
  const [activeMapUrl, setActiveMapUrl] = useState("");
  const [corpInfo, setCorpInfo] = useState({
    addressLine1: "Arihant Tower, 12th Floor",
    addressLine2: "Business District, South Mumbai, MH 400001, India",
    phone: "1800-456-7890",
    email: "hq@arihant-fmcg.com",
    locations: [
      { name: "MUMBAI", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609950348!2d72.74109995711681!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" }
    ]
  });

  useEffect(() => {
    if (siteSettings && siteSettings.corporate_info) {
      setCorpInfo(siteSettings.corporate_info);
      if (siteSettings.corporate_info.locations && siteSettings.corporate_info.locations.length > 0) {
        setActiveMapUrl(siteSettings.corporate_info.locations[0].mapUrl);
      }
    } else {
      setActiveMapUrl("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609950348!2d72.74109995711681!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin");
    }
  }, [siteSettings]);

  return (
    <div className="relative w-full overflow-hidden page-transition">
      <div className="grain-overlay"></div>

      {/* Hero Section */}
      <section className="relative h-[640px] md:h-[819px] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-40">
          <img loading="lazy"
            className="w-full h-full object-cover animate-fade-in duration-1000"
            alt="A cinematic, wide-angle landscape shot of lush green wheat fields swaying gently under a golden sunset. The lighting is ethereal and warm, emphasizing the organic and pure origins of Arihant staples."
            src="/assets/images/about1.webp"
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
              src="/assets/images/about2.webp"
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
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(corpInfo.addressLine2)}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors cursor-pointer block">
                    <p className="font-label-md text-label-md text-on-surface">
                      {corpInfo.addressLine1}
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {corpInfo.addressLine2}
                    </p>
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-stack-md">
                <span className="material-symbols-outlined text-primary mt-1">call</span>
                <div>
                  <a href={`tel:${corpInfo.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-primary transition-colors cursor-pointer block">
                    <p className="font-label-md text-label-md text-on-surface">Toll-Free Helpline</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {corpInfo.phone}
                    </p>
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-stack-md">
                <span className="material-symbols-outlined text-primary mt-1">mail</span>
                <div>
                  <a href={`mailto:${corpInfo.email}`} className="hover:text-primary transition-colors cursor-pointer block">
                    <p className="font-label-md text-label-md text-on-surface">Corporate Relations</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {corpInfo.email}
                    </p>
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-stack-md border-t border-outline-variant">
              <h4 className="font-label-md text-label-md text-primary mb-stack-sm">
                Global Presence
              </h4>
              <div className="flex flex-wrap gap-stack-sm">
                {corpInfo.locations.map((loc, idx) => {
                  const isActive = loc.mapUrl === activeMapUrl;
                  return (
                    <button 
                      key={idx}
                      onClick={() => setActiveMapUrl(loc.mapUrl)}
                      className={`px-3 py-1 rounded-full border text-[12px] font-semibold transition-all ${
                        isActive 
                          ? 'bg-primary border-primary text-white' 
                          : 'bg-surface border-outline-variant text-primary hover:bg-surface-container'
                      }`}
                    >
                      {loc.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="h-[300px] lg:h-full min-h-[300px] relative bg-surface-container-highest">
            {activeMapUrl ? (
              <iframe 
                src={activeMapUrl}
                className="absolute inset-0 w-full h-full border-0 transition-opacity duration-500"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Arihant Location Map"
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant font-label-md">
                Select a location to view map
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
