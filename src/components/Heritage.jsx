import React from "react";
import { motion } from "framer-motion";

export default function Heritage({ onNavigate }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-12 md:py-16 bg-surface relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10 max-w-container-max mx-auto"
      >
        {/* Left Side: Images & Graphics */}
        <motion.div variants={itemVariants} className="relative">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-surface-container-lowest/80 backdrop-blur-sm transform transition-transform hover:scale-[1.02] duration-700">
            <img loading="lazy"
              className="w-full aspect-[4/3] object-cover"
              alt="Panoramic cinematic shot of a vast golden wheat field in rural India during the golden hour."
              src="/assets/images/heritage.webp"
            />
            {/* Elegant Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
            
            {/* Floating Glassmorphism Badge */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex items-center gap-6 shadow-xl">
               <div className="w-16 h-16 shrink-0 bg-secondary rounded-full flex items-center justify-center text-on-secondary shadow-lg">
                  <span className="text-3xl font-bold font-display-lg">30</span>
               </div>
               <div className="text-white">
                 <p className="font-bold text-headline-sm leading-tight">Years of Heritage</p>
                 <p className="text-white/90 text-label-sm mt-1">Mastering agricultural excellence</p>
               </div>
            </div>
          </div>
          
          {/* Decorative Leaf Icon */}
          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-8 -right-8 w-24 h-24 bg-surface-container-lowest rounded-full shadow-xl flex items-center justify-center border border-outline-variant/30 hidden md:flex"
          >
            <span className="material-symbols-outlined text-4xl text-primary">eco</span>
          </motion.div>
        </motion.div>

        {/* Right Side: Content */}
        <div className="lg:pr-8">
          <motion.span variants={itemVariants} className="inline-block px-5 py-2 rounded-full bg-secondary-container/50 text-secondary font-bold text-label-sm tracking-widest uppercase mb-6 border border-secondary/20 shadow-sm">
            Our Story
          </motion.span>
          
          <motion.h2 variants={itemVariants} className="font-display-lg text-display-md md:text-display-lg text-primary mb-6 leading-tight">
            A Heritage of <br/> <span className="text-secondary italic">Pure Commitment</span>
          </motion.h2>
          
          <motion.p variants={itemVariants} className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed text-lg">
            The Arihant journey began in the fertile plains of India, where we recognized
            the need for staples that didn't just fill stomachs, but nourished souls. We
            believe that the purest food comes from a place of respect—for the farmer,
            the land, and the consumer.
          </motion.p>
          
          <div className="space-y-6 mb-8">
            <motion.div variants={itemVariants} className="flex gap-5 group">
              <div className="flex-shrink-0 w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">agriculture</span>
              </div>
              <div>
                <h4 className="text-headline-sm font-bold text-primary mb-1">
                  Direct Farmer Sourcing
                </h4>
                <p className="text-on-surface-variant leading-relaxed">
                  Eliminating middlemen to ensure the freshest crop reach your home while empowering local communities.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-5 group">
              <div className="flex-shrink-0 w-14 h-14 bg-secondary-container rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors duration-300 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">factory</span>
              </div>
              <div>
                <h4 className="text-headline-sm font-bold text-primary mb-1">
                  State-of-the-Art Milling
                </h4>
                <p className="text-on-surface-variant leading-relaxed">
                  Cold-press milling technology that retains every bit of natural goodness, fiber, and vital nutrients.
                </p>
              </div>
            </motion.div>
          </div>
          
          <motion.button 
            variants={itemVariants}
            onClick={() => onNavigate('about')} 
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-on-primary rounded-xl font-bold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
            <span className="relative">Discover Our Roots</span>
            <span className="material-symbols-outlined relative group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
