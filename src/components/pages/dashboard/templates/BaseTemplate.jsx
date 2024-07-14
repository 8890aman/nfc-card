/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FaFacebook, FaLinkedin, FaDiscord, FaMedium, FaAt, FaTwitter, FaUser, FaPhone, FaQrcode, FaUserCircle } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

const BaseTemplate = ({ userData, links, socialLinks, tags, children, className, style }) => {
  const [showQR, setShowQR] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState('profile');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const liquidVariants = {
    animate: {
      borderRadius: [
        "60% 40% 30% 70%/60% 30% 70% 40%",
        "30% 60% 70% 40%/50% 60% 30% 60%",
        "60% 40% 30% 70%/60% 30% 70% 40%"
      ],
      transition: {
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  const textRevealVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerChildrenVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const handleNavClick = (item) => {
    setSelectedNavItem(item);
    if (item === 'qr') {
      setShowQR(true);
    } else if (item === 'phone') {
      saveContact();
    } else {
      setShowQR(false);
    }
  };

  const saveContact = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${userData.displayName}
TEL:${userData.mobileNumber || ''}
EMAIL:${userData.email}
END:VCARD`;
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userData.displayName}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Background with blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
        <motion.div
          className="absolute top-0 left-0 w-64 h-64 bg-green-400 rounded-full filter blur-3xl opacity-50"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-green-600 rounded-full filter blur-3xl opacity-50"
          animate={{
            x: [0, -150, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500 rounded-full filter blur-3xl opacity-50"
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Backdrop filter layer */}
      <div className="absolute inset-0 backdrop-filter backdrop-blur-md bg-black bg-opacity-30" />

      {/* Content */}
      <motion.div
        className="relative z-10 min-h-[60vh] w-full flex flex-col items-center justify-center p-4 sm:p-8 text-green-400"
        variants={fadeInUpVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-4xl">
          {/* Profile section with liquid animation */}
          <motion.div
            className="w-40 h-40 mx-auto mb-6 relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-300 to-green-500 opacity-70"
              variants={liquidVariants}
              animate="animate"
            />
            <div className="w-32 h-32 bg-black rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full  border-white rounded-full overflow-hidden">
                {userData.photoURL ? (
                  <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser className="w-16 h-16 text-green-400" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Name */}
          <motion.h2
            className="text-2xl font-bold text-center mb-2 text-green-300"
            variants={textRevealVariants}
            initial="hidden"
            animate="visible"
          >
            {userData.displayName}
          </motion.h2>

          {/* Bio section */}
          <motion.div
            className="mb-6"
            variants={textRevealVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-center mb-2 text-green-400">{userData.tagline}</p>
            <p className="text-sm text-center text-green-500">{userData.bio}</p>
          </motion.div>

          {/* Tags */}
          <motion.div
            className="flex flex-wrap justify-center mb-6"
            variants={staggerChildrenVariants}
            initial="hidden"
            animate="visible"
          >
            {tags.map((tag, index) => (
              <motion.span
                key={index}
                className="bg-green-500 bg-opacity-20 text-green-300 text-xs px-2 py-1 rounded-full m-1"
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(34, 197, 94, 0.3)" }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {/* Social icons */}
          <motion.div
            className="flex justify-center space-x-4 mb-8"
            variants={staggerChildrenVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: <FaFacebook />, link: socialLinks.facebook },
              { icon: <FaLinkedin />, link: socialLinks.linkedin },
              { icon: <FaDiscord />, link: socialLinks.discord },
              { icon: <FaMedium />, link: socialLinks.medium },
              { icon: <FaAt />, link: `mailto:${userData.email}` },
              { icon: <FaTwitter />, link: socialLinks.twitter },
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-green-400 rounded-full flex items-center justify-center hover:bg-green-400 hover:text-black transition-colors duration-300"
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
              >
                {item.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            variants={staggerChildrenVariants}
            initial="hidden"
            animate="visible"
          >
            {links.slice(0, 4).map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-green-400 rounded-full py-2 px-4 text-center hover:bg-green-400 hover:text-black transition-colors duration-300"
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 197, 94, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                {link.title}
              </motion.a>
            ))}
          </motion.div>

          {/* Footer */}
       
        </div>
      </motion.div>

      {/* Spacer to push content above the navigation bar */}
      <div className="flex-grow" />

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQR(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <QRCodeSVG value={window.location.href} size={200} />
              <p className="mt-4 text-center text-gray-700">Scan to view this profile</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <motion.div
        className="relative z-10 backdrop-filter backdrop-blur-3xl border-t border-green-700/50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <NavButton icon={FaPhone} rotate={true} isSelected={selectedNavItem === 'phone'} onClick={() => handleNavClick('phone')} />
            <NavButton icon={FaUserCircle} isSelected={selectedNavItem === 'profile'} onClick={() => handleNavClick('profile')} />
            <NavButton icon={FaQrcode} isSelected={selectedNavItem === 'qr'} onClick={() => handleNavClick('qr')} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const NavButton = ({ icon: Icon, rotate = false, isSelected = false, onClick }) => (
  <motion.button
    className="group flex flex-col items-center"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
  >
    <motion.div
      className={`p-3 rounded-full ${isSelected ? 'bg-green-400' : 'bg-green-400/10'} group-hover:bg-green-400/20 transition-all duration-300 ${rotate ? 'transform rotate-45' : ''}`}
      whileHover={{ rotate: rotate ? 90 : 0 }}
    >
      <Icon className={`text-2xl ${isSelected ? 'text-black' : 'text-green-300'} group-hover:text-white transition-colors duration-300`} />
    </motion.div>
  </motion.button>
);

export default BaseTemplate;