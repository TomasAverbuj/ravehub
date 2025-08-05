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

    <div class="max-w-4xl mx-auto px-6 py-16">
      <div class="mb-16">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Descripción</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-lg break-words overflow-hidden">{{ event?.description }}</p>
      </div>

      <div class="mb-12">
        <Comments v-if="event" :eventId="event.id" />
        <Loader v-else />
      </div>
    </div>

    <div class="fixed bottom-6 left-6 z-50">
      <button 
        @click="$router.back()" 
        class="inline-flex items-center space-x-2 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 font-medium px-4 py-2 rounded-lg shadow-lg"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Volver</span>
      </button>
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

.transition-all {
  transition: all 0.2s ease-in-out;
}

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

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

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