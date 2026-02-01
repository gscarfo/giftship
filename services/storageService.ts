import { Contact, Label } from '../types';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';

const CONTACTS_COL = 'contacts';
const LABELS_COL = 'labels';

export const storageService = {
  // Non più necessario un setup esplicito delle tabelle con Firestore
  setup: async () => {
    return Promise.resolve();
  },

  getSenders: async (): Promise<Contact[]> => {
    const q = query(collection(db, CONTACTS_COL), where("type", "==", "sender"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
  },

  saveContact: async (contact: Contact, type: 'sender' | 'recipient') => {
    const contactRef = doc(db, CONTACTS_COL, contact.id);
    await setDoc(contactRef, { ...contact, type });
  },

  deleteContact: async (id: string) => {
    // Elimina il contatto
    await deleteDoc(doc(db, CONTACTS_COL, id));
    
    // Pulizia etichette correlate (opzionale, ma consigliata)
    const q = query(collection(db, LABELS_COL), where("senderId", "==", id));
    const q2 = query(collection(db, LABELS_COL), where("recipientId", "==", id));
    const [snap1, snap2] = await Promise.all([getDocs(q), getDocs(q2)]);
    
    const deletePromises = [...snap1.docs, ...snap2.docs].map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  },

  getRecipients: async (): Promise<Contact[]> => {
    const q = query(collection(db, CONTACTS_COL), where("type", "==", "recipient"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
  },

  getLabels: async (): Promise<Label[]> => {
    const q = query(collection(db, LABELS_COL), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Label));
  },

  addLabel: async (label: Label) => {
    await setDoc(doc(db, LABELS_COL, label.id), label);
  },

  deleteLabel: async (id: string) => {
    await deleteDoc(doc(db, LABELS_COL, id));
  }
};