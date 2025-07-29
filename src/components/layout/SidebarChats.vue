<script>
export default {
  name: 'SidebarChats',
  data() {
    return {
      chats: [],
      loading: false
    };
  },
  mounted() {
    // Por ahora, cargamos datos de ejemplo
    this.loadExampleChats();
  },
  methods: {
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
      const currentUserId = 'user1'; // Simulamos usuario actual
      if (!chat.users || !currentUserId) return null;
      return Object.keys(chat.users).find(id => id !== currentUserId);
    }
  }
}
</script>

<template>
  <div class="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Chats Privados</h2>
    </div>
    
    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="chats.length === 0" class="flex-1 flex items-center justify-center">
      <div class="text-center text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {{ getOtherUser(chat) ? getOtherUser(chat).charAt(0).toUpperCase() : '?' }}
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ getOtherUser(chat) || 'Usuario' }}</p>
              <p class="text-sm text-gray-500">{{ chat.lastMessage || 'Sin mensajes' }}</p>
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