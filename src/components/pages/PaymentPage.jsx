import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, currency, name, email, contact } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    if (!amount || !currency || !name || !email || !contact) {
      navigate('/'); // Redirect to home if payment data is missing
      return;
    }

    if (!auth.currentUser) {
      navigate('/login'); // Redirect to login if user is not authenticated
      return;
    }

    const userId = auth.currentUser.uid;
    const paymentRef = doc(db, 'payments', userId);

    // Create or update payment document
    setDoc(paymentRef, {
      amount,
      currency,
      name,
      email,
      contact,
      status: 'pending',
      createdAt: new Date(),
    }, { merge: true });

    // Listen for changes in payment status
    const unsubscribe = onSnapshot(paymentRef, (doc) => {
      if (doc.exists()) {
        setPaymentStatus(doc.data().status);
      }
    });

    // Construct the WhatsApp message
    const message = `Hello! I'd like to make a payment for the NFC Card.\n\nDetails:\nAmount: ${amount} ${currency}\nName: ${name}\nEmail: ${email}\nContact: ${contact}\nPayment ID: ${userId}`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Replace with your WhatsApp business number
    const whatsappNumber = '1234567890';
    
    // Construct the WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Redirect to WhatsApp
    window.location.href = whatsappUrl;

    return () => unsubscribe();
  }, [amount, currency, name, email, contact, navigate, auth, db]);

  useEffect(() => {
    if (paymentStatus === 'completed') {
      navigate('/user-walkthrough');
    }
  }, [paymentStatus, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl">
        {paymentStatus === 'pending' ? "Redirecting to WhatsApp for payment..." : "Payment completed. Redirecting to user walkthrough..."}
      </p>
    </div>
  );
};

export default PaymentPage;