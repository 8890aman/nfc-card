/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocation, faLock, faChartLine, faWrench, faUsers } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Feature = ({ title, description, icon, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <motion.div 
      ref={ref}
      className={`p-6 rounded-lg backdrop-filter backdrop-blur-xl bg-opacity-20 ${className}`}
      whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(34, 197, 94, 0.3)" }}
      transition={{ type: "spring", stiffness: 300 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
    >
      <div className="text-3xl text-green-500 dark:text-green-400 mb-4">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  )
}

const FloatingShape = ({ className, size }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <motion.div
      ref={ref}
      className={`absolute rounded-full ${className}`}
      style={{ width: size, height: size }}
      animate={isInView ? {
        y: ["0%", "100%"],
        x: ["0%", "100%"],
        scale: [1, 1.5, 1],
        rotate: [0, 180, 360],
      } : { y: "0%", x: "0%", scale: 1, rotate: 0 }}
      transition={{
        duration: Math.random() * 10 + 20,
        repeat: isInView ? Infinity : 0,
        repeatType: "reverse",
      }}
    />
  )
}

const AnimatedBackground = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <div ref={ref} className="absolute inset-0 z-0">
      <motion.div
        animate={isInView ? {
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.1, 1],
        } : { opacity: 0, scale: 1 }}
        transition={{
          duration: 8,
          repeat: isInView ? Infinity : 0,
          repeatType: "reverse",
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-500 dark:from-green-700 dark:to-green-900 opacity-30 filter blur-3xl"></div>
      </motion.div>
      <motion.div
        animate={isInView ? {
          opacity: [0.1, 0.2, 0.1],
          scale: [1.1, 1, 1.1],
        } : { opacity: 0, scale: 1 }}
        transition={{
          duration: 10,
          repeat: isInView ? Infinity : 0,
          repeatType: "reverse",
        }}
      >
        <div className="w-full h-full bg-gradient-to-tl from-green-200 to-green-400 dark:from-green-600 dark:to-green-800 opacity-30 filter blur-3xl"></div>
      </motion.div>
      <FloatingShape className="bg-green-300 dark:bg-green-700 opacity-20" size="200px" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
    </div>
  )
}

const Features = () => {
  const features = [
    { title: "Fast", description: "Lightning-quick performance", icon: faLocation },
    { title: "Secure", description: "Top-notch security measures", icon: faLock },
    { title: "Scalable", description: "Grows with your business", icon: faChartLine },
    { title: "24/7 Support", description: "Always here to help", icon: faWrench },
    { title: "User-friendly", description: "Intuitive interface", icon: faUsers },
  ]

  return (
    <section className="relative py-12 bg-white dark:bg-black transition-colors duration-300 overflow-hidden">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50 backdrop-blur-2xl z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          className="text-4xl font-bold mb-8 text-center text-green-600 dark:text-green-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Features
        </motion.h2>
        <div className="grid grid-cols-3 grid-rows-3 gap-4">
          <motion.div 
            className="col-span-2 row-span-2 bg-green-100 dark:bg-green-800 bg-opacity-20 dark:bg-opacity-20 backdrop-filter backdrop-blur-2xl rounded-lg p-6 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ boxShadow: "0px 0px 15px rgba(34, 197, 94, 0.4)" }}
          >
            <AnimatedBackground />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-300">Discover Our Platform</h3>
              <p className="text-xl text-green-600 dark:text-green-400 mb-6">
                Learn why our platform stands out from the rest
              </p>
              <motion.button 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(34, 197, 94, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative overflow-hidden"
            >
              <AnimatedBackground />
              <Feature {...feature} className="bg-green-50 dark:bg-green-900 bg-opacity-20 dark:bg-opacity-20 relative z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features