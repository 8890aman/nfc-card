/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FaFacebook, FaLinkedin, FaDiscord, FaMedium, FaAt, FaTwitter, FaInstagram, FaUser, FaPhone, FaQrcode, FaUserCircle, FaGithub, FaYoutube, FaCalendar, FaChevronDown, FaChevronUp, FaGlobe, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { Carousel } from "@material-tailwind/react";

const BaseTemplate = ({ userData, links, socialLinks, tags, containerClassName, faqs = [], products = [] }) => {
  console.log('Products received in BaseTemplate:', products);
  const [showQR, setShowQR] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState('profile');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const [expandedFaq, setExpandedFaq] = useState(null);

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

  const buttonVariants = {
    rest: {
      background: "linear-gradient(45deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.2) 100%)",
      backgroundSize: "200% 200%",
      backgroundPosition: "0% 0%",
    },
    hover: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  const flowingRiverVariants = {
    initial: {
      opacity: 0,
    },
    hover: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const waveVariants = {
    initial: {
      y: 0,
    },
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [email, setEmail] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleNavClick = (item) => {
    setSelectedNavItem(item);
    if (item === 'qr') {
      setShowQR(true);
    } else if (item === 'phone') {
      saveContact();
    } else if (item === 'meeting') {
      setShowMeetingModal(true);
    } else {
      setShowQR(false);
      setShowMeetingModal(false);
    }
  };

  const handleMeetingSubmit = (e) => {
    e.preventDefault();
    const subject = `Meeting Request from ${name}`;
    const body = `
      Name: ${name}
      Email: ${email}
      Contact Number: ${contactNumber}
      Requested Appointment Time: ${appointmentTime}

      A new meeting has been requested. Please contact the sender to confirm the appointment.
    `;

    window.location.href = `mailto:${userData.email}?subject=${subject}&body=${body}`;

    setShowMeetingModal(false);
    setName('');
    setEmail('');
    setContactNumber('');
    setAppointmentTime('');
  };
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
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
      <div className="absolute inset-0 backdrop-filter backdrop-blur-md bg-black bg-opacity-30 -z-10" />

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
              { icon: <FaInstagram />, link: socialLinks.instagram },
              { icon: <FaFacebook />, link: socialLinks.facebook },
              { icon: <FaTwitter />, link: socialLinks.twitter },
              { icon: <FaLinkedin />, link: socialLinks.linkedin },
              { icon: <FaGithub />, link: socialLinks.github },
              { icon: <FaYoutube />, link: socialLinks.youtube },
              { icon: <FaDiscord />, link: socialLinks.discord },
              { icon: <FaMedium />, link: socialLinks.medium },
              { icon: <FaAt />, link: userData.email ? `mailto:${userData.email}` : null },
            ].filter(item => item.link).map((item, index) => (
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
            className={`${containerClassName} flex flex-col items-center`}
            variants={staggerChildrenVariants}
            initial="hidden"
            animate="visible"
          >
            {links.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.className} relative overflow-hidden border-2 border-green-400 rounded-lg px-4 py-2 mb-2 w-full max-w-xs text-center text-green-400 transition-colors duration-300 flex items-center justify-center`}
                variants={fadeInUpVariants}
                whileHover="hover"
                initial="initial"
              >
                <motion.div
                  className="absolute inset-0 z-0"
                  variants={flowingRiverVariants}
                >
                  <motion.path
                    d="M 0 0 L 100 0 L 100 100 L 0 100 Z"
                    variants={waveVariants}
                  />
                </motion.div>
                <FaGlobe className="mr-2" />
                <span className="relative z-10">{link.title}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <motion.div
              className="w-full max-w-4xl mt-8 p-4"
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-2xl font-bold text-center mb-4 text-green-300">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="border border-green-400 rounded-lg overflow-hidden"
                    initial={false}
                    animate={{ backgroundColor: expandedFaq === index ? 'rgba(34, 197, 94, 0.1)' : 'transparent' }}
                  >
                    <button
                      className="w-full px-4 py-2 text-left flex justify-between items-center text-green-300"
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    >
                      <span>{faq.question}</span>
                      <motion.div
                        animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaChevronDown />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
                          className="px-4 py-2 text-green-400"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Products Section */}
          {products.length > 0 && (
            <motion.div
              className="w-full max-w-4xl mt-8 p-4"
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-2xl font-bold text-center mb-4 text-green-300">Products</h3>
              <div className="overflow-hidden">
                <Carousel
                  className="rounded-xl scrollbar-hide"
                  prevArrow={({ handlePrev }) => (
                    products.length > 1 && (
                      <button
                        onClick={handlePrev}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-green-500 rounded-full p-2 text-white"
                      >
                        <FaChevronLeft />
                      </button>
                    )
                  )}
                  nextArrow={({ handleNext }) => (
                    products.length > 1 && (
                      <button
                        onClick={handleNext}
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-green-500 rounded-full p-2 text-white"
                      >
                        <FaChevronRight />
                      </button>
                    )
                  )}
                  navigation={({ setActiveIndex, activeIndex, length }) => (
                    products.length > 1 && (
                      <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                        {new Array(length).fill("").map((_, i) => (
                          <span
                            key={i}
                            className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                              activeIndex === i ? "w-8 bg-green-500" : "w-4 bg-green-300"
                            }`}
                            onClick={() => setActiveIndex(i)}
                          />
                        ))}
                      </div>
                    )
                  )}
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={index}
                      className="h-full flex flex-col items-center justify-center p-4"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-4" />
                      <h4 className="text-xl font-semibold mb-2 text-green-300">{product.name}</h4>
                      <p className="text-sm mb-2 text-green-400 max-h-20 overflow-y-auto custom-scrollbar">{product.description}</p>
                      <div className="flex flex-col items-center w-full mt-auto">
                        <span className="text-lg font-bold text-green-300 mb-2">₹{product.price}</span>
                        <a
                          href={product.buyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full transition duration-300 flex items-center"
                        >
                          <FaShoppingCart className="mr-2" />
                          Buy Now
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </Carousel>
              </div>
            </motion.div>
          )}

          {/* Footer */}
       
        </div>
      </motion.div>

      {/* Spacer to push content above the navigation bar */}
      <div className="flex-grow z-20" />

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

      {/* Meeting Modal */}
      <AnimatePresence>
        {showMeetingModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMeetingModal(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Schedule a Meeting</h2>
              <form onSubmit={handleMeetingSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="contactNumber" className="block text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="appointmentTime" className="block text-gray-700 mb-2">Appointment Time</label>
                  <input
                    type="datetime-local"
                    id="appointmentTime"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    min={getCurrentDateTime()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-400 text-white py-2 px-4 rounded-md hover:bg-green-500 transition-colors duration-300"
                >
                  Request Meeting
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <motion.div
        className="relative z-10 border-t border-green-700/50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <NavButton icon={FaPhone} rotate={true} isSelected={selectedNavItem === 'phone'} onClick={() => handleNavClick('phone')} />
            <NavButton icon={FaUserCircle} isSelected={selectedNavItem === 'profile'} onClick={() => handleNavClick('profile')} />
            <NavButton icon={FaQrcode} isSelected={selectedNavItem === 'qr'} onClick={() => handleNavClick('qr')} />
            <NavButton icon={FaCalendar} isSelected={selectedNavItem === 'meeting'} onClick={() => handleNavClick('meeting')} />
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