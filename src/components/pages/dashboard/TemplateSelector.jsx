import React from 'react';
import { FaCheck, FaUser } from 'react-icons/fa';
import BaseTemplate from './templates/BaseTemplate';
import BaseLightTemplate from './templates/BaseLightTemplate';

const templates = [
  { id: 'dark', name: 'Dark Theme', preview: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Dark+Theme', component: BaseTemplate },
  { id: 'light', name: 'Light Theme', preview: 'https://placehold.co/600x400/ffffff/1a1a1a?text=Light+Theme', component: BaseLightTemplate },
  // ... add more templates here
];

const TemplateSelector = ({ selectedTemplate, onSelectTemplate, darkMode, userData, links, socialLinks, tags }) => {
  const handleTemplateSelection = (templateId) => {
    onSelectTemplate(templateId);
  };

  const SelectedTemplateComponent = templates.find(t => t.id === selectedTemplate)?.component || BaseTemplate;

  return (
    <div className={`mb-8 ${darkMode ? 'bg-black text-green-400' : 'bg-white text-gray-800'}`}>
      <h3 className="text-3xl font-bold mb-8 text-center">Choose Your Template</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
              darkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-white hover:bg-gray-100'
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
                <div className="absolute top-3 left-3 bg-green-500 rounded-full p-2">
                  <FaUser className="text-black text-lg" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h4 className={`text-lg font-semibold ${darkMode ? 'text-green-400' : 'text-gray-800'}`}>
                {template.name}
              </h4>
            </div>
            {selectedTemplate === template.id && (
              <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1.5">
                <FaCheck className="text-black text-sm" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Render the selected template */}
      <div className="mt-8">
        <SelectedTemplateComponent
          userData={userData}
          links={links}
          socialLinks={socialLinks}
          tags={tags}
        />
      </div>
    </div>
  );
};

export default TemplateSelector;