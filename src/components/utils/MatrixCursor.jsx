/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, useAnimate, useMotionValue, useSpring } from 'framer-motion';

const MatrixCursor = () => {
  const [scope, animate] = useAnimate();
  const [cursorColor, setCursorColor] = useState('rgb(34, 197, 94)');
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 1000, mass: 0.1 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const updateMousePosition = useCallback((e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    setIsVisible(true);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback((e) => {
    if (e.target.matches('a, button, [role="button"], input[type="submit"], input[type="button"]')) {
      setIsHovering(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsVisible(false);
  }, []);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const animation = animate(
      scope.current,
      { backgroundColor: [
        'rgb(34, 197, 94)',  // green-500
        'rgb(21, 128, 61)',  // green-700
        'rgb(22, 163, 74)',  // green-600
        'rgb(16, 185, 129)', // emerald-500
        'rgb(5, 150, 105)',  // emerald-600
      ] },
      { 
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    );

    const interval = setInterval(() => {
      if (scope.current) {
        const color = window.getComputedStyle(scope.current).backgroundColor;
        setCursorColor(color);
      }
    }, 100);

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      animation.stop();
      clearInterval(interval);
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDesktop, animate, scope, updateMousePosition, handleMouseEnter, handleMouseLeave]);

  const lightenColor = useCallback((color) => {
    const rgb = color.match(/\d+/g);
    return `rgb(${rgb.map(c => Math.min(255, parseInt(c) + 100)).join(', ')})`;
  }, []);

  const svgCursor = useMemo(() => `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="${isHovering ? lightenColor(cursorColor) : cursorColor}" d="M4.5.79v22.42l6.56-6.57h9.29L4.5.79z"></path>
    </svg>
  `, [cursorColor, isHovering, lightenColor]);

  if (!isDesktop) return null;

  return (
    <>
      <div ref={scope} style={{ display: 'none' }} />
      <motion.div
        style={{
          position: 'fixed',
          left: cursorX,
          top: cursorY,
          width: '24px',
          height: '24px',
          pointerEvents: 'none',
          zIndex: 9999,
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgCursor)}")`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          transform: 'translate(-2px, -2px)',
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
};

export default React.memo(MatrixCursor);
