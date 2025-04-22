'use client';

import { useState, useEffect } from 'react';
import { app, db, auth } from '../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';

export default function FirebaseDebugger() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState('Checking Firebase connection...');
  const [testData, setTestData] = useState<any[]>([]);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isWriteLoading, setIsWriteLoading] = useState(false);

  useEffect(() => {
    async function checkFirebaseConnection() {
      try {
        if (!app || !db) {
          setStatus('error');
          setMessage('Firebase is not initialized. Check your environment variables in Vercel.');
          return;
        }

        // Check connection by attempting to read from a test collection
        try {
          const testCollection = collection(db as Firestore, '_test_connection');
          
          // Set a timeout for the connection test
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout - Firestore is not responding')), 10000)
          );
          
          await Promise.race([getDocs(testCollection), timeoutPromise]);
          
          setStatus('connected');
          setMessage('Successfully connected to Firebase!');
        } catch (error) {
          console.error('Error checking Firebase connection:', error);
          setStatus('error');
          let errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          if (errorMessage.includes('timeout')) {
            errorMessage = 'Connection timeout. Firestore is not responding or might be blocked.';
          } else if (errorMessage.includes('permission-denied')) {
            errorMessage = 'Permission denied. Check your Firestore security rules.';
          } else if (errorMessage.includes('not-found')) {
            errorMessage = 'Project or database not found. Check your Firebase project configuration.';
          }
          
          setMessage(`Error connecting to Firebase: ${errorMessage}`);
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
      setIsWriteLoading(true);
      setTestResult('Attempting to write test data...');
      
      // Set a timeout for the write operation
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Write operation timeout after 10 seconds')), 10000)
      );
      
      const writePromise = async () => {
        // Cast db as Firestore to fix type error
        const firestore = db as Firestore;
        const testCollection = collection(firestore, '_test_data');
        const docRef = await addDoc(testCollection, {
          message: 'Test data',
          timestamp: serverTimestamp(),
          createdAt: new Date().toISOString()
        });
        return docRef;
      };
      
      const docRef = await Promise.race([writePromise(), timeoutPromise]);
      setTestResult(`Successfully wrote test data with ID: ${docRef.id}`);
    } catch (error) {
      console.error('Error writing test data:', error);
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('timeout')) {
        errorMessage = 'Write operation timed out. Firestore is not responding or might be blocked.';
      } else if (errorMessage.includes('permission-denied')) {
        errorMessage = 'Permission denied. Check your Firestore security rules.';
      } else if (errorMessage.includes('quota-exceeded')) {
        errorMessage = 'Firebase quota exceeded. Check your billing plan.';
      }
      
      setTestResult(`Error writing test data: ${errorMessage}`);
    } finally {
      setIsWriteLoading(false);
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
          <div className="text-sm mt-1">
            <p>Check your Firebase configuration and make sure the project is properly set up.</p>
            <p className="mt-1">Common issues:</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Environment variables not correctly set in Vercel</li>
              <li>Firestore rules blocking access</li>
              <li>Firestore not enabled for your project</li>
              <li>Project ID mismatch between config and actual project</li>
            </ul>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-md font-medium mb-2">Test Firebase Write Operations</h3>
        <button 
          onClick={handleTestWrite}
          disabled={isWriteLoading}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${isWriteLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isWriteLoading ? 'Testing...' : 'Test Write to Firestore'}
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