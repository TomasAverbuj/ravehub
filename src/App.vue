<script>
import Home from './pages/Home.vue';
import Chat from './pages/Chat.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import { logout, subscribeToAuth } from './services/auth';
import SidebarChats from './components/SidebarChats.vue';
import PrivateChat from './pages/PrivateChat.vue';

export default {
  name: 'App',
  components: { Home, Chat, Login, Register, SidebarChats, PrivateChat },
  data() {
    return {
      authUser: {
        id: null,
        email: null,
        role: null,
      },
      menuOpen: false,
      showSidebarChats: false,
      activePrivateChat: null,
      toast: null, // { message, chatId, from }
      theme: 'system', // 'light', 'dark' o 'system'
    };
  },
  methods: {
    handleLogout() {
      logout();
      this.$router.push({
        path: '/iniciar-sesion'
      });
    },
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
  },
  mounted() {
    subscribeToAuth(newUserData => this.authUser = newUserData);
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
    <!-- Efectos de luz sutiles para modo oscuro -->
    <div class="fixed inset-0 pointer-events-none">
      <!-- Luz principal superior -->
      <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 bg-gradient-to-b from-blue-500/5 via-purple-500/3 to-transparent"></div>
      <!-- Luz lateral izquierda -->
      <div class="absolute top-1/4 left-0 w-1/3 h-1/2 bg-gradient-to-r from-blue-600/4 to-transparent"></div>
      <!-- Luz lateral derecha -->
      <div class="absolute top-1/4 right-0 w-1/3 h-1/2 bg-gradient-to-l from-purple-600/4 to-transparent"></div>
      <!-- Luz inferior sutil -->
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
    
    <!-- Panel lateral de chat privado -->
    <PrivateChat
      v-if="activePrivateChat"
      :chatId="activePrivateChat.id"
      :otherUserId="getOtherUserId(activePrivateChat)"
      :visible="!!activePrivateChat"
      @close="closePrivateChat"
    />
    
    <!-- Sidebar de chats privados -->
    <transition name="fade">
      <SidebarChats
        ref="sidebarChats"
        v-if="showSidebarChats && authUser.id"
        class="fixed top-0 left-0 z-50 h-full shadow-2xl"
        @open-chat="openPrivateChat"
        @notify="showToast"
        @click.stop
      />
    </transition>
    
    <!-- Botón flotante limpio -->
    <button
      v-if="authUser.id && !activePrivateChat"
      @click="toggleSidebarChats"
      class="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
      title="Chats privados"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3.75h6m-6 3.75h3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
    
    <!-- NAVBAR CON EFECTOS -->
    <nav class="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800/50 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
                    <!-- LOGO ADAPTATIVO -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2 group">
              <!-- Logo para modo claro -->
              <img 
                src="/favicon-32x32.png" 
                alt="RaveHub Logo" 
                class="w-8 h-8 dark:hidden"
              >
              <!-- Logo para modo oscuro -->
              <img 
                src="/favicon-32x32-white.png" 
                alt="RaveHub Logo" 
                class="w-8 h-8 hidden dark:block"
              >
            </router-link>
          </div>

          <!-- MENÚ DESKTOP UNIFICADO -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link 
              to="/" 
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              active-class="text-blue-600 dark:text-blue-300 font-semibold"
            >
              Inicio
            </router-link>
            <router-link 
              to="/eventos" 
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              active-class="text-blue-600 dark:text-blue-300 font-semibold"
            >
              Eventos
            </router-link>
            <router-link 
              v-if="authUser.id"
              to="/chat" 
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              active-class="text-blue-600 dark:text-blue-300 font-semibold"
            >
              Chat Público
            </router-link>
            <router-link 
              v-if="authUser.id"
              to="/perfil" 
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              active-class="text-blue-600 dark:text-blue-300 font-semibold"
            >
              Perfil
            </router-link>
          </div>

          <!-- ACCIONES DERECHA -->
          <div class="flex items-center space-x-4">
            <!-- BOTÓN TEMA -->
            <button 
              @click="toggleTheme" 
              class="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
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

            <!-- BOTÓN ADMIN -->
            <router-link 
              v-if="authUser.role === 'admin'"
              to="/admin" 
              class="hidden md:flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Admin</span>
            </router-link>

            <!-- USUARIO NO AUTENTICADO -->
            <div v-if="!authUser.id" class="flex items-center space-x-3">
              <router-link 
                to="/iniciar-sesion" 
                class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Iniciar Sesión
              </router-link>
              <router-link 
                to="/registro" 
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Registrarse
              </router-link>
            </div>

            <!-- USUARIO AUTENTICADO -->
            <div v-else class="flex items-center space-x-3">
              <!-- AVATAR -->
              <div class="relative">
                <button 
                  @click="toggleMenu" 
                  class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {{ authUser.email ? authUser.email.charAt(0).toUpperCase() : '?' }}
                  </div>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- MENÚ DESPLEGABLE -->
                <div 
                  v-if="menuOpen" 
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                >
                  <router-link 
                    to="/perfil" 
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    @click="menuOpen = false"
                  >
                    Mi Perfil
                  </router-link>
                  <router-link 
                    to="/eventos" 
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    @click="menuOpen = false"
                  >
                    Eventos
                  </router-link>
                  <router-link 
                    v-if="authUser.role === 'admin'"
                    to="/eventos-tabla" 
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    @click="menuOpen = false"
                  >
                    Tabla de Eventos
                  </router-link>
                  <router-link 
                    v-if="authUser.role === 'admin'"
                    to="/admin" 
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    @click="menuOpen = false"
                  >
                    Panel de Administración
                  </router-link>
                  <hr class="my-1 border-gray-200 dark:border-gray-700">
                  <button 
                    @click="handleLogout" 
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>

            <!-- BOTÓN HAMBURGUESA MOBILE -->
            <button 
              @click="menuOpen = !menuOpen" 
              class="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
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
          <div class="px-2 pt-2 pb-3 space-y-1 bg-black/95 backdrop-blur-md border-t border-cyan-500/30">
            <router-link 
              to="/" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200"
              @click="menuOpen = false"
              active-class="text-cyan-400 bg-cyan-500/20 border-l-2 border-cyan-400"
            >
              Inicio
            </router-link>
            <router-link 
              to="/eventos" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200"
              @click="menuOpen = false"
              active-class="text-cyan-400 bg-cyan-500/20 border-l-2 border-cyan-400"
            >
              Eventos
            </router-link>
            <router-link 
              v-if="authUser.id"
              to="/chat" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200"
              @click="menuOpen = false"
              active-class="text-cyan-400 bg-cyan-500/20 border-l-2 border-cyan-400"
            >
              Chat Público
            </router-link>
            <router-link 
              v-if="authUser.id"
              to="/perfil" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200"
              @click="menuOpen = false"
              active-class="text-cyan-400 bg-cyan-500/20 border-l-2 border-cyan-400"
            >
              Perfil
            </router-link>
            <router-link 
              v-if="authUser.role === 'admin'"
              to="/admin" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200"
              @click="menuOpen = false"
            >
              Panel de Administración
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Espacio para el contenido principal -->
    <main class="relative z-10 flex-1 w-full">
      <RouterView />
    </main>
    
    <!-- FOOTER CON EFECTOS -->
    <footer class="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800/50 mt-auto py-8">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Logo y descripción -->
        <div class="text-center mb-8">
          <router-link to="/" class="inline-flex items-center space-x-2 mb-4">
            <!-- Logo para modo claro -->
            <img 
              src="/favicon-32x32.png" 
              alt="RaveHub Logo" 
              class="w-8 h-8 dark:hidden"
            >
            <!-- Logo para modo oscuro -->
            <img 
              src="/favicon-32x32-white.png" 
              alt="RaveHub Logo" 
              class="w-8 h-8 hidden dark:block"
            >
          </router-link>
          <p class="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Tu plataforma para descubrir los mejores eventos de música electrónica y conectar con la comunidad.
          </p>
        </div>

        <!-- Enlaces principales -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div class="text-center md:text-left">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Navegación
            </h3>
            <ul class="space-y-2">
              <li>
                <router-link to="/" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                  Inicio
                </router-link>
              </li>
              <li>
                <router-link to="/eventos" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                  Eventos
                </router-link>
              </li>
              <li>
                <router-link to="/chat" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                  Chat Público
                </router-link>
              </li>
            </ul>
          </div>

          <div class="text-center md:text-left">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Comunidad
            </h3>
            <ul class="space-y-2">
              <li>
                <a href="https://github.com/nicosici1" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          <div class="text-center md:text-left">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <ul class="space-y-2">
              <li>
                <a href="mailto:nico.siciliano@hotmail.com" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                  nico.siciliano@hotmail.com
                </a>
              </li>
              <li>
                <a href="mailto:totoaverbuj@gmail.com" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                  totoaverbuj@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Línea divisoria -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 md:mb-0">
              © 2024 RaveHub. Todos los derechos reservados.
            </p>
            <div class="flex space-x-6">
              <a href="#" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                <span class="sr-only">Facebook</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                <span class="sr-only">Discord</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                <span class="sr-only">Twitter</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://github.com/nicosici1" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                <span class="sr-only">GitHub</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap');

/* Transiciones básicas */
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



