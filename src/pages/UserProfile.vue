<script>
import Loader from '../components/ui/Loader.vue';
import { getUserProfileById } from '../services/user-profile';

export default {
    name: 'UserProfile',
    components: { Loader },
    data() {
        return {
            user: {
                id: null,
                email: null,
                nombre: null,
                role: null,
                profileImage: null
            },
            loadingUser: false,
            error: false
        }
    },
    async mounted() {
        this.loadingUser = true;
        this.error = false;
        
        try {
            // Leemos el id del parámetro de la ruta ":id".
            this.user = await getUserProfileById(this.$route.params.id);
        } catch (error) {
            console.error('Error cargando perfil:', error);
            this.error = true;
        } finally {
            this.loadingUser = false;
        }
    }
}
</script>

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

    <Loader v-if="loadingUser" />
    
    <div v-else-if="error" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
        <p class="text-gray-600 dark:text-gray-400">No se pudo cargar el perfil del usuario</p>
        <router-link to="/" class="mt-4 inline-block text-blue-600 hover:text-blue-700">
          Volver al inicio
        </router-link>
      </div>
    </div>
    
    <div v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
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
            <div class="relative">
              <div class="w-36 h-36 rounded-full border-6 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-2xl">
                <img 
                  :src="user?.profileImage || '/default-avatar.png'" 
                  :alt="user?.nombre || 'Usuario'"
                  class="w-full h-full object-cover"
                  @error="$event.target.src = '/default-avatar.png'"
                >
              </div>
            </div>
          </div>
          
          <!-- Información básica mejorada -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {{ user?.nombre || 'Usuario' }}
            </h1>
            <p class="text-gray-600 dark:text-gray-300 flex items-center justify-center text-lg">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              {{ user?.email || 'usuario@email.com' }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 capitalize mt-2">
              {{ user?.role || 'Usuario' }}
            </p>
          </div>
          
          <!-- Botones de acción mejorados -->
          <div class="flex justify-center space-x-6">
            <router-link 
              :to="`/usuario/${user.id}/chat`"
              class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chatear con {{ user?.nombre || 'Usuario' }}
            </router-link>
            
            <router-link 
              to="/"
              class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </router-link>
          </div>
        </div>
      </div>

      <!-- Estadísticas del usuario -->
      <div class="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 border border-gray-200/50 dark:border-gray-800/50">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg class="w-7 h-7 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Estadísticas de {{ user?.nombre || 'Usuario' }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">3</div>
            <div class="text-sm text-gray-600 dark:text-gray-300 font-medium">Eventos Asistidos</div>
          </div>
          <div class="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">$0</div>
            <div class="text-sm text-gray-600 dark:text-gray-300 font-medium">Ahorrado con Premium</div>
          </div>
          <div class="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
            <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">3</div>
            <div class="text-sm text-gray-600 dark:text-gray-300 font-medium">Entradas Activas</div>
          </div>
        </div>
      </div>

      <!-- Contenido principal mejorado -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Columna izquierda - Información del usuario -->
        <div class="lg:col-span-1">
          <div class="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-800/50">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg class="w-7 h-7 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Información del Usuario
            </h3>
            
            <div class="space-y-6">
              <div class="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                  <p class="font-semibold text-gray-900 dark:text-white">{{ user?.nombre || 'No especificado' }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p class="font-semibold text-gray-900 dark:text-white">{{ user?.email }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Rol</p>
                  <p class="font-semibold text-gray-900 dark:text-white capitalize">{{ user?.role || 'Usuario' }}</p>
                </div>
              </div>
            </div>
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
            
            <!-- Actividad del usuario -->
            <div class="space-y-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">ÚLTIMAS COMPRAS</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Este usuario ha comprado 3 entradas en total</p>
              </div>
              
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">EVENTOS FAVORITOS</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Sunwaves Festival, Mioritmic, UNUM Festival</p>
              </div>
              
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">ÚLTIMA ACTIVIDAD</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Hace 2 días - Compra de entrada para Sunset Festival</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>