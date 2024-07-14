import React from 'react';
import BaseTemplate from './BaseTemplate';

const CreativeTemplate = (props) => {
  return (
    <div className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
      <BaseTemplate {...props}>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">My Work</h3>
            <p>Showcase your creative projects here.</p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Skills</h3>
            <p>List your creative skills and expertise.</p>
          </div>
        </div>
      </BaseTemplate>
    </div>
  );
};

export default CreativeTemplate;