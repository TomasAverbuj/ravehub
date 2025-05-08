import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

// Exporta la función uploadFile
export async function uploadFile(path, file) {
  try {
    // Crea una referencia al archivo en el almacenamiento de Firebase
    const fileRef = ref(storage, path);
    
    // Sube el archivo a Firebase Storage
    await uploadBytes(fileRef, file);
    
    // Obtiene la URL de descarga del archivo subido
    const downloadURL = await getDownloadURL(fileRef);
    
    return {
      success: true,
      downloadURL: downloadURL
    };
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Función auxiliar para obtener la extensión del archivo
function getFileExtension(file) {
  return file.name.split('.').pop();
}
