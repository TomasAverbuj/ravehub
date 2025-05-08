<script>
import Loader from '../components/Loader.vue';
import { eventsService } from '../services/events.js';

export default {
  name: "Events",
  components: { Loader },
  data() {
    return {
      events: [],
      loading: true
    };
  },
  async created() {
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
      <div v-for="event in events" :key="event.id" class="card bg-white shadow-md rounded-lg overflow-hidden">
        <img :src="event.img" alt="" class="card-image"/>
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-2 card-title">{{ event.title }}</h2>
          <p class="text-gray-700 mb-4 card-text"><strong>Fecha:</strong> {{ event.date }}</p>
          <p class="text-gray-700 mb-4 card-text"><strong>Locación:</strong> {{ event.location }}</p>
          <button @click="goToEventDetail(event.id)" class="card-button">Detalle</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap');

.main-title, .card-title, .card-text {
  font-family: 'Manrope', sans-serif;
}

.card {
  max-width: 350px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
}

.card-image {
  width: 100%;
  height: 60%;
  object-fit: cover;
}

.card-title, .card-text {
  font-size: 16px;
}

.card-title {
  padding-bottom: 10px;
}

.card-text {
  padding-bottom: 10px;
}

.card-button {
  background-color: black;
  color: white;
  padding: 8px 16px;
  border-radius: 30px;
  font-weight: 600;
  text-align: center;
  margin-top: auto;
  transition: background-color 0.3s, color 0.3s, border 0.3s;
  font-family: 'Manrope', sans-serif;
  border: 3px solid transparent;
}

.card-button:hover {
  background-color: white;
  color: black;
  border: 3px solid black; 
}
</style>
