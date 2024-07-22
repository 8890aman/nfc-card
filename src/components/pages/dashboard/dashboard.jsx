/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { auth, db, storage } from '../../../firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaChartBar, FaClipboardList, FaBell, FaIdCard, FaGlobe, FaTags, FaClock, FaCamera, FaUpload, FaTrash, FaEdit, FaChevronRight, FaSignOutAlt, FaTimes, FaBars, FaQuoteLeft, FaEye, FaMousePointer, FaBullseye, FaMoneyBillWave, FaUsers, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, where, deleteDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import AnimatedBackground from '../../utils/AnimatedBackground';
import { SunIcon, MoonIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useDropzone } from 'react-dropzone';
import { Chip } from "@material-tailwind/react";
import Analytics from './Analytics';
import PublicPage from './PublicPage';
import { deleteObject } from 'firebase/storage';

import StatCards from './StatCards';
import imageCompression from 'browser-image-compression';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const calculateProfileCompletion = (data) => {
  if (!data) return 0;
  const fields = ['bio', 'occupation', 'tags', 'photoURL'];
  const completedFields = fields.filter(field => data[field] && data[field].length > 0);
  return (completedFields.length / fields.length) * 100;
};

const Notifications = ({ notifications, darkMode, onDeleteNotification }) => {
  return (
    <div className={`rounded-lg overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between items-center`}>
              <div>
                <p className="font-semibold">{notification.message}</p>
                <p className="text-sm text-gray-500">
                  {notification.timestamp?.toDate().toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => onDeleteNotification(notification.id)}
                className={`p-1 rounded-full ${
                  darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-300'
                } transition-colors duration-200`}
                title="Delete notification"
              >
                <FaTrash className="text-lg" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No notifications yet.</p>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [imageUpload, setImageUpload] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState('profile');
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Read initial theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Derive darkMode boolean for existing component logic
  const darkMode = theme === 'dark';

  const profileCompletion = useMemo(() => calculateProfileCompletion(userData), [userData]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid);
        subscribeToNotifications(currentUser.uid);
      } else {
        setUser(null);
        setUserData(null);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const subscribeToNotifications = (userId) => {
    const notificationsRef = collection(db, "users", userId, "notifications");
    const now = new Date();
    const q = query(
      notificationsRef,
      where("expiresAt", ">", now),
      orderBy("expiresAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(newNotifications);
      
      // Count unread notifications
      const unreadCount = newNotifications.filter(n => !n.read).length;
      setUnreadNotifications(unreadCount);

      // Delete expired notifications
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.expiresAt.toDate() <= now) {
          batch.delete(doc.ref);
        }
      });
      batch.commit().catch(error => console.error("Error deleting expired notifications:", error));
    });

    return unsubscribe;
  };

  const markNotificationsAsRead = async () => {
    if (user) {
      const batch = db.batch();
      notifications.forEach(notification => {
        if (!notification.read) {
          const notificationRef = doc(db, "users", user.uid, "notifications", notification.id);
          batch.update(notificationRef, { read: true });
        }
      });
      await batch.commit();
      setUnreadNotifications(0);
    }
  };

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Optional: update body class for global styling
    document.body.className = theme;
  }, [theme]);

  const fetchUserData = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        // Create a new user document if it doesn't exist
        const newUserData = {
          displayName: user.displayName || '',
          email: user.email,
          photoURL: user.photoURL || '',
          bio: '',
          occupation: '',
          tags: [],
          lastLogin: new Date(),
          pageVisits: 0, // Initialize pageVisits
        };
        await setDoc(userDocRef, newUserData);
        setUserData(newUserData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, updatedData);
      
      // Update local state
      setUserData(prevData => ({ ...prevData, ...updatedData }));
      
      // Optionally, you can show a success message
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      // Optionally, you can show an error message to the user
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGenerateProfile = () => {
    setShowTemplateModal(true);
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    setShowTemplateModal(false);
    console.log(`Generating public profile with template: ${templateId}`);
  };

const handlePhotoUpload = async (e) => {
  const file = e.target.files[0];
  if (file) {
    // Check if the file is a JPEG
    if (file.type !== 'image/jpeg') {
      console.error("Only JPEG images are allowed");
      // Optionally, show an error message to the user
      return;
    }

    try {
      // Compress the image
      const options = {
        maxSizeMB: 0.15, // 150KB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const storageRef = ref(storage, `users/${user.uid}/profile_picture`);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update user profile
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      
      // Update Firestore document
      await updateUserProfile({ photoURL: downloadURL });
      
      // Update local state
      setUserData(prevData => ({ ...prevData, photoURL: downloadURL }));
      
      setShowPhotoUploadModal(false);
    } catch (error) {
      console.error("Error uploading photo:", error);
      // Optionally, show an error message to the user
    }
  }
};
  

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUpload(file);
    }
  };

  const uploadImage = async () => {
    if (imageUpload == null) return;
    setUploadError(null);
    const imageRef = ref(storage, `users/${user.uid}/images/${imageUpload.name}`);
    try {
      // Upload the image
      const snapshot = await uploadBytes(imageRef, imageUpload);
      
      // Get the download URL
      let url = await getDownloadURL(snapshot.ref);
      
      // Replace the Firebase Storage URL with our proxied URL
      url = url.replace('https://firebasestorage.googleapis.com', '/firebase-storage');
      
      console.log("Image uploaded successfully. URL:", url);
      
      // Update user profile
      await updateProfile(auth.currentUser, { photoURL: url });
      
      // Update Firestore document
      await updateUserProfile({ photoURL: url });
      
      // Update local state
      setUserData(prevData => ({ ...prevData, photoURL: url }));
      
      setImageUpload(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
    }
  };

  const handleDeletePhoto = async () => {
    try {
      // Update user profile
      await updateProfile(auth.currentUser, { photoURL: null });
      
      // Update Firestore document
      await updateUserProfile({ photoURL: null });
      
      // Update local state
      setUserData(prevData => ({ ...prevData, photoURL: null }));
      
      setShowPhotoUploadModal(false);
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  const deleteNotification = async (notificationId) => {
    try {
      const notificationRef = doc(db, "users", user.uid, "notifications", notificationId);
      await deleteDoc(notificationRef);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification: ", error);
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Add the AnimatedBackground here with a lower z-index */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground darkMode={darkMode} />
      </div>

      {/* Sidebar */}
      <div 
        className={`
          fixed md:relative w-64 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg z-20 
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              {/* Close button for mobile */}
              <button
                onClick={toggleSidebar}
                className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            <nav className="space-y-2">
              <SidebarLink 
                icon={<FaUser />} 
                text="Profile" 
                isActive={activeComponent === 'profile'}
                onClick={() => setActiveComponent('profile')}
              />
              <SidebarLink 
                icon={<FaChartBar />} 
                text="Analytics" 
                isActive={activeComponent === 'analytics'}
                onClick={() => setActiveComponent('analytics')}
              />
              <SidebarLink 
                icon={<FaBell />} 
                text="Notifications" 
                isActive={activeComponent === 'notifications'}
                onClick={() => {
                  setActiveComponent('notifications');
                  markNotificationsAsRead();
                }}
                hasNotifications={unreadNotifications > 0}
              />
              <SidebarLink 
                icon={<FaGlobe />} 
                text="Page" 
                isActive={activeComponent === 'page'}
                onClick={() => setActiveComponent('page')}
              />
            </nav>
          </div>
          <div className="mt-auto p-5">
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center w-full ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              } text-${darkMode ? 'white' : 'gray-800'} font-bold py-2 px-4 rounded-full transition duration-300 mb-4`}
            >
              {darkMode ? <MoonIcon className="w-5 h-5 mr-2" /> : <SunIcon className="w-5 h-5 mr-2" />}
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 relative">
        {/* Sidebar toggle button for mobile */}
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-30 bg-gray-800 text-white p-2 rounded-md"
        >
          <FaBars className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeComponent === 'profile' && user && userData && (
            <>
              <UserProfile 
                user={user} 
                userData={userData} 
                darkMode={darkMode} 
                setShowPhotoUploadModal={setShowPhotoUploadModal} 
                updateUserProfile={updateUserProfile} 
              />
              <StatCards />
            </>
          )}
          {activeComponent === 'analytics' && (
            <Analytics darkMode={darkMode} pageVisits={userData?.pageVisits || 0} />
          )}
          {activeComponent === 'notifications' && (
            <Notifications 
              notifications={notifications} 
              darkMode={darkMode} 
              onDeleteNotification={deleteNotification}
            />
          )}
          {activeComponent === 'page' && (
            <PublicPage 
              user={user}
              userData={userData}
              darkMode={darkMode}
              updateUserProfile={updateUserProfile}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showTemplateModal && (
          <TemplateModal 
            darkMode={darkMode} 
            onClose={() => setShowTemplateModal(false)} 
            onSelectTemplate={handleSelectTemplate}
          />
        )}
        {showPhotoUploadModal && (
          <PhotoUploadModal 
            darkMode={darkMode} 
            onClose={() => setShowPhotoUploadModal(false)} 
            onUpload={handlePhotoUpload}
            fileInputRef={fileInputRef}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && (
          <LoadingOverlay darkMode={darkMode} />
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarLink = ({ icon, text, isActive, onClick, hasNotifications }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full py-3 px-4 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-green-500 text-white'
        : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
    } relative`}
  >
    {React.cloneElement(icon, { className: "w-5 h-5 mr-3" })}
    <span className="font-medium">{text}</span>
    {hasNotifications && (
      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
    )}
  </button>
);

const UserProfile = ({ user, userData, darkMode, setShowPhotoUploadModal, updateUserProfile }) => {
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(true);

  const bannerVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  const bubbleVariants = {
    animate: (i) => ({
      y: ['0%', '100%'],
      x: i % 2 === 0 ? ['0%', '10%', '0%'] : ['0%', '-10%', '0%'],
      transition: {
        duration: 3 + i * 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    })
  };

  const buttonVariants = {
    rest: { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
    hover: { 
      scale: 1.05, 
      boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    tap: { scale: 0.95 }
  };

  const iconVariants = {
    rest: { rotate: 0 },
    hover: { rotate: 180, transition: { duration: 0.3 } }
  };

  const backgroundVariants = {
    rest: { opacity: 0, scale: 0 },
    hover: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`mb-12 rounded-lg overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <motion.div 
        className="h-48 relative overflow-hidden"
        variants={bannerVariants}
        animate="animate"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600"
          style={{ backgroundSize: '400% 400%' }}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              width: `${20 + i * 10}px`,
              height: `${20 + i * 10}px`,
              left: `${20 + i * 20}%`,
              top: '-20%',
            }}
            variants={bubbleVariants}
            animate="animate"
            custom={i}
          />
        ))}
      </motion.div>
      <div className="p-6 relative">
        <div className="absolute -top-16 left-6">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden relative">
            {isPhotoLoading && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-gray-200"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaSpinner className="text-4xl text-gray-400 animate-spin" />
              </motion.div>
            )}
            {userData.photoURL ? (
              <img 
                src={userData.photoURL} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onLoad={() => setIsPhotoLoading(false)}
                onError={(e) => {
                  setIsPhotoLoading(false);
                  e.target.onerror = null;
                  e.target.src = 'path/to/fallback/image.jpg';
                }}
                style={{ display: isPhotoLoading ? 'none' : 'block' }}
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <FaUser className="text-4xl text-gray-500" />
              </div>
            )}
          </div>
          <motion.button 
            onClick={() => setShowPhotoUploadModal(true)} 
            className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 text-white hover:bg-green-600 transition duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaCamera />
          </motion.button>
        </div>
        <div className="ml-40">
          <h2 className="text-2xl font-bold mb-2">{userData.displayName || user.displayName}</h2>
          <p className="text-sm mb-4">{userData.occupation}</p>
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6 shadow-inner`}>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FaQuoteLeft className={`mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              Bio
            </h3>
            {userData.bio ? (
              <p className="text-sm leading-relaxed">
                {userData.bio}
              </p>
            ) : (
              <p className="text-sm italic text-gray-500">
                No bio added yet. Click "Edit Profile" to share your story!
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {userData.tags?.map((tag, index) => (
              <Chip
                key={index}
                value={tag}
                className={`${
                  darkMode 
                    ? 'bg-green-700 text-white' 
                    : 'bg-green-100 text-green-800'
                } font-medium`}
              />
            ))}
          </div>
          <motion.button
            onClick={() => setShowEditProfileModal(true)}
            className={`
              mt-6 px-6 py-3 rounded-full text-white font-semibold
              flex items-center justify-center relative overflow-hidden
              ${darkMode ? 'bg-green-600' : 'bg-green-500'}
              transition-colors duration-300 ease-in-out
            `}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600"
              variants={backgroundVariants}
            />
            <motion.span className="relative flex items-center">
              <motion.span variants={iconVariants} className="mr-2">
                <FaEdit />
              </motion.span>
              Edit Profile
            </motion.span>
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {showEditProfileModal && (
          <EditProfileModal 
            darkMode={darkMode}
            userData={userData}
            onClose={() => setShowEditProfileModal(false)}
            onSave={updateUserProfile}
          />
        )}
      </AnimatePresence>
    </div>
  );
};


const EditProfileModal = ({ darkMode, userData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    displayName: userData.displayName || '',
    occupation: userData.occupation || '',
    bio: userData.bio || '',
    tags: userData.tags || [],
  });
  const [newTag, setNewTag] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className={`${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } p-8 rounded-lg shadow-xl max-w-md w-full`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="displayName" className="block mb-2">Display Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="occupation" className="block mb-2">Occupation</label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bio" className="block mb-2">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              rows="3"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  value={tag}
                  onClose={() => handleRemoveTag(tag)}
                  className={`${
                    darkMode 
                      ? 'bg-green-700 text-white' 
                      : 'bg-green-100 text-green-800'
                  } font-medium`}
                />
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a new tag"
                className={`mr-2 p-2 rounded flex-grow ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                }`}
              />
              <button
                onClick={handleAddTag}
                className={`px-4 py-2 rounded ${
                  darkMode 
                    ? 'bg-green-700 hover:bg-green-600 text-white' 
                    : 'bg-green-500 hover:bg-green-400 text-white'
                }`}
              >
                Add
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <motion.button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const TemplateModal = ({ darkMode, onClose, onSelectTemplate }) => {
  const templates = [
    { name: 'Professional', icon: FaUser },
    { name: 'Creative', icon: FaChartBar },
    { name: 'Minimalist', icon: FaClipboardList },
    { name: 'Tech', icon: FaBell },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className={`${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } p-8 rounded-lg shadow-xl max-w-md w-full`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Select a Template</h2>
        <div className="grid grid-cols-2 gap-4">
          {templates.map((template) => (
            <motion.button
              key={template.name}
              onClick={() => onSelectTemplate(template.name)}
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition duration-300 flex flex-col items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <template.icon className={`text-3xl mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              {template.name}
            </motion.button>
          ))}
        </div>
        <motion.button
          onClick={onClose}
          className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const PhotoUploadModal = ({ darkMode, onClose, onUpload, fileInputRef }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setPreviewImage(URL.createObjectURL(file));
    onUpload({ target: { files: [file] } });
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className={`${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } p-8 rounded-lg shadow-xl max-w-md w-full`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Profile Picture</h2>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : darkMode
              ? 'border-gray-600 hover:border-gray-500'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="mx-auto max-h-48 mb-4" />
          ) : (
            <FaUpload className="mx-auto text-4xl mb-4 text-gray-400" />
          )}
          {isDragActive ? (
            <p>Drop the image here ...</p>
          ) : (
            <p>Drag 'n' drop an image here, or click to select a file</p>
          )}
        </div>
        <div className="flex flex-col space-y-4">
          <motion.button
            onClick={() => fileInputRef.current.click()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 w-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Choose File
          </motion.button>
          <motion.button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 w-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LoadingOverlay = ({ darkMode }) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      variants={{
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
      }}
      initial="initial"
      animate="animate"
    >
      <PaperAirplaneIcon className="h-10 w-10 text-green-500" />
    </motion.div>
  </motion.div>
);

export default Dashboard;



















