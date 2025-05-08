import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function getUserById(userId) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
} 