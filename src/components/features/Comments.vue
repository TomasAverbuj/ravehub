<script>
import { commentsService } from '../../services/comments';
import Avatar from '../ui/Avatar.vue';
import { auth } from '../../services/firebase';
import { subscribeToAuth } from '../../services/auth';

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
      loading: false,
      currentUser: null,
      userProfileData: null
    };
  },
  computed: {
    isAdmin() {
      return this.userProfileData?.role === 'admin';
    }
  },
  async mounted() {
    // Obtener usuario actual
    this.currentUser = auth.currentUser;
    console.log('🔍 Usuario actual en Comments:', this.currentUser);
    
    // Suscribirse a los cambios de autenticación para obtener la información del perfil
    subscribeToAuth((userData) => {
      console.log('🔐 Datos de autenticación recibidos en Comments:', userData);
      this.userProfileData = userData;
    });
    
    console.log('🖼️ Datos del perfil del usuario:', this.userProfileData);
    await this.loadComments();
  },
  methods: {
    async loadComments() {
      this.loading = true;
      try {
        this.comments = await commentsService.getCommentsByEventId(this.eventId);
        console.log('📝 Comentarios cargados:', this.comments);
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
          userId: this.currentUser?.uid || 'anonymous',
          email: this.currentUser?.email || 'Usuario',
          nombre: this.currentUser?.displayName || this.currentUser?.email?.split('@')[0] || 'Usuario',
          created_at: new Date()
        };
        console.log('💬 Enviando comentario:', comment);
        await commentsService.addComment(comment);
        this.newComment = '';
        await this.loadComments();
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    },
    async deleteAllComments() {
      if (!confirm('¿Estás seguro de que quieres borrar todos los comentarios? Esta acción no se puede deshacer.')) {
        return;
      }
      
      try {
        console.log('🗑️ Borrando todos los comentarios del evento:', this.eventId);
        
        // Usar la función optimizada del servicio
        await commentsService.deleteAllCommentsByEventId(this.eventId);
        
        // Recargar comentarios
        await this.loadComments();
        console.log('✅ Todos los comentarios han sido borrados');
        
      } catch (error) {
        console.error('Error borrando comentarios:', error);
        alert('Error al borrar los comentarios. Intenta nuevamente.');
      }
    },
    formatDate(dateString) {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return 'Hoy';
        }
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        return 'Hoy';
      }
    },
    getUserDisplayName(comment) {
      // Si es el usuario actual, usar su información
      if (comment.userId === this.currentUser?.uid) {
        return this.userProfileData?.nombre || this.currentUser?.displayName || this.currentUser?.email?.split('@')[0] || 'Nico';
      }
      
      // Para comentarios antiguos con datos incorrectos, usar información del usuario actual si coincide
      if (comment.userId === 'current-user-id' || comment.email === 'Usuario') {
        return this.userProfileData?.nombre || this.currentUser?.displayName || this.currentUser?.email?.split('@')[0] || 'Nico';
      }
      
      return comment.nombre || comment.email?.split('@')[0] || 'Usuario';
    },
    getUserEmail(comment) {
      // Si es el usuario actual, usar su email
      if (comment.userId === this.currentUser?.uid) {
        return this.currentUser?.email || 'nico@example.com';
      }
      
      // Para comentarios antiguos con datos incorrectos, usar email del usuario actual
      if (comment.userId === 'current-user-id' || comment.email === 'Usuario') {
        return this.currentUser?.email || 'nico@example.com';
      }
      
      return comment.email || this.getUserDisplayName(comment);
    },
    getUserId(comment) {
      // Para comentarios antiguos con userId incorrecto, usar el userId actual
      if (comment.userId === 'current-user-id') {
        return this.currentUser?.uid || 'anonymous';
      }
      return comment.userId || comment.id;
    },
    getUserProfileImage(comment) {
      console.log('🖼️ Verificando imagen para comentario:', comment);
      console.log('🖼️ UserId del comentario:', comment.userId);
      console.log('🖼️ UserId del usuario actual:', this.currentUser?.uid);
      console.log('🖼️ Datos del perfil:', this.userProfileData);
      
      // Si es el usuario actual o un comentario antiguo del usuario actual, usar su imagen de perfil
      if (comment.userId === this.currentUser?.uid || comment.userId === 'current-user-id' || comment.email === 'Usuario') {
        const imageUrl = this.userProfileData?.profileImage || '';
        console.log('🖼️ Imagen devuelta:', imageUrl);
        return imageUrl;
      }
      
      console.log('🖼️ No es usuario actual, devolviendo vacío');
      return '';
    }
  }
}
</script>

<template>
  <div class="mt-8">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ comments.length }} comentario{{ comments.length !== 1 ? 's' : '' }}
      </h3>
      
      <!-- Botón para borrar todos los comentarios (solo visible para admins y si hay comentarios) -->
      <button
        v-if="isAdmin && comments.length > 0"
        @click="deleteAllComments"
        class="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        title="Borrar todos los comentarios (Solo administradores)"
      >
        🗑️ Limpiar
      </button>
    </div>
    
    <!-- Formulario de comentario -->
    <div class="mb-8">
      <textarea
        v-model="newComment"
        placeholder="Escribe tu comentario..."
        class="w-full p-3 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-white resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        rows="3"
      ></textarea>
      <button
        @click="submitComment"
        class="mt-3 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
      >
        Comentar
      </button>
    </div>
    
    <!-- Lista de comentarios -->
    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
    </div>
    
    <div v-else-if="comments.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      No hay comentarios aún. ¡Sé el primero en comentar!
    </div>
    
    <div v-else class="space-y-6">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex space-x-4"
      >
        <div class="flex-shrink-0">
          <!-- Avatar personalizado para el usuario actual -->
          <div 
            v-if="getUserProfileImage(comment)"
            class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white dark:text-black border-2 border-white dark:border-gray-800 shadow-lg bg-cover bg-center"
            :style="{ backgroundImage: `url(${getUserProfileImage(comment)})` }"
          >
          </div>
          <!-- Avatar normal para otros usuarios -->
          <Avatar 
            v-else
            :userId="getUserId(comment)"
            :email="getUserEmail(comment)"
            size="md"
            :skipFirestore="true"
          />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2 mb-1">
            <span class="font-semibold text-gray-900 dark:text-white text-sm">
              {{ getUserDisplayName(comment) }}
            </span>
            <span class="text-gray-500 dark:text-gray-400 text-sm">
              {{ formatDate(comment.created_at) }}
            </span>
          </div>
          <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{{ comment.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template> 