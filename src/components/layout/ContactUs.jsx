/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faPaperPlane, faClock, faGlobe, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import AnimatedBackground from '../utils/AnimatedBackground';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [showToast, setShowToast] = useState(false);
  const envelopeControls = useAnimation();
  const toastControls = useAnimation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields");
      return;
    }

    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    // Trigger envelope animation
    await envelopeControls.start({
      scale: [1, 1.2, 1],
      x: [0, -25, window.innerWidth / 2],
      y: [0, -25, -window.innerHeight / 2],
      rotate: [0, -10, 45],
      opacity: [1, 1, 0],
      transition: { duration: 2, ease: "easeInOut" }
    });

    // Show toast notification
    setShowToast(true);
    await toastControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    });

    // Hide toast after 3 seconds
    setTimeout(async () => {
      await toastControls.start({
        opacity: 0,
        y: -20,
        transition: { duration: 0.5, ease: "easeIn" }
      });
      setShowToast(false);
    }, 3000);

    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const contactInfo = [
    { icon: faEnvelope, text: 'contact@neotech.com' },
    { icon: faPhone, text: '+1 (555) 123-4567' },
    { icon: faMapMarkerAlt, text: '123 Tech Street, Silicon Valley, CA' },
    { icon: faClock, text: 'Mon-Fri: 9AM-6PM (PST)' },
    { icon: faGlobe, text: 'www.neotech.com' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const postmanVariants = {
    wave: {
      rotate: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <section className="relative py-16 bg-gradient-to-br from-green-50 to-white dark:from-green-900 dark:to-black transition-colors duration-300 overflow-hidden">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70 backdrop-blur-xl z-0"></div>
      
      <div className="container mx-auto px-4 relative z-20">
        <motion.h2 
          className="text-5xl font-bold mb-12 text-center text-green-700 dark:text-green-300"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          Contact Us
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-200">Get in Touch</h3>
            <p className="text-green-700 dark:text-green-300 mb-8 text-lg">
              We'd love to hear from you. Reach out to us for any inquiries or collaborations.
            </p>
            {contactInfo.map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center mb-6"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-4">
                  <FontAwesomeIcon icon={item.icon} className="text-2xl text-green-600 dark:text-green-300" />
                </div>
                <span className="text-green-700 dark:text-green-300 text-lg">{item.text}</span>
              </motion.div>
            ))}
            <motion.div 
              className="mt-12"
              variants={itemVariants}
            >
              <h4 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-200">Our Location</h4>
              <div className="w-full h-64 bg-green-100 dark:bg-green-800 rounded-lg overflow-hidden">
                {/* Replace with an actual map component or embed */}
                <div className="w-full h-full flex items-center justify-center text-green-600 dark:text-green-300">
                  Interactive Map Placeholder
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <div className="relative">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-green-600 text-white px-4 py-3 rounded-t-lg shadow-lg flex items-center justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={toastControls}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              <span className="font-semibold">Message received successfully!</span>
            </motion.div>
            
            <motion.form
              onSubmit={handleSubmit}
              variants={itemVariants}
              className="bg-white dark:bg-green-900 shadow-xl rounded-lg p-8 mt-12"
            >
              <motion.div className="mb-6" variants={itemVariants}>
                <label htmlFor="name" className="block text-green-700 dark:text-green-300 mb-2 text-lg">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-green-50 dark:bg-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800 dark:text-green-200"
                  required
                />
              </motion.div>
              <motion.div className="mb-6" variants={itemVariants}>
                <label htmlFor="email" className="block text-green-700 dark:text-green-300 mb-2 text-lg">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-green-50 dark:bg-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800 dark:text-green-200"
                  required
                />
              </motion.div>
              <motion.div className="mb-6" variants={itemVariants}>
                <label htmlFor="message" className="block text-green-700 dark:text-green-300 mb-2 text-lg">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-green-50 dark:bg-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800 dark:text-green-200 resize-none"
                  required
                ></textarea>
              </motion.div>
              <motion.button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                Send Message
              </motion.button>
            </motion.form>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-200">Connect With Us</h3>
          <p className="text-green-700 dark:text-green-300 mb-8 text-lg">
            Follow us on social media for the latest updates and tech insights.
          </p>
          <div className="flex justify-center space-x-6">
            {['facebook', 'twitter', 'linkedin', 'instagram'].map((social, index) => (
              <motion.a
                key={social}
                href={`https://${social}.com/neotech`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon={['fab', social]} size="2x" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={envelopeControls}
        className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <FontAwesomeIcon
          icon={faEnvelope}
          className="text-6xl text-green-500"
          style={{ filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))' }}
        />
      </motion.div>
    </section>
  );
};

export default ContactUs;
