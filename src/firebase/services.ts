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
  Timestamp 
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

// Collection references
const perksCollection = collection(db, 'perks');

// Get all perks
export const getAllPerks = async (): Promise<Perk[]> => {
  const perksQuery = query(perksCollection, orderBy('business'));
  const snapshot = await getDocs(perksQuery);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Perk[];
};

// Get perk by ID
export const getPerkById = async (id: string): Promise<Perk | null> => {
  const docRef = doc(db, 'perks', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Perk;
  } else {
    return null;
  }
};

// Add a new perk
export const addPerk = async (perk: Omit<Perk, 'id'>): Promise<string> => {
  const docRef = await addDoc(perksCollection, {
    ...perk,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  
  return docRef.id;
};

// Update a perk
export const updatePerk = async (id: string, data: Partial<Perk>): Promise<void> => {
  const docRef = doc(db, 'perks', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

// Delete a perk
export const deletePerk = async (id: string): Promise<void> => {
  const docRef = doc(db, 'perks', id);
  await deleteDoc(docRef);
};

// Get perks by category
export const getPerksByCategory = async (category: string): Promise<Perk[]> => {
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
}; 