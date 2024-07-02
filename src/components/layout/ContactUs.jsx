/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import AnimatedBackground from '../utils/AnimatedBackground';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const contactInfo = [
    { icon: faEnvelope, text: 'contact@neotech.com' },
    { icon: faPhone, text: '+1 (555) 123-4567' },
    { icon: faMapMarkerAlt, text: '123 Tech Street, Silicon Valley, CA' },
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
              >
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-4">
                  <FontAwesomeIcon icon={item.icon} className="text-2xl text-green-600 dark:text-green-300" />
                </div>
                <span className="text-green-700 dark:text-green-300 text-lg">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.form
            onSubmit={handleSubmit}
            variants={itemVariants}
            className="bg-white dark:bg-green-900 shadow-xl rounded-lg p-8"
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
                rows="4"
                className="w-full px-4 py-3 bg-green-50 dark:bg-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800 dark:text-green-200"
                required
              ></textarea>
            </motion.div>
            <motion.button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(34, 197, 94, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">Send Message</span>
              <FontAwesomeIcon icon={faPaperPlane} className="text-xl" />
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;
