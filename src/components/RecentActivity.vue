<template>
  <div class="recent-activity">
    <!-- Estadísticas principales mejoradas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total de eventos -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-blue-100 dark:text-blue-200 text-sm font-medium mb-1">Eventos Asistidos</p>
            <p class="text-3xl font-bold">{{ totalEvents }}</p>
            <p class="text-blue-200 dark:text-blue-300 text-xs mt-1">Total histórico</p>
          </div>
          <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Dinero ahorrado -->
      <div class="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-green-100 dark:text-green-200 text-sm font-medium mb-1">Ahorrado con Premium</p>
            <p class="text-3xl font-bold">${{ totalSaved.toLocaleString() }}</p>
            <p class="text-green-200 dark:text-green-300 text-xs mt-1">Con descuentos</p>
          </div>
          <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Entradas activas -->
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-purple-100 dark:text-purple-200 text-sm font-medium mb-1">Entradas Activas</p>
            <p class="text-3xl font-bold">{{ activeTickets }}</p>
            <p class="text-purple-200 dark:text-purple-300 text-xs mt-1">Vigentes</p>
          </div>
          <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Actividad reciente mejorada -->
    <div class="space-y-6">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <svg class="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Actividad Reciente
      </h3>
      
      <!-- Últimas entradas compradas -->
      <div v-if="recentTickets.length > 0" class="space-y-4">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center">
          <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          Últimas Compras
        </h4>
        <div class="space-y-4">
          <div 
            v-for="ticket in recentTickets.slice(0, 3)" 
            :key="ticket.id"
            class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] cursor-pointer"
            @click="goToEvent(ticket.eventId)"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900 dark:text-white text-lg">{{ ticket.event?.title || 'Evento' }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(ticket.purchaseDate) }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-bold text-gray-900 dark:text-white text-lg">${{ ticket.totalPrice?.toLocaleString() }}</p>
                <p v-if="ticket.savings" class="text-xs text-green-600 dark:text-green-400 font-medium">
                  Ahorraste ${{ ticket.savings?.toLocaleString() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Próximos eventos -->
      <div v-if="upcomingEvents.length > 0" class="space-y-4">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center">
          <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Próximos Eventos
        </h4>
        <div class="space-y-4">
          <div 
            v-for="event in upcomingEvents.slice(0, 3)" 
            :key="event.id"
            class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] cursor-pointer"
            @click="goToEvent(event.id)"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                <img 
                  :src="event.img" 
                  :alt="event.title"
                  class="w-full h-full object-cover"
                  @error="$event.target.src = '/default-event-image.jpg'"
                />
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900 dark:text-white text-lg">{{ event.title }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(event.date) }}
                </p>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Próximo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío mejorado -->
      <div v-if="recentTickets.length === 0 && upcomingEvents.length === 0" class="text-center py-12">
        <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center shadow-lg">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">¡Bienvenido a RaveHub!</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Como usuario nuevo, aún no tienes actividad. Compra tu primera entrada para empezar a ver tu actividad aquí.
        </p>
        <router-link 
          to="/eventos" 
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Explorar Eventos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ticketsService } from '../services/tickets.js';
import { eventsService } from '../services/events.js';
import { subscribeToAuth } from '../services/auth.js';

export default {
  name: 'RecentActivity',
  setup() {
    const router = useRouter();
    const recentTickets = ref([]);
    const upcomingEvents = ref([]);
    const totalEvents = ref(0);
    const totalSaved = ref(0);
    const activeTickets = ref(0);
    const authUser = ref({ id: null });

    const clearActivity = () => {
      recentTickets.value = [];
      upcomingEvents.value = [];
      totalEvents.value = 0;
      totalSaved.value = 0;
      activeTickets.value = 0;
    };

    const loadUserActivity = async (userId) => {
      if (!userId) {
        clearActivity();
        return;
      }

      try {
        // Cargar entradas del usuario
        const tickets = await ticketsService.getTicketsByUserId(userId);
        recentTickets.value = tickets.slice(0, 5);
        activeTickets.value = tickets.length;

        // Calcular estadísticas
        totalEvents.value = tickets.length;
        totalSaved.value = tickets.reduce((sum, ticket) => {
          return sum + (ticket.savings || 0);
        }, 0);

        // Cargar eventos próximos donde el usuario tiene entradas
        const userTickets = await ticketsService.getTicketsByUserId(userId);
        const userEventIds = userTickets.map(ticket => ticket.eventId);
        
        if (userEventIds.length > 0) {
          const allEvents = await eventsService.getEvents();
          upcomingEvents.value = allEvents
            .filter(event => 
              userEventIds.includes(event.id) && 
              new Date(event.date) > new Date()
            )
            .slice(0, 3);
        } else {
          upcomingEvents.value = [];
        }

      } catch (error) {
        console.error('Error loading user activity:', error);
        clearActivity();
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
        return new Intl.DateTimeFormat('es-AR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(new Date(dateString));
      } catch (error) {
        return dateString;
      }
    };

    const goToEvent = (eventId) => {
      router.push({ name: 'EventDetail', params: { id: eventId } });
    };

    // Observar cambios en el usuario autenticado
    watch(() => authUser.value.id, (newUserId, oldUserId) => {
      if (newUserId !== oldUserId) {
        // Si cambió el usuario, limpiar y cargar nueva actividad
        clearActivity();
        if (newUserId) {
          loadUserActivity(newUserId);
        }
      }
    });

    onMounted(() => {
      subscribeToAuth((newUserData) => {
        authUser.value = newUserData;
        if (newUserData.id) {
          loadUserActivity(newUserData.id);
        } else {
          clearActivity();
        }
      });
    });

    return {
      recentTickets,
      upcomingEvents,
      totalEvents,
      totalSaved,
      activeTickets,
      formatDate,
      goToEvent
    };
  }
};
</script>

<style scoped>
.recent-activity {
  @apply space-y-6;
}
</style> 