import React from 'react';
import { FaEnvelope, FaLink } from 'react-icons/fa';

const BaseTemplate = ({ userData, links, socialLinks, children }) => {
  return (
    <div className="p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <img 
          src={userData.photoURL || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold">{userData.displayName || userData.email}</h2>
        <p className="mt-2">{userData.bio || 'No bio available'}</p>
      </div>
      
      {children}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">My Links</h3>
        <div className="space-y-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <FaLink className="mr-2" />
              <span>{link.title || link.url}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <a href={`mailto:${userData.email}`} className="inline-flex items-center">
          <FaEnvelope className="mr-2" />
          Contact Me
        </a>
      </div>
    </div>
  );
};

export default BaseTemplate;