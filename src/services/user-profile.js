import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { updatePassword } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Obtiene el perfil del usuario por ID.
 * @param {string} id - El ID del usuario.
 * @returns {Promise<{id: string, email: string, nombre: string, profileImage: string}>}
 */
export async function getUserProfileById(id) {
    const userRef = doc(db, `users/${id}`);

    try {
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            throw new Error('No such document!');
        }
        const data = userDoc.data();

        return {
            id: userDoc.id,
            email: data.email,
            nombre: data.nombre,
            role: data.role || 'user',
            subscriptionType: data.subscriptionType || 'free',
            profileImage: data.profileImage || '' // Asegura que siempre devuelva una cadena
        };
    } catch (error) {
        console.error('[user-profile.js getUserProfileById] Error al traer el perfil del usuario.', error);
        throw error;
    }
}

/**
 * Crea un perfil de usuario.
 * @param {string} id - El ID del usuario.
 * @param {Object} data - Los datos del perfil del usuario.
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export async function createUserProfile(id, data) {
    const userRef = doc(db, `users/${id}`);

    try {
        await setDoc(userRef, { ...data });
        return { success: true };
    } catch (error) {
        console.error('[user-profile.js createUserProfile] Error al crear el perfil del usuario.', error);
        return { success: false, error };
    }
}

/**
 * Actualiza el perfil del usuario.
 * @param {string} id - El ID del usuario.
 * @param {Object} data - Los datos actualizados del perfil del usuario.
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export async function updateUserProfile(id, data) {
    const userRef = doc(db, `users/${id}`);

    try {
        await updateDoc(userRef, data);
        return { success: true };
    } catch (error) {
        console.error('[user-profile.js updateUserProfile] Error al actualizar el perfil del usuario.', error);
        return { success: false, error };
    }
}

/**
 * Actualiza el nombre del usuario.
 * @param {string} id - El ID del usuario.
 * @param {string} newName - El nuevo nombre del usuario.
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export async function updateUserName(id, newName) {
    const userRef = doc(db, `users/${id}`);

    try {
        await updateDoc(userRef, { nombre: newName });
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar el nombre del usuario:", error);
        return { success: false, error };
    }
}

/**
 * Actualiza la contraseña del usuario.
 * @param {string} newPassword - La nueva contraseña del usuario.
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export async function updateUserPassword(newPassword) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No authenticated user');
        }
        await updatePassword(user, newPassword);
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar la contraseña del usuario:", error);
        return { success: false, error };
    }
}

/**
 * Actualiza el rol del usuario.
 * @param {string} id - El ID del usuario.
 * @param {string} newRole - El nuevo rol del usuario ('admin', 'user', etc.).
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export async function updateUserRole(id, newRole) {
    const userRef = doc(db, `users/${id}`);

    try {
        await updateDoc(userRef, { role: newRole });
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar el rol del usuario:", error);
        return { success: false, error };
    }
}

/**
 * Actualiza el tipo de suscripción del usuario.
 * @param {string} id - El ID del usuario.
 * @param {string} subscriptionType - El nuevo tipo de suscripción ('premium', 'free').
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export async function updateUserSubscription(id, subscriptionType) {
    const userRef = doc(db, `users/${id}`);

    try {
        await updateDoc(userRef, { subscriptionType: subscriptionType });
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar la suscripción del usuario:", error);
        return { success: false, error };
    }
}

/**
 * Actualiza la imagen de perfil del usuario.
 * @param {string} id - El ID del usuario.
 * @param {string} profileImageUrl - La URL de la nueva imagen de perfil.
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export async function updateUserProfileImage(id, profileImageUrl) {
    const userRef = doc(db, `users/${id}`);

    try {
        await updateDoc(userRef, { profileImage: profileImageUrl });
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar la imagen de perfil del usuario:", error);
        return { success: false, error };
    }
}

/**
 * Obtiene todos los usuarios de la base de datos.
 * @returns {Promise<Array<{id: string, email: string, nombre: string, profileImage: string}>>}
 */
export async function getAllUsers() {
    const usersRef = collection(db, 'users');

    try {
        const usersSnapshot = await getDocs(usersRef);
        const users = [];
        
        usersSnapshot.forEach((doc) => {
            const data = doc.data();
            users.push({
                id: doc.id,
                email: data.email,
                nombre: data.nombre,
                role: data.role || 'user',
                subscriptionType: data.subscriptionType || 'free',
                profileImage: data.profileImage || ''
            });
        });
        
        return users;
    } catch (error) {
        console.error('[user-profile.js getAllUsers] Error al obtener todos los usuarios.', error);
        throw error;
    }
}
