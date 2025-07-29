<template>
  <div class="w-full bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 min-h-screen">
    <div class="max-w-6xl mx-auto px-6 py-16">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 tracking-tight">
          Tus Entradas
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Gestiona todas tus entradas compradas
        </p>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total de Entradas -->
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-black dark:text-white">{{ tickets.length }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Total de Entradas</p>
            </div>
          </div>
        </div>

        <!-- Próximos Eventos -->
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-black dark:text-white">{{ upcomingTickets.length }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Próximos Eventos</p>
            </div>
          </div>
        </div>

        <!-- Eventos Pasados -->
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-black dark:text-white">{{ pastTickets.length }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Eventos Pasados</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="[
            'px-6 py-3 rounded-xl font-semibold transition-all duration-200',
            activeFilter === filter.value 
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Lista de Entradas -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
      </div>

      <div v-else-if="filteredTickets.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No tienes entradas
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Aún no has comprado ninguna entrada.
        </p>
        <router-link 
          to="/eventos" 
          class="inline-flex items-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200"
        >
          Explorar Eventos
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="ticket in filteredTickets" 
          :key="ticket.id"
          class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300"
        >
          <!-- Imagen del evento -->
          <div class="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500">
            <img 
              v-if="ticket.event?.img"
              :src="ticket.event.img" 
              :alt="ticket.event.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            
            <!-- Estado del ticket -->
            <div class="absolute top-4 right-4">
              <span 
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  getTicketStatusClass(ticket)
                ]"
              >
                {{ getTicketStatus(ticket) }}
              </span>
            </div>
          </div>

          <!-- Información del ticket -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-black dark:text-white mb-2">
              {{ ticket.event?.title || 'Evento no disponible' }}
            </h3>
            
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(ticket.event?.date) }}
              </div>
              
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ ticket.event?.location || 'Ubicación no disponible' }}
              </div>
              
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                ${{ ticket.totalPrice?.toLocaleString() }}
              </div>
            </div>

            <!-- Información del cliente -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Información de Compra</h4>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <p>{{ ticket.customerInfo?.firstName }} {{ ticket.customerInfo?.lastName }}</p>
                <p>{{ ticket.customerInfo?.email }}</p>
                <p>{{ ticket.customerInfo?.phone }}</p>
              </div>
            </div>

                         <!-- Acciones -->
             <div class="flex space-x-2">
               <button 
                 @click="downloadTicket(ticket)"
                 class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
               >
                 <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                 </svg>
                 Descargar PDF
               </button>
              <button 
                v-if="ticket.event"
                @click="viewEventDetail(ticket.event.id)"
                class="flex-1 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Ver Evento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ticketsService } from '../services/tickets.js';
import { subscribeToAuth } from '../services/auth.js';
import { downloadTicketAsPDF } from '../services/pdf-generator.js';

export default {
  name: "MyTickets",
  setup() {
    const router = useRouter();
    const tickets = ref([]);
    const loading = ref(true);
    const activeFilter = ref('all');
    const authUser = ref({ id: null });

    const filters = [
      { label: 'Todas', value: 'all' },
      { label: 'Próximas', value: 'upcoming' },
      { label: 'Pasadas', value: 'past' }
    ];

    // Computed properties
    const upcomingTickets = computed(() => {
      return tickets.value.filter(ticket => {
        if (!ticket.event?.date) return false;
        const eventDate = new Date(ticket.event.date);
        return eventDate > new Date();
      });
    });

    const pastTickets = computed(() => {
      return tickets.value.filter(ticket => {
        if (!ticket.event?.date) return false;
        const eventDate = new Date(ticket.event.date);
        return eventDate <= new Date();
      });
    });

    const filteredTickets = computed(() => {
      switch (activeFilter.value) {
        case 'upcoming':
          return upcomingTickets.value;
        case 'past':
          return pastTickets.value;
        default:
          return tickets.value;
      }
    });

    // Methods
    const fetchTickets = async () => {
      if (!authUser.value.id) return;
      
      try {
        loading.value = true;
        tickets.value = await ticketsService.getTicketsByUserId(authUser.value.id);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        loading.value = false;
      }
    };

    const getTicketStatus = (ticket) => {
      if (!ticket.event?.date) return 'Sin fecha';
      
      const eventDate = new Date(ticket.event.date);
      const now = new Date();
      
      if (eventDate > now) {
        return 'Próximo';
      } else {
        return 'Pasado';
      }
    };

    const getTicketStatusClass = (ticket) => {
      if (!ticket.event?.date) return 'bg-gray-100 text-gray-800';
      
      const eventDate = new Date(ticket.event.date);
      const now = new Date();
      
      if (eventDate > now) {
        return 'bg-green-100 text-green-800';
      } else {
        return 'bg-gray-100 text-gray-800';
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'Fecha no disponible';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return dateString;
      }
    };

    const downloadTicket = async (ticket) => {
      try {
        // Mostrar indicador de carga
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = `
          <svg class="animate-spin w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Generando PDF...
        `;
        button.disabled = true;
        
        await downloadTicketAsPDF(ticket);
        
        // Restaurar botón
        button.innerHTML = originalText;
        button.disabled = false;
      } catch (error) {
        console.error('Error downloading ticket:', error);
        alert('Error al descargar la entrada. Intenta nuevamente.');
        
        // Restaurar botón en caso de error
        const button = event.target;
        button.innerHTML = `
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Descargar PDF
        `;
        button.disabled = false;
      }
    };

    const viewEventDetail = (eventId) => {
      router.push(`/evento/${eventId}`);
    };

    // Lifecycle
    onMounted(() => {
      subscribeToAuth(newUserData => {
        authUser.value = newUserData;
        if (newUserData.id) {
          fetchTickets();
        }
      });
    });

    return {
      tickets,
      loading,
      activeFilter,
      filters,
      upcomingTickets,
      pastTickets,
      filteredTickets,
      getTicketStatus,
      getTicketStatusClass,
      formatDate,
      downloadTicket,
      viewEventDetail
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

/* Transiciones suaves */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
</style> 