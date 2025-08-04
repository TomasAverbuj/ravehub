<script>
import Loader from '../components/ui/Loader.vue';
import MainH1 from '../components/MainH1.vue';
import Avatar from '../components/ui/Avatar.vue';
import { getUserProfileById } from '../services/user-profile';

export default {
    name: 'UserProfile',
    components: { MainH1, Loader, Avatar },
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
    <Loader v-if="loadingUser" />
    
    <div v-else-if="error" class="container mx-auto px-4 py-8">
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
    
    <div v-else class="container mx-auto px-4 py-8">
        <!-- Header del perfil -->
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-8">
            <div class="flex items-center space-x-6">
                <Avatar 
                    :userId="user.id" 
                    :email="user.email"
                    size="xl"
                />
                <div class="flex-1">
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {{ user.nombre || user.email }}
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400 mb-1">{{ user.email }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-500 capitalize">
                        {{ user.role || 'Usuario' }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Información del usuario -->
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Información del Usuario</h2>
            
            <div class="space-y-4">
                <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300">
                        <strong>Nombre:</strong> {{ user.nombre || 'No especificado' }}
                    </span>
                </div>
                
                <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300">
                        <strong>Email:</strong> {{ user.email }}
                    </span>
                </div>
                
                <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300">
                        <strong>Rol:</strong> {{ user.role || 'Usuario' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Acciones -->
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Acciones</h2>
            
            <div class="flex flex-wrap gap-4">
                <router-link 
                    :to="`/usuario/${user.id}/chat`"
                    class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Chatear con {{ user.nombre || user.email }}</span>
                </router-link>
                
                <router-link 
                    to="/"
                    class="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Volver al inicio</span>
                </router-link>
            </div>
        </div>
    </div>
</template>