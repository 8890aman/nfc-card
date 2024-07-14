import React from 'react';
import { FaCheck, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaCode, FaLaptopCode, FaPalette, FaRocket, FaCamera } from 'react-icons/fa';

const templates = [
  { id: 'professional', name: 'Professional', icon: FaBriefcase },
  { id: 'creative', name: 'Creative', icon: FaPalette },
  { id: 'minimalist', name: 'Minimalist', icon: FaUser },
  { id: 'tech', name: 'Tech', icon: FaLaptopCode },
  { id: 'elegant', name: 'Elegant', icon: FaUser },
  { id: 'bold', name: 'Bold', icon: FaBriefcase },
  { id: 'startup', name: 'Startup', icon: FaRocket },
  { id: 'portfolio', name: 'Portfolio', icon: FaCamera },
  { id: 'academic', name: 'Academic', icon: FaGraduationCap },
];

const TemplateSelector = ({ selectedTemplate, onSelectTemplate, darkMode }) => {
  const handleTemplateSelection = (templateId) => {
    onSelectTemplate(templateId);
  };

  const renderTemplatePreview = (template) => {
    const IconComponent = template.icon;
    switch (template.id) {
      case 'professional':
        return (
          <div className="flex flex-col h-full">
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-bold">John Doe</h2>
              <p>Professional Title</p>
            </div>
            <div className="flex-grow p-4">
              <div className="flex items-center mb-2"><FaEnvelope className="mr-2" /> john@example.com</div>
              <div className="flex items-center"><FaPhone className="mr-2" /> (123) 456-7890</div>
            </div>
          </div>
        );
      case 'creative':
        return (
          <div className="h-full bg-gradient-to-br from-purple-400 to-pink-500 p-4 text-white">
            <h2 className="text-2xl font-bold mb-2">Creative Mind</h2>
            <div className="flex items-center justify-center h-3/4">
              <IconComponent size={48} />
            </div>
          </div>
        );
      case 'minimalist':
        return (
          <div className="h-full flex flex-col justify-center items-center border-2 border-gray-300 p-4">
            <h2 className="text-xl font-light mb-2">JOHN DOE</h2>
            <p className="text-sm text-gray-600">Minimalist Designer</p>
          </div>
        );
      case 'tech':
        return (
          <div className="h-full bg-gray-900 text-green-400 p-4 font-mono">
            <div className="mb-2">{'>'} John.Doe</div>
            <div className="mb-2">{'>'} Software.Engineer</div>
            <div>{'>'} <span className="animate-pulse">_</span></div>
          </div>
        );
      case 'elegant':
        return (
          <div className="h-full bg-gradient-to-r from-gray-100 to-gray-300 p-4">
            <h2 className="text-2xl font-serif text-gray-800 mb-2">John Doe</h2>
            <div className="w-12 h-1 bg-gray-800 mb-2"></div>
            <p className="text-sm text-gray-600">Elegance Personified</p>
          </div>
        );
      case 'bold':
        return (
          <div className="h-full bg-red-600 text-white p-4">
            <h2 className="text-3xl font-bold mb-2">JOHN DOE</h2>
            <p className="text-xl">BOLD INNOVATOR</p>
          </div>
        );
      case 'startup':
        return (
          <div className="h-full bg-gradient-to-r from-blue-400 to-teal-500 p-4">
            <h2 className="text-2xl font-bold mb-2">John Doe</h2>
            <div className="flex items-center mb-2"><IconComponent className="mr-2" /> Startup Founder</div>
            <div className="flex items-center"><FaMapMarkerAlt className="mr-2" /> San Francisco, CA</div>
          </div>
        );
      case 'portfolio':
        return (
          <div className="h-full bg-gray-100 p-4">
            <h2 className="text-2xl font-bold mb-2">John Doe</h2>
            <div className="flex items-center mb-2"><IconComponent className="mr-2" /> Photographer</div>
            <div className="flex items-center"><FaEnvelope className="mr-2" /> john@example.com</div>
          </div>
        );
      case 'academic':
        return (
          <div className="h-full bg-gray-200 p-4">
            <h2 className="text-2xl font-bold mb-2">John Doe</h2>
            <div className="flex items-center mb-2"><IconComponent className="mr-2" /> Professor</div>
            <div className="flex items-center"><FaPhone className="mr-2" /> (123) 456-7890</div>
          </div>
        );
      default:
        return (
          <div className="h-full flex flex-col justify-center items-center bg-gray-100 p-4">
            <IconComponent size={32} className="mb-2" />
            <h2 className="text-lg font-semibold">{template.name}</h2>
          </div>
        );
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Choose a Template</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative cursor-pointer rounded-lg overflow-hidden ${
              darkMode ? 'bg-gray-700' : 'bg-white'
            } ${selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleTemplateSelection(template.id)}
          >
            <div className="h-40">
              {renderTemplatePreview(template)}
            </div>
            <div className="p-2 text-center">{template.name}</div>
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                <FaCheck className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;