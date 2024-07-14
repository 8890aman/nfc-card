/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaGlobe, FaCopy, FaLink, FaEnvelope, FaUsers, FaPlus, FaInstagram, FaFacebook, FaTrash, FaTags, FaSave, FaExternalLinkAlt } from 'react-icons/fa';
import TemplateSelector from './TemplateSelector';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import TechTemplate from './templates/TechTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import BoldTemplate from './templates/BoldTemplate';
import StartupTemplate from './templates/StartupTemplate';
import PortfolioTemplate from './templates/PortfolioTemplate';
import AcademicTemplate from './templates/AcademicTemplate';
import BaseTemplate from './templates/BaseTemplate';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig'; // Adjust the path if necessary

const PublicPage = ({ user, userData, darkMode, updateUserProfile }) => {
  const [pageUrl, setPageUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(userData.template || 'classic');
  const [links, setLinks] = useState(userData.templateData?.links || []);
  const [socialLinks, setSocialLinks] = useState(userData.templateData?.socialLinks || {
    instagram: '',
    facebook: '',
  });
  const [tags, setTags] = useState(userData.tags || []);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const baseUrl = window.location.origin;
    setPageUrl(`${baseUrl}/profile/${user.uid}`);
  }, [user.uid]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenUrl = () => {
    window.open(pageUrl, '_blank');
  };

  const addLink = () => {
    setLinks([...links, { url: '', title: '' }]);
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const updateSocialLink = (platform, url) => {
    setSocialLinks(prev => ({ ...prev, [platform]: url }));
  };

  const deleteLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const addTag = () => {
    if (newTag.trim() !== '' && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag('');
      updateUserProfile({ tags: updatedTags });
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    updateUserProfile({ tags: updatedTags });
  };

  const getTemplateComponent = () => {
    switch (selectedTemplate) {
      case 'professional':
        return ProfessionalTemplate;
      case 'creative':
        return CreativeTemplate;
      case 'minimalist':
        return MinimalistTemplate;
      case 'tech':
        return TechTemplate;
      case 'elegant':
        return ElegantTemplate;
      case 'bold':
        return BoldTemplate;
      case 'startup':
        return StartupTemplate;
      case 'portfolio':
        return PortfolioTemplate;
      case 'academic':
        return AcademicTemplate;
      default:
        return BaseTemplate;
    }
  };
  const TemplateComponent = getTemplateComponent();

  const getLinkIcon = (url) => {
    if (url.includes('facebook.com')) return FaFacebook;
    if (url.includes('instagram.com')) return FaInstagram;
    if (url.includes('linkedin.com')) return FaLinkedin;
    if (url.includes('gmail.com')) return SiGmail;
    return FaLink;
  };

  const saveTemplate = async () => {
    try {
      const templateData = {
        selectedTemplate,
        links,
        socialLinks,
        tags,
        updatedAt: new Date()
      };

      // Update both templateData and template fields
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { 
        templateData,
        template: selectedTemplate // Add this line
      }, { merge: true });

      // Update local state
      updateUserProfile({ 
        templateData,
        template: selectedTemplate // Add this line
      });

      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen`}
    >
      <h2 className="text-4xl font-bold mb-12 text-center">Your Public Page</h2>
      
      <div className="max-w-4xl mx-auto">
        {/* URL display */}
        <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg mb-12`}>
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold mb-4 md:mb-0">Your Page URL</h3>
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
            <input
              type="text"
              value={pageUrl}
              readOnly
              className="flex-grow p-4 bg-transparent outline-none text-lg"
            />
            <button
              onClick={handleCopyUrl}
              className={`p-4 ${copied ? 'bg-green-500' : 'bg-gray-200'} transition duration-300`}
              title="Copy URL"
            >
              <FaCopy className={copied ? 'text-white' : 'text-gray-600'} />
            </button>
            <button
              onClick={handleOpenUrl}
              className="p-4 bg-blue-500 hover:bg-blue-600 transition duration-300"
              title="Open URL"
            >
              <FaExternalLinkAlt className="text-white" />
            </button>
          </div>
          {copied && <p className="text-green-500 mt-2">Copied to clipboard!</p>}
        </div>

        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onSelectTemplate={(template) => {
            setSelectedTemplate(template);
          }}
          darkMode={darkMode}
        />

        {/* Add Save Template button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={saveTemplate}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center"
          >
            <FaSave className="mr-2" />
            Save Template
          </button>
        </div>

        {/* Preview section */}
        <div className="mt-12 rounded-lg shadow-lg overflow-hidden">
          <h3 className="text-3xl font-semibold mb-8 text-center">Page Preview</h3>
          <TemplateComponent
            userData={userData}
            links={links}
            socialLinks={socialLinks}
            tags={tags}
            darkMode={darkMode}
          />
        </div>

        {/* UI elements for user input */}
        <div className={`mt-8 p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
          <h3 className="text-2xl font-semibold mb-6">Customize Your Page</h3>

          {/* Tags Section */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2">Tags</h4>
            <div className="flex flex-wrap mb-2">
              {tags.map((tag, index) => (
                <span key={index} className="bg-blue-500 text-white px-2 py-1 rounded mr-2 mb-2 flex items-center">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-2 text-xs">
                    <FaTrash />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="p-2 rounded flex-grow mr-2"
              />
              <button onClick={addTag} className="bg-blue-500 text-white p-2 rounded flex items-center">
                <FaPlus className="mr-2" /> Add Tag
              </button>
            </div>
          </div>

          {/* Add Link */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2">Add Links</h4>
            {links.map((link, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  placeholder="Link Title"
                  value={link.title}
                  onChange={(e) => updateLink(index, 'title', e.target.value)}
                  className="mr-2 p-2 rounded"
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  className="mr-2 p-2 rounded"
                />
                <button
                  onClick={() => deleteLink(index)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button onClick={addLink} className="mt-2 bg-blue-500 text-white p-2 rounded flex items-center">
              <FaPlus className="mr-2" /> Add Link
            </button>
          </div>

          {/* Social Media Links */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2">Social Media Links</h4>
            <div className="flex mb-2">
              <FaInstagram className="text-2xl mr-2" />
              <input
                type="text"
                placeholder="Instagram Profile URL"
                value={socialLinks.instagram}
                onChange={(e) => updateSocialLink('instagram', e.target.value)}
                className="p-2 rounded flex-grow"
              />
            </div>
            <div className="flex">
              <FaFacebook className="text-2xl mr-2" />
              <input
                type="text"
                placeholder="Facebook Profile URL"
                value={socialLinks.facebook}
                onChange={(e) => updateSocialLink('facebook', e.target.value)}
                className="p-2 rounded flex-grow"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicPage;
