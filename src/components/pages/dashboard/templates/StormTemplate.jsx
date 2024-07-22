import React, { useRef, useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from 'react-spring';
import { FaFacebook, FaLinkedin, FaDiscord, FaMedium, FaAt, FaTwitter, FaInstagram, FaUser, FaPhone, FaQrcode, FaUserCircle, FaGithub, FaYoutube, FaCalendar, FaChevronDown, FaChevronUp, FaGlobe, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import stormVideo from '../../../../assets/video/15250-262569986_medium.mp4';
import { Carousel } from "@material-tailwind/react";

const StormTemplate = ({ userData, links, socialLinks, tags, containerClassName, faqs = [], products = [] }) => {
  const [showQR, setShowQR] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState('profile');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [email, setEmail] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleNavClick = (item) => {
    setSelectedNavItem(item);
    if (item === 'qr') {
      setShowQR(true);
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col bg-gray-900 text-blue-200 ">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(90%)' }}
      >
        <source src={stormVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to darken the video */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex-grow w-full flex flex-col items-center justify-center p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full max-w-4xl backdrop-blur-sm  bg-opacity-50 p-8 rounded-lg">
          {/* Profile section */}
          <motion.div
            className="w-40 h-40 mx-auto mb-6 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden shadow-lg">
              {userData.photoURL ? (
                <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="w-16 h-16 text-white" />
              )}
            </div>
          </motion.div>
          
          {/* Name */}
          <motion.h2
            className="text-2xl font-bold text-center mb-2 text-blue-300"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {userData.displayName}
          </motion.h2>

          {/* Bio section */}
          <motion.div
            className="mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-center mb-2 text-blue-200">{userData.tagline}</p>
            <p className="text-sm text-center text-blue-300">{userData.bio}</p>
          </motion.div>

          {/* Tags */}
          <motion.div
            className="flex flex-wrap justify-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, staggerChildren: 0.1 }}
          >
            {tags.map((tag, index) => (
              <motion.span
                key={index}
                className="bg-blue-500 bg-opacity-20 text-blue-200 text-xs px-2 py-1 rounded-full m-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.3)" }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {/* Social icons */}
          <motion.div
            className="flex justify-center space-x-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, staggerChildren: 0.1 }}
          >
            {Object.entries(socialLinks).filter(([_, link]) => link).map(([platform, link], index) => {
              let Icon;
              switch (platform) {
                case 'instagram': Icon = FaInstagram; break;
                case 'facebook': Icon = FaFacebook; break;
                case 'twitter': Icon = FaTwitter; break;
                case 'linkedin': Icon = FaLinkedin; break;
                case 'github': Icon = FaGithub; break;
                case 'youtube': Icon = FaYoutube; break;
                case 'discord': Icon = FaDiscord; break;
                case 'medium': Icon = FaMedium; break;
                default: Icon = FaGlobe;
              }
              return (
                <motion.a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-blue-400 rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-gray-900 transition-colors duration-300"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon />
                </motion.a>
              );
            })}
            {userData.email && (
              <motion.a
                href={`mailto:${userData.email}`}
                className="w-8 h-8 border border-blue-400 rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-gray-900 transition-colors duration-300"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaAt />
              </motion.a>
            )}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className={`${containerClassName} flex flex-col items-center`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, staggerChildren: 0.1 }}
          >
            {links.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.className} relative overflow-hidden border-2 border-blue-400 rounded-lg px-4 py-2 mb-2 w-full max-w-xs text-center text-blue-300 transition-colors duration-300 flex items-center justify-center`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGlobe className="mr-2" />
                <span>{link.title}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-blue-300 text-lg font-bold mb-4 text-center">Frequently Asked Questions</h3>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border border-blue-400 rounded-lg mb-4 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div
                  className="p-4 cursor-pointer hover:bg-blue-500 hover:bg-opacity-20 transition-colors duration-300 flex justify-between items-center"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <h4 className="text-blue-200 font-bold">{faq.question}</h4>
                  {expandedFaq === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-blue-500 bg-opacity-10"
                    >
                      <p className="text-blue-200 p-4">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Products Section */}
          {products.length > 0 && (
            <motion.div
              className="mt-8 w-full max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-center mb-4 text-blue-300">Products</h3>
              <Carousel
                className="rounded-xl"
                prevArrow={({ handlePrev }) => (
                  products.length > 1 && (
                    <button
                      onClick={handlePrev}
                      className="absolute top-1/2 left-4 -translate-y-1/2 bg-blue-400/30 hover:bg-blue-400/50 rounded-full p-2 text-white transition-colors"
                    >
                      <FaChevronLeft />
                    </button>
                  )
                )}
                nextArrow={({ handleNext }) => (
                  products.length > 1 && (
                    <button
                      onClick={handleNext}
                      className="absolute top-1/2 right-4 -translate-y-1/2 bg-blue-400/30 hover:bg-blue-400/50 rounded-full p-2 text-white transition-colors"
                    >
                      <FaChevronRight />
                    </button>
                  )
                )}
              >
                {products.map((product, index) => (
                  <div key={index} className="h-full flex flex-col items-center justify-center p-4">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-4" />
                    <h4 className="text-xl font-semibold mb-2 text-blue-300">{product.name}</h4>
                    <p className="text-sm mb-2 text-blue-200 max-h-20 overflow-y-auto">{product.description}</p>
                    <div className="flex flex-col items-center w-full mt-auto">
                      <span className="text-lg font-bold text-blue-300 mb-2">₹{product.price}</span>
                      <a
                        href={product.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-400 hover:bg-blue-500 text-gray-900 py-2 px-4 rounded-full transition duration-300 flex items-center"
                      >
                        <FaShoppingCart className="mr-2" />
                        Buy Now
                      </a>
                    </div>
                  </div>
                ))}
              </Carousel>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        className=" bottom-0 left-0 right-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm relative"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <NavButton icon={FaPhone} isSelected={selectedNavItem === 'phone'} onClick={() => handleNavClick('phone')} />
            <NavButton icon={FaUserCircle} isSelected={selectedNavItem === 'profile'} onClick={() => handleNavClick('profile')} />
            <NavButton icon={FaQrcode} isSelected={selectedNavItem === 'qr'} onClick={() => handleNavClick('qr')} />
            <NavButton icon={FaCalendar} isSelected={selectedNavItem === 'meeting'} onClick={() => handleNavClick('meeting')} />
          </div>
        </div>
      </motion.div>

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
    </div>
  );
};

const NavButton = ({ icon: Icon, isSelected, onClick }) => (
  <motion.button
    className="group flex flex-col items-center"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
  >
    <motion.div
      className={`p-3 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-blue-400/10'} group-hover:bg-blue-400/20 transition-all duration-300`}
    >
      <Icon className={`text-2xl ${isSelected ? 'text-gray-900' : 'text-blue-300'} group-hover:text-white transition-colors duration-300`} />
    </motion.div>
  </motion.button>
);

export default StormTemplate;