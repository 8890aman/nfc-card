/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const getRandomGreenColor = () => {
  const greenValue = Math.floor(Math.random() * 156) + 100; // Random green value between 100 and 255
  return `rgba(34, ${greenValue}, 94, 0.8)`; // Increased alpha for better visibility
};

const Blob = ({ index, x, y, darkMode }) => {
  const color = getRandomGreenColor();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ x, y, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      style={{
        position: 'absolute',
        width: `${40 + index * 15}px`,
        height: `${40 + index * 15}px`,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}`,
        filter: 'brightness(1.2) contrast(1.2)', // Gamma correction
      }}
    />
  );
};

const CursorBlobsBackground = ({ darkMode }) => {
  const [blobs, setBlobs] = useState([]);

  useEffect(() => {
    const generateBlob = () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      angle: Math.random() * Math.PI * 2,
      speed: 1 + Math.random() * 2,
    });

    const initialBlobs = [...Array(10)].map(() => generateBlob());
    setBlobs(initialBlobs);

    const moveBlobs = () => {
      setBlobs((prevBlobs) =>
        prevBlobs.map((blob) => {
          const newX = blob.x + Math.cos(blob.angle) * blob.speed;
          const newY = blob.y + Math.sin(blob.angle) * blob.speed;

          // Check if blob is out of the screen
          if (newX < 0 || newX > window.innerWidth || newY < 0 || newY > window.innerHeight) {
            return generateBlob(); // Generate a new blob if out of screen
          }

          return { ...blob, x: newX, y: newY };
        })
      );
    };

    const interval = setInterval(moveBlobs, 50); // Adjust the interval for smoother movement

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {blobs.map((blob, index) => (
        <Blob
          key={index}
          index={index}
          x={blob.x}
          y={blob.y}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

export default CursorBlobsBackground;
