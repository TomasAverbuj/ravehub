// services/subscription.js
import { doc, setDoc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; 

// Tipos de suscripción
export const SUBSCRIPTION_TYPES = {
  FREE: 'free',
  PREMIUM: 'premium'
};

// Beneficios de cada tipo
export const SUBSCRIPTION_BENEFITS = {
  free: {
    name: 'Gratuita',
    price: 0,
    discount: 0,
    earlyAccess: false,
    privateChats: 5,
    ads: true,
    support: 'básico'
  },
  premium: {
    name: 'Premium',
    price: 9.99,
    discount: 0.15, // 15% descuento
    earlyAccess: true,
    privateChats: -1, // ilimitado
    ads: false,
    support: 'prioritario'
  }
};

export const getSubscriptionStatus = async (userId) => {
  const userSubscriptionRef = doc(db, "subscriptions", userId);
  const userSubscriptionSnap = await getDoc(userSubscriptionRef);
  if (userSubscriptionSnap.exists()) {
    return userSubscriptionSnap.data();
  } else {
    // Usuario sin suscripción = suscripción gratuita
    return {
      status: "active",
      type: SUBSCRIPTION_TYPES.FREE,
      startDate: new Date().toISOString(),
      endDate: null, // Gratuita no expira
      benefits: SUBSCRIPTION_BENEFITS.free
    };
  }
};

export const subscribeUser = async (userId, type = SUBSCRIPTION_TYPES.PREMIUM) => {
  const userSubscriptionRef = doc(db, "subscriptions", userId);
  const benefits = SUBSCRIPTION_BENEFITS[type];
  
  const subscriptionData = {
    status: "active",
    type: type,
    startDate: new Date().toISOString(),
    endDate: type === SUBSCRIPTION_TYPES.PREMIUM 
      ? new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
      : null,
    benefits: benefits,
    price: benefits.price
  };
  
  await setDoc(userSubscriptionRef, subscriptionData);
  return subscriptionData;
};

/**
 * Cancela la suscripción del usuario (cambia a plan gratuito)
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const unsubscribeUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const subscriptionData = {
      type: SUBSCRIPTION_TYPES.FREE,
      startDate: new Date().toISOString(),
      endDate: null,
      benefits: SUBSCRIPTION_BENEFITS.free,
      price: 0,
      isActive: true
    };

    await updateDoc(userRef, {
      subscription: subscriptionData
    });

    return { success: true, message: 'Suscripción cancelada exitosamente' };
  } catch (error) {
    console.error('Error al cancelar la suscripción:', error);
    return { success: false, error: error.message };
  }
};

export const isSubscriptionActive = async (userId) => {
  const subscription = await getSubscriptionStatus(userId);
  if (!subscription) return false;
  
  if (subscription.type === SUBSCRIPTION_TYPES.FREE) return true;
  
  if (subscription.endDate) {
    return new Date() < new Date(subscription.endDate);
  }
  
  return subscription.status === "active";
};

export const getSubscriptionDiscount = async (userId) => {
  const subscription = await getSubscriptionStatus(userId);
  return subscription?.benefits?.discount || 0;
};

export const hasEarlyAccess = async (userId) => {
  const subscription = await getSubscriptionStatus(userId);
  return subscription?.benefits?.earlyAccess || false;
};

export const canCreatePrivateChat = async (userId) => {
  const subscription = await getSubscriptionStatus(userId);
  const privateChatsLimit = subscription?.benefits?.privateChats || 5;
  
  if (privateChatsLimit === -1) return true; // Ilimitado
  
  // TODO: Implementar contador de chats privados
  return true; // Por ahora siempre permitido
};

export const calculateDiscountedPrice = (originalPrice, discount) => {
  return originalPrice * (1 - discount);
};
