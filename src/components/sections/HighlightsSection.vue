<script>
import Card from '../ui/Card.vue';
import Container from '../ui/Container.vue';

export default {
  name: 'HighlightsSection',
  components: { Card, Container }
}
</script>

<template>
  <div class="w-full py-24 bg-gray-50 dark:bg-neutral-950">
    <Container>
      <!-- Header con diseño asimétrico mejorado -->
      <div class="mb-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Lado izquierdo - Título y descripción -->
          <div class="space-y-8">
            <div class="space-y-6">
              <h2 class="text-5xl md:text-6xl font-bold text-black dark:text-white leading-tight">
                Encuentra tu próxima
                <span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
                  experiencia
                </span>
              </h2>
              <div class="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            </div>
            <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              Sumérgete en el mundo de la música electrónica y forma parte de una comunidad apasionada
            </p>
          </div>
          
          <!-- Lado derecho - Elemento visual mejorado -->
          <div class="relative flex justify-center lg:justify-end">
            <div class="relative z-10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl p-10 border border-purple-200/20 dark:border-purple-800/20 backdrop-blur-sm">
              <div class="flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl mx-auto mb-8 shadow-2xl">
                <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div class="text-center space-y-3">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Música Electrónica</h3>
                <p class="text-gray-600 dark:text-gray-400">Los mejores eventos te esperan</p>
              </div>
            </div>
            
            <!-- Elementos decorativos mejorados -->
            <div class="absolute -top-6 -right-6 w-12 h-12 bg-purple-400 rounded-full opacity-40 animate-pulse"></div>
            <div class="absolute -bottom-6 -left-6 w-10 h-10 bg-blue-400 rounded-full opacity-40 animate-pulse" style="animation-delay: 1s;"></div>
            <div class="absolute top-1/2 -right-8 w-6 h-6 bg-purple-300 rounded-full opacity-30"></div>
          </div>
        </div>
      </div>
      
      <!-- Cards con diseño mejorado -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        <!-- Tarjeta de eventos -->
        <div class="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8">
          <div class="flex items-start gap-6 mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1 space-y-4">
              <h3 class="text-2xl font-bold text-black dark:text-white">Explora eventos destacados</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                Navega por los eventos más populares y emocionantes de la escena electrónica cerca de ti.
              </p>
            </div>
          </div>
          <router-link to="/eventos" class="inline-flex items-center text-purple-600 dark:text-purple-400 font-semibold text-lg hover:text-purple-700 dark:hover:text-purple-300 transition-colors group-hover:translate-x-2 duration-300">
            Ver eventos
            <svg class="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
        
        <!-- Tarjeta de comunidad -->
        <div class="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8">
          <div class="flex items-start gap-6 mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div class="flex-1 space-y-4">
              <h3 class="text-2xl font-bold text-black dark:text-white">¡Comparte tu pasión!</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                Únete a conversaciones vibrantes y conoce personas que comparten tu amor por la música electrónica.
              </p>
            </div>
          </div>
          <router-link to="/chat" class="inline-flex items-center text-green-600 dark:text-green-400 font-semibold text-lg hover:text-green-700 dark:hover:text-green-300 transition-colors group-hover:translate-x-2 duration-300">
            Ir al chat
            <svg class="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
      </div>
    </Container>
  </div>
</template> 