import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
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

// Log the environment variable status
console.log('Firebase config loaded with:', {
  apiKey: firebaseConfig.apiKey ? (firebaseConfig.apiKey === 'placeholder-api-key' ? 'PLACEHOLDER_USED' : 'API_KEY_SET') : 'API_KEY_MISSING',
  authDomain: firebaseConfig.authDomain ? (firebaseConfig.authDomain === 'placeholder-app.firebaseapp.com' ? 'PLACEHOLDER_USED' : firebaseConfig.authDomain) : 'AUTH_DOMAIN_MISSING',
  projectId: firebaseConfig.projectId ? (firebaseConfig.projectId === 'placeholder-app' ? 'PLACEHOLDER_USED' : firebaseConfig.projectId) : 'PROJECT_ID_MISSING',
  storageBucket: firebaseConfig.storageBucket ? (firebaseConfig.storageBucket === 'placeholder-app.appspot.com' ? 'PLACEHOLDER_USED' : firebaseConfig.storageBucket) : 'STORAGE_BUCKET_MISSING',
  messagingSenderId: firebaseConfig.messagingSenderId ? (firebaseConfig.messagingSenderId === '000000000000' ? 'PLACEHOLDER_USED' : 'MESSAGING_SENDER_ID_SET') : 'MESSAGING_SENDER_ID_MISSING',
  appId: firebaseConfig.appId ? (firebaseConfig.appId === '1:000000000000:web:0000000000000000000000' ? 'PLACEHOLDER_USED' : 'APP_ID_SET') : 'APP_ID_MISSING',
});

// Only initialize Firebase if we're in the browser and not during SSG/SSR
const initializeFirebase = () => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    // Don't initialize with placeholder values
    if (firebaseConfig.apiKey === 'placeholder-api-key') {
      console.error('Firebase config is missing environment variables');
      return { app: null, db: null, auth: null, storage: null };
    }
    
    // Verify essential config values
    const essentialValues = [
      { name: 'apiKey', value: firebaseConfig.apiKey },
      { name: 'projectId', value: firebaseConfig.projectId },
      { name: 'appId', value: firebaseConfig.appId },
    ];
    
    const missingValues = essentialValues
      .filter(item => !item.value || item.value.includes('placeholder'))
      .map(item => item.name);
    
    if (missingValues.length > 0) {
      console.error(`Firebase initialization error: Missing essential configuration values: ${missingValues.join(', ')}`);
      return { app: null, db: null, auth: null, storage: null };
    }
    
    try {
      // Initialize Firebase only if not already initialized
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const db = getFirestore(app);
      const auth = getAuth(app);
      const storage = getStorage(app);
      
      console.log('Firebase initialized successfully!');
      
      // Use Firestore emulator in development if needed
      // if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
      //   connectFirestoreEmulator(db, 'localhost', 8080);
      //   console.log('Connected to Firestore emulator');
      // }
      
      return { app, db, auth, storage };
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      return { app: null, db: null, auth: null, storage: null };
    }
  }
  
  // Return null values for server-side
  console.log('Firebase not initialized (server-side context)');
  return { app: null, db: null, auth: null, storage: null };
};

// Initialize Firebase
const { app, db, auth, storage } = initializeFirebase();

// Export a function to check Firebase connectivity
export const checkFirebaseConnection = async () => {
  if (!app || !db) {
    return { connected: false, message: 'Firebase is not initialized' };
  }
  
  try {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firebase connection timeout')), 10000)
    );
    
    // Attempt a simple ping
    const result = await Promise.race([
      Promise.resolve({ connected: true, message: 'Firebase connected successfully' }),
      timeout
    ]);
    
    return result;
  } catch (error) {
    return { 
      connected: false, 
      message: `Firebase connection error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

export { app, db, auth, storage }; 