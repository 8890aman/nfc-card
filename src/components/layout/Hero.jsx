import { Button } from "@material-tailwind/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <motion.div
      ref={ref}
      className="container mx-auto px-4 relative z-10"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.h1
          className="text-6xl font-bold mb-6 text-green-600 dark:text-green-400 font-outfit tracking-tight"
          animate={isInView ? { scale: [0.9, 1], opacity: [0, 1] } : { scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Next-Gen <span className="text-green-500 dark:text-green-300">NFC Business Cards</span>
        </motion.h1>
        <motion.p
          className="text-xl mb-10 max-w-2xl mx-auto text-green-700 dark:text-green-300"
          animate={isInView ? { opacity: [0, 1] } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Elevate your networking with our custom NFC-enabled business cards. Share your details instantly and make a lasting digital impression.
        </motion.p>
        <div className="flex justify-center space-x-4">
          <Button 
            size="lg" 
            className="bg-green-500 hover:bg-green-600 text-white font-bold transition-all duration-300 font-outfit text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-green-600/50"
          >
            Design Your Card
          </Button>
          <Button 
            size="lg" 
            className="bg-transparent border-2 border-green-500 hover:bg-green-500/10 text-green-500 font-bold transition-all duration-300 font-outfit text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-green-500/30"
          >
            Learn More
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default Hero;