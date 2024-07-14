import React from 'react';
import BaseTemplate from './BaseTemplate';

const StartupTemplate = (props) => {
  return (
    <div className="bg-gradient-to-r from-blue-400 to-teal-500 text-white">
      <BaseTemplate {...props}>
        <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
          <p>Describe your startup's vision and goals here.</p>
        </div>
        <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold mb-2">What We Offer</h3>
          <p>List your products or services here.</p>
        </div>
      </BaseTemplate>
    </div>
  );
};

export default StartupTemplate;