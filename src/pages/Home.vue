<script>
import MainH1 from '../components/MainH1.vue';
</script>

<template>
  <div class="w-full">
    <!-- Hero Section con efectos de luz -->
    <div class="relative w-full min-h-screen flex items-center">
      <!-- Fondo sólido con efectos de luz -->
      <div class="absolute inset-0 bg-white dark:bg-gray-950"></div>
      
      <!-- Efectos de luz sutiles mejorados -->
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.12),transparent_50%)]"></div>
      <div class="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.12),transparent_50%)]"></div>
      
      <!-- Luz superior adicional para modo oscuro -->
      <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-64 bg-gradient-to-b from-blue-500/8 via-purple-500/4 to-transparent dark:from-blue-500/15 dark:via-purple-500/8 dark:to-transparent"></div>
      
      <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16 py-20">
        <!-- Ilustración profesional -->
        <div class="flex-1 flex justify-center md:order-last">
          <div class="relative">
            <!-- Círculo principal con gradiente uniforme -->
            <div class="w-80 h-80 bg-gradient-to-br from-blue-700 via-purple-800 to-blue-700 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <!-- Círculo interno con efecto glassmorphism uniforme -->
              <div class="w-72 h-72 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <svg class="w-40 h-40 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            </div>
            <!-- Efectos de brillo uniformes -->
            <div class="absolute -top-4 -left-4 w-8 h-8 bg-blue-400 rounded-full blur-xl opacity-40"></div>
            <div class="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-400 rounded-full blur-lg opacity-40"></div>
          </div>
        </div>
        
        <!-- Contenido principal -->
        <div class="flex-1 flex flex-col items-start justify-center">
          <MainH1 class="text-6xl md:text-7xl font-black text-blue-600 dark:text-blue-300 mb-6">
            RaveHub
          </MainH1>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6 tracking-tight">
            Todo lo que un <span class="text-purple-600 dark:text-purple-300">Clubber</span> Necesita
          </h2>
                      <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              Descubre las mejores fechas de música electrónica cerca de ti, conéctate con otros amantes de la música y vive experiencias inolvidables en la escena local.
            </p>
          <div class="flex flex-col sm:flex-row gap-6 mb-12">
            <router-link to="/eventos">
              <button class="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
                Explorar Eventos
              </button>
            </router-link>
            <router-link to="/registro">
              <button class="px-10 py-4 border-2 border-blue-400 text-blue-600 dark:text-blue-300 font-bold text-lg rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-500 transition-all duration-300">
                Crear Cuenta
              </button>
            </router-link>
          </div>
          
          <!-- Tarjetas de características limpias -->
          <div class="flex flex-col md:flex-row gap-6 w-full">
            <div class="group flex-1 p-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
              <h3 class="text-xl font-bold text-blue-600 dark:text-blue-300 mb-3 flex items-center gap-3">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                Eventos Exclusivos
              </h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">Explora una amplia variedad de eventos de música electrónica, desde festivales hasta clubes locales.</p>
            </div>
            <div class="group flex-1 p-8 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg">
              <h3 class="text-xl font-bold text-purple-600 dark:text-purple-300 mb-3 flex items-center gap-3">
                <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                Comunidad Activa
              </h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">Conéctate con otros amantes de la música electrónica, comparte tus experiencias y descubre nuevas pistas y artistas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de destacados con efectos -->
    <div class="relative w-full py-20 bg-gray-50 dark:bg-gray-950">
      <!-- Efectos de luz sutiles para la sección -->
      <div class="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-100 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"></div>
      <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Descubre tu <span class="text-blue-600 dark:text-blue-300">Próximo Evento</span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explora las mejores experiencias de música electrónica y conéctate con la comunidad
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="group p-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">¡Comenta tu evento favorito!</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">Descubre tu evento favorito y conéctate con personas con los mismos gustos musicales.</p>
            <router-link to="/eventos">
              <span class="inline-flex items-center text-blue-600 dark:text-blue-300 font-semibold hover:text-blue-500 dark:hover:text-blue-200 transition-colors">
                Elige tu favorito
                <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </router-link>
          </div>
          
          <div class="group p-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Explora eventos destacados</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">Descubre los eventos más populares y emocionantes de la escena de la música electrónica cerca de ti.</p>
            <router-link to="/eventos">
              <span class="inline-flex items-center text-purple-600 dark:text-purple-300 font-semibold hover:text-purple-500 dark:hover:text-purple-200 transition-colors">
                Ver Eventos Destacados
                <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;900&display=swap');

* {
  font-family: 'Manrope', sans-serif;
}

/* Transiciones suaves */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>