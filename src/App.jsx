/* eslint-disable no-unused-vars */
import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { useState, useEffect, useCallback } from 'react';
import Home from './components/pages/Home';
import EmailVerification from './components/pages/EmailVerification';
import DesignCard from './components/pages/DesignCard';
import { library } from '@fortawesome/fontawesome-svg-core';
import UserWalkthrough from './components/pages/UserWalkthrough';
import NotFound from './components/pages/404/404';
import PublicProfilePage from "./components/pages/dashboard/PublicProfilePage";
import { 
  faMicrochip, faWifi, faNetworkWired, faServer, 
  faDatabase, faCode
} from '@fortawesome/free-solid-svg-icons';
import { Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Dashboard from "./components/pages/dashboard/dashboard";
import AdminDashboard from "./components/pages/AdminDashboard/AdminDashboard";
import PaymentPage from "./components/pages/PaymentPage";
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
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} setDarkMode={handleDarkModeToggle} />} />
        <Route path="/design-card" element={<DesignCard darkMode={darkMode} setDarkMode={handleDarkModeToggle} />} />
        <Route path="/email-verification" element={<EmailVerification darkMode={darkMode} setDarkMode={handleDarkModeToggle} />} />
        <Route path="/login" element={<Login darkMode={darkMode} setDarkMode={handleDarkModeToggle} />} />
        <Route path="/signup" element={<Signup darkMode={darkMode} setDarkMode={handleDarkModeToggle} />} />
        <Route path="/dashboard" element={<Dashboard darkMode={darkMode} setDarkMode={handleDarkModeToggle} />} />
        <Route path="/user-walkthrough" element={<UserWalkthrough darkMode={darkMode} setDarkMode={handleDarkModeToggle} />} />
        <Route path="*" element={<NotFound darkMode={darkMode} setDarkMode={handleDarkModeToggle} />} />
        <Route path="/profile/:userId" element={<PublicProfilePage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default React.memo(App);
