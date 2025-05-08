<template>
  <div class="flex flex-col h-full">
    <!-- Lista de comentarios con scroll -->
    <div class="flex-1 overflow-y-auto pr-2">
      <div v-for="comentario in comentarios" :key="comentario.id" class="mb-4">
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 relative min-h-[70px]">
          <span class="font-bold block mb-1">{{ comentario.nombre || comentario.email }}</span>
          <span class="block mb-6">{{ comentario.texto || comentario.text }}</span>
          <div class="text-xs text-gray-500 absolute bottom-2 right-4">
            {{ formatDate(comentario.fecha || comentario.created_at) }}
          </div>
        </div>
      </div>
    </div>
    <!-- Formulario para agregar comentario, fuera del scroll -->
    <form @submit.prevent="agregarComentario" class="mt-4">
      <input
        v-model="nuevoComentario"
        type="text"
        placeholder="Escribe un comentario"
        class="w-full border rounded-lg p-3 mb-2"
      />
      <button
        type="submit"
        class="w-full bg-black text-white rounded-full py-3 font-semibold"
      >
        Agregar comentario
      </button>
    </form>
  </div>
</template>

<script>
import { commentsService } from '../services/comments.js';
import { subscribeToAuth } from '../services/auth.js';
import Loader from '../components/Loader.vue';
import { getUserById } from '../services/users.js';

export default {
  components: { Loader },
  props: {
    eventId: { type: [String, Number], required: true }
  },
  data() {
    return {
      comentarios: [],
      nuevoComentario: "",
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
        this.authUser = newUserData;
      });

      let comentarios = await commentsService.getCommentsByEventId(this.eventId);

      // Ordenar por fecha descendente (más reciente primero)
      comentarios.sort((a, b) => new Date(b.created_at || b.fecha) - new Date(a.created_at || a.fecha));

      // Optimización: obtener usuarios únicos y sus datos en paralelo
      const userIds = [...new Set(comentarios.map(c => c.userId).filter(Boolean))];
      const userMap = {};
      await Promise.all(userIds.map(async userId => {
        const usuario = await getUserById(userId);
        userMap[userId] = usuario?.nombre || usuario?.email || 'Usuario';
      }));

      // Asignar nombre/email a cada comentario
      for (let comentario of comentarios) {
        comentario.nombre = userMap[comentario.userId] || 'Usuario';
      }

      this.comentarios = comentarios;
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
    async agregarComentario() {
      if (!this.nuevoComentario.trim()) return;
      try {
        this.loading = true;
        const newComment = {
          userId: this.authUser.id,
          text: this.nuevoComentario,
          created_at: new Date().toISOString(),
          eventId: this.eventId,
        };
        await commentsService.addComment(newComment);
        // Recargar comentarios y usuarios (igual que arriba)
        let comentarios = await commentsService.getCommentsByEventId(this.eventId);
        comentarios.sort((a, b) => new Date(b.created_at || b.fecha) - new Date(a.created_at || a.fecha));
        const userIds = [...new Set(comentarios.map(c => c.userId).filter(Boolean))];
        const userMap = {};
        await Promise.all(userIds.map(async userId => {
          const usuario = await getUserById(userId);
          userMap[userId] = usuario?.nombre || usuario?.email || 'Usuario';
        }));
        for (let comentario of comentarios) {
          comentario.nombre = userMap[comentario.userId] || 'Usuario';
        }
        this.comentarios = comentarios;
        this.nuevoComentario = '';
      } catch (error) {
        console.error('Error al agregar comentario:', error);
      } finally {
        this.loading = false;
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
.flex-1 {
  flex: 1 1 0%;
  min-height: 0;
}
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
