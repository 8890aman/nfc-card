import React from 'react';
import BaseTemplate from './BaseTemplate';

const PortfolioTemplate = (props) => {
  return (
    <div className="bg-gray-800 text-white">
      <BaseTemplate {...props}>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Project 1</h3>
            <p>Description of your first featured project.</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Project 2</h3>
            <p>Description of your second featured project.</p>
          </div>
        </div>
      </BaseTemplate>
    </div>
  );
};

export default PortfolioTemplate;