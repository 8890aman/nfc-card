import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { FaGlobe } from 'react-icons/fa';

// Import all template components
import BaseTemplate from './templates/BaseTemplate';
import BaseLightTemplate from './templates/BaseLightTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import TechTemplate from './templates/TechTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import BoldTemplate from './templates/BoldTemplate';
import StartupTemplate from './templates/StartupTemplate';
import PortfolioTemplate from './templates/PortfolioTemplate';
import AcademicTemplate from './templates/AcademicTemplate';
import StormTemplate from './templates/StormTemplate';
import BeautifulDayTemplate from './templates/BeautifulDayTemplate';
import FloralTemplate from './templates/FloralTemplate';
import SnowTemplate from './templates/SnowTemplate';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

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

  useEffect(() => {
    const addPageVisitNotification = async () => {
      if (userId) {
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          const visitorIP = data.ip;

          const notificationsRef = collection(db, "users", userId, "notifications");
          
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          const recentVisitsQuery = query(
            notificationsRef,
            where("ip", "==", visitorIP),
            where("timestamp", ">=", oneDayAgo)
          );
          
          const recentVisits = await getDocs(recentVisitsQuery);
          
          if (recentVisits.empty) {
            await addDoc(notificationsRef, {
              message: "Someone new visited your public page!",
              timestamp: serverTimestamp(),
              expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
              ip: visitorIP
            });

            const oldNotificationsQuery = query(
              notificationsRef,
              orderBy("timestamp", "asc")
            );
            const allNotifications = await getDocs(oldNotificationsQuery);
            
            if (allNotifications.size > 20) {
              const notificationsToDelete = allNotifications.docs.slice(0, allNotifications.size - 20);
              for (const doc of notificationsToDelete) {
                await deleteDoc(doc.ref);
              }
            }
          }
        } catch (error) {
          console.error("Error handling page visit: ", error);
        }
      }
    };

    addPageVisitNotification();
  }, [userId]);

  const getTemplateComponent = (templateName) => {
    switch (templateName) {
      case 'light': return BaseLightTemplate;
      case 'professional': return ProfessionalTemplate;
      case 'creative': return CreativeTemplate;
      case 'minimalist': return MinimalistTemplate;
      case 'tech': return TechTemplate;
      case 'elegant': return ElegantTemplate;
      case 'bold': return BoldTemplate;
      case 'startup': return StartupTemplate;
      case 'portfolio': return PortfolioTemplate;
      case 'academic': return AcademicTemplate;
      case 'storm': return StormTemplate;
      case 'beautifulDay': return BeautifulDayTemplate;
      case 'floral': return FloralTemplate;
      case 'snow': return SnowTemplate;
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
    <div className="flex flex-col justify-center items-center min-h-screen w-screen">
      <TemplateComponent
        userData={userData}
        links={userData.templateData?.links || []}
        socialLinks={userData.templateData?.socialLinks || {}}
        tags={userData.tags || []}
        faqs={userData.templateData?.faqs || []} 
        products={userData.templateData?.products || []}
      />
    </div>
  );
};

export default PublicProfilePage;