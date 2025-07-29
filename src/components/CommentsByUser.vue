<template>
  <div class="comments-by-user-section my-8 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-6">Tus comentarios</h2>
    <div v-if="loading" class="flex justify-center">
      <Loader />
    </div>
    <div v-else>
      <div v-if="commentsGrouped && commentsGrouped.length" class="space-y-4">
        <div v-for="event in commentsGrouped" :key="event.eventId" class="event-comments p-4 bg-gray-100 rounded-lg">
          <h3 class="font-bold">{{ event.eventName }}</h3>
          <div v-for="comment in event.comments" :key="comment.id" class="comment mt-2 p-4 bg-gray-200 rounded-lg">
            <p class="font-bold">{{ comment.email }}</p>
            <p>{{ comment.text }}</p>
            <p class="text-gray-500 text-sm">{{ formatDate(comment.created_at) }}</p>
          </div>
        </div>
        <div class="bg-gray-100 p-4 rounded-md shadow-md">
          <p class="text-lg font-semibold text-gray-700">
            ¡Sigue comentando <router-link to="/eventos" class="text-blue-500 hover:text-blue-700 underline">eventos</router-link>!
          </p>
        </div>
      </div>
      <div v-else class="text-gray-500">
        <p>No has realizado comentarios aún.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Loader from '../components/ui/Loader.vue';
import { commentsService } from '../services/comments.js';

export default {
  components: { Loader },
  props: ['userId'],
  data() {
    return {
      commentsGrouped: [],
      loading: false,
    };
  },
  async created() {
    try {
      this.loading = true;
      this.commentsGrouped = await commentsService.getCommentsByUserId(this.userId);
      this.loading = false;
    } catch (error) {
      console.error("Error al obtener comentarios del usuario:", error);
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      try {
        return new Date(date).toLocaleString('es-AR', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit',
        });
      } catch (error) {
        console.error('Error al formatear la fecha:', error);
        return '';
      }
    },
  },
};
</script>