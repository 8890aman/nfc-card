import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

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
import QRCodePopup from '../QRCodePopup';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  const TemplateComponent = getTemplateComponent(userData.template);

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <TemplateComponent
        userData={userData}
        links={userData.templateData?.links || []}
        socialLinks={userData.templateData?.socialLinks || {}}
        tags={userData.tags || []}
      />
    </div>
  );
};

export default PublicProfilePage;