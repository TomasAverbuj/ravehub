<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getAllUsers } from '../../services/user-profile.js';
import { subscribeToAuth } from '../../services/auth.js';
import Avatar from './Avatar.vue';

export default {
  name: 'UserSearch',
  components: { Avatar },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const router = useRouter();
    const users = ref([]);
    const filteredUsers = ref([]);
    const searchQuery = ref('');
    const loading = ref(false);
    const authUser = ref({ id: null, email: null });

    const loadUsers = async () => {
      try {
        console.log('🔍 Cargando usuarios...');
        loading.value = true;
        const allUsers = await getAllUsers();
        console.log('📋 Usuarios cargados:', allUsers.length);
        
        // Filtrar el usuario actual
        const filteredUsersList = allUsers.filter(user => user.id !== authUser.value.id);
        console.log('👤 Usuario actual:', authUser.value.id);
        console.log('✅ Usuarios filtrados:', filteredUsersList.length);
        
        users.value = filteredUsersList;
        filteredUsers.value = filteredUsersList;
      } catch (error) {
        console.error('❌ Error cargando usuarios:', error);
      } finally {
        loading.value = false;
      }
    };

    const filterUsers = () => {
      console.log('🔍 Filtrando usuarios con query:', searchQuery.value);
      if (!searchQuery.value.trim()) {
        filteredUsers.value = users.value;
      } else {
        const query = searchQuery.value.toLowerCase();
        filteredUsers.value = users.value.filter(user => 
          user.email.toLowerCase().includes(query) || 
          (user.nombre && user.nombre.toLowerCase().includes(query))
        );
      }
      console.log('📋 Usuarios filtrados:', filteredUsers.value.length);
    };

    const selectUser = (user) => {
      console.log('👤 Usuario seleccionado:', user);
      // Navegar a la página de perfil del usuario usando el router
      router.push(`/usuario/${user.id}`);
      // Cerrar el modal
      emit('close');
      searchQuery.value = '';
    };

    const handleClickOutside = (event) => {
      // Solo cerrar si se hace clic fuera del modal y no en el botón que lo abre
      const modal = event.target.closest('.user-search-container');
      const searchButton = event.target.closest('[data-search-button]');
      
      if (!modal && !searchButton) {
        console.log('🔄 Cerrando modal por clic fuera');
        emit('close');
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        console.log('🔄 Cerrando modal con Escape');
        emit('close');
      }
    };

    onMounted(() => {
      console.log('🚀 UserSearch montado');
      // Suscribirse a la autenticación
      subscribeToAuth(newUserData => {
        console.log('🔐 Datos de autenticación recibidos:', newUserData);
        authUser.value = newUserData;
      });
      
      // Agregar event listeners con delay para evitar conflictos
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
      }, 100);
      
      if (props.visible) {
        loadUsers();
      }
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    });

    // Watchers
    watch(searchQuery, () => {
      filterUsers();
    });

    watch(() => props.visible, (newVal) => {
      console.log('👁️ Visibilidad cambiada:', newVal);
      if (newVal) {
        // Pequeño delay para asegurar que el modal esté visible antes de cargar
        setTimeout(() => {
          loadUsers();
        }, 50);
      }
    });

    return {
      users,
      filteredUsers,
      searchQuery,
      loading,
      loadUsers,
      filterUsers,
      selectUser
    };
  }
};
</script>

<template>
  <div v-if="visible" class="user-search-container fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-start justify-center pt-20">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md mx-4 max-h-96 overflow-hidden">
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Buscar Usuarios</h3>
          <button 
            @click="$emit('close')" 
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Search input -->
        <div class="relative mt-3">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por email o nombre..."
            class="w-full p-3 pl-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            autofocus
          />
          <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <!-- Loading -->
      <div v-if="loading" class="p-8 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
      
      <!-- User list -->
      <div v-else class="max-h-64 overflow-y-auto">
        <div v-if="filteredUsers.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <p>{{ searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios disponibles' }}</p>
        </div>
        
        <div v-else>
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            @click="selectUser(user)"
            class="flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
          >
            <Avatar 
              :userId="user.id" 
              :email="user.email"
              size="md"
            />
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ user.email }}</p>
              <p v-if="user.nombre" class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ user.nombre }}</p>
            </div>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 