import { db, checkFirestoreConnection, reconnectFirestore } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const testFirestoreConnection = async () => {
  try {
    console.log('🔍 Probando conexión a Firestore...');
    
    // Verificar conexión básica
    const isConnected = await checkFirestoreConnection();
    if (!isConnected) {
      console.log('❌ No se pudo conectar a Firestore');
      return false;
    }
    
    console.log('✅ Conexión básica establecida');
    
    // Intentar una operación de lectura
    const usersCol = collection(db, 'users');
    const snapshot = await getDocs(usersCol);
    console.log(`✅ Lectura exitosa: ${snapshot.docs.length} usuarios encontrados`);
    
    return true;
  } catch (error) {
    console.error('❌ Error en prueba de conexión:', error);
    
    if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
      console.log('🔒 Error: Las peticiones están siendo bloqueadas por el cliente');
      console.log('💡 Soluciones:');
      console.log('   1. Desactiva bloqueadores de anuncios temporalmente');
      console.log('   2. Agrega firebase.googleapis.com a las excepciones');
      console.log('   3. Usa modo incógnito');
    }
    
    return false;
  }
};

export const testUserOperations = async () => {
  try {
    console.log('🧪 Probando operaciones de usuarios...');
    
    // Importar funciones de usuarios
    const { getAllUsers } = await import('../services/users');
    
    // Probar lectura de usuarios
    const users = await getAllUsers();
    console.log(`✅ Lectura de usuarios exitosa: ${users.length} usuarios`);
    
    return true;
  } catch (error) {
    console.error('❌ Error en operaciones de usuarios:', error);
    return false;
  }
}; 