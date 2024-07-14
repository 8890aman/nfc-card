/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { updateProfile } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  FaUser,
  FaBriefcase,
  FaInfoCircle,
  FaTags,
  FaCamera,
  FaGlobe,
  FaPhone, // Added FaPhone icon
} from "react-icons/fa";

const UserWalkthrough = ({ darkMode }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    displayName: "",
    occupation: "",
    bio: "",
    tags: "",
    mobileNumber: "", // Ensure mobileNumber is included in the state
    profilePicture: null,
    publicProfile: "",
  });

  useEffect(() => {
    const checkWalkthroughCompletion = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().walkthroughCompleted) {
          navigate("/dashboard");
        }
      }
    };

    checkWalkthroughCompletion();
  }, [navigate]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file);
    setUserData({ ...userData, profilePicture: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      // Check for duplicate public profile
      const publicProfileRef = collection(db, "publicProfiles");
      const q = query(
        publicProfileRef,
        where("profile", "==", userData.publicProfile)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert(
          "This public profile name is already taken. Please choose another one."
        );
        return;
      }

      let photoURL = null;

      // Upload profile picture if one was selected
      if (userData.profilePicture) {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `profilePictures/${user.uid}/${userData.profilePicture.name}`
        );
        console.log("Attempting to upload to:", storageRef.fullPath);

        try {
          const snapshot = await uploadBytes(
            storageRef,
            userData.profilePicture
          );
          photoURL = await getDownloadURL(snapshot.ref);
          console.log("Profile picture uploaded successfully. URL:", photoURL);
        } catch (uploadError) {
          console.error("Error uploading profile picture:", uploadError);
          // Don't throw the error, continue with the rest of the profile update
        }
      }

      // Update user profile in Firebase Auth
      await updateProfile(user, {
        displayName: userData.displayName || user.email.split("@")[0],
        photoURL: photoURL,
      });

      // Prepare user data for Firestore
      const userDataForFirestore = {
        displayName: userData.displayName || user.email.split("@")[0],
        email: user.email,
        occupation: userData.occupation,
        bio: userData.bio,
        tags: userData.tags.split(",").map((tag) => tag.trim()),
        mobileNumber: userData.mobileNumber, // Ensure mobileNumber is included
        photoURL: photoURL,
        publicProfile: userData.publicProfile,
        updatedAt: new Date(),
        lastLogin: new Date(),
        walkthroughCompleted: true,
      };

      // Update specific fields in Firestore document
      await setDoc(doc(db, "users", user.uid), userDataForFirestore, {
        merge: true,
      });

      // Store public profile
      await setDoc(doc(db, "publicProfiles", userData.publicProfile), {
        userId: user.uid,
        profile: userData.publicProfile,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating user profile:", error);
      if (error.code) {
        console.error("Error code:", error.code);
      }
      if (error.message) {
        console.error("Error message:", error.message);
      }
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const steps = [
    { icon: <FaUser />, label: "Name" },
    { icon: <FaBriefcase />, label: "Occupation" },
    { icon: <FaInfoCircle />, label: "Bio" },
    { icon: <FaTags />, label: "Tags" },
    { icon: <FaPhone />, label: "Mobile" }, // Added Mobile step
    { icon: <FaCamera />, label: "Picture" },
    { icon: <FaGlobe />, label: "Public Profile" },
  ];

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${
        darkMode ? "from-gray-900 to-gray-800" : "from-green-100 to-green-200"
      } transition-colors duration-300`}
    >
      <motion.div
        className={`w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className={`text-3xl font-bold mb-6 text-center ${
            darkMode ? "text-green-400" : "text-green-600"
          }`}
        >
          Complete Your Profile
        </h2>

        {/* Progress indicator */}
        <div className="flex justify-between mb-8">
          {steps.map((s, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index < step ? "text-green-500" : "text-gray-400"
              }`}
            >
              <div
                className={`rounded-full p-2 ${
                  index < step
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {s.icon}
              </div>
              <span className="text-xs mt-1">{s.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Name and Occupation */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InputField
                label="Your Name"
                name="displayName"
                value={userData.displayName}
                onChange={handleChange}
                required
              />
              <InputField
                label="What do you do?"
                name="occupation"
                value={userData.occupation}
                onChange={handleChange}
                required
              />
            </motion.div>
          )}

          {/* Step 2: Bio */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TextAreaField
                label="Tell us about yourself"
                name="bio"
                value={userData.bio}
                onChange={handleChange}
                required
              />
            </motion.div>
          )}

          {/* Step 3: Tags */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InputField
                label="Add some tags (comma-separated)"
                name="tags"
                value={userData.tags}
                onChange={handleChange}
                required
              />
            </motion.div>
          )}

          {/* Step 4: Mobile Number */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InputField
                label="Mobile Number"
                name="mobileNumber"
                value={userData.mobileNumber}
                onChange={handleChange}
                required
                type="tel"
                placeholder="Enter your mobile number"
              />
            </motion.div>
          )}

          {/* Step 5: Profile Picture */}
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FileInputField
                label="Upload a profile picture"
                name="profilePicture"
                onChange={handleFileChange}
              />
            </motion.div>
          )}

          {/* Step 6: Public Profile */}
          {step === 6 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InputField
                label="Choose a public profile name"
                name="publicProfile"
                value={userData.publicProfile}
                onChange={handleChange}
                required
              />
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-300"
              >
                Back
              </button>
            )}
            {step < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300 ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300 ml-auto"
              >
                Finish
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Helper components for form fields
const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
      {...props}
    />
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <textarea
      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
      {...props}
    />
  </div>
);

const FileInputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      type="file"
      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
      {...props}
    />
  </div>
);

export default UserWalkthrough;