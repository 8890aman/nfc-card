import React from 'react';
import BaseTemplate from './BaseTemplate';

const BoldTemplate = (props) => {
  return (
    <div className="bg-red-600 text-white">
      <BaseTemplate {...props}>
        <div className="bg-white text-red-600 p-4 rounded-lg mb-8">
          <h3 className="text-2xl font-bold mb-2">MISSION STATEMENT</h3>
          <p className="uppercase">Your bold and impactful mission statement goes here.</p>
        </div>
      </BaseTemplate>
    </div>
  );
};

export default BoldTemplate;