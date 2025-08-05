<script>
import { ref, onMounted } from 'vue';
import { subscribeToAuth, logout } from './services/auth.js';
import { getUserProfileById } from './services/user-profile.js';
import Home from './pages/Home.vue';
import Chat from './pages/Chat.vue';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import SidebarChats from './components/layout/SidebarChats.vue';
import PrivateChat from './pages/PrivateChat.vue';
import Avatar from './components/ui/Avatar.vue';
import UserSearch from './components/ui/UserSearch.vue';

export default {
  name: 'App',
  components: { Home, Chat, Login, Register, SidebarChats, PrivateChat, Avatar, UserSearch },
  data: () => ({
    authUser: { id: null, email: null, role: null },
    authLoading: true, // Estado de carga para la autenticación
    menuOpen: false,
    showSidebarChats: false,
    activePrivateChat: null,
    theme: 'system',
    toast: null,
    showUserSearch: false,
    showPricingModal: false
  }),
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    toggleSidebarChats() {
      this.showSidebarChats = !this.showSidebarChats;
    },
    openPrivateChat(chat) {
      this.activePrivateChat = chat;
      this.showSidebarChats = false;
      this.clearUnread(chat.id);
    },
    closePrivateChat() {
      this.activePrivateChat = null;
    },
    startChatWithUser(chatData) {
      this.activePrivateChat = {
        id: chatData.chatId,
        users: {
          [this.authUser.id]: true,
          [chatData.otherUserId]: true
        }
      };
      this.showSidebarChats = false;
    },
    startChatFromSidebar(chatData) {
      this.activePrivateChat = chatData;
      this.showSidebarChats = false;
    },
    getOtherUserId(chat) {
      if (!chat.users) return null;
      return Object.keys(chat.users).find(id => id !== this.authUser.id);
    },
    showToast(message, chatId, from) {
      this.toast = { message, chatId, from };
      setTimeout(() => { this.toast = null; }, 4000);
    },
    clearUnread(chatId) {
      this.$refs.sidebarChats && this.$refs.sidebarChats.clearUnread(chatId);
    },
    setTheme(theme) {
      this.theme = theme;
      localStorage.setItem('theme', theme);
      this.applyTheme();
    },
    applyTheme() {
      const root = document.documentElement;
      if (this.theme === 'dark' || (this.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    },
    toggleTheme() {
      if (this.theme === 'light') {
        this.setTheme('dark');
      } else if (this.theme === 'dark') {
        this.setTheme('system');
      } else {
        this.setTheme('light');
      }
    },
    themeLabel() {
      if (this.theme === 'light') return 'Claro';
      if (this.theme === 'dark') return 'Oscuro';
      return 'Sistema';
    },
    async handleLogout() {
      try {
        await logout();
        this.menuOpen = false;
        // Redirigir al usuario a la página de login después del logout
        this.$router.push('/iniciar-sesion');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },
    toggleUserSearch() {
      this.showUserSearch = !this.showUserSearch;
    },
    closeUserSearch() {
      this.showUserSearch = false;
    },
    togglePricingModal() {
      this.showPricingModal = !this.showPricingModal;
    },
    async subscribeToPremium() {
      try {
        if (!this.authUser.id) {
          throw new Error('Usuario no autenticado');
        }
        
        // Usar el servicio de suscripción
        const { updateSubscription } = await import('./services/subscription.js');
        const result = await updateSubscription(this.authUser.id, 'premium');
        
                 if (result.success) {
           // Actualizar el estado local
           this.authUser.subscriptionType = 'premium';
           
           this.showPricingModal = false;
           this.showToast('¡Gracias por tu suscripción! Ahora eres un usuario Premium.', null, 'Sistema');
         } else {
          throw new Error('Error al actualizar suscripción');
        }
      } catch (error) {
        console.error('Error al suscribirse al plan premium:', error);
        this.showToast('Error al suscribirse al plan premium. Inténtalo de nuevo.', null, 'Sistema');
      }
    },
    
    // Función temporal para convertir en admin
    async makeAdmin() {
      try {
        if (!this.authUser.id) {
          throw new Error('Usuario no autenticado');
        }
        
        const { updateUserRole } = await import('./services/user-profile.js');
        const result = await updateUserRole(this.authUser.id, 'admin');
        
        if (result.success) {
          // Actualizar el estado local
          this.authUser.role = 'admin';
          this.showToast('¡Ahora eres administrador!', null, 'Sistema');
        } else {
          throw new Error('Error al actualizar rol');
        }
      } catch (error) {
        console.error('Error al convertir en admin:', error);
        this.showToast('Error al convertir en admin. Inténtalo de nuevo.', null, 'Sistema');
      }
    }
  },
  mounted() {
    subscribeToAuth(async (newUserData) => {
      this.authUser = newUserData;
      
      // Si tenemos un usuario autenticado, cargar sus datos completos del perfil
      if (newUserData && newUserData.id) {
        try {
          const profileData = await getUserProfileById(newUserData.id);
          // Combinar los datos de autenticación con los datos del perfil
          this.authUser = {
            ...newUserData,
            ...profileData
          };
          console.log('Usuario cargado:', this.authUser);
          console.log('Rol del usuario:', this.authUser.role);
          console.log('¿Es admin?', this.authUser.role === 'admin');


        } catch (error) {
          console.error('Error al cargar datos del perfil:', error);
        }
      }
      
      this.authLoading = false; // Marcamos que ya terminó la carga
    });

    // Escuchar cambios en el perfil del usuario
    const handleUserProfileUpdate = (event) => {
      this.authUser = event.detail.user;
    };

    window.addEventListener('userProfileUpdated', handleUserProfileUpdate);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.theme = savedTheme;
    } else {
      this.theme = 'system';
    }
    this.applyTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.theme === 'system') this.applyTheme();
    });
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 bg-gradient-to-b from-blue-500/5 via-purple-500/1 to-transparent"></div>
      <div class="absolute top-1/4 left-0 w-1/3 h-1/2 bg-gradient-to-r from-blue-600/4 to-transparent"></div>
      <div class="absolute top-1/4 right-0 w-1/3 h-1/2 bg-gradient-to-l from-purple-600/4 to-transparent"></div>
      <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-800/20 to-transparent"></div>
    </div>
    
    <!-- Toast de notificación -->
    <transition name="fade">
      <div v-if="toast" class="fixed bottom-24 right-6 z-50 bg-indigo-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
        <div>
          <strong>{{ toast.from }}</strong>: {{ toast.message }}
        </div>
        <button @click="openPrivateChat({ id: toast.chatId })" class="ml-4 underline">Abrir chat</button>
      </div>
    </transition>
    
    <PrivateChat
      v-if="activePrivateChat"
      :chatId="activePrivateChat.id"
      :otherUserId="getOtherUserId(activePrivateChat)"
      :visible="!!activePrivateChat"
      @close="closePrivateChat"
      @start-chat="startChatWithUser"
    />
    
    <UserSearch
      :visible="showUserSearch"
      @close="closeUserSearch"
    />

    <!-- Modal de Pricing Premium -->
    <div v-if="showPricingModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <!-- Header del modal -->
        <div class="flex items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Accede a beneficios exclusivos y ahorra en eventos</h2>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Selecciona el plan que más te convenga</p>
          </div>
          <button @click="showPricingModal = false" class="text-gray-400 transition-colors duration-200">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenido del modal -->
        <div class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- Plan Gratuito -->
            <div class="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8">
              <div class="text-center mb-8">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Plan Gratuito</h3>
                <p class="text-gray-600 dark:text-gray-400">Acceso básico a la plataforma</p>
              </div>
              
              <div class="text-center mb-8">
                <div class="text-4xl font-bold text-gray-900 dark:text-white">$0</div>
                <div class="text-gray-600 dark:text-gray-400">para siempre</div>
              </div>

              <ul class="space-y-4 mb-8">
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300">Acceso a todos los eventos</span>
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300">Chat público ilimitado</span>
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300">5 chats privados</span>
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-500 dark:text-gray-400">Sin descuentos en entradas</span>
                </li>
              </ul>

              <button 
                @click="showPricingModal = false"
                class="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-semibold transition-all duration-200"
              >
                Continuar Gratis
              </button>
            </div>

            <!-- Plan Premium -->
            <div class="border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 relative">
              <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-6 py-2 rounded-full text-sm font-bold">
                MÁS POPULAR
              </div>
              
              <div class="text-center mb-8">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Plan Premium</h3>
                <p class="text-gray-600 dark:text-gray-400">Para verdaderos amantes de la música</p>
              </div>
              
              <div class="text-center mb-8">
                <div class="text-4xl font-bold text-gray-900 dark:text-white">$9.99</div>
                <div class="text-gray-600 dark:text-gray-400">/mes</div>
              </div>

              <ul class="space-y-4 mb-8">
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300 font-semibold">15% descuento en todas las entradas</span>
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300">Acceso anticipado a eventos (24h antes)</span>
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300">Chats privados ilimitados</span>
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300">Sin anuncios</span>
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-700 dark:text-gray-300">Soporte prioritario</span>
                </li>
              </ul>

              <button 
                @click="subscribeToPremium"
                class="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:from-yellow-500 hover:to-orange-600 shadow-lg"
              >
                Suscribirse Premium
              </button>
            </div>
          </div>

          <!-- Ejemplo de ahorro -->
          <div class="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
            <h4 class="font-bold text-green-800 dark:text-green-200 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              Ejemplo de ahorro con Premium
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <span class="text-gray-700 dark:text-gray-300">Entrada de $50</span>
                <span class="font-bold text-green-600 dark:text-green-400">$42.50</span>
                <span class="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-medium">Ahorras $7.50</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <span class="text-gray-700 dark:text-gray-300">Entrada de $100</span>
                <span class="font-bold text-green-600 dark:text-green-400">$85</span>
                <span class="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-medium">Ahorras $15</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer del modal -->
        <div class="flex justify-center p-6 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="showPricingModal = false"
            class="text-gray-600 dark:text-gray-400 transition-colors duration-200 font-medium flex items-center"
          >
            O continúa sin un plan de pago
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <transition name="fade">
      <SidebarChats
        ref="sidebarChats"
        v-if="showSidebarChats && !authLoading && authUser.id"
        class="fixed top-0 left-0 z-50 h-full shadow-2xl"
        @open-chat="openPrivateChat"
        @start-chat="startChatFromSidebar"
        @notify="showToast"
        @click.stop
      />
    </transition>
    
    <button
      v-if="!authLoading && authUser.id && !activePrivateChat"
      @click="toggleSidebarChats"
      class="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
      title="Chats privados"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3.75h6m-6 3.75h3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
    
    <nav class="bg-neutral-950 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- LOGO -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-3">
              <img 
                src="/favicon-32x32-white.png" 
                alt="RaveHub Logo" 
                class="w-8 h-8"
              >
            </router-link>
          </div>

          <div class="hidden md:flex items-center space-x-8">
            <router-link 
              to="/" 
              class="text-gray-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
              active-class="text-white font-semibold"
            >
              Inicio
            </router-link>
            <router-link 
              to="/eventos" 
              class="text-gray-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
              active-class="text-white font-semibold"
            >
              Eventos
            </router-link>
            <router-link 
              v-if="!authLoading && authUser.id"
              to="/chat" 
              class="text-gray-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
              active-class="text-white font-semibold"
            >
              Chat
            </router-link>
            <router-link 
              v-if="!authLoading && authUser.id"
              to="/mis-entradas" 
              class="text-gray-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
              active-class="text-white font-semibold"
            >
              Tus Entradas
            </router-link>
          </div>

          <div class="flex items-center space-x-4">
            <button 
              v-if="!authLoading && authUser.id"
              @click="toggleUserSearch" 
              class="p-2 text-gray-400 rounded-lg transition-colors duration-200"
              title="Buscar usuarios"
              data-search-button
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <!-- Botón Premium -->
            <button 
              @click="showPricingModal = true" 
              class="bg-black dark:bg-neutral-950 text-white border-2 border-white dark:border-neutral-300 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-neutral-900 dark:hover:bg-neutral-900"
            >
              Premium
            </button>
            
            <button 
              @click="toggleTheme" 
              class="p-2 text-gray-400 rounded-lg transition-colors duration-200"
              :title="'Cambiar tema (' + themeLabel() + ')'"
            >
              <svg v-if="theme === 'light'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <svg v-else-if="theme === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>



            <!-- Debug temporal -->
            <div v-if="!authLoading && authUser.id" class="text-xs text-gray-400 hidden">
              Debug: authLoading={{ authLoading }}, role={{ authUser.role }}, isAdmin={{ authUser.role === 'admin' }}
            </div>
            
            <!-- Botón temporal para convertir en admin -->
            <button 
              v-if="!authLoading && authUser.id && authUser.role !== 'admin'"
              @click="makeAdmin"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Convertir en Admin
            </button>
            <router-link 
              v-if="!authLoading && authUser.role === 'admin'"
              to="/admin" 
              class="hidden md:flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Admin</span>
            </router-link>

            <div v-if="!authLoading && !authUser.id" class="flex items-center space-x-4">
              <router-link 
                to="/iniciar-sesion" 
                class="text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Iniciar Sesión
              </router-link>
              <router-link 
                to="/registro" 
                class="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Registrarse
              </router-link>
            </div>

            <div v-if="authLoading" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
            </div>

            <!-- USUARIO AUTENTICADO -->
            <div v-else-if="authUser.id" class="flex items-center space-x-3">
                             <!-- AVATAR -->
               <router-link 
                 to="/perfil" 
                 class="flex items-center space-x-2 text-white p-2 rounded-lg transition-colors duration-200"
               >
                 <div class="relative">
                   <div class="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                     <img 
                       v-if="authUser.profileImage"
                       :src="authUser.profileImage"
                       :alt="authUser.nombre || authUser.email || 'Avatar'"
                       class="w-full h-full object-cover"
                     />
                     <span v-else>
                       {{ authUser.nombre?.charAt(0)?.toUpperCase() || authUser.email?.charAt(0)?.toUpperCase() || 'U' }}
                     </span>
                   </div>
                                       <!-- Badge Premium en el avatar -->
                    <div v-if="authUser.subscriptionType === 'premium'" class="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white dark:border-neutral-950 flex items-center justify-center">
                     <svg class="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                       <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                     </svg>
                   </div>
                 </div>
               </router-link>

              <!-- ICONO CERRAR SESIÓN -->
              <button 
                @click="handleLogout" 
                class="text-gray-400 p-2 rounded-lg transition-colors duration-200"
                title="Cerrar sesión"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            <!-- BOTÓN HAMBURGUESA MOBILE -->
            <button 
              @click="menuOpen = !menuOpen" 
              class="md:hidden p-2 text-gray-400 rounded-lg transition-colors duration-200"
            >
              <svg v-if="!menuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- MENÚ MOBILE -->
        <div v-if="menuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 bg-neutral-950">
            <router-link 
              to="/" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 transition-all duration-200"
              @click="menuOpen = false"
              active-class="text-white bg-gray-800"
            >
              Inicio
            </router-link>
            <router-link 
              to="/eventos" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 transition-all duration-200"
              @click="menuOpen = false"
              active-class="text-white bg-gray-800"
            >
              Eventos
            </router-link>
            <router-link 
              v-if="!authLoading && authUser.id"
              to="/chat" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 transition-all duration-200"
              @click="menuOpen = false"
              active-class="text-white bg-gray-800"
            >
              Chat
            </router-link>
            <router-link 
              v-if="!authLoading && authUser.id"
              to="/mis-entradas" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 transition-all duration-200"
              @click="menuOpen = false"
              active-class="text-white bg-gray-800"
            >
              Tus Entradas
            </router-link>
            <router-link 
              v-if="!authLoading && authUser.id"
              to="/perfil" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 transition-all duration-200"
              @click="menuOpen = false"
              active-class="text-white bg-gray-800"
            >
              Mi Perfil
            </router-link>

            <router-link 
              v-if="!authLoading && authUser.role === 'admin'"
              to="/admin" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 transition-all duration-200"
              @click="menuOpen = false"
            >
              Panel de Administración
            </router-link>
            <hr v-if="!authLoading && authUser.id" class="my-2 border-gray-700">
            <button 
              v-if="authUser.id"
              @click="handleLogout" 
              class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 transition-all duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="relative z-10 flex-1 w-full">
      <RouterView />
    </main>
    
    
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap');

.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.2s; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>



