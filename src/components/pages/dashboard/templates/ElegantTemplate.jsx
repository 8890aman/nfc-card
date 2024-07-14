import React from 'react';
import BaseTemplate from './BaseTemplate';

const ElegantTemplate = (props) => {
  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-300 text-gray-800">
      <BaseTemplate {...props}>
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-serif font-semibold mb-2">About Me</h3>
          <p className="font-serif">Elegant description of your background and expertise.</p>
        </div>
      </BaseTemplate>
    </div>
  );
};

export default ElegantTemplate;