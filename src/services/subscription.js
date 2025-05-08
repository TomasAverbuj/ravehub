// services/subscription.js
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase"; 

export const getSubscriptionStatus = async (userId) => {
  const userSubscriptionRef = doc(db, "subscriptions", userId);
  const userSubscriptionSnap = await getDoc(userSubscriptionRef);
  if (userSubscriptionSnap.exists()) {
    return userSubscriptionSnap.data();
  } else {
    return null;
  }
};

export const subscribeUser = async (userId) => {
  const userSubscriptionRef = doc(db, "subscriptions", userId);
  const subscriptionData = {
    status: "active",
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // 1 month subscription
  };
  await setDoc(userSubscriptionRef, subscriptionData);
};

export const unsubscribeUser = async (userId) => {
  const userSubscriptionRef = doc(db, "subscriptions", userId);
  await deleteDoc(userSubscriptionRef);
};
