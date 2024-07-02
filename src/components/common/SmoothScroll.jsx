/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

const SmoothScroll = ({ children, isDarkMode }) => {
  const scrollRef = useRef(null);
  const locomotiveScrollRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const darkMode = useMotionValue(isDarkMode ? 1 : 0);
  const scrollbarColor = useTransform(
    darkMode,
    [0, 1],
    ['#2E7D32', '#4CAF50']
  );

  useEffect(() => {
    darkMode.set(isDarkMode ? 1 : 0);
  }, [isDarkMode, darkMode]);

  useEffect(() => {
    if (!locomotiveScrollRef.current) {
      locomotiveScrollRef.current = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        smoothMobile: false,
        multiplier: 0.5,
        lerp: 0.08,
        class: 'is-revealed',
        getDirection: true,
        reloadOnContextChange: true,
        touchMultiplier: 2,
        smartphone: {
          smooth: false,
          breakpoint: 767,
        },
        tablet: {
          smooth: false,
          breakpoint: 1024,
        },
      });

      locomotiveScrollRef.current.on('scroll', (instance) => {
        // Custom scroll handling if needed
      });

      setIsReady(true);
    }

    return () => {
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
        locomotiveScrollRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isReady && locomotiveScrollRef.current) {
      setTimeout(() => {
        locomotiveScrollRef.current.update();
      }, 500);
    }
  }, [isReady]);

  return (
    <div ref={scrollRef} data-scroll-container>
      <motion.div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '10px',
          backgroundColor: scrollbarColor,
        }}
      />
      {children}
    </div>
  );
};

export default React.memo(SmoothScroll);