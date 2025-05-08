<template>
  <div class="comments-section my-8 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-6">Comentarios</h2>
    <div v-if="loading" class="flex justify-center">
      <Loader />
    </div>
    <div v-else>
      <div v-if="comments && comments.length" class="space-y-4">
        <div v-for="comment in comments" :key="comment.id" class="comment p-4 bg-gray-100 rounded-lg">
          <a>
            <p class="font-bold">{{ comment.email }}</p>
          </a>
          <p>{{ comment.text }}</p>
          <p class="text-gray-500 text-sm">{{ formatDate(comment.created_at) }}</p>
        </div>
      </div>
      <div v-else class="text-gray-500">
        <p>No hay comentarios aún.</p>
      </div>
      <div class="add-comment mt-6">
        <input 
          v-model="newComment" 
          class="w-full p-3 border rounded-lg mb-4" 
          placeholder="Escribe un comentario" 
        />
        <button 
          @click="addComment" 
          class="custom-button w-full p-3 rounded-lg transition duration-300"
        >
          Agregar comentario
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { commentsService } from '../services/comments.js';
import { subscribeToAuth } from '../services/auth.js';
import Loader from '../components/Loader.vue';

export default {
  components: { Loader },
  props: ['eventId'],
  data() {
    return {
      comments: [],
      newComment: '',
      authUser: {
        id: null,
        email: null,
      },
      loading: false,
    };
  },
  async created() {
    try {
      this.unsubscribeFromAuth = subscribeToAuth(newUserData => {
        console.log(newUserData, 'new user data');
        this.authUser = newUserData;
      });

      this.comments = await commentsService.getCommentsByEventId(this.eventId);
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
    }
  },
  unmounted() {
    if (this.unsubscribeFromAuth) {
      this.unsubscribeFromAuth();
    }
  },
  methods: {
    async addComment() {
      if (this.newComment.trim()) {
        try {
          this.loading = true;
          const newComment = {
            userId: this.authUser.id,
            text: this.newComment,
            created_at: new Date().toISOString(),
            eventId: this.eventId,
          };
          await commentsService.addComment(newComment);
          this.comments = await commentsService.getCommentsByEventId(this.eventId);
          this.newComment = '';
        } catch (error) {
          console.error('Error al agregar comentario:', error);
        } finally {
          this.loading = false;
        }
      }
    },
    formatDate(date) {
      if (!date) return '';
      try {
        return Intl.DateTimeFormat('es-AR', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit',
        }).format(new Date(date)).replace(',', '');
      } catch (error) {
        console.error('Error al formatear la fecha:', error);
        return '';
      }
    },
  },
};
</script>

<style scoped>
.custom-button {
  background-color: black;
  color: white;
  border-radius: 20px;
  border: 2px solid black;
}
.custom-button:hover {
  background-color: white;
  color: black;
}
</style>
