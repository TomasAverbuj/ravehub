<script>
import Home from './pages/Home.vue';
import Chat from './pages/Chat.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import { logout, subscribeToAuth } from './services/auth';

export default {
  name: 'App',
  components: { Home, Chat, Login, Register },
  data() {
    return {
      authUser: {
        id: null,
        email: null,
      },
      menuOpen: false
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
    }
  },
  mounted() {
    subscribeToAuth(newUserData => this.authUser = newUserData);
  }
}
</script>

<template>
    <div>
      <nav class="bg-white dark:bg-neutral-950 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="" class="flex items-center space-x-3 rtl:space-x-reverse">
            <router-link to="/">
              <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Funktion<strong>Club</strong></span>
            </router-link>
          </a>
          <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
            <div v-if="!authUser.id">
              <button type="button" class="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm mx-2 px-4 py-2 text-center dark:bg-black text-white">
                <router-link to="/iniciar-sesion"><img src="/dist/assets/imagenes-icons/acceso.png" alt="" class="w-8 h-8 dark:bg-black text-white"></router-link>
              </button>
              <button type="button" class="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm mx-2 px-4 py-2 text-center ">
                <router-link to="/registro"><img src="/dist/assets/imagenes-icons/crear-cuenta.png" alt="" class="w-8 h-8 "></router-link>
              </button>
            </div>
            <div v-else class="relative">
              <div class="flex items-center">
                <button @click="toggleMenu" class="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm mx-2 px-4 py-2 text-center dark:bg-white text-black">
                  <img src="/dist/assets/imagenes-icons/administrador.png" alt="" class="w-8 h-8">
                </button>
                <button type="button" class="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm mx-2 px-4 py-2 text-center dark:bg-white text-black" @click="handleLogout">
                  <img src="/dist/assets/imagenes-icons/cerrar-sesion.png" alt="" class="w-8 h-8">
                </button>
              </div>
              <div v-if="menuOpen" class="absolute right-0 mt-2 w-48 bg-black dark:bg-white shadow-lg rounded-lg z-30">
                <ul>
                  <li class="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <router-link to="/eventos">Eventos</router-link>
                  </li>
              
                  <li class="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <router-link to="/eventos-tabla">Tabla de Eventos</router-link>
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



