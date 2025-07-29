<template>
  <div class="w-full bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 min-h-screen">
    <!-- Hero Section con imagen de fondo -->
    <div class="relative w-full h-96 md:h-[500px] overflow-hidden">
      <img
        v-if="event"
        :src="event.img"
        :alt="event.title"
        class="w-full h-full object-cover object-center"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      
      <!-- Overlay con información del evento -->
      <div class="absolute inset-0 flex items-end">
        <div class="w-full p-8 md:p-12">
          <div class="max-w-4xl mx-auto">
            <!-- Badge del evento -->
            <div class="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30">
              <span class="text-sm font-bold text-white">EVENTO</span>
            </div>
            
            <!-- Título del evento -->
            <h1 class="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              {{ event?.title }}
            </h1>
            
            <!-- Información del evento -->
            <div class="flex flex-wrap items-center gap-6 text-white/90 mb-8">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                <span class="font-medium">{{ event?.date }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="font-medium">{{ event?.location }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span class="font-medium">{{ event?.capacity }} personas</span>
              </div>
            </div>
            
            <!-- Botón de acción -->
            <router-link :to="`/evento/${event?.id}/comprar`">
              <button class="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Comprar Entrada</span>
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-4xl mx-auto px-6 py-16">
      <!-- Descripción -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-12">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-black dark:text-white">Descripción del Evento</h2>
        </div>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-lg break-words overflow-hidden">{{ event?.description }}</p>
      </div>

      <!-- Comentarios -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-12">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-black dark:text-white">Comentarios</h2>
        </div>
        
        <!-- Contenedor de comentarios -->
        <div class="h-96 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <Comments v-if="event" :eventId="event.id" />
          <Loader v-else />
        </div>
      </div>

      <!-- Botón volver -->
      <div class="text-center">
        <button 
          @click="$router.back()" 
          class="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Volver</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MainH1 from '../components/MainH1.vue';
import Loader from '../components/ui/Loader.vue';
import Comments from '../components/features/Comments.vue';
import { eventsService } from '../services/events.js';

export default {
  name: "EventDetail",
  components: { MainH1, Loader, Comments },
  data() {
    return {
      event: null,
      error: null,
    };
  },
  async created() {
    const eventId = this.$route.params.id;
    try {
      this.event = await eventsService.getEventById(eventId);
    } catch (error) {
      this.error = error.message;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

/* Transiciones suaves */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Scrollbar personalizado */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

/* Efectos hover */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
</style>