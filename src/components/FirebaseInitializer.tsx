'use client';

import { useEffect, useState } from 'react';
import { app } from '../firebase/config';

/**
 * This component initializes Firebase when the app starts
 * It doesn't render anything visible, but ensures Firebase
 * is properly initialized before the app fully loads
 */
export default function FirebaseInitializer() {
  // Only keep the error state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run Firebase checks in the browser
    if (typeof window === 'undefined') return;
    
    try {
      // Check if Firebase is initialized
      if (app) {
        console.log('Firebase initialized successfully');
      } else {
        // Don't show error during development if it's just missing environment variables
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Firebase app is undefined - this is expected during development or build');
        } else {
          console.error('Firebase app is undefined in production');
          setError('Failed to initialize Firebase');
        }
      }
    } catch (err) {
      console.error('Error initializing Firebase:', err);
      setError('Failed to initialize Firebase');
    }
  }, []);

  // Only show error in development
  if (error && process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 p-4 rounded-md shadow-lg z-50 max-w-md">
        <p className="text-red-700 font-medium">Firebase Initialization Error</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <p className="text-red-600 text-sm mt-2">
          Check your environment variables and Firebase configuration.
        </p>
      </div>
    );
  }

  // This component doesn't render anything
  return null;
} 