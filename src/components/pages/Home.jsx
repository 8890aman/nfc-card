/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import Hero from "../layout/Hero";
import Navbar from "../common/Navbar";
import Features from "../layout/Features";
import AboutUs from "../layout/AboutUs";
import ContactUs from "../layout/ContactUs";
import Footer from "../layout/Footer";
import Preloader from "../common/Preloader"; // Add this import

// Create a new context for the active section
export const ActiveSectionContext = createContext();

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const refs = [heroRef, featuresRef, aboutRef, contactRef];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust this value to control how long the preloader is shown

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-black min-h-screen transition-colors duration-300">

    <ActiveSectionContext.Provider value={activeSection}>
      <AnimatePresence>
        {isLoading && <Preloader />}
      </AnimatePresence>
      <div className="overflow-x-hidden">
        <Navbar />
        <div id="hero" ref={heroRef} className="bg-white dark:bg-black min-h-screen font-roboto text-green-700 dark:text-green-400 flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isHeroVisible && <MemoizedGlowingBlobs />}
          </AnimatePresence>

          {/* Increased number of revolving lights */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 bg-green-50/30 dark:bg-green-900/20 rounded-3xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0">
                {/* Light 1 - Top Left */}
                <div className="absolute top-0 left-0 w-1/2 h-1/2 animate-revolve" style={{animationDuration: '20s'}}>
                  <div className="absolute w-32 h-32 bg-green-400/30 rounded-full filter blur-xl"></div>
                </div>

                {/* Light 2 - Bottom Right */}
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 animate-revolve" style={{animationDuration: '22s', animationDirection: 'reverse'}}>
                  <div className="absolute w-28 h-28 bg-green-200/30 rounded-full filter blur-xl"></div>
                </div>

                {/* Light 3 - Top Right */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 animate-revolve" style={{animationDuration: '25s', animationDelay: '-5s'}}>
                  <div className="absolute w-36 h-36 bg-green-300/30 rounded-full filter blur-xl"></div>
                </div>

                {/* Light 4 - Bottom Left */}
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 animate-revolve" style={{animationDuration: '18s', animationDirection: 'reverse', animationDelay: '-3s'}}>
                  <div className="absolute w-24 h-24 bg-green-500/30 rounded-full filter blur-xl"></div>
                </div>

                {/* Light 5 - Center */}
                <div className="absolute inset-1/4 animate-pulse" style={{animationDuration: '4s'}}>
                  <div className="absolute w-full h-full bg-green-400/20 rounded-full filter blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div ref={heroRef} data-scroll data-scroll-speed="2">
            <Hero />
          </div>
        </div>

        <div id="features" ref={featuresRef} className="relative overflow-hidden">
          <div data-scroll data-scroll-speed="1">
            <Features />
          </div>
        </div>

        <div id="about" ref={aboutRef} className="relative overflow-hidden">
          <div data-scroll data-scroll-speed="1">
            <AboutUs />
          </div>
        </div>

        <div id="contact" ref={contactRef} className="relative overflow-hidden">
          <div data-scroll data-scroll-speed="1">
            <ContactUs />
          </div>
        </div>

        <Footer />
      </div>
    </ActiveSectionContext.Provider>
      
    </div>
  );
}

// Updated MemoizedGlowingBlobs component
const MemoizedGlowingBlobs = React.memo(function GlowingBlobs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  const greenShades = [
    'rgba(52, 211, 153, 0.1)',  // Light green
    'rgba(16, 185, 129, 0.1)',  // Medium green
    'rgba(6, 95, 70, 0.1)',     // Dark green
    'rgba(167, 243, 208, 0.1)', // Very light green
    'rgba(4, 120, 87, 0.1)',    // Deep green
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full filter blur-3xl mix-blend-multiply dark:mix-blend-screen"
          style={{
            background: `radial-gradient(circle, ${greenShades[i % greenShades.length]} 0%, rgba(52, 211, 153, 0) 70%)`,
            width: `${Math.random() * 40 + 20}vw`,
            height: `${Math.random() * 40 + 20}vw`,
          }}
          initial={{
            x: `${Math.random() * 200 - 50}%`,
            y: `${Math.random() * 200 - 50}%`,
            scale: 0,
          }}
          animate={isInView ? {
            x: [`${Math.random() * 200 - 50}%`, `${Math.random() * 200 - 50}%`],
            y: [`${Math.random() * 200 - 50}%`, `${Math.random() * 200 - 50}%`],
            scale: [0, 1, 0],
          } : { scale: 0 }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: isInView ? Infinity : 0,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </motion.div>
  );
});

export default Home;
