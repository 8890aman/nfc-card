/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaGlobe, FaPlus, FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaGithub, FaTrash, FaSave, FaEye, FaTimes, FaChevronDown, FaChevronUp, FaQuestion, FaShoppingCart } from 'react-icons/fa';
import TemplateSelector from './TemplateSelector';
import { doc, setDoc, collection, addDoc, serverTimestamp, query, where, getDocs, limit, deleteDoc, orderBy, increment } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

const PublicPage = ({ user, userData, darkMode, updateUserProfile }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(userData.template || 'dark');
  const [links, setLinks] = useState(userData.templateData?.links || []);
  const [socialLinks, setSocialLinks] = useState(userData.templateData?.socialLinks || {
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    github: '',
  });
  const [tags, setTags] = useState(userData.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSection, setOpenSection] = useState('tags');
  const [faqs, setFaqs] = useState(userData.templateData?.faqs || []);
  const [products, setProducts] = useState(userData.templateData?.products || []);
  const [isUploading, setIsUploading] = useState(false);

  const handleOpenUrl = () => {
    const baseUrl = window.location.origin;
    const pageUrl = `${baseUrl}/profile/${user.uid}`;
    window.open(pageUrl, '_blank');
    incrementPageVisits();
  };

  const incrementPageVisits = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { 
        pageVisits: increment(1)
      }, { merge: true });
    } catch (error) {
      console.error('Error incrementing page visits:', error);
    }
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

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const updateFaq = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const deleteFaq = (index) => {
    const newFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(newFaqs);
  };

  const addProduct = () => {
    if (products.length < 20) {
      setProducts([...products, { name: '', description: '', price: '', imageUrl: '', buyUrl: '' }]);
    } else {
      alert('Maximum limit of 20 products reached.');
    }
  };

  const updateProduct = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const deleteProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const compressImage = async (imageFile) => {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    try {
      return await imageCompression(imageFile, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      return null;
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    setIsUploading(true);
    try {
      const compressedFile = await compressImage(file);
      if (!compressedFile) throw new Error("Image compression failed");

      const storage = getStorage();
      const storageRef = ref(storage, `product_images/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(storageRef);
      setIsUploading(false);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
      return null;
    }
  };

  const saveTemplate = async () => {
    try {
      const templateData = {
        selectedTemplate,
        links,
        socialLinks,
        tags,
        faqs,
        products,
        updatedAt: new Date()
      };
      console.log('Saving template data:', templateData);

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { 
        templateData,
        template: selectedTemplate
      }, { merge: true });

      updateUserProfile({ 
        templateData,
        template: selectedTemplate
      });

      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Public Page</h1>
          <div className="flex space-x-4">
            <button
              onClick={saveTemplate}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center"
            >
              <FaSave className="mr-2" />
              Save
            </button>
            <button
              onClick={handleOpenUrl}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center"
            >
              <FaEye className="mr-2" />
              Preview
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Template</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className={`py-2 px-4 rounded-lg text-center font-semibold transition-colors duration-300 ${
                  darkMode
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                Choose Template
              </button>
            </div>
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              darkMode={darkMode}
              userData={userData}
              faqs={faqs}
              links={links}
              socialLinks={socialLinks}
              tags={tags}
              products={products}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </section>

          <section className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
            <h2 className="text-2xl font-bold mb-8 text-center">Customize Your Profile</h2>
            
            <div className="space-y-4">
              {[
                { id: 'tags', icon: '🏷️', title: 'Tags' },
                { id: 'links', icon: '🔗', title: 'Links' },
                { id: 'social', icon: '📱', title: 'Social Media' },
                { id: 'faqs', icon: '❓', title: 'FAQs' },
                { id: 'products', icon: '🛍️', title: 'Products' },
              ].map(({ id, icon, title }) => (
                <div key={id} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md`}>
                  <button
                    onClick={() => toggleSection(id)}
                    className="w-full flex justify-between items-center text-xl font-semibold"
                  >
                    <span className="flex items-center">
                      <span className="mr-2">{icon}</span> {title}
                    </span>
                    {openSection === id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {openSection === id && (
                    <div className="mt-4">
                      {id === 'tags' && (
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md`}>
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="mr-2">🏷️</span> Tags
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {tags.map((tag, index) => (
                              <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'} flex items-center`}>
                                {tag}
                                <button onClick={() => removeTag(tag)} className="ml-2 text-xs hover:text-red-500 transition-colors duration-200">
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
                              className={`p-2 rounded-l-lg flex-grow border-2 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <button onClick={addTag} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-lg transition duration-200">
                              <FaPlus />
                            </button>
                          </div>
                        </div>
                      )}
                      {id === 'links' && (
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md`}>
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="mr-2">🔗</span> Links
                          </h3>
                          <div className="space-y-4">
                            {links.map((link, index) => (
                              <div key={index} className="flex space-x-2">
                                <input
                                  type="text"
                                  placeholder="Title"
                                  value={link.title}
                                  onChange={(e) => updateLink(index, 'title', e.target.value)}
                                  className={`p-2 rounded-lg flex-grow border-2 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                <input
                                  type="url"
                                  placeholder="URL"
                                  value={link.url}
                                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                                  className={`p-2 rounded-lg flex-grow border-2 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                <button
                                  onClick={() => deleteLink(index)}
                                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition duration-200"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button onClick={addLink} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center">
                            <FaPlus className="mr-2" /> Add Link
                          </button>
                        </div>
                      )}
                      {id === 'social' && (
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md`}>
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="mr-2">📱</span> Social Media
                          </h3>
                          <div className="space-y-4">
                            {[
                              { icon: FaInstagram, name: 'instagram', color: 'pink' },
                              { icon: FaFacebook, name: 'facebook', color: 'blue' },
                              { icon: FaTwitter, name: 'twitter', color: 'sky' },
                              { icon: FaLinkedin, name: 'linkedin', color: 'blue' },
                              { icon: FaYoutube, name: 'youtube', color: 'red' },
                              { icon: FaGithub, name: 'github', color: 'gray' },
                            ].map(({ icon: Icon, name, color }) => (
                              <div key={name} className="flex items-center space-x-2">
                                <Icon className={`text-2xl ${darkMode ? `text-${color}-400` : `text-${color}-600`}`} />
                                <input
                                  type="text"
                                  placeholder={`${name.charAt(0).toUpperCase() + name.slice(1)} Profile URL`}
                                  value={socialLinks[name]}
                                  onChange={(e) => updateSocialLink(name, e.target.value)}
                                  className={`p-2 rounded-lg flex-grow border-2 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-${color}-500`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {id === 'faqs' && (
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md`}>
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="mr-2">❓</span> FAQs
                          </h3>
                          <div className="space-y-4">
                            {faqs.map((faq, index) => (
                              <div key={index} className="space-y-2">
                                <input
                                  type="text"
                                  placeholder="Question"
                                  value={faq.question}
                                  onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                  className={`p-2 rounded-lg w-full border-2 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                <textarea
                                  placeholder="Answer"
                                  value={faq.answer}
                                  onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                                  className={`p-2 rounded-lg w-full border-2 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                  rows="3"
                                />
                                <button
                                  onClick={() => deleteFaq(index)}
                                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition duration-200"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button onClick={addFaq} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center">
                            <FaPlus className="mr-2" /> Add FAQ
                          </button>
                        </div>
                      )}
                      {id === 'products' && (
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md`}>
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="mr-2">🛍️</span> Products
                          </h3>
                          <div className="space-y-4">
                            {products.map((product, index) => (
                              <div key={index} className="space-y-2 p-4 border rounded-lg">
                                <input
                                  type="text"
                                  placeholder="Product Name"
                                  value={product.name}
                                  onChange={(e) => updateProduct(index, 'name', e.target.value)}
                                  className={`p-2 rounded-lg w-full border-2 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                <textarea
                                  placeholder="Product Description"
                                  value={product.description}
                                  onChange={(e) => updateProduct(index, 'description', e.target.value)}
                                  className={`p-2 rounded-lg w-full border-2 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                  rows="3"
                                />
                                <div className="flex items-center">
                                  <span className={`mr-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>₹</span>
                                  <input
                                    type="number"
                                    placeholder="Price in INR"
                                    value={product.price}
                                    onChange={(e) => updateProduct(index, 'price', e.target.value)}
                                    className={`p-2 rounded-lg w-full border-2 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                  />
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const downloadURL = await uploadImage(e.target.files[0]);
                                    if (downloadURL) {
                                      updateProduct(index, 'imageUrl', downloadURL);
                                    }
                                  }}
                                  className={`p-2 rounded-lg w-full border-2 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                <input
                                  type="url"
                                  placeholder="Buy URL"
                                  value={product.buyUrl}
                                  onChange={(e) => updateProduct(index, 'buyUrl', e.target.value)}
                                  className={`p-2 rounded-lg w-full border-2 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                <button
                                  onClick={() => deleteProduct(index)}
                                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition duration-200"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button onClick={addProduct} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center">
                            <FaPlus className="mr-2" /> Add Product
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicPage;