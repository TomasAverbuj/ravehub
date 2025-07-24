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
      // Aquí podrías actualizar Firestore para poner en 0 los mensajes no leídos de este chat para el usuario actual
      // O puedes hacerlo en el sidebar
      this.$refs.sidebarChats && this.$refs.sidebarChats.clearUnread(chatId);
    }
  },
  mounted() {
    subscribeToAuth(newUserData => this.authUser = newUserData);
  }
}
</script>

<template>
    <div>
      <!-- Toast de notificación -->
      <transition name="fade">
        <div v-if="toast" class="fixed bottom-24 right-6 z-50 bg-indigo-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-bounce-in">
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
      <!-- Botón flotante para abrir/cerrar el sidebar de chats -->
      <button
        v-if="authUser.id && !activePrivateChat"
        @click="toggleSidebarChats"
        class="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
        title="Chats privados"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3.75h6m-6 3.75h3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      <nav class="bg-white dark:bg-neutral-950 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="" class="flex items-center space-x-3 rtl:space-x-reverse">
            <router-link to="/">
              <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Funktion<strong>Club</strong></span>
            </router-link>
          </a>
          <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative items-center">
            <div v-if="authUser.role === 'admin'" class="flex items-center mr-2">
              <router-link to="/admin" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition">
                Panel de Administración
              </router-link>
            </div>
            <div v-if="!authUser.id">
              <button type="button" class="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm mx-2 px-4 py-2 text-center dark:bg-black text-white">
                <router-link to="/iniciar-sesion">
                  <!-- Heroicon: User (Outline, estilizado) -->
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 dark:bg-black text-black dark:text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                  </svg>
                </router-link>
              </button>
              <button type="button" class="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm mx-2 px-4 py-2 text-center ">
                <router-link to="/registro">
                  <!-- Heroicon: User Plus (Outline, estilizado) -->
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-black dark:text-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v6m3-3h-6" />
                  </svg>
                </router-link>
              </button>
            </div>
            <div v-else class="relative">
              <div class="flex items-center">
                <button @click="toggleMenu" class="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm mx-2 px-4 py-2 text-center dark:bg-white text-black">
                  <!-- Heroicon: Cog (Administrador) -->
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.01c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.01 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.01 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.01c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.572-1.01c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.01-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.01-2.572c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.01z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button type="button" class="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm mx-2 px-4 py-2 text-center dark:bg-white text-black" @click="handleLogout">
                  <!-- Heroicon: Arrow Right On Rectangle (Logout) -->
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12h-9m9 0l-3-3m3 3l-3 3" />
                  </svg>
                </button>
              </div>
              <div v-if="menuOpen" class="absolute right-0 mt-2 w-48 bg-white text-black dark:bg-black dark:text-white shadow-lg rounded-lg z-30 transition-colors">
                <ul>
                  <li class="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <router-link to="/eventos">Eventos</router-link>
                  </li>
                  <li v-if="authUser.role === 'admin'" class="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <router-link to="/eventos-tabla">Tabla de Eventos</router-link>
                  </li>
                  <li v-if="authUser.role === 'admin'" class="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <router-link to="/admin">Panel de Administración</router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="items-center justify-between hidden w-full md:flex md:w-auto" id="navbar-sticky">
            <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-neutral-950 dark:border-gray-700">
              <li class="block py-2 px-3 text-gray-900 rounded dark:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                <router-link to="/">Inicio</router-link>
              </li>
              <li class="block py-2 px-3 text-gray-900 rounded dark:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                <router-link to="/eventos">Eventos</router-link>
              </li>
              <template v-if="authUser.id">
                <li class="block py-2 px-3 text-gray-900 rounded dark:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                  <router-link to="/chat">Chat Público</router-link>
                </li>
                <li class="block py-2 px-3 text-gray-900 rounded dark:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                  <router-link to="/perfil">Perfil</router-link>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </nav>





    <main class="container mx-auto p-6">
      <RouterView />
    </main>

    <footer class=" dark:bg-neutral-900 mt-auto">
        <div class="mx-auto max-w-screen-xl p-4 py-6 lg:py-8">
            <div class="md:flex md:justify-between">
              <div class="mb-6 md:mb-0">
                  <a href="" class="flex items-center">
                      <span class="text-white text-xl font-bold">Funktion<strong>Club</strong></span>
                  </a>
              </div>
              <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                  <div>
                      <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Recursos útiles</h2>
                      <ul class="text-gray-500 dark:text-gray-400 font-medium">
                        <li class="mb-4">
                            <a href="#" class="hover:underline">
                                <span class="logo-text">Eventos</span>
                            </a>
                        </li>
                          <li class="mb-4">
                          <a href="#" class="hover:underline">
                                <span class="logo-text">Novedades</span>
                            </a>
                          </li>
                          <li class="mb-4">
                          <a href="#" class="hover:underline">
                                <span class="logo-text">Agenda</span>
                            </a>
                          </li>
                      </ul>
                  </div>
                  <div>
                      <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Síganos</h2>
                      <ul class="text-gray-500 dark:text-gray-400 font-medium">
                          <li class="mb-4">
                              <a href="https://github.com/nicosici1" class="hover:underline ">Github</a>
                          </li>
                          <li>
                              <a href="#" class="hover:underline">Discord</a>
                          </li>
                      </ul>
                  </div>
                  <div>
                      <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Contacto</h2>
                      <ul class="text-gray-500 dark:text-gray-400 font-medium">
                          <li class="mb-4">
                              <a href="#" class="hover:underline">nico.siciliano@hotmail.com</a><br>
                              <a href="#" class="hover:underline">totoaverbuj@gmail.com</a>
                          </li>                     
                      </ul>
                  </div>
              </div>
          </div>
          <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div class="sm:flex sm:items-center sm:justify-between">
              <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" class="hover:underline">FunktionClub</a>. Todos los derechos reservados.
              </span>
              <div class="flex mt-4 sm:justify-center sm:mt-0">
                  <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                            <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd"/>
                        </svg>
                      <span class="sr-only">Facebook page</span>
                  </a>
                  <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 16">
                            <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"/>
                        </svg>
                      <span class="sr-only">Discord community</span>
                  </a>
                  <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                        <path fill-rule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clip-rule="evenodd"/>
                    </svg>
                      <span class="sr-only">Twitter page</span>
                  </a>
                  <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
                      </svg>
                      <span class="sr-only">GitHub account</span>
                  </a>
                  <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" clip-rule="evenodd"/>
                    </svg>
                      <span class="sr-only">Dribbble account</span>
                  </a>
              </div>
          </div>
        </div>
    </footer>
</div>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes bounce-in { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
.animate-bounce-in { animation: bounce-in 0.4s; }
</style>



