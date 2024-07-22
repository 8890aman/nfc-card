/* eslint-disable react/no-unescaped-entities */
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faLightbulb, faRocket, faHistory, faAward, faHandshake } from '@fortawesome/free-solid-svg-icons';
import AnimatedBackground from '../utils/AnimatedBackground';

const AboutUs = () => {
  const aboutItems = [
    { icon: faUsers, title: "Our Team", description: "A diverse group of passionate innovators dedicated to revolutionizing NFC technology." },
    { icon: faLightbulb, title: "Our Mission", description: "To create cutting-edge NFC solutions that seamlessly connect the physical and digital worlds." },
    { icon: faRocket, title: "Our Vision", description: "To be the global leader in NFC-enabled business cards and networking solutions." },
  ];

  const additionalSections = [
    { icon: faHistory, title: "Our History", content: "Founded in 2015, Zaptagch has been at the forefront of NFC technology innovation. What started as a small startup has grown into a global leader in digital networking solutions." },
    { icon: faAward, title: "Our Achievements", content: "With over 50 patents and numerous industry awards, Zaptagch has consistently pushed the boundaries of what's possible with NFC technology." },
    { icon: faHandshake, title: "Our Partnerships", content: "We've collaborated with Fortune 500 companies, tech giants, and innovative startups to create seamless networking experiences across various industries." },
  ];

  return (
    <section className="relative py-16 bg-white dark:bg-black transition-colors duration-300 overflow-hidden">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50 backdrop-blur-2xl z-0"></div>
      
      <div className="container mx-auto px-4 relative z-20">
        <motion.h2 
          className="text-4xl font-bold mb-12 text-center text-green-600 dark:text-green-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Zaptag        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {aboutItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-green-50 dark:bg-green-900 bg-opacity-20 dark:bg-opacity-20 backdrop-filter backdrop-blur-xl rounded-lg p-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(34, 197, 94, 0.4)" }}
            >
              <AnimatedBackground />
              <div className="relative z-10">
                <FontAwesomeIcon icon={item.icon} className="text-4xl text-green-500 dark:text-green-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-green-700 dark:text-green-300">{item.title}</h3>
                <p className="text-green-600 dark:text-green-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-lg text-green-700 dark:text-green-300 mb-6">
            At Zaptagch, we're not just creating NFC business cards; we're redefining professional networking for the digital age.
          </p>
          <motion.button 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(34, 197, 94, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More About Us
          </motion.button>
        </motion.div>

        {additionalSections.map((section, index) => (
          <motion.div
            key={index}
            className="mb-16 bg-green-50 dark:bg-green-900 bg-opacity-20 dark:bg-opacity-20 backdrop-filter backdrop-blur-xl rounded-lg p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.02, boxShadow: "0px 0px 15px rgba(34, 197, 94, 0.3)" }}
          >
            <AnimatedBackground />
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={section.icon} className="text-3xl text-green-500 dark:text-green-400 mr-4" />
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">{section.title}</h3>
              </div>
              <p className="text-green-600 dark:text-green-400 text-lg">{section.content}</p>
            </div>
          </motion.div>
        ))}

        <motion.div
          className="text-center bg-green-50 dark:bg-green-900 bg-opacity-20 dark:bg-opacity-20 backdrop-filter backdrop-blur-xl rounded-lg p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          whileHover={{ scale: 1.02, boxShadow: "0px 0px 15px rgba(34, 197, 94, 0.3)" }}
        >
          <AnimatedBackground />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">Join Us on Our Journey</h3>
            <p className="text-green-600 dark:text-green-400 text-lg mb-6">
              As we continue to innovate and expand, we're always looking for talented individuals to join our team. 
              If you're passionate about technology and want to make a difference, we'd love to hear from you.
            </p>
            <motion.button 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(34, 197, 94, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              View Career Opportunities
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;