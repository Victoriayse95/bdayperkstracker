'use client';

import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function FirebaseDebugger() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        setLoading(true);
        // Try to fetch a test document
        if (!db) {
          throw new Error('Firebase not initialized');
        }
        
        // Try to list documents from the perks collection
        await getDocs(collection(db, 'perks'));
        
        setConnectionStatus('connected');
        setErrorDetails(null);
      } catch (error) {
        setConnectionStatus('error');
        if (error instanceof Error) {
          setErrorDetails(error.message);
        } else {
          setErrorDetails('Unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    checkFirebaseConnection();
  }, []);

  return (
    <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Firebase Connection Debugger</h3>
      
      <div className="flex items-center mb-2">
        <span className="mr-2 font-medium">Status:</span>
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500 mr-2"></div>
            <span>Checking connection...</span>
          </div>
        ) : connectionStatus === 'connected' ? (
          <span className="text-green-700 flex items-center">
            <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            Connected
          </span>
        ) : (
          <span className="text-red-700 flex items-center">
            <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
            Error
          </span>
        )}
      </div>
      
      {errorDetails && (
        <div className="bg-red-50 p-3 rounded-md mt-2">
          <p className="text-sm text-red-700">Error details: {errorDetails}</p>
        </div>
      )}
      
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          <strong>Tips:</strong>
        </p>
        <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
          <li>Check that your Firebase configuration is correct in your environment variables</li>
          <li>Make sure your Firestore security rules allow the operations you're trying to perform</li>
          <li>Check your internet connection</li>
          <li>Firebase might be temporarily unavailable or experiencing issues</li>
        </ul>
      </div>
    </div>
  );
} 