/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const blobs = [
    { initialX: '10%', initialY: '20%', delay: 0 },
    { initialX: '70%', initialY: '60%', delay: 2 },
    { initialX: '40%', initialY: '80%', delay: 4 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className="absolute w-96 h-96 rounded-full opacity-30 filter blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,0,0.3) 0%, rgba(0,255,0,0) 70%)',
            boxShadow: '0 0 60px 30px rgba(0,255,0,0.3)',
          }}
          initial={{ x: blob.initialX, y: blob.initialY }}
          animate={{
            x: ['0%', '100%', '50%', '0%'],
            y: ['0%', '50%', '100%', '0%'],
          }}
          transition={{
            duration: 20,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: blob.delay,
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(AnimatedBackground);
