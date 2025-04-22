'use client';

import { useState, useEffect } from 'react';
import { app, db, auth } from '../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export default function FirebaseDebugger() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState('Checking Firebase connection...');
  const [testData, setTestData] = useState<any[]>([]);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    async function checkFirebaseConnection() {
      try {
        if (!app || !db) {
          setStatus('error');
          setMessage('Firebase is not initialized');
          return;
        }

        // Check connection by attempting to read from a test collection
        try {
          const testCollection = collection(db, '_test_connection');
          await getDocs(testCollection);
          setStatus('connected');
          setMessage('Successfully connected to Firebase!');
        } catch (error) {
          console.error('Error checking Firebase connection:', error);
          setStatus('error');
          setMessage(`Error connecting to Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error in Firebase connection check:', error);
        setStatus('error');
        setMessage(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    checkFirebaseConnection();
  }, []);

  const handleTestWrite = async () => {
    if (!db) {
      setTestResult('Firebase DB is not initialized');
      return;
    }

    try {
      setTestResult('Attempting to write test data...');
      
      const testCollection = collection(db, '_test_data');
      const docRef = await addDoc(testCollection, {
        message: 'Test data',
        timestamp: serverTimestamp()
      });
      
      setTestResult(`Successfully wrote test data with ID: ${docRef.id}`);
    } catch (error) {
      console.error('Error writing test data:', error);
      setTestResult(`Error writing test data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Firebase Connection Status</h2>
      
      <div className={`p-3 rounded-md mb-3 ${
        status === 'connected' ? 'bg-green-100 text-green-800' : 
        status === 'error' ? 'bg-red-100 text-red-800' : 
        'bg-blue-100 text-blue-800'
      }`}>
        <p>{message}</p>
        {status === 'error' && (
          <p className="text-sm mt-1">
            Check your Firebase configuration and make sure the project is properly set up.
          </p>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-md font-medium mb-2">Test Firebase Write Operations</h3>
        <button 
          onClick={handleTestWrite}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Test Write to Firestore
        </button>
        
        {testResult && (
          <div className={`mt-2 p-2 rounded-md ${testResult.includes('Successfully') ? 'bg-green-100' : 'bg-red-100'}`}>
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
} 