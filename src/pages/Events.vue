<script>
import Loader from '../components/ui/Loader.vue';
import EventCard from '../components/features/EventCard.vue';
import { eventsService } from '../services/events.js';
import { subscribeToAuth } from '../services/auth.js';

export default {
  name: "Events",
  components: { 
    Loader,
    EventCard 
  },
  data() {
    return {
      events: [],
      loading: true,
      authUser: { role: null },
    };
  },
  async created() {
    subscribeToAuth(newUserData => this.authUser = newUserData);
    try {
      this.events = await eventsService.getEvents(); 
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    } finally {
      this.loading = false; 
    }
  },
  methods: {
    goToEventDetail(eventId) {
      this.$router.push({ name: 'EventDetail', params: { id: eventId } });
    }
  }
};
</script>

<template>
  <div class="container mx-auto py-32 p-5 mt-5 mb-5">
    <h1 class="text-3xl font-bold mb-6 main-title">Eventos Disponibles</h1>

    <div v-if="loading" class="flex justify-center items-center">
      <Loader />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :imageSrc="event.img"
        :title="event.title"
        containerHeight="400px"
        imageHeight="300px"
        @click="goToEventDetail(event.id)"
      />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap');

.main-title {
  font-family: 'Manrope', sans-serif;
}

.container {
  max-width: 1200px;
}
</style>
