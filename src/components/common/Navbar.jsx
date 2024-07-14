/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { useState, useEffect, useContext } from 'react';
import { IconButton, Button, Navbar as MTNavbar, Typography, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { AnimatePresence } from 'framer-motion';
import { ActiveSectionContext } from '../pages/Home'; // Add this import
import { NavLink } from 'react-router-dom'; // Add this import at the top of the file

const Navbar = () => {
  const activeSection = useContext(ActiveSectionContext); // Add this line
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Features', id: 'features' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' }
  ];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavItemClick = (e, item) => {
    e.preventDefault();
    console.log(`Clicked on ${item.label}`); // Debug log

    const element = document.getElementById(item.id);
    if (element) {
      const yOffset = -80; // Adjust this value based on your navbar height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else if (item.id === 'hero') {
      const heroElement = document.getElementById('hero');
      if (heroElement) {
        heroElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    setIsMenuOpen(false);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0 }
  };

  return (
    <>
      <MTNavbar
        className={`bg-white/80 dark:bg-black/80 backdrop-blur-md py-4 z-50 transition-all duration-300 border-none shadow-md fixed top-0 left-0 right-0`}
        fullWidth
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Typography
            as={motion.div}
            variant="h4"
            className={`font-outfit font-bold text-green-600 dark:text-green-400`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            NeoTech
          </Typography>

          {/* Desktop Menu - Only visible on large screens */}
          <motion.div 
            className="hidden lg:flex flex-1 justify-end items-center space-x-6 me-64"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            {navItems.map((item) => (
              <motion.div
                key={item.label}
                className="relative inline-block"
              >
                <motion.a
                  href={`#${item.id}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`font-outfit transition-colors duration-300 ${
                    activeSection === item.id ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                  }`}
                  onClick={(e) => handleNavItemClick(e, item)}
                >
                  {item.label}
                </motion.a>
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center space-x-4">
            <IconButton
              variant="text"
              color={darkMode ? "white" : "black"}
              onClick={toggleDarkMode}
              className={`focus:outline-none`}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-green-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-green-600" />
              )}
            </IconButton>
            <div className="hidden lg:flex space-x-2">
              <NavLink to="/login">
                <Button 
                  variant="text" 
                  className={`font-outfit text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-300`}
                >
                  Login
                </Button>
              </NavLink>
              <NavLink to="/signup">
                <Button 
                  variant="filled"
                  className={`font-outfit bg-green-600 hover:bg-green-700 text-white transition-colors duration-300`}
                >
                  Sign Up
                </Button>
              </NavLink>
            </div>

            {/* Mobile Menu Toggle */}
            <IconButton
              variant="text"
              color={darkMode ? "white" : "black"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden focus:outline-none`}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </IconButton>
          </div>
        </div>
      </MTNavbar>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-50 lg:hidden"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex flex-col h-full justify-center items-center space-y-8 p-4 relative">
              {/* Close button */}
              <motion.button
                className="absolute top-4 right-4 text-white"
                onClick={() => setIsMenuOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <XMarkIcon className="h-8 w-8" />
              </motion.button>

              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={`#${item.id}`}
                  className={`font-outfit text-2xl font-semibold transition-colors duration-300 ${
                    activeSection === item.id ? 'text-green-400' : 'text-gray-200'
                  }`}
                  onClick={(e) => {
                    handleNavItemClick(e, item);
                    setIsMenuOpen(false);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="flex flex-col space-y-4 w-full max-w-xs">
                <NavLink to="/login" className="w-full">
                  <Button 
                    variant="text" 
                    className={`font-outfit text-gray-300 hover:text-green-400 transition-colors duration-300`}
                    fullWidth
                  >
                    Login
                  </Button>
                </NavLink>
                <NavLink to="/signup" className="w-full">
                  <Button 
                    variant="filled"
                    className={`font-outfit bg-green-600 hover:bg-green-700 text-white transition-colors duration-300`}
                    fullWidth
                  >
                    Sign Up
                  </Button>
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
