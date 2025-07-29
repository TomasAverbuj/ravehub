<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero imagen -->
    <div class="relative w-full h-72 md:h-96 overflow-hidden">
      <img
        v-if="event"
        :src="event.img"
        :alt="event.title"
        class="w-full h-full object-cover object-center"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    </div>

    <!-- Card flotante -->
    <div class="max-w-3xl mx-auto -mt-24 relative z-10">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div class="flex-1">
          <MainH1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white event-title">{{ event?.title }}</MainH1>
          <div class="flex flex-wrap items-center text-gray-600 dark:text-gray-300 mb-4 gap-4">
            <span><i class="fa-regular fa-calendar"></i> <strong>Fecha:</strong> {{ event?.date }}</span>
            <span><i class="fa-solid fa-location-dot"></i> <strong>Locación:</strong> {{ event?.location }}</span>
            <span><i class="fa-solid fa-users"></i> <strong>Capacidad:</strong> {{ event?.capacity }}</span>
          </div>
          <button class="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition">
            Comprar entrada
          </button>
        </div>
      </div>
    </div>

    <!-- Descripción y comentarios -->
    <div class="max-w-3xl mx-auto mt-12 px-4">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Descripción</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-8">{{ event?.description }}</p>
      <!-- Caja de comentarios scrollable, ancho completo -->
      <div class="w-full h-80 bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-4 overflow-y-auto">
        <Comments v-if="event" :eventId="event.id" />
        <Loader v-else />
      </div>
      <!-- Caja para escribir comentarios (fuera del scroll) -->
      <div class="w-full bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-8">
        <!-- Aquí deberías colocar tu formulario de comentarios si está separado -->
        <!-- <CommentForm v-if="event" :eventId="event.id" /> -->
      </div>
      <button @click="$router.back()" class="mt-12 text-gray-500 hover:underline">← Volver</button>
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
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap');

.event-title {
  font-family: 'Manrope', sans-serif;
}
</style>