<script>
import { getAllUsers } from '../../services/user-profile.js';
import { subscribeToAuth } from '../../services/auth.js';
import Avatar from '../ui/Avatar.vue';

export default {
  name: 'SidebarChats',
  components: { Avatar },
  data() {
    return {
      chats: [],
      loading: false,
      users: [],
      filteredUsers: [],
      searchQuery: '',
      showUserSearch: false,
      authUser: { id: null, email: null }
    };
  },
  mounted() {
    // Suscribirse a la autenticación
    this.unsubscribeFromAuth = subscribeToAuth(newUserData => {
      this.authUser = newUserData;
    });
    
    // Por ahora, cargamos datos de ejemplo
    this.loadExampleChats();
  },
  beforeUnmount() {
    if (this.unsubscribeFromAuth) {
      this.unsubscribeFromAuth();
    }
  },
  methods: {
    async loadUsers() {
      try {
        const allUsers = await getAllUsers();
        // Filtrar el usuario actual
        this.users = allUsers.filter(user => user.id !== this.authUser.id);
        this.filteredUsers = this.users;
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      }
    },
    filterUsers() {
      if (!this.searchQuery.trim()) {
        this.filteredUsers = this.users;
      } else {
        const query = this.searchQuery.toLowerCase();
        this.filteredUsers = this.users.filter(user => 
          user.email.toLowerCase().includes(query) || 
          (user.nombre && user.nombre.toLowerCase().includes(query))
        );
      }
    },
    startChatWithUser(user) {
      // Crear un ID único para el chat basado en los IDs de usuario
      const chatId = [this.authUser.id, user.id].sort().join('_');
      this.$emit('start-chat', { 
        id: chatId, 
        users: {
          [this.authUser.id]: true,
          [user.id]: true
        }
      });
      this.showUserSearch = false;
      this.searchQuery = '';
    },
    loadExampleChats() {
      this.loading = true;
      // Simulamos carga de datos
      setTimeout(() => {
        this.chats = [
          {
            id: '1',
            users: { 'user1': true, 'user2': true },
            lastMessage: '¡Hola! ¿Cómo estás?',
            unreadCount: 2
          },
          {
            id: '2', 
            users: { 'user1': true, 'user3': true },
            lastMessage: '¿Vas al evento de mañana?',
            unreadCount: 0
          }
        ];
        this.loading = false;
      }, 500);
    },
    clearUnread(chatId) {
      // Simulamos marcar como leído
      const chat = this.chats.find(c => c.id === chatId);
      if (chat) {
        chat.unreadCount = 0;
      }
    },
    getOtherUser(chat) {
      const currentUserId = this.authUser.id;
      if (!chat.users || !currentUserId) return null;
      return Object.keys(chat.users).find(id => id !== currentUserId);
    }
  },
  watch: {
    searchQuery() {
      this.filterUsers();
    }
  }
}
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col z-[9999] shadow-2xl">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Chats Privados</h2>
        <button 
          @click="showUserSearch = !showUserSearch; if(showUserSearch) loadUsers()" 
          class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg transition-colors"
          title="Buscar usuarios"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      
      <!-- Buscador de usuarios -->
      <div v-if="showUserSearch" class="mb-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar usuarios..."
            class="w-full p-3 pl-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
          <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <!-- Lista de usuarios -->
        <div class="mt-3 max-h-48 overflow-y-auto">
          <div v-if="filteredUsers.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
            <p>No se encontraron usuarios</p>
          </div>
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            @click="startChatWithUser(user)"
            class="flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
          >
            <Avatar 
              :userId="user.id" 
              :email="user.email"
              size="md"
            />
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">{{ user.email }}</p>
              <p v-if="user.nombre" class="text-sm text-gray-500 dark:text-gray-400">{{ user.nombre }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="chats.length === 0" class="flex-1 flex items-center justify-center">
      <div class="text-center text-gray-500 dark:text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p>No hay chats privados</p>
      </div>
    </div>
    
    <!-- Chat list -->
    <div v-else class="flex-1 overflow-y-auto">
      <div
        v-for="chat in chats"
        :key="chat.id"
        @click="$emit('open-chat', chat)"
        class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <Avatar 
              :userId="getOtherUser(chat) || 'unknown'" 
              :email="getOtherUser(chat) || 'Usuario'"
              size="md"
            />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ getOtherUser(chat) || 'Usuario' }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ chat.lastMessage || 'Sin mensajes' }}</p>
            </div>
          </div>
          <div v-if="chat.unreadCount > 0" class="bg-red-500 text-white text-xs rounded-full px-2 py-1">
            {{ chat.unreadCount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 