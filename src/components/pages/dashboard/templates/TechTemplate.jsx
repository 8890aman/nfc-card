import React from 'react';
import BaseTemplate from './BaseTemplate';

const TechTemplate = (props) => {
  return (
    <div className="bg-gray-900 text-green-400 font-mono">
      <BaseTemplate {...props}>
        <div className="bg-black p-4 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-2">$ whoami</h3>
          <p className="font-mono">
            {`> A passionate technologist with expertise in...`}
          </p>
        </div>
      </BaseTemplate>
    </div>
  );
};

export default TechTemplate;