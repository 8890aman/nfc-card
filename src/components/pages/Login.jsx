/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faApple, faFacebook } from '@fortawesome/free-brands-svg-icons';
import CursorBlobsBackground from '../utils/CursorBlobsBackground';
import AnimatedBackground from '../utils/AnimatedBackground';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const Login = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setIsLoading(false);
        // Send verification email
        await sendEmailVerification(user);
        // Redirect to email verification page
        navigate('/email-verification');
      } else {
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          navigate('/user-walkthrough');
        }, 1500);
      }
    } catch (error) {
      console.error("Error signing in:", error.message);
      setIsLoading(false);
      setIsError(true);
      setErrorMessage(error.message);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user document already exists
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      let walkthroughCompleted = false;

      if (!userDoc.exists()) {
        // If the user document doesn't exist, create it
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          lastLogin: new Date(),
          walkthroughCompleted: false
        });
      } else {
        // If the user document exists, update the last login and check walkthrough status
        const userData = userDoc.data();
        walkthroughCompleted = userData.walkthroughCompleted || false;
        await setDoc(userDocRef, { lastLogin: new Date() }, { merge: true });
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (walkthroughCompleted) {
          navigate('/dashboard');
        } else {
          navigate('/user-walkthrough');
        }
      }, 1500);
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      setIsError(true);
      setErrorMessage(error.message);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  const paperPlaneVariants = {
    initial: { x: -100, y: 100, rotate: -45 },
    animate: { 
      x: [0, 300, 0], 
      y: [0, -200, 0], 
      rotate: [-45, 0, -45],
      transition: { 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      } 
    }
  };

  const successVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      y: -50,
      transition: { duration: 0.3 }
    }
  };

  const animationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      y: -50,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300 overflow-hidden`}>
      <CursorBlobsBackground darkMode={darkMode} />
      <AnimatedBackground />
      <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50 backdrop-blur-2xl z-0"></div>
      
      <motion.div 
        className="container mx-auto px-4 relative z-20 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className={`w-full max-w-md bg-green-50 dark:bg-green-900 bg-opacity-20 dark:bg-opacity-20 backdrop-filter backdrop-blur-xl p-8 rounded-lg shadow-xl relative overflow-hidden`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatedBackground />
          <div className="relative">
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  className="absolute top-0 left-0 right-0 bg-green-500 text-white p-4 rounded-t-lg z-10"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.h2 
                    className="text-center text-xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Success!
                  </motion.h2>
                </motion.div>
              )}
              {isError && (
                <motion.div
                  className="absolute top-0 left-0 right-0 bg-red-500 text-white p-4 rounded-t-lg z-10"
                  variants={animationVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.h2 
                    className="text-center text-xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Error: {errorMessage}
                  </motion.h2>
                </motion.div>
              )}
            </AnimatePresence>

            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Welcome Back!</h2>
            <p className={`${darkMode ? 'text-green-300' : 'text-green-700'} mb-8`}>Sign in to your account</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4 relative">
                <EnvelopeIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 ${darkMode ? 'bg-green-800 text-green-200' : 'bg-green-50 text-green-800'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                />
              </div>
              <div className="mb-6 relative">
                <LockClosedIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 ${darkMode ? 'bg-green-800 text-green-200' : 'bg-green-50 text-green-800'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <motion.button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            </form>

            <div className="mt-4 text-right">
              <a href="#" className={`${darkMode ? 'text-green-400' : 'text-green-600'} hover:underline`}>Forgot Password?</a>
            </div>

            <div className="mt-8">
              <p className={`text-center ${darkMode ? 'text-green-300' : 'text-green-700'} mb-4`}>Or continue with</p>
              <div className="flex justify-center space-x-4">
                {[
                  { icon: faGoogle, color: 'text-red-600' },
                  { icon: faApple, color: darkMode ? 'text-gray-200' : 'text-gray-800' },
                  { icon: faFacebook, color: 'text-blue-600' },
                ].map((social, index) => (
                  <motion.button
                    key={index}
                    className={`p-2 rounded-full ${darkMode ? 'bg-green-800' : 'bg-green-50'} hover:bg-opacity-80`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={social.icon === faGoogle ? handleGoogleSignUp : null}
                  >
                    <FontAwesomeIcon icon={social.icon} className={`text-xl ${social.color}`} />
                  </motion.button>
                ))}
              </div>
            </div>

            <p className={`mt-8 text-center ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
              Don't have an account? <a href="#" className={`${darkMode ? 'text-green-400' : 'text-green-600'} hover:underline`}>Sign up</a>
            </p>
          </div>
        </motion.div>
      </motion.div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-4 right-4 p-2 rounded-full ${darkMode ? 'bg-green-700 text-green-200' : 'bg-green-200 text-green-700'} hover:bg-opacity-80 transition-colors duration-200 focus:outline-none`}
      >
        {darkMode ? (
          <SunIcon className="h-5 w-5 text-green-400" />
        ) : (
          <MoonIcon className="h-5 w-5 text-green-600" />
        )}
      </button>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              variants={paperPlaneVariants}
              initial="initial"
              animate="animate"
            >
              <PaperAirplaneIcon className="h-10 w-10 text-green-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



export default Login;
