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
  DocumentReference
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
    return collection(db, 'perks');
  } catch (error) {
    console.error('Error getting perks collection:', error);
    return null;
  }
};

// Get all perks
export const getAllPerks = async (): Promise<Perk[]> => {
  // If not in browser or db is null, return sample data
  if (!isBrowser || !db) {
    console.warn('getAllPerks: Using sample data (SSR/build mode)');
    return [...samplePerks];
  }
  
  try {
    const perksCollection = getPerksCollection();
    if (!perksCollection) return samplePerks;
    
    const perksQuery = query(perksCollection, orderBy('business'));
    const snapshot = await getDocs(perksQuery);
    
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
    const docRef = doc(db, 'perks', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Perk;
    } else {
      return null;
    }
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
      throw new Error('Database connection error. Please try again later.');
    }
    
    console.log('Adding document to Firestore with data:', { ...perk, createdAt: 'now', updatedAt: 'now' });
    
    const docRef = await addDoc(perksCollection, {
      ...perk,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('Document added successfully with ID:', docRef.id);
    return docRef.id;
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
    const docRef = doc(db, 'perks', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error in updatePerk:', error);
    throw error;
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
    const docRef = doc(db, 'perks', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error in deletePerk:', error);
    throw error;
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
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Perk[];
  } catch (error) {
    console.error('Error in getPerksByCategory:', error);
    return samplePerks.filter(perk => perk.category === category);
  }
}; 