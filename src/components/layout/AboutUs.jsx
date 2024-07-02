/* eslint-disable react/no-unescaped-entities */
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faLightbulb, faRocket } from '@fortawesome/free-solid-svg-icons';
import AnimatedBackground from '../utils/AnimatedBackground';

const AboutUs = () => {
  const aboutItems = [
    { icon: faUsers, title: "Our Team", description: "A diverse group of passionate innovators dedicated to revolutionizing NFC technology." },
    { icon: faLightbulb, title: "Our Mission", description: "To create cutting-edge NFC solutions that seamlessly connect the physical and digital worlds." },
    { icon: faRocket, title: "Our Vision", description: "To be the global leader in NFC-enabled business cards and networking solutions." },
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
          About NeoTech
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-lg text-green-700 dark:text-green-300 mb-6">
            At NeoTech, we're not just creating NFC business cards; we're redefining professional networking for the digital age.
          </p>
          <motion.button 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(34, 197, 94, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More About Us
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;