import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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