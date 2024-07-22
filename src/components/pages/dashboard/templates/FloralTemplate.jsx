import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FaFacebook, FaLinkedin, FaDiscord, FaMedium, FaAt, FaTwitter, FaInstagram, FaUser, FaPhone, FaQrcode, FaUserCircle, FaGithub, FaYoutube, FaCalendar, FaChevronDown, FaChevronUp, FaGlobe, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { Carousel } from "@material-tailwind/react";

const FloralTemplate = ({ userData, links, socialLinks, tags, containerClassName, faqs = [], products = [] }) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState('profile');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [email, setEmail] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
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
    document.body.appendChild(a); // Append the anchor to the body
    a.click();
    document.body.removeChild(a); // Remove the anchor from the body
    URL.revokeObjectURL(url);
  };
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  
  const fadeInUpVariants = {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { y: -100, opacity: 0, transition: { duration: 0.6, ease: "easeIn" } }
  };

  const textRevealVariants = {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { x: 100, opacity: 0, transition: { duration: 0.6, ease: "easeIn" } }
  };

  const staggerChildrenVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
  };

  const flowerVariants = {
    initial: { y: -100, opacity: 0, rotate: 0 },
    animate: { 
      y: 800, 
      opacity: [0, 1, 1, 0],
      rotate: 360,
      transition: { 
        duration: 10,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
        delay: Math.random() * 5
      }
    }
  };

  const profileVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const profileBackgroundVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: 360,
      transition: { 
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSelectFaq = (faq) => {
    setSelectedFaq(faq);
    handleOpenModal();
  };

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
    <motion.div
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Blurred background with flowers */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-white overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            variants={flowerVariants}
            initial="initial"
            animate="animate"
            custom={i}
          >
            <svg 
              className="w-20 h-20 md:w-24 md:h-24"
              fill="#ff7ace" 
              version="1.1" 
              id="Capa_1" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 407.814 407.814" 
              xml:space="preserve"
            >
              <path d="M353.985,203.905c35.145-20.995,47.049-66.379,26.508-101.954c-20.54-35.575-65.794-47.957-101.547-28.017 C278.336,33.001,244.985,0,203.907,0c-41.079,0-74.431,33.001-75.039,73.937c-35.754-19.94-81.01-7.557-101.549,28.02 C6.78,137.531,18.683,182.915,53.83,203.908c-35.146,20.995-47.05,66.379-26.51,101.954c20.54,35.576,65.796,47.958,101.55,28.017 c0.607,40.936,33.96,73.938,75.039,73.936c41.08,0,74.43-33.002,75.038-73.936c35.754,19.939,81.011,7.557,101.548-28.021 C401.035,270.282,389.13,224.898,353.985,203.905z M203.907,272.65c-37.966,0-68.744-30.777-68.744-68.744 s30.778-68.744,68.744-68.744c37.965,0,68.744,30.777,68.744,68.744S241.873,272.65,203.907,272.65z"></path>
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex-grow w-full flex flex-col items-center justify-center p-4 sm:p-8 text-pink-700"
        variants={fadeInUpVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-4xl">
          {/* Profile section with image on top of the flower background */}
          <div className="w-40 h-40 mx-auto mb-6 relative">
            <motion.div
              className="absolute inset-0 w-full h-full"
              variants={profileBackgroundVariants}
              initial="initial"
              animate="animate"
            >
              <svg 
                viewBox="0 0 16 16" 
                version="1.1" 
                xmlns="http://www.w3.org/2000/svg" 
                xmlnsXlink="http://www.w3.org/1999/xlink" 
                className="w-full h-full" 
                fill="#fc3dff" 
                stroke="#fc3dff"
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <path 
                    d="M15.164,8.404 C14.993,8.31 14.642,8.167 14.182,8.001 C14.642,7.835 14.992,7.693 15.163,7.599 C16.179,7.05 16.284,5.439 15.398,4.001 C14.511,2.564 12.969,1.844 11.954,2.392 C11.781,2.487 11.474,2.698 11.089,2.989 C11.167,2.531 11.208,2.175 11.208,1.989 C11.208,0.889 9.771,-0.000999999989 8,-0.000999999989 C6.229,-0.000999999989 4.79,0.889 4.79,1.989 C4.79,2.175 4.833,2.53 4.911,2.987 C4.526,2.696 4.22,2.485 4.048,2.391 C3.032,1.842 1.488,2.562 0.603,4 C-0.282,5.437 -0.176,7.048 0.838,7.597 C1.011,7.692 1.36,7.835 1.823,8.001 C1.36,8.168 1.009,8.311 0.837,8.405 C-0.179,8.954 -0.284,10.563 0.602,12.002 C1.488,13.439 3.031,14.159 4.046,13.61 C4.219,13.517 4.525,13.306 4.911,13.015 C4.833,13.472 4.79,13.825 4.79,14.012 C4.79,15.111 6.226,16.001 8,16.001 C9.771,16.001 11.208,15.111 11.208,14.012 C11.208,13.825 11.167,13.47 11.089,13.011 C11.474,13.304 11.782,13.516 11.955,13.609 C12.971,14.158 14.513,13.439 15.398,12.002 C16.285,10.563 16.179,8.953 15.164,8.404 L15.164,8.404 Z M8,11.047 C6.315,11.047 4.951,9.683 4.951,8.001 C4.951,6.319 6.315,4.955 8,4.955 C9.683,4.955 11.049,6.319 11.049,8.001 C11.048,9.683 9.682,11.047 8,11.047 L8,11.047 Z" 
                    fill="#ff00c8" 
                    className="si-glyph-fill"
                  />
                </g>
              </svg>
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={profileVariants}
              initial="initial"
              animate="animate"
            >
              <div className="w-52 h-52 rounded-full flex items-center justify-center overflow-hidden">
                <div className="w-[110px] h-[110px] rounded-full overflow-hidden">
                  {userData.photoURL ? (
                    <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-pink-400">
                      <FaUser className="w-14 h-14 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Name */}
          <motion.h2
            className="text-2xl font-bold text-center mb-2 text-pink-700"
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
            <p className="text-sm text-center mb-2 text-pink-600">{userData.tagline}</p>
            <p className="text-sm text-center text-pink-700">{userData.bio}</p>
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
                className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full m-1"
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(236, 72, 153, 0.3)" }}
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
                  className="w-8 h-8 border border-pink-600 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-300"
                  variants={fadeInUpVariants}
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
                className="w-8 h-8 border border-pink-600 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-300"
                variants={fadeInUpVariants}
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
                className={`${link.className} relative overflow-hidden border-2 border-pink-400 rounded-lg px-4 py-2 mb-2 w-full max-w-xs text-center text-pink-600 transition-colors duration-300 flex items-center justify-center`}
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(236, 72, 153, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGlobe className="mr-2" />
                <span>{link.title}</span>
              </motion.a>
            ))}
          </motion.div>

        
          {/* FAQ Section */}
          <motion.div
            className="mt-4"
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-pink-700 text-lg font-bold mb-4">FAQs</h3>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border rounded-lg mb-4 overflow-hidden"
                variants={fadeInUpVariants}
              >
                <div
                  className="p-4 cursor-pointer hover:bg-pink-100 transition-colors duration-300 flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <h4 className="text-pink-700 font-bold">{faq.question}</h4>
                  {openFaqIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-pink-50"
                    >
                      <p className="text-pink-600 p-4">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
        {/* Products Section */}
        {products.length > 0 && (
            <motion.div
              className="mt-8 w-full"
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-2xl font-bold text-center mb-4 text-pink-700">Products</h3>
              <Carousel
                className="rounded-xl"
                prevArrow={({ handlePrev }) => (
                  products.length > 1 && (
                    <button
                      onClick={handlePrev}
                      className="absolute top-1/2 left-4 -translate-y-1/2 bg-pink-500 rounded-full p-2 text-white"
                    >
                      <FaChevronLeft />
                    </button>
                  )
                )}
                nextArrow={({ handleNext }) => (
                  products.length > 1 && (
                    <button
                      onClick={handleNext}
                      className="absolute top-1/2 right-4 -translate-y-1/2 bg-pink-500 rounded-full p-2 text-white"
                    >
                      <FaChevronRight />
                    </button>
                  )
                )}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={index}
                    className="h-full flex flex-col items-center justify-center p-4"
                    variants={fadeInUpVariants}
                  >
                    <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-4" />
                    <h4 className="text-xl font-semibold mb-2 text-pink-700">{product.name}</h4>
                    <p className="text-sm mb-2 text-pink-600 max-h-20 overflow-y-auto">{product.description}</p>
                    <div className="flex flex-col items-center w-full mt-auto">
                      <span className="text-lg font-bold text-pink-700 mb-2">₹{product.price}</span>
                      <a
                        href={product.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-full transition duration-300 flex items-center"
                      >
                        <FaShoppingCart className="mr-2" />
                        Buy Now
                      </a>
                    </div>
                  </motion.div>
                ))}
              </Carousel>
            </motion.div>
          )}


      {/* Navigation */}
      <motion.div
        className="relative bottom-0 left-0 right-0 bg-pink-500 bg-opacity-50 backdrop-blur-sm"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <NavButton icon={FaPhone} isSelected={selectedNavItem === 'phone'} onClick={() => handleNavClick(saveContact)} />
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
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
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
              <h2 className="text-2xl font-bold mb-4 text-pink-700">Schedule a Meeting</h2>
              <form onSubmit={handleMeetingSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-pink-600 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-pink-600 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="contactNumber" className="block text-pink-600 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="appointmentTime" className="block text-pink-600 mb-2">Appointment Time</label>
                  <input
                    type="datetime-local"
                    id="appointmentTime"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    min={getCurrentDateTime()}
                    className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors duration-300"
                >
                  Request Meeting
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
      className={`p-3 rounded-full ${isSelected ? 'bg-pink-600' : 'bg-pink-600/10'} group-hover:bg-pink-600/20 transition-all duration-300`}
    >
      <Icon className={`text-2xl ${isSelected ? 'text-white' : 'text-pink-600'} group-hover:text-white transition-colors duration-300`} />
    </motion.div>
  </motion.button>
);

export default FloralTemplate;