import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAaZ3UVs-n2JOJ7vUUUIKnmptJs3c5hpCo",
    authDomain: "p1-clientes-web.firebaseapp.com",
    projectId: "p1-clientes-web",
    storageBucket: "p1-clientes-web.appspot.com",
    messagingSenderId: "45429526973",
    appId: "1:45429526973:web:1ba58d156a3fb52e0602d4",
    measurementId: "G-0J1ZWVF5RB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Obtenemos la conexión a Firestore, Auth y Storage.
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Configurar persistencia de autenticación
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistencia de autenticación configurada exitosamente');
  })
  .catch((error) => {
    console.error('Error configurando persistencia de autenticación:', error);
  });

// Función para verificar la conectividad de Firestore
export const checkFirestoreConnection = async () => {
  try {
    // Intentar una operación simple para verificar la conexión
    await enableNetwork(db);
    return true;
  } catch (error) {
    console.error('Error verificando conexión a Firestore:', error);
    return false;
  }
};

// Función para reconectar Firestore
export const reconnectFirestore = async () => {
  try {
    console.log('Intentando reconectar a Firestore...');
    await enableNetwork(db);
    console.log('Reconexión exitosa a Firestore');
    return true;
  } catch (error) {
    console.error('Error reconectando a Firestore:', error);
    return false;
  }
};

// Función para manejar errores de red
export const handleNetworkError = async (error, retryFunction, maxRetries = 3) => {
  console.error('Error de red detectado:', error);
  
  // Verificar si es un error de red
  if (error.code === 'unavailable' || 
      error.message.includes('ERR_BLOCKED_BY_CLIENT') ||
      error.message.includes('net::ERR_BLOCKED_BY_CLIENT')) {
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`Intento de reconexión ${attempt}/${maxRetries}`);
      
      try {
        // Esperar antes de reintentar
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        
        // Intentar reconectar
        const reconnected = await reconnectFirestore();
        if (reconnected) {
          // Reintentar la función original
          return await retryFunction();
        }
      } catch (retryError) {
        console.error(`Error en intento ${attempt}:`, retryError);
        if (attempt === maxRetries) {
          throw new Error('No se pudo reconectar después de múltiples intentos');
        }
      }
    }
  }
  
  // Si no es un error de red, re-lanzar el error original
  throw error;
};