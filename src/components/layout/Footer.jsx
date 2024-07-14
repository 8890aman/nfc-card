import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import AnimatedBackground from '../utils/AnimatedBackground';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/yourusername' },
    { icon: FaTwitter, href: 'https://twitter.com/yourusername' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/yourusername' },
  ];

  return (
    <motion.footer 
      className="relative bg-white dark:bg-black text-green-700 dark:text-green-400 py-12 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <AnimatedBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-black opacity-70 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left">
            <img src="/path/to/logo.png" alt="Logo" className="h-16 w-auto mx-auto md:mx-0 mb-4" />
            <motion.p 
              className="text-lg font-mono"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              © {currentYear} Your Company Name
            </motion.p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {['Home', 'About', 'Services', 'Contact'].map((text, index) => (
                <motion.a
                  key={text}
                  href="#"
                  className="block text-green-700 dark:text-green-400 hover:text-green-600 dark:hover:text-green-500 transition-colors duration-300"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {text}
                </motion.a>
              ))}
            </div>
          </div>
          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              {socialLinks.map(({ icon: Icon, href }, index) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 dark:text-green-400 hover:text-green-600 dark:hover:text-green-500 transition-colors duration-300"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Icon className="text-2xl" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-green-200 dark:border-green-800 text-center">
          <p className="text-sm text-green-700 dark:text-green-500">
            All rights reserved. Designed with ❤️ by Your Team
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;