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
    
    // Actualizar solo el tipo de suscripción a 'free', mantener el rol
    await updateDoc(userRef, {
      subscriptionType: 'free'
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

/**
 * Obtiene el descuento de suscripción para un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<number>} - Porcentaje de descuento (0-1)
 */
export async function getSubscriptionDiscount(userId) {
  try {
    const userRef = doc(db, `users/${userId}`);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Usuarios premium tienen 15% de descuento
      return userData.subscriptionType === 'premium' ? 0.15 : 0;
    }
    return 0;
  } catch (error) {
    console.error('Error al obtener descuento de suscripción:', error);
    return 0;
  }
}

/**
 * Verifica si un usuario tiene acceso anticipado
 * @param {string} userId - ID del usuario
 * @returns {Promise<boolean>}
 */
export async function hasEarlyAccess(userId) {
  try {
    const userRef = doc(db, `users/${userId}`);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.subscriptionType === 'premium';
    }
    return false;
  } catch (error) {
    console.error('Error al verificar acceso anticipado:', error);
    return false;
  }
}

/**
 * Actualiza la suscripción de un usuario
 * @param {string} userId - ID del usuario
 * @param {string} subscriptionType - Tipo de suscripción ('basic', 'premium')
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export async function updateSubscription(userId, subscriptionType) {
  try {
    const userRef = doc(db, `users/${userId}`);
    await updateDoc(userRef, {
      subscriptionType: subscriptionType,
      subscriptionDate: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar suscripción:', error);
    return { success: false, error };
  }
}

/**
 * Cancela la suscripción de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export async function cancelSubscription(userId) {
  try {
    const userRef = doc(db, `users/${userId}`);
    await updateDoc(userRef, {
      subscriptionType: 'free',
      subscriptionCancelledAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error al cancelar suscripción:', error);
    return { success: false, error };
  }
}

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
