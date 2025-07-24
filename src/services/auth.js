// Servicio de autenticación con Firebase Authentication.

import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, updateUserProfile, getUserProfileById } from "./user-profile";
import { uploadFile } from "./file-storage";

const AUTH_EMPTY_STATE = {
    id: null,
    email: null,
};

// Definimos una variable para contener los datos del usuario autenticado.
// Vamos a implementar nuestra propia versión del patrón Observer para que los componentes
// u otros elementos de nuestra app puedan enterarse de los cambios de esta variable.
let authUser = AUTH_EMPTY_STATE;

// Definimos una lista de "observers".
let observers = [];

onAuthStateChanged(auth, async user => {
    if (user) {
        // Hay un usuario autenticado.
        // Cargar el perfil completo desde Firestore
        let profile = { id: user.uid, email: user.email, role: null };
        try {
            const dbProfile = await getUserProfileById(user.uid);
            profile = { ...profile, ...dbProfile };
        } catch (e) {
            // Si falla, al menos tenemos el email y el id
        }
        authUser = profile;
    } else {
        // No hay un usuario autenticado.
        authUser = AUTH_EMPTY_STATE;
    }
    // Notificamos los cambios ocurridos en el estado de autenticación.
    notifyAll();
});

/**
 * Crea un usuario y lo autentica automáticamente.
 * 
 * @param {string} email
 * @param {string} nombre  
 * @param {string} password 
 * @returns {Promise<{id: string, email: string, nombre: string}>}
 */
export async function register(email, password, nombre) {
    try {
        // Registramos el usuario en Auth.
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        // Como es costumbre, interceptamos la promesa para remover el objeto de Firebase.

        // Creamos el perfil el usuario en Firestore.
        await createUserProfile(userCredentials.user.uid, { email, nombre, role: 'user' });

        console.log('Usuario creado: ', userCredentials);
        return {
            id: userCredentials.user.uid,
            email: userCredentials.user.email,
            nombre: userCredentials.user.displayName,
            
        };
    } catch (error) {
        // TODO: Manejar el error.
        console.error('[auth.js register] Error al crear el usuario: ', error);
    }
}

/**
 * Actualiza la foto de perfil del usuario.
 * 
 * @param {File} photo 
 * @returns {Promise<void>}
 */
export async function updateUserPhoto(photo) {
    if (!photo) return;

    try {
        // Subimos la foto y buscamos obtener la ruta absoluta donde quedó almacenada.
        const photoURL = await uploadFile(`users/${authUser.id}/avatar.${getFileExtension(photo)}`, photo);

        // Actualizamos Auth.
        const authPromise = updateProfile(auth.currentUser, { photoURL });

        // Actualizamos el perfil en Firestore.
        const profilePromise = updateUserProfile(authUser.id, { photoURL });

        await Promise.all([authPromise, profilePromise]);

        // Actualizamos la información del usuario autenticado.
        authUser.photoURL = photoURL;

        updateUserData({
            id: auth.currentUser.uid,
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
        });
    } catch (error) {
        console.error('[auth.js updateUserPhoto] Error al tratar de actualizar la foto de perfil: ', error);
        throw error;
    }
}

/**
 * Inicia sesión con correo electrónico y contraseña.
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{id: string, email: string}>}
 */
export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            console.log("Usuario autenticado: ", userCredentials.user);
            return {
                id: userCredentials.user.uid,
                email: userCredentials.user.email,
            };
        });
}

/**
 * Cierra la sesión del usuario.
 * 
 * @returns {Promise<void>}
 */
export function logout() {
    return signOut(auth);
}

/*----------------------------------------------------
| Observer para el estado de autenticación
+-----------------------------------------------------
| Observer es un patrón de diseño muy útil para muchos escenarios.
| De hecho, lo han estado usando sin, tal vez, saberlo.
|
| ¿Cómo funciona?
| Es bastante común encontrarnos con el siguiente escenario:
| Tenemos un elemento de nuestro sistema ("sujeto" o "subject") que puede cambiar. 
| Y tenemos muchos otros elementos ("observadores" u "observers") que quieren enterarse 
| de los cambios de ese "sujeto".
| Observer es un mecanismo para resolver esta situación.
|
| En nuestro caso, la variable "authUser" es el sujeto. Queremos permitir que cualquier
| elemento de nuestro sistema se entere de los cambios que esa variable reciba.
| Para esto, vamos a crear una función de "subscribeToAuth" (suscribirse a la autenticación)
| que va a recibir un "callback", que sería el observer.
|
| Nota: "Suscribirse" es el término habitual para asociar un observer a un sujeto. También
| pueden verlo como "escuchar" (listen), "observar" (watch) o "adjuntar" (attach).
|
| Es ESENCIAL que siempre nos aseguremos de que las suscripciones a un observer puedan
| cancelarse. Y por supuesto, que todo aquel que se suscriba cancele la suscripción
| cuando ya no la necesite.
+-----------------------------------------------------*/
/**
 * Agrega un observer para la autenticación, y lo ejecuta inmediatamente.
 * 
 * @param {(user) => void} callback 
 * @returns {() => void} - Función para cancelar la suscripción.
 */
export function subscribeToAuth(callback) {
    // Agregamos el callback al array de observers
    observers.push(callback);

    // console.log("Observer para auth agregado. El stack es: ", observers);

    // Ejecutamos el callback inmediatamente para indicarle los datos actuales.
    notify(callback);

    // Retornamos una función de cancelar la suscripción.
    // Esta función elimina del array de observers al que acabamos de agregar.
    return () => observers = observers.filter(obs => obs !== callback);
}

/**
 * Ejecuta el observer y le pasa los datos del usuario.
 * 
 * @param {(user) => void} observer 
 */
function notify(observer) {
    observer({ ...authUser });
}

/**
 * Notifica a todos los observers.
 * Esta función debe invocarse cada vez que los datos del estado de autenticación cambien.
 */
function notifyAll() {
    observers.forEach(obs => notify(obs));
}

/**
 * Actualiza los datos del usuario autenticado.
 * 
 * @param {Object} userData 
 */
function updateUserData(userData) {
    authUser = { ...authUser, ...userData };
    notifyAll();
}

/**
 * Obtiene la extensión del archivo.
 * 
 * @param {File} file 
 * @returns {string}
 */
function getFileExtension(file) {
    return file.name.split('.').pop();
}
