<template>
  <div class="container mx-auto py-32 p-10 mt-5 mb-5">
    <div v-if="event">
      <div class="event-image-container mx-auto pt-12">
        <img
          class="event-image"
          :src="event.img"
          alt="Imagen del evento"
        />
      </div>
      <div class="event-title-container bg-gray-200 rounded-lg p-4 mt-12">
        <MainH1 class="event-title text-center">{{ event.title }}</MainH1>
      </div>
      <div class="event-details flex flex-col md:flex-row mt-5">
        <div class="description w-full md:w-1/2 p-2">
          <div class="description-container bg-gray-200 rounded-lg p-4">
            <p class="text-gray-700 mb-4">{{ event.description }}</p>
          </div>
        </div>
        <div class="info w-full md:w-1/2 p-2">
          <div class="info-item bg-gray-200 rounded-lg p-4 mb-4" style="width: 50%; padding-left: 10px;">
            <p class="text-gray-700"><strong>Fecha:</strong> {{ event.date }}</p>
          </div>
          <div class="info-item bg-gray-200 rounded-lg p-4 mb-4" style="width: 50%; padding-left: 10px;">
            <p class="text-gray-700"><strong>Locación:</strong> {{ event.location }}</p>
          </div>
          <div class="info-item bg-gray-200 rounded-lg p-4" style="width: 50%; padding-left: 10px;">
            <p class="text-gray-700"><strong>Capacidad:</strong> {{ event.capacity }}</p>
          </div>
        </div>
      </div>
      <Comments :eventId="event.id" />
    </div>
    <Loader v-else />
  </div>
</template>

<script>
import MainH1 from '../components/MainH1.vue';
import Loader from '../components/Loader.vue';
import Comments from '../components/Comments.vue';
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
      console.log(this.event); // Verifica la estructura de los datos
    } catch (error) {
      this.error = error.message;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap');

.container {
  padding: 35px;
}

.event-image-container {
  width: 100%;
  border-radius: 30px;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 30px;
}

.event-title-container {
  background-color: #e5e7eb;
  border-radius: 30px;
  padding: 10px;
  margin-top: 30px;
}

.event-title-container p {
  font-family: 'Manrope', sans-serif;
}

.event-title {
  font-family: 'Manrope', sans-serif;
  padding-top: 10px;
}

.event-details {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-top: 30px;
}

.description, .info {
  padding: 5px;
}

.description-container, .info-item {
  background-color: #e5e7eb;
  border-radius: 30px;
  font-family: 'Manrope', sans-serif;
}

.info-item {
  padding: 10px;
}
</style>