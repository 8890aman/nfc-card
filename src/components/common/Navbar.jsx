import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { IconButton, Button, Navbar as MTNavbar, Typography, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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

  const navItems = ['Home', 'Features', 'About', 'Contact'];

  return (
    <MTNavbar
      className="bg-white/80 dark:bg-black/80 backdrop-blur-md py-4 sticky top-0 z-50 transition-colors duration-300 border-none shadow-md"
      fullWidth
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Typography
          as={motion.div}
          variant="h4"
          className="font-outfit font-bold text-green-600 dark:text-green-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          NeoTech
        </Typography>

        {/* Desktop Menu */}
        <motion.div 
          className="hidden md:flex flex-1 justify-end items-center space-x-6 me-64"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item) => (
            <motion.div
              key={item}
              className="relative inline-block"
            >
              <motion.a
                href="#"
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`font-outfit transition-colors duration-300 ${
                  activeItem === item ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                }`}
                onClick={() => setActiveItem(item)}
              >
                {item}
              </motion.a>
              {activeItem === item && (
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
            className="focus:outline-none"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-green-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-green-600" />
            )}
          </IconButton>
          <div className="hidden md:block space-x-2">
            <Button 
              variant="text" 
              className="font-outfit text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-300"
            >
              Login
            </Button>
            <Button 
              variant="filled"
              className="font-outfit bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white transition-colors duration-300"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu */}
          <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
            <MenuHandler>
              <IconButton
                variant="text"
                color={darkMode ? "white" : "black"}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden focus:outline-none"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </IconButton>
            </MenuHandler>
            <MenuList className="md:hidden bg-white dark:bg-gray-800 py-4 px-4 rounded-lg shadow-md mt-4 border-none focus:outline-none">
              {navItems.map((item) => (
                <MenuItem
                  key={item}
                  className="mb-4 "
                >
                  <motion.a
                    href="#"
                    variants={itemVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`font-outfit transition-colors duration-300 ${
                      activeItem === item ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'
                    }`}
                    onClick={() => {
                      setActiveItem(item);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item}
                  </motion.a>
                </MenuItem>
              ))}
              <MenuItem className="mt-4">
                <Button 
                  variant="text" 
                  className="w-full font-outfit text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-300"
                >
                  Login
                </Button>
              </MenuItem>
              <MenuItem>
                <Button 
                  variant="filled"
                  className="w-full font-outfit bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white transition-colors duration-300"
                >
                  Sign Up
                </Button>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </MTNavbar>
  )
}

export default Navbar
