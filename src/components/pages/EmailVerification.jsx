/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import { auth, reloadUser, sendVerificationEmail } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const checkEmailVerification = async () => {
    try {
      const user = await reloadUser();
      console.log("Current user:", user);
      console.log("Email verified status:", user?.emailVerified);
      if (user?.emailVerified) {
        setIsVerified(true);
        navigate('/design-card');
      } else {
        setMessage('Email is not verified yet. Please check your inbox and spam folder.');
      }
    } catch (error) {
      console.error("Error checking email verification:", error);
      setError('Error checking email verification. Please try again.');
    }
  };

  useEffect(() => {
    const interval = setInterval(checkEmailVerification, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const resendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await sendVerificationEmail(user);
        setMessage('Verification email sent. Please check your inbox.');
      } catch (error) {
        setError('Error sending verification email. Please try again.');
        console.error("Error sending verification email:", error);
      }
    }
  };

  if (isVerified) {
    return <div>Email verified! Redirecting to dashboard...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification email to your inbox. Please check your email and click the verification link.
          </p>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
        <div className="mt-5 space-y-3">
          <button
            onClick={resendVerificationEmail}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Resend Verification Email
          </button>
          <button
            onClick={checkEmailVerification}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Check Email Verification
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;