import React from 'react';
import BaseTemplate from './BaseTemplate';

const MinimalistTemplate = (props) => {
  return (
    <div className="bg-white text-gray-800">
      <BaseTemplate {...props}>
        <div className="border-t border-b border-gray-200 py-4 my-8">
          <p className="text-center italic">
            "Add a minimalist quote or statement here."
          </p>
        </div>
      </BaseTemplate>
    </div>
  );
};

export default MinimalistTemplate;