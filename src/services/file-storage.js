import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

// Exporta la función uploadFile
export async function uploadFile(path, file) {
  try {
    // Validar que el archivo existe
    if (!file) {
      throw new Error('No se proporcionó ningún archivo');
    }

    // Validar que el archivo es válido
    if (!(file instanceof File)) {
      throw new Error('El archivo proporcionado no es válido');
    }

    console.log('Iniciando subida de archivo:', {
      path,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Crea una referencia al archivo en el almacenamiento de Firebase
    const fileRef = ref(storage, path);
    
    // Sube el archivo a Firebase Storage
    console.log('Subiendo archivo a Firebase Storage...');
    const uploadResult = await uploadBytes(fileRef, file);
    
    console.log('Archivo subido exitosamente:', {
      bytesTransferred: uploadResult.bytesTransferred,
      totalBytes: uploadResult.totalBytes
    });
    
    // Obtiene la URL de descarga del archivo subido
    console.log('Obteniendo URL de descarga...');
    const downloadURL = await getDownloadURL(fileRef);
    
    console.log('URL de descarga obtenida:', downloadURL);
    
    return {
      success: true,
      downloadURL: downloadURL,
      metadata: {
        size: uploadResult.totalBytes,
        contentType: file.type
      }
    };
  } catch (error) {
    console.error('Error al subir el archivo:', {
      error: error.message,
      code: error.code,
      path,
      fileName: file?.name
    });
    
    // Manejar errores específicos de Firebase
    let errorMessage = 'Error al subir el archivo';
    
    if (error.code === 'storage/unauthorized') {
      errorMessage = 'No tienes permisos para subir archivos';
    } else if (error.code === 'storage/quota-exceeded') {
      errorMessage = 'Se ha excedido la cuota de almacenamiento';
    } else if (error.code === 'storage/retry-limit-exceeded') {
      errorMessage = 'Error de conexión. Por favor intenta nuevamente';
    } else if (error.code === 'storage/invalid-checksum') {
      errorMessage = 'El archivo está corrupto. Por favor intenta con otro archivo';
    } else {
      errorMessage = error.message || 'Error desconocido al subir el archivo';
    }
    
    return {
      success: false,
      error: errorMessage,
      code: error.code
    };
  }
}

// Función auxiliar para obtener la extensión del archivo
function getFileExtension(file) {
  return file.name.split('.').pop();
}
