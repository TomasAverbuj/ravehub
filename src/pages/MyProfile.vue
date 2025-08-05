<template>
  <div class="min-h-screen bg-white dark:bg-neutral-950">
    <div class="max-w-4xl mx-auto">
      <!-- Header del Perfil - Refinado -->
      <div class="relative">
        <!-- Banner superior - Más sutil -->
        <div class="h-32 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-150 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-700 relative">
          <div class="absolute inset-0 bg-black/3 dark:bg-black/5"></div>
        </div>
        
        <!-- Información del usuario - Mejor balance -->
        <div class="relative px-6 pb-6 -mt-16">
          <!-- Avatar - Más elegante -->
          <div class="flex justify-start mb-5">
            <div class="relative group">
              <div class="w-24 h-24 rounded-full border-4 border-white dark:border-neutral-900 shadow-md overflow-hidden">
                <img 
                  v-if="currentUser && currentUser.profileImage"
                  :src="currentUser.profileImage"
                  :alt="currentUser.nombre || 'Avatar'"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-700 dark:to-neutral-600 flex items-center justify-center text-gray-600 dark:text-neutral-300 text-2xl font-semibold">
                  {{ currentUser?.nombre?.charAt(0)?.toUpperCase() || 'U' }}
                </div>
              </div>
              <!-- Overlay para cambiar foto - Más discreto -->
              <div class="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer" @click="triggerFileInput">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Información básica - Mejor tipografía -->
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-1">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ currentUser?.nombre || 'Usuario' }}
              </h1>
                             <!-- Badge Premium -->
               <div v-if="currentUser?.role === 'premium'" class="flex items-center gap-1 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                 <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                   <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                 </svg>
                 PREMIUM
               </div>
            </div>
            <p class="text-gray-500 dark:text-neutral-400 text-base">
              {{ currentUser?.email || 'usuario@email.com' }}
            </p>
                         <!-- Información de suscripción -->
             <div v-if="currentUser?.role === 'premium'" class="mt-2 text-sm text-gray-600 dark:text-neutral-400">
               <span class="flex items-center gap-1">
                 <svg class="w-4 h-4 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                   <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                 </svg>
                 Suscripción Premium Activa
               </span>
               <!-- Botón para cancelar suscripción -->
               <div class="mt-3">
                 <button
                   @click="cancelPremium"
                   class="px-4 py-2 bg-slate-600 dark:bg-slate-500 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200 font-medium text-sm flex items-center gap-2"
                 >
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                   </svg>
                   Cancelar suscripción Premium
                 </button>
               </div>
             </div>
          </div>
          
          <!-- Botones de acción - Más compactos -->
          <div class="flex items-center space-x-4 mb-8">
            <button 
              @click="editing = true"
              class="bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-100 flex items-center shadow-sm"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Perfil
            </button>
            <button 
              @click="showStats = !showStats"
              class="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium"
            >
              {{ showStats ? 'Ocultar' : 'Ver' }} Estadísticas
            </button>
          </div>
        </div>
      </div>

      <!-- Estadísticas - Más elegantes -->
      <div v-if="showStats" class="px-6 mb-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-5 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800">
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ userStats.visitedEvents || 0 }}</div>
            <div class="text-gray-600 dark:text-neutral-400 text-sm">Eventos Visitados</div>
          </div>
          <div class="text-center p-5 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800">
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ userStats.comments || 0 }}</div>
            <div class="text-gray-600 dark:text-neutral-400 text-sm">Comentarios</div>
          </div>
          <div class="text-center p-5 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800">
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ userStats.activeDays || 0 }}</div>
            <div class="text-gray-600 dark:text-neutral-400 text-sm">Días Activo</div>
          </div>
        </div>
      </div>

             <!-- Beneficios Premium - Solo para usuarios premium -->
       <div v-if="currentUser?.role === 'premium'" class="px-6 mb-10">
         <div class="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/20 dark:to-gray-800/20 border border-slate-200 dark:border-slate-700/30 rounded-2xl p-6">
           <div class="flex items-center gap-3 mb-4">
             <div class="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600 rounded-full flex items-center justify-center">
               <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                 <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
               </svg>
             </div>
             <h3 class="text-lg font-bold text-gray-900 dark:text-white">Tus Beneficios Premium</h3>
           </div>
           
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div class="flex items-center gap-3 p-3 bg-white/60 dark:bg-neutral-800/40 rounded-lg border border-slate-200 dark:border-slate-700/20">
               <svg class="w-5 h-5 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                 <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
               </svg>
               <span class="text-sm font-medium text-gray-700 dark:text-gray-300">15% descuento en entradas</span>
             </div>
             <div class="flex items-center gap-3 p-3 bg-white/60 dark:bg-neutral-800/40 rounded-lg border border-slate-200 dark:border-slate-700/20">
               <svg class="w-5 h-5 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                 <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
               </svg>
               <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Acceso anticipado a eventos</span>
             </div>
             <div class="flex items-center gap-3 p-3 bg-white/60 dark:bg-neutral-800/40 rounded-lg border border-slate-200 dark:border-slate-700/20">
               <svg class="w-5 h-5 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                 <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
               </svg>
               <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Chats privados ilimitados</span>
             </div>
             <div class="flex items-center gap-3 p-3 bg-white/60 dark:bg-neutral-800/40 rounded-lg border border-slate-200 dark:border-slate-700/20">
               <svg class="w-5 h-5 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                 <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
               </svg>
               <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Sin anuncios</span>
             </div>
           </div>
           
                        
         </div>
       </div>

      <!-- Contenido principal - Mejor jerarquía -->
      <div class="px-6 pb-10">
        <div class="max-w-full">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-gray-500 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Actividad Reciente
          </h3>
          <RecentActivity v-if="currentUser" />
        </div>
      </div>
    </div>

    <!-- Modal de edición - Más refinado -->
    <div v-if="editing" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-neutral-800">
        <!-- Header del modal - Más limpio -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Editar Perfil</h2>
          <button @click="editing = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenido del modal - Mejor espaciado -->
        <div class="p-6 space-y-5">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Nombre
            </label>
            <input 
              v-model="newName" 
              type="text" 
              class="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white transition-all duration-200"
              placeholder="Tu nombre"
            >
          </div>

          <!-- Contraseña -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Nueva Contraseña
            </label>
            <input 
              v-model="newPassword" 
              type="password" 
              class="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-white transition-all duration-200"
              placeholder="Deja vacío para no cambiar"
            >
          </div>

          <!-- Foto de perfil - Más compacto -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
              Foto de Perfil
            </label>
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                <img 
                  v-if="previewImage || (currentUser?.profileImage && currentUser.profileImage !== '/default-avatar.png')"
                  :src="previewImage || currentUser?.profileImage" 
                  class="w-full h-full object-cover"
                >
                <div v-else class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-700 dark:to-neutral-600 flex items-center justify-center text-gray-600 dark:text-neutral-300 text-xl font-semibold">
                  {{ currentUser?.nombre?.charAt(0)?.toUpperCase() || 'U' }}
                </div>
              </div>
              <button 
                @click="triggerFileInput"
                class="px-4 py-2 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-lg transition-all duration-200 font-medium text-sm border border-gray-200 dark:border-neutral-700"
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

        <!-- Footer del modal - Más compacto -->
        <div class="flex justify-end space-x-3 p-6 border-t border-gray-100 dark:border-neutral-800">
          <button 
            @click="editing = false"
            class="px-5 py-2 text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 transition-colors duration-200 font-medium"
          >
            Cancelar
          </button>
          <button 
            @click="saveProfile"
            class="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm"
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
import RecentActivity from '../components/RecentActivity.vue';
import Avatar from '../components/ui/Avatar.vue';
import { ref, onMounted } from 'vue';
import { auth } from '../services/firebase';
import { getUserProfileById, updateUserName, updateUserPassword, updateUserProfileImage } from '../services/user-profile';
import { uploadFile } from '../services/file-storage';
import { unsubscribeUser } from '../services/subscription';
import { commentsService } from '../services/comments';
import { ticketsService } from '../services/tickets';

export default {
  name: 'MyProfile',
  components: { RecentActivity, Avatar },
  setup() {
    const currentUser = ref(null);
    const editing = ref(false);
    const showStats = ref(false);
    const newName = ref('');
    const newPassword = ref('');
    const selectedPhoto = ref(null);
    const previewImage = ref(null);
    const fileInput = ref(null);
    const userStats = ref({
      visitedEvents: 0,
      comments: 0,
      activeDays: 0
    });

    const calculateUserStats = async (userId) => {
      try {
        // Obtener comentarios del usuario
        const comments = await commentsService.getCommentsByUserId(userId);
        const commentsCount = comments ? comments.length : 0;

        // Obtener tickets del usuario (eventos visitados)
        const tickets = await ticketsService.getTicketsByUserId(userId);
        const visitedEventsCount = tickets ? tickets.length : 0;

        // Calcular días activo (desde la fecha de registro)
        const registrationDate = currentUser.value?.createdAt || new Date();
        const daysActive = Math.floor((new Date() - new Date(registrationDate)) / (1000 * 60 * 60 * 24));

        userStats.value = {
          visitedEvents: visitedEventsCount,
          comments: commentsCount,
          activeDays: Math.max(1, daysActive) // Mínimo 1 día
        };
      } catch (error) {
        console.error('Error al calcular estadísticas:', error);
        userStats.value = {
          visitedEvents: 0,
          comments: 0,
          activeDays: 1
        };
      }
    };

    onMounted(() => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            currentUser.value = await getUserProfileById(user.uid);
            console.log('Perfil del usuario:', currentUser.value);
            // Calcular estadísticas del usuario
            await calculateUserStats(user.uid);
          } catch (error) {
            console.error('Error al cargar datos del perfil:', error);
          }
        } else {
          currentUser.value = null;
          userStats.value = {
            visitedEvents: 0,
            comments: 0,
            activeDays: 0
          };
        }
      });

      // Escuchar cambios en el perfil del usuario
      const handleUserProfileUpdate = async (event) => {
        currentUser.value = event.detail.user;
        // Recalcular estadísticas cuando se actualice el perfil
        if (currentUser.value?.id) {
          await calculateUserStats(currentUser.value.id);
        }
      };

      window.addEventListener('userProfileUpdated', handleUserProfileUpdate);

      // Limpiar el event listener cuando el componente se desmonte
      return () => {
        window.removeEventListener('userProfileUpdated', handleUserProfileUpdate);
      };
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

    const cancelPremium = async () => {
      if (!currentUser.value) return;
      
      if (!confirm('¿Estás seguro que quieres cancelar tu suscripción Premium? Perderás todos los beneficios premium.')) {
        return;
      }
      
      try {
        await unsubscribeUser(currentUser.value.id);
        
        // Recargar perfil y notificar a toda la app
        const updatedProfile = await getUserProfileById(currentUser.value.id);
        currentUser.value = updatedProfile;
        
        // Disparar evento para actualizar otros componentes
        window.dispatchEvent(new CustomEvent('userProfileUpdated', {
          detail: { user: updatedProfile }
        }));
        
        alert('Suscripción cancelada exitosamente. Has vuelto al plan gratuito.');
      } catch (error) {
        console.error('Error al cancelar la suscripción:', error);
        alert('Error al cancelar la suscripción: ' + error.message);
      }
    };



    return { 
      currentUser, 
      editing, 
      showStats,
      userStats,
      newName, 
      newPassword, 
      previewImage,
      fileInput,
      saveProfile, 
      handlePhotoUpload,
      triggerFileInput,
      cancelPremium
    };
  },
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
