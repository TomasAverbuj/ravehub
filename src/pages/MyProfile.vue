<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
    <!-- Efectos de luz sutiles para modo oscuro -->
    <div class="fixed inset-0 pointer-events-none">
      <!-- Luz principal superior -->
      <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 bg-gradient-to-b from-blue-500/5 via-purple-500/3 to-transparent"></div>
      <!-- Luz lateral izquierda -->
      <div class="absolute top-1/4 left-0 w-1/3 h-1/2 bg-gradient-to-r from-blue-600/4 to-transparent"></div>
      <!-- Luz lateral derecha -->
      <div class="absolute top-1/4 right-0 w-1/3 h-1/2 bg-gradient-to-l from-purple-600/4 to-transparent"></div>
    </div>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header del Perfil mejorado -->
      <div class="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-200/50 dark:border-gray-800/50">
        <!-- Banner superior mejorado -->
        <div class="h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 dark:from-blue-700 dark:via-purple-700 dark:to-blue-800 relative">
          <div class="absolute inset-0 bg-black/20"></div>
          <!-- Elementos decorativos -->
          <div class="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div class="absolute bottom-4 left-4 w-16 h-16 bg-purple-400/20 rounded-full blur-lg"></div>
        </div>
        
        <!-- Información del usuario mejorada -->
        <div class="relative px-8 pb-8">
          <!-- Avatar mejorado -->
          <div class="flex justify-center -mt-20 mb-6">
            <div class="relative group">
              <div class="w-36 h-36 rounded-full border-6 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-2xl">
                <img 
                  :src="currentUser?.profileImage || '/default-avatar.png'" 
                  :alt="currentUser?.nombre || 'Usuario'"
                  class="w-full h-full object-cover"
                  @error="$event.target.src = '/default-avatar.png'"
                >
              </div>
              <!-- Overlay para cambiar foto mejorado -->
              <div class="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-sm" @click="triggerFileInput">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Información básica mejorada -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {{ currentUser?.nombre || 'Usuario' }}
            </h1>
            <p class="text-gray-600 dark:text-gray-300 flex items-center justify-center text-lg">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              {{ currentUser?.email || 'usuario@email.com' }}
            </p>
          </div>
          
          <!-- Botones de acción mejorados -->
          <div class="flex justify-center space-x-6">
            <button 
              @click="editing = true"
              class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Perfil
            </button>
            <button 
              @click="showStats = !showStats"
              class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Estadísticas
            </button>
          </div>
        </div>
      </div>

      <!-- Estadísticas mejoradas -->
      <div v-if="showStats" class="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 border border-gray-200/50 dark:border-gray-800/50">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg class="w-7 h-7 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Estadísticas de Actividad
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">12</div>
            <div class="text-sm text-gray-600 dark:text-gray-300 font-medium">Eventos Visitados</div>
          </div>
          <div class="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">8</div>
            <div class="text-sm text-gray-600 dark:text-gray-300 font-medium">Comentarios</div>
          </div>
          <div class="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
            <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">156</div>
            <div class="text-sm text-gray-600 dark:text-gray-300 font-medium">Días Activo</div>
          </div>
        </div>
      </div>

      <!-- Contenido principal mejorado -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Columna izquierda - Suscripción -->
        <div class="lg:col-span-1">
          <div class="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-800/50">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg class="w-7 h-7 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Suscripción
            </h3>
            <Subscription v-if="currentUser" />
          </div>
        </div>

        <!-- Columna derecha - Actividad Reciente -->
        <div class="lg:col-span-2">
          <div class="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-800/50">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg class="w-7 h-7 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Actividad Reciente
            </h3>
            <RecentActivity v-if="currentUser" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edición mejorado -->
    <div v-if="editing" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200/50 dark:border-gray-800/50">
        <!-- Header del modal mejorado -->
        <div class="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Editar Perfil</h2>
          <button @click="editing = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenido del modal mejorado -->
        <div class="p-8 space-y-8">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Nombre
            </label>
            <input 
              v-model="newName" 
              type="text" 
              class="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              placeholder="Tu nombre"
            >
          </div>

          <!-- Contraseña -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Nueva Contraseña
            </label>
            <input 
              v-model="newPassword" 
              type="password" 
              class="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              placeholder="Deja vacío para no cambiar"
            >
          </div>

          <!-- Foto de perfil mejorada -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Foto de Perfil
            </label>
            <div class="flex items-center space-x-6">
              <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-lg">
                <img 
                  :src="previewImage || currentUser?.profileImage || '/default-avatar.png'" 
                  class="w-full h-full object-cover"
                >
              </div>
              <button 
                @click="triggerFileInput"
                class="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 font-medium"
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

        <!-- Footer del modal mejorado -->
        <div class="flex justify-end space-x-4 p-8 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="editing = false"
            class="px-8 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200 font-medium"
          >
            Cancelar
          </button>
          <button 
            @click="saveProfile"
            class="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
import Subscription from '../components/Subscription.vue';
import RecentActivity from '../components/RecentActivity.vue';
import { ref, onMounted } from 'vue';
import { auth } from '../services/firebase';
import { getUserProfileById, updateUserName, updateUserPassword, updateUserProfileImage } from '../services/user-profile';
import { uploadFile } from '../services/file-storage';

export default {
  name: 'MyProfile',
  components: { Subscription, RecentActivity },
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
