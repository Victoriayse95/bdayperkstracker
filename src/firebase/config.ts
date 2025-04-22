import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Get Firebase config from environment variables or use placeholders during build
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'placeholder-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'placeholder-app.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'placeholder-app',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'placeholder-app.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000',
};

// Only initialize Firebase if we're in the browser and not during SSG/SSR
const initializeFirebase = () => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    // Don't initialize with placeholder values
    if (firebaseConfig.apiKey === 'placeholder-api-key') {
      console.error('Firebase config is missing environment variables');
      return { app: null, db: null, auth: null, storage: null };
    }
    
    // Initialize Firebase only if not already initialized
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    return { app, db, auth, storage };
  }
  
  // Return null values for server-side
  return { app: null, db: null, auth: null, storage: null };
};

// Initialize Firebase
const { app, db, auth, storage } = initializeFirebase();

export { app, db, auth, storage }; 