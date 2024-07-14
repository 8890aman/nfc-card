// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, sendEmailVerification, signOut } from 'firebase/auth';
// eslint-disable-next-line no-unused-vars
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBbA0KikfryEGQwIrOpnLFHUi0fxZ-Lhb0",
    authDomain: "nfc-card-app-5261e.firebaseapp.com",
    projectId: "nfc-card-app-5261e",
    storageBucket: "nfc-card-app-5261e.appspot.com",
    messagingSenderId: "551622534405",
    appId: "1:551622534405:web:2e1ee0a3aa3d6f18fec36c",
    measurementId: "G-8K5V05B23L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

const checkEmailVerification = (user) => {
  return user.emailVerified;
};

const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

const reloadUser = async () => {
  try {
    await auth.currentUser.reload();
    return auth.currentUser;
  } catch (error) {
    console.error('Error reloading user:', error);
    throw error;
  }
};

export { 
  auth, 
  db, // Added this line to export db directly
  storage,
  analytics,
  sendVerificationEmail, 
  checkEmailVerification, 
  signOutUser,
  reloadUser
};
