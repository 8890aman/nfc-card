/* eslint-disable no-unused-vars */
import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { useState, useEffect, useCallback } from 'react';
import Home from './components/pages/Home';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faMicrochip, faWifi, faNetworkWired, faServer, 
  faDatabase, faCode
} from '@fortawesome/free-solid-svg-icons';
import SmoothScroll from './components/common/SmoothScroll';

// Add icons to the library
library.add(
  faMicrochip, faWifi, faNetworkWired, faServer, 
  faDatabase, faCode
);

// Array of icon names

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkModeToggle = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, []);

  useEffect(() => {
    const root = document.getElementById('root');
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ThemeProvider>
      <SmoothScroll>
        <div className="bg-white dark:bg-black min-h-screen transition-colors duration-300">
          <Home darkMode={darkMode} setDarkMode={handleDarkModeToggle} />
        </div>
      </SmoothScroll>
    </ThemeProvider>
  );
}

export default React.memo(App);
