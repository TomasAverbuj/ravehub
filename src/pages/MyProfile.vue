<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header del Perfil -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8">
        <!-- Banner superior -->
        <div class="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          <div class="absolute inset-0 bg-black/20"></div>
        </div>
        
        <!-- Información del usuario -->
        <div class="relative px-8 pb-8">
          <!-- Avatar -->
          <div class="flex justify-center -mt-16 mb-6">
            <div class="relative group">
              <div class="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img 
                  :src="currentUser?.profileImage || '/default-avatar.png'" 
                  :alt="currentUser?.nombre || 'Usuario'"
                  class="w-full h-full object-cover"
                  @error="$event.target.src = '/default-avatar.png'"
                >
              </div>
              <!-- Overlay para cambiar foto -->
              <div class="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer" @click="triggerFileInput">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Información básica -->
          <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ currentUser?.nombre || 'Usuario' }}
            </h1>
            <p class="text-gray-600 dark:text-gray-300 flex items-center justify-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              {{ currentUser?.email || 'usuario@email.com' }}
            </p>
          </div>
          
          <!-- Botones de acción -->
          <div class="flex justify-center space-x-4">
            <button 
              @click="editing = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Perfil
            </button>
            <button 
              @click="showStats = !showStats"
              class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Estadísticas
            </button>
          </div>
        </div>
      </div>

      <!-- Estadísticas (opcional) -->
      <div v-if="showStats" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Estadísticas de Actividad</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Eventos Visitados</div>
          </div>
          <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">8</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Comentarios</div>
          </div>
          <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">156</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Días Activo</div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Columna izquierda - Suscripción -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Suscripción
            </h3>
            <Subscription v-if="currentUser" />
          </div>
        </div>

        <!-- Columna derecha - Comentarios -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Mis Comentarios
            </h3>
            <CommentsByUser v-if="currentUser" :userId="currentUser.id" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edición -->
    <div v-if="editing" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <!-- Header del modal -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Editar Perfil</h2>
          <button @click="editing = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenido del modal -->
        <div class="p-6 space-y-6">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre
            </label>
            <input 
              v-model="newName" 
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Tu nombre"
            >
          </div>

          <!-- Contraseña -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nueva Contraseña
            </label>
            <input 
              v-model="newPassword" 
              type="password" 
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Deja vacío para no cambiar"
            >
          </div>

          <!-- Foto de perfil -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Foto de Perfil
            </label>
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img 
                  :src="previewImage || currentUser?.profileImage || '/default-avatar.png'" 
                  class="w-full h-full object-cover"
                >
              </div>
              <button 
                @click="triggerFileInput"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
              >
                Cambiar
              </button>
            </div>
            <input 
              ref="fileInput"
              type="file" 
              @change="handlePhotoUpload" 
              accept="image/*"
              class="hidden"
            >
          </div>
        </div>

        <!-- Footer del modal -->
        <div class="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="editing = false"
            class="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button 
            @click="saveProfile"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>

    <!-- Input file oculto -->
    <input 
      ref="fileInput"
      type="file" 
      @change="handlePhotoUpload" 
      accept="image/*"
      class="hidden"
    >
  </div>
</template>

<script>
import CommentsByUser from '../components/CommentsByUser.vue';
import Subscription from '../components/Subscription.vue';
import { ref, onMounted } from 'vue';
import { auth } from '../services/firebase';
import { getUserProfileById, updateUserName, updateUserPassword, updateUserProfileImage } from '../services/user-profile';
import { uploadFile } from '../services/file-storage';

export default {
  name: 'MyProfile',
  components: { CommentsByUser, Subscription },
  setup() {
    const currentUser = ref(null);
    const editing = ref(false);
    const showStats = ref(false);
    const newName = ref('');
    const newPassword = ref('');
    const selectedPhoto = ref(null);
    const previewImage = ref(null);
    const fileInput = ref(null);

    onMounted(() => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            currentUser.value = await getUserProfileById(user.uid);
            console.log('Perfil del usuario:', currentUser.value);
          } catch (error) {
            console.error('Error al cargar datos del perfil:', error);
          }
        } else {
          currentUser.value = null;
        }
      });
    });

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const handlePhotoUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedPhoto.value = file;
        // Crear preview
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const saveProfile = async () => {
      try {
        if (newName.value) {
          const resultName = await updateUserName(currentUser.value.id, newName.value);
          if (resultName && resultName.success) {
            currentUser.value.nombre = newName.value;
          } else {
            console.error('Error al actualizar el nombre:', resultName?.error);
            alert('Error al actualizar el nombre.');
          }
        }

        if (newPassword.value) {
          const resultPassword = await updateUserPassword(newPassword.value);
          if (resultPassword && resultPassword.success) {
            // Se puede agregar un mensaje de éxito si se desea
          } else {
            console.error('Error al actualizar la contraseña:', resultPassword?.error);
            alert('Error al actualizar la contraseña.');
          }
        }

        if (selectedPhoto.value) {
          const path = `profilePictures/${currentUser.value.id}/${selectedPhoto.value.name}`;
          const uploadResult = await uploadFile(path, selectedPhoto.value);
          if (uploadResult && uploadResult.success) {
            const photoURL = uploadResult.downloadURL;
            const resultProfile = await updateUserProfileImage(currentUser.value.id, photoURL);
            if (resultProfile && resultProfile.success) {
              currentUser.value.profileImage = photoURL;
            } else {
              console.error('Error al actualizar la foto de perfil:', resultProfile?.error);
              alert('Error al actualizar la foto de perfil.');
            }
          } else {
            console.error('Error al subir la foto:', uploadResult?.error);
            alert('Error al subir la foto.');
          }
        }

        editing.value = false;
        newName.value = '';
        newPassword.value = '';
        selectedPhoto.value = null;
        previewImage.value = null;
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
        alert('Error al guardar los cambios.');
      }
    };

    return { 
      currentUser, 
      editing, 
      showStats,
      newName, 
      newPassword, 
      previewImage,
      fileInput,
      saveProfile, 
      handlePhotoUpload,
      triggerFileInput
    };
  },
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
