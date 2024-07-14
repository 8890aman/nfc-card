import { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import texture from '../../assets/textures/black-smooth-textured-paper-background.jpg';

const Preloader = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const cardSpring = useSpring({
    from: { opacity: 0, scale: 0.5 },
    to: { opacity: 1, scale: 1 },
    config: { mass: 5, tension: 500, friction: 80 },
  });

  const shimmerSpring = useSpring({
    from: { backgroundPosition: '-200% 0' },
    to: { backgroundPosition: '200% 0' },
    config: { duration: 3000 },
    loop: true,
  });

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}
    >
      <animated.div
        style={cardSpring}
        className="relative"
      >
        <animated.div
          style={{
            ...shimmerSpring,
            backgroundImage: `url(${texture}), linear-gradient(90deg, ${isDarkMode ? '#2d3748' : '#f7fafc'} 0%, ${isDarkMode ? '#4a5568' : '#edf2f7'} 50%, ${isDarkMode ? '#2d3748' : '#f7fafc'} 100%)`,
            backgroundSize: 'cover, 200% 100%',
            backgroundBlendMode: isDarkMode ? 'overlay' : 'soft-light',
          }}
          className={`w-96 h-56 rounded-2xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } flex items-center justify-center overflow-hidden`}
        >
          {/* NFC indicator */}
          <div className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center">
            <div className={`w-6 h-6 border-2 ${isDarkMode ? 'border-gray-400' : 'border-gray-600'} rounded-full flex items-center justify-center`}>
              <div className={`w-4 h-4 ${isDarkMode ? 'border-gray-400' : 'border-gray-600'} border-t-2 border-l-2 rounded-tl-full`}></div>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-gray-400 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-400 rounded-full"></div>
          </div>
          <div className="absolute bottom-4 left-4 text-xs font-mono text-gray-500">
            1234 5678 9012 3456
          </div>
          <div className="wifi-loader scale-150">
            <div className={`wifi-circle ${isDarkMode ? 'dark' : ''}`}></div>
            <div className={`wifi-circle ${isDarkMode ? 'dark' : ''}`}></div>
            <div className={`wifi-circle ${isDarkMode ? 'dark' : ''}`}></div>
          </div>
        </animated.div>
      </animated.div>
    </div>
  );
};

export default Preloader;
