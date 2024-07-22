import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaUser, FaTimes, FaMobileAlt, FaQuestionCircle, FaShoppingCart } from 'react-icons/fa';
import BaseTemplate from './templates/BaseTemplate';
import BaseLightTemplate from './templates/BaseLightTemplate';
import FloralTemplate from './templates/FloralTemplate';
import StormTemplate from './templates/StormTemplate';
import SnowTemplate from './templates/SnowTemplate';
import BeautifulDayTemplate from './templates/BeautifulDayTemplate'; // Import the new template

const templates = [
  { id: 'dark', name: 'Dark Theme', preview: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Dark+Theme', component: BaseTemplate },
  { id: 'light', name: 'Light Theme', preview: 'https://placehold.co/600x400/ffffff/1a1a1a?text=Light+Theme', component: BaseLightTemplate },
  { id: 'floral', name: 'Floral Theme', preview: 'https://placehold.co/600x400/fff0f5/ff69b4?text=Floral+Theme', component: FloralTemplate },
  { id: 'storm', name: 'Storm Theme', preview: 'https://placehold.co/600x400/2c3e50/ecf0f1?text=Storm+Theme', component: StormTemplate },
  { id: 'snow', name: 'Snow Theme', preview: 'https://placehold.co/600x400/ffffff/1a1a1a?text=Snow+Theme', component: SnowTemplate },
  { id: 'beautifulDay', name: 'Beautiful Day', preview: 'https://placehold.co/600x400/87CEEB/FFFFFF?text=Beautiful+Day', component: BeautifulDayTemplate },
  // ... add more templates here
];

const TemplateSelector = ({ selectedTemplate, onSelectTemplate, darkMode, userData, links, socialLinks, tags, faqs = [], products = [], isModalOpen, setIsModalOpen }) => {

  const handleTemplateSelection = (templateId) => {
    onSelectTemplate(templateId);
    setIsModalOpen(false);
  };

  const getLinkClassName = () => {
    return 'w-full max-w-md px-4 py-2 mb-2 text-center transition-all duration-300 rounded-full border border-green-500 bg-opacity-20 bg-green-500 hover:bg-opacity-30 text-sm';
    return 'w-full max-w-md px-6 py-3 mb-4 text-center transition-all duration-300 rounded-full border-2 border-green-500 bg-opacity-20 bg-green-500 hover:bg-opacity-30';
  };

  const SelectedTemplateComponent = templates.find(t => t.id === selectedTemplate)?.component || BaseTemplate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mb-8 ${darkMode ? 'bg-gray-900 text-green-400' : 'bg-gray-100 text-gray-800'}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-4 overflow-hidden rounded-lg shadow-lg relative"
        style={{
          backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        }}
      >
        {/* Blurred background */}
        <div 
          className="absolute inset-0 bg-transparent"
        ></div>
        
        {/* Phone frame (iPhone 15 Pro style) */}
        <div className="relative  flex justify-center items-center py-8 z-[100]">
          <div className="w-[320px] h-[690px] bg-black overflow-hidden rounded-[55px] shadow-xl relative z-50 ">
            {/* Outer frame */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-800 rounded-[55px] hidden z-[100]"></div>
            
            {/* Inner frame */}
            <div className="absolute inset-[3px] bg-black rounded-[52px]">
              {/* Dynamic Island */}
            
              
              {/* Side buttons */}
              <div className="absolute top-[100px] left-[-2px] w-[4px] h-[35px] bg-gradient-to-l from-gray-700 to-gray-800 rounded-r-sm z-40"></div>
              <div className="absolute top-[150px] left-[-2px] w-[4px] h-[65px] bg-gradient-to-l from-gray-700 to-gray-800 rounded-r-sm z-40"></div>
              <div className="absolute top-[100px] right-[-2px] w-[4px] h-[40px] bg-gradient-to-r from-gray-700 to-gray-800 rounded-l-sm z-40"></div>
              
              {/* Content area */}
              <div className="absolute inset-[12px] overflow-hidden rounded-[40px] bg-transparent z-10">
                <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
                  <SelectedTemplateComponent
                    userData={userData}
                    links={links}
                    socialLinks={socialLinks}
                    tags={tags}
                    faqs={faqs}
                    products={products} // Add this line
                    containerClassName="flex flex-col items-center w-full"
                    getLinkClassName={getLinkClassName}
                    
                    className="z-0"
                  />
                </div>
              </div>
            </div>
            
            {/* Reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-10 rounded-[55px]"></div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative p-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
              <h3 className="text-3xl font-bold mb-8 text-center">Choose Your Template</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    } ${selectedTemplate === template.id ? 'ring-4 ring-green-500' : 'shadow-lg hover:shadow-xl'}`}
                    onClick={() => handleTemplateSelection(template.id)}
                  >
                    <div className="h-48 sm:h-56 lg:h-64 relative">
                      <img
                        src={template.preview}
                        alt={`${template.name} Preview`}
                        className="w-full h-full object-cover"
                      />
                      {darkMode && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="absolute top-3 left-3 bg-green-500 rounded-full p-2"
                        >
                          <FaUser className="text-black text-lg" />
                        </motion.div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className={`text-lg font-semibold ${darkMode ? 'text-green-400' : 'text-gray-800'}`}>
                        {template.name}
                      </h4>
                    </div>
                    {selectedTemplate === template.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 bg-green-500 rounded-full p-1.5"
                      >
                        <FaCheck className="text-black text-sm" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TemplateSelector;