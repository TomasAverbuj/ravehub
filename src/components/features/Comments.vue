<script>
import { commentsService } from '../../services/comments';
import Avatar from '../ui/Avatar.vue';

export default {
  name: 'Comments',
  components: { Avatar },
  props: {
    eventId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      newComment: '',
      loading: false
    };
  },
  async mounted() {
    await this.loadComments();
  },
  methods: {
    async loadComments() {
      this.loading = true;
      try {
        this.comments = await commentsService.getCommentsByEventId(this.eventId);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        this.loading = false;
      }
    },
    async submitComment() {
      if (!this.newComment.trim()) return;
      
      try {
        const comment = {
          eventId: this.eventId,
          text: this.newComment,
          userId: 'current-user-id', // Esto debería venir del auth
          created_at: new Date()
        };
        await commentsService.addComment(comment);
        this.newComment = '';
        await this.loadComments();
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  }
}
</script>

<template>
  <div class="mt-8">
    <h3 class="text-xl font-semibold mb-4">Comentarios</h3>
    
    <!-- Formulario de comentario -->
    <div class="mb-6">
      <textarea
        v-model="newComment"
        placeholder="Escribe tu comentario..."
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows="3"
      ></textarea>
      <button
        @click="submitComment"
        class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Comentar
      </button>
    </div>
    
    <!-- Lista de comentarios -->
    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>
    
    <div v-else-if="comments.length === 0" class="text-center py-4 text-gray-500">
      No hay comentarios aún. ¡Sé el primero en comentar!
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
      >
        <div class="flex items-center space-x-3 mb-3">
          <Avatar 
            :userId="comment.userId || comment.id" 
            :email="comment.email || comment.nombre"
            size="md"
          />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ comment.email || comment.nombre || 'Usuario' }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ new Date(comment.created_at).toLocaleDateString() }}
              </span>
            </div>
          </div>
        </div>
        <p class="text-gray-700 dark:text-gray-300">{{ comment.text }}</p>
      </div>
    </div>
  </div>
</template> 