import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaLinkedin,
  FaDiscord,
  FaMedium,
  FaAt,
  FaTwitter,
  FaInstagram,
  FaUser,
  FaPhone,
  FaQrcode,
  FaUserCircle,
  FaGithub,
  FaYoutube,
  FaCalendar,
  FaChevronDown,
  FaChevronUp,
  FaGlobe,
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import { Carousel } from "@material-tailwind/react";
import video from "../../../../assets/video/WhatsApp Video 2024-07-20 at 2.13.51 PM.mp4";
// Define NavButton component before BeautifulDayTemplate
const NavButton = ({ icon: Icon, isSelected, onClick }) => (
  <button className="group flex flex-col items-center" onClick={onClick}>
    <div
      className={`p-3 rounded-full ${
        isSelected ? "bg-white" : "bg-white/10"
      } group-hover:bg-white/20 transition-all duration-300`}
    >
      <Icon
        className={`text-2xl ${
          isSelected ? "text-black" : "text-white"
        } group-hover:text-white transition-colors duration-300`}
      />
    </div>
  </button>
);

const BeautifulDayTemplate = ({
  userData,
  links,
  socialLinks,
  tags,
  containerClassName,
  faqs = [],
  products = [],
}) => {
  const saveContact = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${userData.displayName}
TEL:${userData.mobileNumber || ""}
EMAIL:${userData.email}
END:VCARD`;
    const blob = new Blob([vCard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${userData.displayName}.vcf`;
    document.body.appendChild(a); // Append the anchor to the body
    a.click();
    document.body.removeChild(a); // Remove the anchor from the body
    URL.revokeObjectURL(url);
  };
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState("profile");
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [email, setEmail] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleNavClick = (item) => {
    setSelectedNavItem(item);
    if (item === "qr") {
      setShowQR(true);
    } else if (item === "meeting") {
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
    setName("");
    setEmail("");
    setContactNumber("");
    setAppointmentTime("");
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 [radial-gradient(ellipse_45%_50%_at_50%_50%,_rgba(255,255,255,0.5)_0,rgba(0,0,0,0)_100%)] z-0 animate-pulse"></div>

      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
        ref={(el) => {
          if (el) {
            el.playbackRate = 0.5; // Adjust this value to control the speed (0.5 is half speed)
          }
        }}
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay with backdrop blur */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex-grow w-full flex flex-col items-center justify-center p-4 sm:p-8 text-white">
        <div className="w-full max-w-4xl">
          {/* Profile section with Framer Motion animation */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background: [
                  "linear-gradient(0deg, #ff00ff, #00ffff)",
                  "linear-gradient(90deg, #00ffff, #ff00ff)",
                  "linear-gradient(180deg, #ff00ff, #00ffff)",
                  "linear-gradient(270deg, #00ffff, #ff00ff)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <div className="absolute inset-1 bg-black rounded-full"></div>
            <div className="absolute inset-2 rounded-full overflow-hidden">
              {userData.photoURL ? (
                <img
                  src={userData.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-400">
                  <FaUser className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <h2 className="text-2xl font-bold text-center mb-2 text-white">
            {userData.displayName}
          </h2>

          {/* Bio section */}
          <div className="mb-6">
            <p className="text-sm text-center mb-2 text-gray-300">
              {userData.tagline}
            </p>
            <p className="text-sm text-center text-white">{userData.bio}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center mb-6">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full m-1"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex justify-center space-x-4 mb-8">
            {Object.entries(socialLinks)
              .filter(([_, link]) => link)
              .map(([platform, link], index) => {
                let Icon;
                switch (platform) {
                  case "instagram":
                    Icon = FaInstagram;
                    break;
                  case "facebook":
                    Icon = FaFacebook;
                    break;
                  case "twitter":
                    Icon = FaTwitter;
                    break;
                  case "linkedin":
                    Icon = FaLinkedin;
                    break;
                  case "github":
                    Icon = FaGithub;
                    break;
                  case "youtube":
                    Icon = FaYoutube;
                    break;
                  case "discord":
                    Icon = FaDiscord;
                    break;
                  case "medium":
                    Icon = FaMedium;
                    break;
                  default:
                    Icon = FaGlobe;
                }
                return (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    <Icon />
                  </a>
                );
              })}
            {userData.email && (
              <a
                href={`mailto:${userData.email}`}
                className="w-8 h-8 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
              >
                <FaAt />
              </a>
            )}
          </div>

          {/* Action buttons */}
          <div className={`${containerClassName} flex flex-col items-center`}>
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden border-2 border-white rounded-lg px-4 py-2 mb-2 w-full max-w-xs text-center text-white transition-colors duration-300 flex items-center justify-center hover:bg-white hover:text-black"
              >
                <FaGlobe className="mr-2" />
                <span>{link.title}</span>
              </a>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-4">
            <h3 className="text-white text-lg font-bold mb-4">FAQs</h3>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-white rounded-lg mb-4 overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors duration-300 flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <h4 className="text-white font-bold">{faq.question}</h4>
                  {openFaqIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white bg-opacity-10"
                    >
                      <p className="text-white p-4">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          {/* Products Section */}
          {products.length > 0 && (
            <div className="mt-8 w-full">
              <h3 className="text-2xl font-bold text-center mb-4 text-white">
                Products
              </h3>
              <Carousel
                className="rounded-xl"
                prevArrow={({ handlePrev }) =>
                  products.length > 1 && (
                    <button
                      onClick={handlePrev}
                      className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white transition-colors"
                    >
                      <FaChevronLeft />
                    </button>
                  )
                }
                nextArrow={({ handleNext }) =>
                  products.length > 1 && (
                    <button
                      onClick={handleNext}
                      className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white transition-colors"
                    >
                      <FaChevronRight />
                    </button>
                  )
                }
              >
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="h-full flex flex-col items-center justify-center p-4"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <h4 className="text-xl font-semibold mb-2 text-white">
                      {product.name}
                    </h4>
                    <p className="text-sm mb-2 text-gray-300 max-h-20 overflow-y-auto">
                      {product.description}
                    </p>
                    <div className="flex flex-col items-center w-full mt-auto">
                      <span className="text-lg font-bold text-white mb-2">
                        ₹{product.price}
                      </span>
                      <a
                        href={product.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-opacity-80 text-black py-2 px-4 rounded-full transition duration-300 flex items-center"
                      >
                        <FaShoppingCart className="mr-2" />
                        Buy Now
                      </a>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="relative bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm z-30">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <NavButton
              icon={FaPhone}
              onClick={() => handleNavClick(saveContact)}
            />
            <NavButton
              icon={FaUserCircle}
              isSelected={selectedNavItem === "profile"}
              onClick={() => handleNavClick("profile")}
            />
            <NavButton
              icon={FaQrcode}
              isSelected={selectedNavItem === "qr"}
              onClick={() => handleNavClick("qr")}
            />
            <NavButton
              icon={FaCalendar}
              isSelected={selectedNavItem === "meeting"}
              onClick={() => handleNavClick("meeting")}
            />
          </div>
        </div>
      </div>

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
              <p className="mt-4 text-center text-gray-700">
                Scan to view this profile
              </p>
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
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Schedule a Meeting
              </h2>
              <form onSubmit={handleMeetingSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Name
                  </label>
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
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email
                  </label>
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
                  <label
                    htmlFor="contactNumber"
                    className="block text-gray-700 mb-2"
                  >
                    Contact Number
                  </label>
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
                  <label
                    htmlFor="appointmentTime"
                    className="block text-gray-700 mb-2"
                  >
                    Appointment Time
                  </label>
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

export default BeautifulDayTemplate;
