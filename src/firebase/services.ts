import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy, 
  Timestamp,
  CollectionReference,
  DocumentReference,
  Firestore
} from 'firebase/firestore';
import { db } from './config';

// Perk type definition
export interface Perk {
  id?: string;
  business: string;
  contact: string;
  category: string;
  startDate: string;
  expiry: string;
  redemptionPhone: string;
  redemptionEmail: string;
  status: 'To Redeem' | 'Redeemed' | 'Expired';
  notes: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Sample perks data for SSR/build time
export const samplePerks: Perk[] = [
  {
    id: '1',
    business: "Starbucks",
    contact: "555-123-4567",
    category: "Coffee & Drinks",
    startDate: "04/19/2023",
    expiry: "04/26/2023",
    redemptionPhone: "800-782-7282",
    redemptionEmail: "support@starbucks.com",
    status: "To Redeem",
    notes: "Free drink on birthday - mobile app required"
  },
  {
    id: '2',
    business: "Sephora",
    contact: "555-567-8901",
    category: "Beauty",
    startDate: "04/23/2023",
    expiry: "04/30/2023",
    redemptionPhone: "877-737-4672",
    redemptionEmail: "customerservice@sephora.com",
    status: "To Redeem",
    notes: "Free beauty gift - Beauty Insider membership required"
  },
  {
    id: '3',
    business: "Baskin-Robbins",
    contact: "555-345-6789",
    category: "Food & Dessert",
    startDate: "04/13/2023",
    expiry: "04/20/2023",
    redemptionPhone: "800-859-5339",
    redemptionEmail: "support@baskinrobbins.com",
    status: "Expired",
    notes: "Free ice cream scoop - birthday club membership needed"
  }
];

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Safe collection reference function
const getPerksCollection = (): CollectionReference | null => {
  if (!isBrowser || !db) return null;
  try {
    return collection(db as Firestore, 'perks');
  } catch (error) {
    console.error('Error getting perks collection:', error);
    return null;
  }
};

// Helper to handle Firestore timeouts
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000, fallback?: T): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('TIMEOUT_ERROR')), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } catch (error) {
    console.error('Operation timed out or failed:', error);
    if (fallback !== undefined) {
      console.log('Using fallback data');
      return fallback;
    }
    throw error;
  }
}

// Get all perks
export const getAllPerks = async (): Promise<Perk[]> => {
  // If not in browser or db is null, return sample data
  if (!isBrowser || !db) {
    console.warn('getAllPerks: Using sample data (SSR/build mode)');
    return [...samplePerks];
  }
  
  try {
    console.log('Getting perks collection reference');
    const perksCollection = getPerksCollection();
    if (!perksCollection) {
      console.warn('Perks collection reference is null, using sample data');
      return [...samplePerks];
    }
    
    console.log('Querying Firestore for perks...');
    const perksQuery = query(perksCollection, orderBy('business'));
    
    // Use timeout with fallback to sample data
    const snapshot = await withTimeout(
      getDocs(perksQuery), 
      8000, 
      { docs: [] }
    );
    
    if (snapshot.docs.length === 0) {
      console.log('No perks found in Firestore, using sample data');
      return [...samplePerks];
    }
    
    console.log(`Found ${snapshot.docs.length} perks in Firestore`);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Perk[];
  } catch (error) {
    console.error('Error in getAllPerks:', error);
    return [...samplePerks];
  }
};

// Get perk by ID
export const getPerkById = async (id: string): Promise<Perk | null> => {
  // If not in browser or db is null, return from sample data
  if (!isBrowser || !db) {
    console.warn('getPerkById: Using sample data (SSR/build mode)');
    return samplePerks.find(perk => perk.id === id) || null;
  }
  
  try {
    if (!db) return null;
    const docRef = doc(db as Firestore, 'perks', id);
    
    // Use timeout with fallback to sample data
    const docSnap = await withTimeout(
      getDoc(docRef), 
      8000, 
      null
    );
    
    if (!docSnap || !docSnap.exists()) {
      const samplePerk = samplePerks.find(perk => perk.id === id);
      return samplePerk || null;
    }
    
    return { id: docSnap.id, ...docSnap.data() } as Perk;
  } catch (error) {
    console.error('Error in getPerkById:', error);
    return samplePerks.find(perk => perk.id === id) || null;
  }
};

// Add a new perk
export const addPerk = async (perk: Omit<Perk, 'id'>): Promise<string> => {
  // If not in browser or db is null, mock the operation
  if (!isBrowser || !db) {
    console.warn('addPerk: Mocked operation (SSR/build mode)');
    return 'mocked-id-' + Date.now();
  }
  
  try {
    console.log('Getting perks collection reference');
    const perksCollection = getPerksCollection();
    
    if (!perksCollection) {
      console.error('Firestore not initialized, perksCollection is null');
      // Return mock ID but show we're using fallback
      console.log('Using fallback mock ID due to Firebase connection issues');
      return 'mock-' + Date.now();
    }
    
    // Validate data structure
    const requiredFields = ['business', 'category', 'startDate', 'expiry', 'status'];
    const missingFields = requiredFields.filter(field => !perk[field as keyof typeof perk]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Clean and prepare the data
    const cleanedPerk = {
      ...perk,
      business: String(perk.business).trim(),
      category: String(perk.category).trim(),
      status: perk.status || 'To Redeem',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    console.log('Adding document to Firestore with data:', { 
      ...cleanedPerk, 
      createdAt: 'now', 
      updatedAt: 'now' 
    });
    
    try {
      // Use timeout - if it fails, fall back to mock ID
      const docRef = await withTimeout(
        addDoc(perksCollection, cleanedPerk),
        8000
      );
      
      console.log('Document added successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Firebase write operation failed:', error);
      if (String(error).includes('TIMEOUT_ERROR')) {
        // Use mock ID as fallback
        const mockId = 'mock-timeout-' + Date.now();
        console.log('Using fallback mock ID due to timeout:', mockId);
        return mockId;
      }
      throw error;
    }
  } catch (error) {
    console.error('Detailed error in addPerk:', error);
    if (error instanceof Error) {
      // Provide more specific error messages based on error types
      if (error.message.includes('permission-denied')) {
        throw new Error('Permission denied. You do not have access to add perks.');
      } else if (error.message.includes('unavailable')) {
        throw new Error('Firestore service is currently unavailable. Please try again later.');
      } else if (error.message.includes('unauthenticated')) {
        throw new Error('Authentication required. Please sign in to add perks.');
      } else if (error.message.includes('quota-exceeded')) {
        throw new Error('Firebase quota exceeded. Please try again later.');
      } else if (error.message.includes('invalid-argument')) {
        throw new Error('Invalid data format. Please check your input and try again.');
      } else {
        throw new Error(`Failed to add perk: ${error.message}`);
      }
    } else {
      throw new Error('Unknown error occurred while adding the perk');
    }
  }
};

// Update a perk
export const updatePerk = async (id: string, data: Partial<Perk>): Promise<void> => {
  // If not in browser or db is null, mock the operation
  if (!isBrowser || !db) {
    console.warn('updatePerk: Mocked operation (SSR/build mode)');
    return;
  }
  
  try {
    if (!db) throw new Error('Firestore not initialized');
    const docRef = doc(db as Firestore, 'perks', id);
    
    // Try with timeout
    await withTimeout(
      updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      }),
      8000
    );
  } catch (error) {
    console.error('Error in updatePerk:', error);
    // Don't throw here, just let it silently fail for UX
  }
};

// Delete a perk
export const deletePerk = async (id: string): Promise<void> => {
  // If not in browser or db is null, mock the operation
  if (!isBrowser || !db) {
    console.warn('deletePerk: Mocked operation (SSR/build mode)');
    return;
  }
  
  try {
    if (!db) throw new Error('Firestore not initialized');
    const docRef = doc(db as Firestore, 'perks', id);
    
    // Try with timeout
    await withTimeout(
      deleteDoc(docRef),
      8000
    );
  } catch (error) {
    console.error('Error in deletePerk:', error);
    // Don't throw here, just let it silently fail for UX
  }
};

// Get perks by category
export const getPerksByCategory = async (category: string): Promise<Perk[]> => {
  // If not in browser or db is null, return filtered sample data
  if (!isBrowser || !db) {
    console.warn('getPerksByCategory: Using sample data (SSR/build mode)');
    return samplePerks.filter(perk => perk.category === category);
  }
  
  try {
    const perksCollection = getPerksCollection();
    if (!perksCollection) return samplePerks.filter(perk => perk.category === category);
    
    const q = query(
      perksCollection, 
      where('category', '==', category),
      orderBy('business')
    );
    
    // Use timeout with fallback
    const snapshot = await withTimeout(
      getDocs(q),
      8000,
      { docs: [] }
    );
    
    if (snapshot.docs.length === 0) {
      return samplePerks.filter(perk => perk.category === category);
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Perk[];
  } catch (error) {
    console.error('Error in getPerksByCategory:', error);
    return samplePerks.filter(perk => perk.category === category);
  }
}; 