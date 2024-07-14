import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '../../utils/AnimatedBackground';
import CursorBlobsBackground from '../../utils/CursorBlobsBackground';

const NotFound = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300 overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      <CursorBlobsBackground darkMode={theme === 'dark'} />
      <AnimatedBackground />
      <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50 backdrop-blur-2xl z-0"></div>
      
      <motion.div 
        className="container mx-auto px-4 relative z-20 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg className="w-full max-w-2xl h-64 mb-8" viewBox="0 0 300 100">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="80" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 dark:text-green-400">
            404
          </text>
          {[...Array(50)].map((_, i) => (
            <circle
              key={i}
              className="text-green-500 dark:text-green-400 animate-float"
              cx={Math.random() * 300}
              cy={Math.random() * 100}
              r={Math.random() * 3 + 1}
              fill="currentColor"
              style={{animationDelay: `${Math.random() * 5}s`}}
            />
          ))}
        </svg>
        <motion.h1
          className="text-4xl font-bold mb-4 text-green-600 dark:text-green-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Page Not Found
        </motion.h1>
        <motion.p
          className="text-xl mb-8 text-green-700 dark:text-green-300 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>
        <motion.a
          href="/"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go Back Home
        </motion.a>
        <motion.button
          onClick={toggleTheme}
          className="mt-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-full transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Toggle Theme
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;
