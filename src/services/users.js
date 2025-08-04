import { doc, getDoc, getDocs, collection, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db, handleNetworkError } from './firebase';

export async function getUserById(userId) {
  const retryFunction = async () => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  };

  try {
    return await retryFunction();
  } catch (error) {
    return await handleNetworkError(error, retryFunction);
  }
}

export async function getAllUsers() {
  const retryFunction = async () => {
    const usersCol = collection(db, 'users');
    const snapshot = await getDocs(usersCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  try {
    return await retryFunction();
  } catch (error) {
    return await handleNetworkError(error, retryFunction);
  }
}

export async function updateUser(userId, userData) {
  const retryFunction = async () => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, userData);
    return true;
  };

  try {
    return await retryFunction();
  } catch (error) {
    return await handleNetworkError(error, retryFunction);
  }
}

export async function deleteUser(userId) {
  const retryFunction = async () => {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    return true;
  };

  try {
    return await retryFunction();
  } catch (error) {
    return await handleNetworkError(error, retryFunction);
  }
}

export async function createUser(userId, userData) {
  const retryFunction = async () => {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, userData);
    return true;
  };

  try {
    return await retryFunction();
  } catch (error) {
    return await handleNetworkError(error, retryFunction);
  }
} 