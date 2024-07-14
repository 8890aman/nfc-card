import React from 'react';
import BaseTemplate from './BaseTemplate';

const AcademicTemplate = (props) => {
  return (
    <div className="bg-indigo-100 text-indigo-800">
      <BaseTemplate {...props}>
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold mb-2">Research Interests</h3>
          <p>List your primary areas of academic research and study.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold mb-2">Publications</h3>
          <p>List your key academic publications or achievements.</p>
        </div>
      </BaseTemplate>
    </div>
  );
};

export default AcademicTemplate;