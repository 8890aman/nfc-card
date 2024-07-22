/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring } from '@react-spring/web';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { motion } from 'framer-motion';
import animehero from "../../assets/images/animehero.jpg";
import cyberpunkcity from "../../assets/images/cyberPunk.jpg";
import fantasyworld from "../../assets/images/fantasyworld.jpg";
import spaceexplorer from "../../assets/images/spaceexplorer.jpg";
import retrogaming from "../../assets/images/retrogaming.jpg";
import kawaiicute from "../../assets/images/kawaiicute.jpg";
import steampunkgears from "../../assets/images/steampunkgears.jpg";
import mecharoobot from "../../assets/images/mecharoobot.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faFont, faImage, faToggleOn, faToggleOff, faLayerGroup, faShoppingCart, faUpload, faTextWidth, faTimes, faEdit, faPencilAlt, faEye, faEyeSlash, faIcons, faEnvelope, faPhone, faGlobe, faAdjust, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook, faInstagram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import AnimatedBackground from '../utils/AnimatedBackground';
import Card3D from '../utils/3dCard';
import Footer from '../layout/Footer';
import html2canvas from 'html2canvas';
import QRCodeSVG from 'qrcode-svg';

const CARD_WIDTH = 300;
const CARD_HEIGHT = 180;

const DesignCardPage = ({ darkMode, setDarkMode }) => {
  const [cardColor, setCardColor] = useState('#ffffff');
  const [cardText, setCardText] = useState('My NFC Card');
  const [cardImage, setCardImage] = useState(null);
  const [useColorPicker, setUseColorPicker] = useState(true);
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [useGradient, setUseGradient] = useState(false);
  const [gradientColor1, setGradientColor1] = useState('#ffffff');
  const [gradientColor2, setGradientColor2] = useState('#000000');
  const [gradientType, setGradientType] = useState('linear');
  const [gradientAngle, setGradientAngle] = useState(145);
  const fileInputRef = useRef(null);
  const [templates, setTemplates] = useState([
    { name: 'Elegant White', cardColor: '#ffffff', textColor: '#000000', fontFamily: 'Arial' },
    { name: 'Dark Mode', cardColor: '#1a1a1a', textColor: '#ffffff', fontFamily: 'Helvetica' },
    { name: 'Nature Green', cardColor: '#4CAF50', textColor: '#ffffff', fontFamily: 'Georgia' },
    { name: 'Ocean Blue', cardColor: '#03A9F4', textColor: '#ffffff', fontFamily: 'Verdana' },
    { name: 'Sunset Orange', cardColor: '#FF9800', textColor: '#ffffff', fontFamily: 'Trebuchet MS' },
    { name: 'Royal Purple', cardColor: '#9C27B0', textColor: '#ffffff', fontFamily: 'Palatino' },
    { name: 'Sunny Yellow', cardColor: '#FFEB3B', textColor: '#000000', fontFamily: 'Garamond' },
    { name: 'Gradient Sunset', cardColor: '#FF9800', textColor: '#ffffff', fontFamily: 'Trebuchet MS', useGradient: true, gradientColor1: '#FF9800', gradientColor2: '#9C27B0' },
    { name: 'Gradient Ocean', cardColor: '#03A9F4', textColor: '#ffffff', fontFamily: 'Verdana', useGradient: true, gradientColor1: '#03A9F4', gradientColor2: '#4CAF50' },
    // New templates with imported images
    { name: 'Anime Hero', cardColor: '#FF5733', textColor: '#ffffff', fontFamily: 'Comic Sans MS', image: animehero },
    { name: 'Cyberpunk City', cardColor: '#00FFFF', textColor: '#ffff00', fontFamily: 'Orbitron', image: cyberpunkcity },
    { name: 'Fantasy World', cardColor: '#8A2BE2', textColor: '#ffffff', fontFamily: 'Luminari', image: fantasyworld },
    { name: 'Space Explorer', cardColor: '#000000', textColor: '#ffffff', fontFamily: 'Nasalization', image: spaceexplorer },
    { name: 'Retro Gaming', cardColor: '#32CD32', textColor: '#ffffff', fontFamily: 'Press Start 2P', image: retrogaming },
    { name: 'Kawaii Cute', cardColor: '#FFC0CB', textColor: '#000000', fontFamily: 'Quicksand', image: kawaiicute },
    { name: 'Steampunk Gears', cardColor: '#B8860B', textColor: '#ffffff', fontFamily: 'Copperplate', image: steampunkgears },
    { name: 'Magical Girl', cardColor: '#FF69B4', textColor: '#ffffff', fontFamily: 'Pacifico', image: 'magical_girl.jpg' },
    { name: 'Mecha Robot', cardColor: '#4682B4', textColor: '#ffffff', fontFamily: 'Audiowide', image: mecharoobot },
  ]);

  const applyTemplate = (template) => {
    if (template.image) {
      setCardImage(template.image);
      setUseColorPicker(false);
    } else {
      setCardImage(null);
      setUseColorPicker(true);
      setCardColor(template.cardColor);
      setUseGradient(template.useGradient || false);
      setGradientColor1(template.gradientColor1 || '#ffffff');
      setGradientColor2(template.gradientColor2 || '#000000');
    }
    setTextColor(template.textColor);
    setFontFamily(template.fontFamily);
  };

  // Function to adjust color brightness
  const adjustColor = (color, amount) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  };

  const springProps = useSpring({
    transform: 'perspective(1000px) rotateY(30deg)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
    backgroundColor: darkMode 
      ? `${cardColor}CC` // 80% opacity in dark mode
      : cardColor,
    background: useGradient
      ? `linear-gradient(145deg, ${gradientColor1}, ${gradientColor2})`
      : `linear-gradient(145deg, ${cardColor}, ${adjustColor(cardColor, -20)})`,
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCardImage(e.target.result);
        setUseColorPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Set the default active section to 'templates'
  const [activeSection, setActiveSection] = useState('templates');

  const sections = [
    { id: 'templates', label: 'Templates' },
    { id: 'customize', label: 'Customize' },
    { id: 'upload', label: 'Upload Image' },
  ];

  const [isEditMode, setIsEditMode] = useState(false);
  const [editMode, setEditMode] = useState('text'); // New state for edit mode
  const [cardEditMode, setCardEditMode] = useState(false);
  const [cardIcons, setCardIcons] = useState([]);
  const [iconSize, setIconSize] = useState('medium'); // New state for icon size
  const [iconColor, setIconColor] = useState('#ffffff'); // New state for icon color
  const [overlayColor, setOverlayColor] = useState('#000000');
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  // Expanded icon selection
  const availableIcons = [
    { icon: faTwitter, name: 'Twitter' },
    { icon: faFacebook, name: 'Facebook' },
    { icon: faInstagram, name: 'Instagram' },
    { icon: faLinkedin, name: 'LinkedIn' },
    { icon: faGithub, name: 'GitHub' },
    { icon: faEnvelope, name: 'Email' },
    { icon: faPhone, name: 'Phone' },
    { icon: faGlobe, name: 'Website' },
    // Add more icons as needed
  ];

  const addIcon = (icon) => {
    if (cardIcons.length < 5) { // Limit to 5 icons
      setCardIcons([...cardIcons, { ...icon, size: iconSize, color: iconColor }]);
    }
  };

  const removeIcon = (index) => {
    const newIcons = cardIcons.filter((_, i) => i !== index);
    setCardIcons(newIcons);
  };

  const toggleCardEditMode = () => {
    setCardEditMode(!cardEditMode);
  };

  const generateCardImages = async () => {
    try {
      // Create a flat version of the card for capturing
      const captureCard = document.createElement('div');
      captureCard.style.width = `${CARD_WIDTH}px`;
      captureCard.style.height = `${CARD_HEIGHT}px`;
      captureCard.style.position = 'fixed';
      captureCard.style.left = '-9999px';
      captureCard.style.top = '-9999px';
      document.body.appendChild(captureCard);

      // Function to render card content
      const renderCardContent = (isFront) => {
        captureCard.innerHTML = '';
        captureCard.style.fontFamily = fontFamily;
        captureCard.style.color = textColor;
        captureCard.style.display = 'flex';
        captureCard.style.flexDirection = 'column';
        captureCard.style.justifyContent = 'center';
        captureCard.style.alignItems = 'center';
        captureCard.style.padding = '20px';
        captureCard.style.boxSizing = 'border-box';
        captureCard.style.borderRadius = '10px';
        captureCard.style.position = 'relative';
        captureCard.style.overflow = 'hidden';

        // Apply background
        if (cardImage) {
          captureCard.style.backgroundImage = `url(${cardImage})`;
          captureCard.style.backgroundSize = 'cover';
          captureCard.style.backgroundPosition = 'center';
        } else if (useGradient) {
          if (gradientType === 'linear') {
            captureCard.style.background = `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})`;
          } else if (gradientType === 'radial') {
            captureCard.style.background = `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`;
          }
        } else {
          captureCard.style.backgroundColor = cardColor;
        }

        // Apply overlay
        const overlayElement = document.createElement('div');
        overlayElement.style.position = 'absolute';
        overlayElement.style.top = '0';
        overlayElement.style.left = '0';
        overlayElement.style.width = '100%';
        overlayElement.style.height = '100%';
        overlayElement.style.backgroundColor = overlayColor;
        overlayElement.style.opacity = overlayOpacity / 100;
        overlayElement.style.mixBlendMode = 'multiply';
        captureCard.appendChild(overlayElement);

        if (isFront) {
          // Main text
          const textElement = document.createElement('div');
          textElement.textContent = cardText;
          textElement.style.fontSize = '24px';
          textElement.style.fontWeight = 'bold';
          textElement.style.textAlign = 'center';
          textElement.style.width = '100%';
          textElement.style.padding = '0 20px';
          textElement.style.boxSizing = 'border-box';
          textElement.style.display = 'flex';
          textElement.style.justifyContent = 'center';
          textElement.style.alignItems = 'center';
          textElement.style.height = '100%';
          textElement.style.position = 'absolute';
          textElement.style.top = '0';
          textElement.style.left = '0';
          textElement.style.transform = 'translateY(-12px)'; // Move text up by 35px
          captureCard.appendChild(textElement);

          // Card number
          const numberElement = document.createElement('div');
          numberElement.textContent = 'ZapTag';
          numberElement.style.position = 'absolute';
          numberElement.style.bottom = '16px';
          numberElement.style.left = '16px';
          numberElement.style.fontSize = '12px';
          numberElement.style.letterSpacing = '0.1em';
          captureCard.appendChild(numberElement);

          // Add icons
          cardIcons.forEach((icon, index) => {
            const iconElement = document.createElement('div');
            iconElement.innerHTML = icon.icon.html[0];
            iconElement.style.position = 'absolute';
            iconElement.style.top = '16px';
            iconElement.style.right = `${16 + index * 30}px`;
            iconElement.style.fontSize = icon.size === 'small' ? '16px' : icon.size === 'large' ? '24px' : '20px';
            iconElement.style.color = icon.color;
            captureCard.appendChild(iconElement);
          });
        } else {
          // QR code for the back of the card
          const qrCode = new QRCodeSVG({
            content: 'https://example.com',
            width: 100,
            height: 100,
            color: textColor,
            background: 'transparent',
          });
          const qrElement = document.createElement('div');
          qrElement.innerHTML = qrCode.svg();
          qrElement.style.display = 'flex';
          qrElement.style.justifyContent = 'center';
          qrElement.style.alignItems = 'center';
          qrElement.style.width = '100%';
          qrElement.style.height = '100%';
          captureCard.appendChild(qrElement);
        }
      };

      // Capture front of the card
      renderCardContent(true);
      const frontCanvas = await html2canvas(captureCard, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      });
      const frontImage = frontCanvas.toDataURL('image/png');

      // Capture back of the card
      renderCardContent(false);
      const backCanvas = await html2canvas(captureCard, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      });
      const backImage = backCanvas.toDataURL('image/png');

      // Remove the temporary capture element
      document.body.removeChild(captureCard);

      return { frontImage, backImage };
    } catch (error) {
      console.error('Error generating card images:', error);
      return null;
    }
  };

  const navigate = useNavigate();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowAddressModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    console.log('Address submitted:', address);
    navigate('/payment', { 
      state: { 
        amount: 1000, // Amount in paise (e.g., 1000 paise = ₹10)
        currency: 'INR',
        name: address.name,
        email: 'customer@example.com', // You might want to add an email field to your address form
        contact: '9999999999', // You might want to add a phone number field to your address form
        cardProps: {
          cardText,
          cardImage,
          cardColor,
          textColor,
          fontFamily,
          useColorPicker,
          useGradient,
          gradientType,
          gradientAngle,
          gradientColor1,
          gradientColor2,
          cardIcons,
          overlayColor,
          overlayOpacity
        }
      } 
    });
    setShowAddressModal(false);
    
    // Here you would typically send the address to your backend or process it as needed
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black transition-colors duration-300 overflow-hidden">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50 backdrop-blur-2xl z-0"></div>
      
      <motion.div 
        className="container mx-auto px-4 relative z-20 flex flex-col items-center justify-center flex-grow py-8 sm:py-12 md:py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-center text-green-600 dark:text-green-400">Design Your NFC Card</h1>
        
        <div className="w-full max-w-7xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-center ${
                  activeSection === section.id
                    ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
              <div className="relative z-30 w-full max-w-xs mx-auto mb-4 group">
                <Card3D 
                  key={cardText}
                  cardImage={cardImage} 
                  cardText={cardText} 
                  cardColor={cardColor} 
                  textColor={textColor} 
                  fontFamily={fontFamily}
                  isDarkMode={darkMode}
                  useColorPicker={useColorPicker}
                  useGradient={useGradient}
                  gradientType={gradientType}
                  gradientAngle={gradientAngle}
                  gradientColor1={gradientColor1}
                  gradientColor2={gradientColor2}
                  isEditMode={cardEditMode}
                  cardIcons={cardIcons}
                  overlayColor={overlayColor}
                  overlayOpacity={overlayOpacity}
                />
                {/* Edit button (only visible when not in full edit mode) */}
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="absolute top-2 right-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="lg:w-2/3 p-4 sm:p-6 md:p-8">
              <div className="space-y-4 sm:space-y-6">
                {activeSection === 'customize' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-300">
                        <FontAwesomeIcon icon={faPalette} className="mr-2" />
                        Card Color
                      </h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Use Gradient
                        </span>
                        <button
                          onClick={() => setUseGradient(!useGradient)}
                          className="text-2xl text-green-600 dark:text-green-400"
                        >
                          <FontAwesomeIcon icon={useGradient ? faToggleOn : faToggleOff} />
                        </button>
                      </div>
                      {useGradient && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gradient Type</h4>
                          <select
                            value={gradientType}
                            onChange={(e) => setGradientType(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="linear">Linear</option>
                            <option value="radial">Radial</option>
                          </select>
                        </div>
                      )}
                      {useGradient && gradientType === 'linear' && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gradient Angle</h4>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={gradientAngle}
                            onChange={(e) => setGradientAngle(Number(e.target.value))}
                            className="w-full"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{gradientAngle}°</span>
                        </div>
                      )}
                      {useGradient ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <div className="w-full sm:w-1/2">
                            <HexColorPicker 
                              color={gradientColor1} 
                              onChange={setGradientColor1}
                              style={{ width: '100%', height: '150px' }}
                            />
                            <HexColorInput
                              color={gradientColor1}
                              onChange={setGradientColor1}
                              className="w-full mt-2 p-2 text-center bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                            />
                          </div>
                          <div className="w-full sm:w-1/2">
                            <HexColorPicker 
                              color={gradientColor2} 
                              onChange={setGradientColor2}
                              style={{ width: '100%', height: '150px' }}
                            />
                            <HexColorInput
                              color={gradientColor2}
                              onChange={setGradientColor2}
                              className="w-full mt-2 p-2 text-center bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-4">    
                          <div className="w-full sm:w-2/3">
                            <HexColorPicker 
                              color={cardColor} 
                              onChange={setCardColor}
                              style={{ width: '100%', height: '200px' }}
                            />
                          </div>
                          <div className="w-full sm:w-1/3 flex flex-col items-center">
                            <div 
                              className="w-24 h-24 rounded-full shadow-lg mb-3"
                              style={{ backgroundColor: cardColor }}
                            ></div>
                            <input
                              type="text"
                              value={cardColor}
                              onChange={(e) => setCardColor(e.target.value)}
                              className="w-full p-2 text-center bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-300">
                        <FontAwesomeIcon icon={faFont} className="mr-2" />
                        Card Text
                      </h3>
                      <input
                        type="text"
                        id="cardText"
                        value={cardText}
                        onChange={(e) => setCardText(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-300">
                        <FontAwesomeIcon icon={faPalette} className="mr-2" />
                        Text Color
                      </h3>
                      <div className="flex items-center gap-4">
                        <HexColorPicker 
                          color={textColor} 
                          onChange={setTextColor}
                          style={{ width: '100%', height: '100px' }}
                        />
                        <input
                          type="text"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-1/3 p-2 text-center bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-300">
                        <FontAwesomeIcon icon={faFont} className="mr-2" />
                        Font Family
                      </h3>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Palatino">Palatino</option>
                        <option value="Garamond">Garamond</option>
                        <option value="Bookman">Bookman</option>
                        <option value="Comic Sans MS">Comic Sans MS</option>
                        <option value="Trebuchet MS">Trebuchet MS</option>
                        <option value="Arial Black">Arial Black</option>
                      </select>
                    </div>

                    {cardImage && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-300">
                          <FontAwesomeIcon icon={faImage} className="mr-2" />
                          Background Image
                        </h3>
                        <div className="flex items-center space-x-4">
                          <img
                            src={cardImage}
                            alt="Uploaded background"
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <button
                            onClick={() => {
                              setCardImage(null);
                              setUseColorPicker(true);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                          >
                            Remove Image
                          </button>
                        </div>
                      </div>
                    )}

                    {cardImage && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-300">
                          <FontAwesomeIcon icon={faImage} className="mr-2" />
                          Image Overlay
                        </h3>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color:</label>
                            <input
                              type="color"
                              value={overlayColor}
                              onChange={(e) => setOverlayColor(e.target.value)}
                              className="w-8 h-8 rounded-md"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Opacity:</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={overlayOpacity}
                              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                              className="w-full"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{overlayOpacity}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSection === 'templates' && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-300">
                      <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
                      Pre-made Templates
                    </h3>
                    <div className="mb-4">
                      <label htmlFor="templateCardText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Card Text
                      </label>
                      <input
                        type="text"
                        id="templateCardText"
                        value={cardText}
                        onChange={(e) => setCardText(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter card text"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                      {templates.map((template, index) => (
                        <button
                          key={index}
                          onClick={() => applyTemplate(template)}
                          className="p-2 border border-green-300 dark:border-green-600 rounded-md hover:bg-green-100 dark:hover:bg-green-800 transition duration-300 relative overflow-hidden flex flex-col items-center"
                        >
                          <div 
                            className="w-full h-16 sm:h-20 md:h-24 mb-2 bg-cover bg-center rounded-md"
                            style={{ 
                              backgroundImage: template.image ? `url(${template.image})` : 'none',
                              backgroundColor: template.cardColor
                            }}
                          ></div>
                          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{template.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'upload' && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-300">
                      <FontAwesomeIcon icon={faUpload} className="mr-2" />
                      Upload Image
                    </h3>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-green-300 dark:border-green-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-10 h-10 mb-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                    </div>
                  </div>
                )}
              </div>    
            </div>
          </div>

          {/* Add the Get Card button outside of the sections */}
          <div className="p-8 bg-gray-100 dark:bg-gray-700">
            <div className="flex justify-between items-center">
              <button
                onClick={generateCardImages}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                Get Card
              </button>
              <button
                onClick={() => setShowAddressModal(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center ml-4"
              >
                <FontAwesomeIcon icon={faAddressCard} className="mr-2" />
                Enter Address
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {isEditMode && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-3xl mx-auto p-8">
            <button
              onClick={() => setIsEditMode(false)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center justify-center h-full">
              <Card3D 
                key={cardText}
                cardImage={cardImage} 
                cardText={cardText} 
                cardColor={cardColor} 
                textColor={textColor} 
                fontFamily={fontFamily}
                isDarkMode={darkMode}
                useColorPicker={useColorPicker}
                useGradient={useGradient}
                gradientType={gradientType}
                gradientAngle={gradientAngle}
                gradientColor1={gradientColor1}
                gradientColor2={gradientColor2}
                isEditMode={cardEditMode}
                cardIcons={cardIcons}
                overlayColor={overlayColor}
                overlayOpacity={overlayOpacity}
              />
              
              {/* New button to toggle card edit mode */}
              <button
                onClick={toggleCardEditMode}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center"
              >
                <FontAwesomeIcon icon={cardEditMode ? faEyeSlash : faEye} className="mr-2" />
                {cardEditMode ? "Hide Edit Mode" : "Show Edit Mode"}
              </button>
              
              {/* Toolbar */}
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => setEditMode('text')}
                  className={`p-2 rounded-full ${editMode === 'text' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <FontAwesomeIcon icon={faTextWidth} className="w-6 h-6" />
                </button>
                {!cardImage && (
                  <button
                    onClick={() => setEditMode('color')}
                    className={`p-2 rounded-full ${editMode === 'color' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    <FontAwesomeIcon icon={faPalette} className="w-6 h-6" />
                  </button>
                )}
                <button
                  onClick={() => setEditMode('image')}
                  className={`p-2 rounded-full ${editMode === 'image' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <FontAwesomeIcon icon={faImage} className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setEditMode('icons')}
                  className={`p-2 rounded-full ${editMode === 'icons' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <FontAwesomeIcon icon={faIcons} className="w-6 h-6" />
                </button>
              </div>

              {/* Edit options based on mode */}
              <div className="mt-4 w-full max-w-md">
                {editMode === 'text' && (
                  <input
                    type="text"
                    value={cardText}
                    onChange={(e) => setCardText(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter card text"
                  />
                )}
                {editMode === 'color' && !cardImage && (
                  <div className="flex items-center space-x-2">
                    <HexColorPicker 
                      color={cardColor} 
                      onChange={setCardColor}
                      style={{ width: '100%', height: '200px' }}
                    />
                    <input
                      type="text"
                      value={cardColor}
                      onChange={(e) => setCardColor(e.target.value)}
                      className="w-1/3 p-2 border rounded"
                    />
                  </div>
                )}
              
                {editMode === 'icons' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Add Icons (Max 5)</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Icon Size:</label>
                      <select
                        value={iconSize}
                        onChange={(e) => setIconSize(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Icon Color:</label>
                      <HexColorPicker 
                        color={iconColor} 
                        onChange={setIconColor}
                        style={{ width: '100%', height: '100px' }}
                      />
                      <input
                        type="text"
                        value={iconColor}
                        onChange={(e) => setIconColor(e.target.value)}
                        className="w-full mt-2 p-2 text-center bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {availableIcons.map((iconObj, index) => (
                        <button
                          key={index}
                          onClick={() => addIcon(iconObj)}
                          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex flex-col items-center"
                          disabled={cardIcons.length >= 5}
                        >
                          <FontAwesomeIcon icon={iconObj.icon} className="w-6 h-6 mb-1" />
                          <span className="text-xs">{iconObj.name}</span>
                        </button>
                      ))}
                    </div>
                    {cardIcons.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Current Icons</h4>
                        <div className="flex flex-wrap gap-2">
                          {cardIcons.map((icon, index) => (
                            <button
                              key={index}
                              onClick={() => removeIcon(index)}
                              className="p-2 bg-red-100 dark:bg-red-700 rounded-md hover:bg-red-200 dark:hover:bg-red-600 transition-colors duration-200 flex items-center"
                            >
                              <FontAwesomeIcon icon={icon.icon} className={`w-${icon.size === 'small' ? '4' : icon.size === 'large' ? '6' : '5'} h-${icon.size === 'small' ? '4' : icon.size === 'large' ? '6' : '5'}`} />
                              <span className="ml-2 text-xs">Remove</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {editMode === 'image' && (
                  <div className="mt-4 w-full max-w-md">
                    {cardImage ? (
                      <>
                        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Current Image</h3>
                        <div className="flex items-center space-x-4 mb-4">
                          <img
                            src={cardImage}
                            alt="Current background"
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <button
                            onClick={() => {
                              setCardImage(null);
                              setUseColorPicker(true);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                          >
                            Remove Image
                          </button>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Image Overlay</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color:</label>
                          <input
                            type="color"
                            value={overlayColor}
                            onChange={(e) => setOverlayColor(e.target.value)}
                            className="w-8 h-8 rounded-md"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Opacity:</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={overlayOpacity}
                            onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                            className="w-full"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{overlayOpacity}%</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Upload Image</h3>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Enter Your Address</h2>
            <form onSubmit={handleAddressSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input type="text" id="name" name="name" value={address.name} onChange={handleAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
              </div>
              <div className="mb-4">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
                <input type="text" id="street" name="street" value={address.street} onChange={handleAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                <input type="text" id="city" name="city" value={address.city} onChange={handleAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
              </div>
              <div className="mb-4">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">State/Province</label>
                <input type="text" id="state" name="state" value={address.state} onChange={handleAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
              </div>
              <div className="mb-4">
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ZIP/Postal Code</label>
                <input type="text" id="zip" name="zip" value={address.zip} onChange={handleAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
              </div>
              <div className="mb-4">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                <input type="text" id="country" name="country" value={address.country} onChange={handleAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setShowAddressModal(false)} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignCardPage;






    


