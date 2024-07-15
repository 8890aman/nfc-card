/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPaperPlane,
  faClock,
  faGlobe,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import AnimatedBackground from "../utils/AnimatedBackground";
import earthDark from "../../assets/images/earth-dark.jpg";
import earthTopology from "../../assets/images/earth-topology.png";
import Globe from "react-globe.gl";
import { feature } from "topojson-client";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showToast, setShowToast] = useState(false);
  const envelopeControls = useAnimation();
  const toastControls = useAnimation();
  const [indiaFeature, setIndiaFeature] = useState(null);
  const [rings, setRings] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [countries, setCountries] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields");
      return;
    }

    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    // Trigger envelope animation
    await envelopeControls.start({
      scale: [1, 1.2, 1],
      x: [0, -25, window.innerWidth / 2],
      y: [0, -25, -window.innerHeight / 2],
      rotate: [0, -10, 45],
      opacity: [1, 1, 0],
      transition: { duration: 2, ease: "easeInOut" },
    });

    // Show toast notification
    setShowToast(true);
    await toastControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    });

    // Hide toast after 3 seconds
    setTimeout(async () => {
      await toastControls.start({
        opacity: 0,
        y: -20,
        transition: { duration: 0.5, ease: "easeIn" },
      });
      setShowToast(false);
    }, 3000);

    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  const contactInfo = [
    { icon: faEnvelope, text: "contact@neotech.com" },
    { icon: faPhone, text: "+1 (555) 123-4567" },
    { icon: faMapMarkerAlt, text: "123 Tech Street, Silicon Valley, CA" },
    { icon: faClock, text: "Mon-Fri: 9AM-6PM (PST)" },
    { icon: faGlobe, text: "www.neotech.com" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const postmanVariants = {
    wave: {
      rotate: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const globeRef = useRef();
  const [globeReady, setGlobeReady] = useState(false);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = !isHovering;
      controls.autoRotateSpeed = 0.5;
    }
  }, [globeReady, isHovering]);

  const updateRings = useCallback(() => {
    setRings((currentRings) => {
      if (currentRings.length === 0) {
        return [{ lat: 26.9124, lng: 75.7873, maxR: 1, propagationSpeed: 1 }];
      }
      const updatedRings = currentRings.map((ring) => ({
        ...ring,
        maxR: ring.maxR + 0.02,
      }));

      if (updatedRings[0].maxR > 2) {
        return [{ lat: 26.9124, lng: 75.7873, maxR: 1, propagationSpeed: 1 }];
      }

      return updatedRings;
    });
  }, []);

  useEffect(() => {
    // Fetch world GeoJSON data
    fetch(
      "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
    )
      .then((res) => res.json())
      .then((data) => {
        setCountries(data.features);
        const indiaFeature = data.features.find(
          (f) => f.properties.ADMIN === "India"
        );
        setIndiaFeature(indiaFeature);

        // Initialize the rings
        setRings([{ lat: 26.9124, lng: 75.7873, maxR: 1, propagationSpeed: 1 }]);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(updateRings, 50);
    return () => clearInterval(interval);
  }, [updateRings]);

  return (
    <section className="relative py-16 bg-gradient-to-br from-green-50 to-white dark:from-green-900 dark:to-black transition-colors duration-300 overflow-hidden">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70 backdrop-blur-xl z-0"></div>

      <div className="container mx-auto px-4 relative z-20">
        <motion.h2
          className="text-5xl font-bold mb-12 text-center text-green-700 dark:text-green-300"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          Contact Us
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-200">
              Get in Touch
            </h3>
            <p className="text-green-700 dark:text-green-300 mb-8 text-lg">
              We'd love to hear from you. Reach out to us for any inquiries or
              collaborations.
            </p>
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center mb-6"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-4">
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-2xl text-green-600 dark:text-green-300"
                  />
                </div>
                <span className="text-green-700 dark:text-green-300 text-lg">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <div className="relative">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-green-600 text-white px-4 py-3 rounded-t-lg shadow-lg flex items-center justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={toastControls}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              <span className="font-semibold">
                Message received successfully!
              </span>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              variants={itemVariants}
              className="bg-white dark:bg-green-900 shadow-xl rounded-lg p-8 mt-12"
            >
              <motion.div className="mb-6" variants={itemVariants}>
                <label
                  htmlFor="name"
                  className="block text-green-700 dark:text-green-300 mb-2 text-lg"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-green-50 dark:bg-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800 dark:text-green-200"
                  required
                />
              </motion.div>
              <motion.div className="mb-6" variants={itemVariants}>
                <label
                  htmlFor="email"
                  className="block text-green-700 dark:text-green-300 mb-2 text-lg"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-green-50 dark:bg-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800 dark:text-green-200"
                  required
                />
              </motion.div>
              <motion.div className="mb-6" variants={itemVariants}>
                <label
                  htmlFor="message"
                  className="block text-green-700 dark:text-green-300 mb-2 text-lg"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-green-50 dark:bg-green-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800 dark:text-green-200 resize-none"
                  required
                ></textarea>
              </motion.div>
              <motion.button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                Send Message
              </motion.button>
            </motion.form>
          </div>
        </motion.div>

        {/* Add spacing here */}
        <div className="my-20 border-t border-green-200 dark:border-green-800"></div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          
          <div className="flex justify-center space-x-6">
            {["facebook", "twitter", "linkedin", "instagram"].map(
              (social, index) => (
                <motion.a
                  key={social}
                  href={`https://${social}.com/neotech`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={["fab", social]} size="2x" />
                </motion.a>
              )
            )}
          </div>
        </motion.div>
        <motion.div className="mt-16" variants={itemVariants}>
          <h3 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-200 text-center">
            Our Global Presence
          </h3>
          <p className="text-green-700 dark:text-green-300 mb-8 text-lg text-center">
            Discover our impact across the globe, with a special focus on our
            operations in India.
          </p>
          <div className="w-full h-[500px] bg-gradient-to-b from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 rounded-lg overflow-hidden shadow-xl flex justify-center">
            {typeof window !== "undefined" && (
              <div
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Globe
                  ref={globeRef}
                  globeImageUrl={earthDark}
                  bumpImageUrl={earthTopology}
                  backgroundColor="rgba(0,0,0,0)"
                  atmosphereColor="#22c55e"
                  atmosphereAltitude={0.15}
                  onGlobeReady={() => setGlobeReady(true)}
                  width={800}
                  height={500}
                  cameraDistance={200}
                  initialCameraPosition={{ lat: 20, lng: 77, altitude: 1.5 }}
                  polygonsData={countries}
                  polygonAltitude={0.01}
                  polygonCapColor={(d) => d.properties.ADMIN === "India" 
                    ? "rgba(34, 197, 94, 0.8)" 
                    : "rgba(20, 83, 45, 0.3)"}
                  polygonSideColor={(d) => d.properties.ADMIN === "India"
                    ? "rgba(34, 197, 94, 0.8)"
                    : "rgba(20, 83, 45, 0.3)"}
                  polygonStrokeColor={(d) => d.properties.ADMIN === "India"
                    ? "#22c55e"
                    : "rgba(20, 83, 45, 0.5)"}
                  polygonLabel={({ properties: { ADMIN } }) => `
                    <div style="background-color: rgba(34, 197, 94, 0.8); color: white; padding: 10px; border-radius: 5px;">
                      <strong>${ADMIN}</strong>
                      ${ADMIN === "India" ? "<br/>Jaipur, India" : ""}
                    </div>
                  `}
                  labelsData={[
                    {
                      lat: 26.9124,
                      lng: 75.7873,
                      size: 1.5,
                      color: "white",
                      altitude: 0.02,
                    },
                  ]}
                  labelLat={(d) => d.lat}
                  labelLng={(d) => d.lng}
                  labelText={(d) => d.name}
                  labelSize={(d) => d.size}
                  labelColor={(d) => d.color}
                  labelDotRadius={0.5}
                  labelAltitude={(d) => d.altitude}
                  ringsData={rings}
                  ringColor={() => (t) => `rgba(134, 239, 172, ${1 - t})`}
                  ringMaxRadius="maxR"
                  ringPropagationSpeed="propagationSpeed"
                  ringRepeatPeriod={1000}
                  ringAltitude={0.015}
                  oceanColor="rgba(34, 197, 94, 0.3)"
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={envelopeControls}
        className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <FontAwesomeIcon
          icon={faEnvelope}
          className="text-6xl text-green-500"
          style={{ filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))" }}
        />
      </motion.div>
    </section>
  );
};

export default ContactUs;
