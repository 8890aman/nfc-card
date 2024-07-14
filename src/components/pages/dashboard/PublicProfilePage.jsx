import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import QRCode from 'qrcode.react'; // Make sure to install this package

// Import all template components
import BaseTemplate from './templates/BaseTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import TechTemplate from './templates/TechTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import BoldTemplate from './templates/BoldTemplate';
import StartupTemplate from './templates/StartupTemplate';
import PortfolioTemplate from './templates/PortfolioTemplate';
import AcademicTemplate from './templates/AcademicTemplate';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.log('No such user!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const getTemplateComponent = (templateName) => {
    switch (templateName) {
      case 'professional': return ProfessionalTemplate;
      case 'creative': return CreativeTemplate;
      case 'minimalist': return MinimalistTemplate;
      case 'tech': return TechTemplate;
      case 'elegant': return ElegantTemplate;
      case 'bold': return BoldTemplate;
      case 'startup': return StartupTemplate;
      case 'portfolio': return PortfolioTemplate;
      case 'academic': return AcademicTemplate;
      default: return BaseTemplate;
    }
  };

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  const TemplateComponent = getTemplateComponent(userData.template);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen relative">
      <TemplateComponent
        userData={userData}
        links={userData.templateData?.links || []}
        socialLinks={userData.templateData?.socialLinks || {}}
        tags={userData.tags || []}
      />
      <button
        onClick={toggleQRCode}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Show QR Code
      </button>
      {showQRCode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg transform transition-transform duration-300 ease-in-out translate-y-0">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2">{userData.name}</h2>
            <p className="text-sm text-gray-600 mb-4">{userData.title}</p>
            <QRCode value={window.location.href} size={200} />
            <button
              onClick={toggleQRCode}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfilePage;