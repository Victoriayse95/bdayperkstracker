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
  expiry: string;
  value: string;
  status: string;
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
    expiry: "04/26/2023",
    value: "$5",
    status: "Reminder Sent",
    notes: "Free drink on birthday - mobile app required"
  },
  {
    id: '2',
    business: "Sephora",
    contact: "555-567-8901",
    category: "Beauty",
    expiry: "04/30/2023",
    value: "$10",
    status: "Service In Progress",
    notes: "Free beauty gift - Beauty Insider membership required"
  },
  {
    id: '3',
    business: "Baskin-Robbins",
    contact: "555-345-6789",
    category: "Food & Dessert",
    expiry: "04/20/2023",
    value: "$3",
    status: "Cancelled",
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
    const perksCollection = getPerksCollection();
    if (!perksCollection) throw new Error('Firestore not initialized');
    
    const docRef = await addDoc(perksCollection, {
      ...perk,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error in addPerk:', error);
    throw error;
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