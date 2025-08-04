<script>
import Loader from '../components/ui/Loader.vue';
import EventCard from '../components/features/EventCard.vue';
import { eventsService } from '../services/events.js';
import { subscribeToAuth } from '../services/auth.js';
import { getSubscriptionDiscount, hasEarlyAccess } from '../services/subscription.js';

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
      subscriptionDiscount: 0,
      hasEarlyAccess: false,
    };
  },
  async created() {
    subscribeToAuth(async (newUserData) => {
      this.authUser = newUserData;
      
      // Obtener beneficios de suscripción si el usuario está autenticado
      if (newUserData.id) {
        try {
          this.subscriptionDiscount = await getSubscriptionDiscount(newUserData.id);
          this.hasEarlyAccess = await hasEarlyAccess(newUserData.id);
        } catch (error) {
          console.error("Error al obtener beneficios de suscripción:", error);
        }
      }
    });
    
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
    },
    
    // Calcular precio con descuento para un evento
    getDiscountedPrice(event) {
      if (!this.subscriptionDiscount || !event.price) return event.price;
      return event.price * (1 - this.subscriptionDiscount);
    },
    
    // Verificar si el evento tiene acceso anticipado
    isEarlyAccessEvent(event) {
      // Por ahora, simulamos que algunos eventos tienen acceso anticipado
      // En una implementación real, esto vendría de la base de datos
      return this.hasEarlyAccess && Math.random() > 0.7; // 30% de probabilidad
    },
    
    // Verificar si es un evento premium/VIP
    isPremiumEvent(event) {
      // Simulamos eventos premium basados en el precio
      return event.price > 8000; // Eventos de más de $80
    }
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
    <!-- Efectos de luz sutiles para modo oscuro -->
    <div class="fixed inset-0 pointer-events-none">
      <!-- Luz principal superior -->
      <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 bg-gradient-to-b from-blue-500/5 via-purple-500/3 to-transparent"></div>
      <!-- Luz lateral izquierda -->
      <div class="absolute top-1/4 left-0 w-1/3 h-1/2 bg-gradient-to-r from-blue-600/4 to-transparent"></div>
      <!-- Luz lateral derecha -->
      <div class="absolute top-1/4 right-0 w-1/3 h-1/2 bg-gradient-to-l from-purple-600/4 to-transparent"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header de la página -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Eventos Disponibles
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Descubre los mejores eventos de música electrónica y reserva tu lugar en experiencias únicas
        </p>
      </div>

      <!-- Banner de suscripción premium mejorado -->
      <div v-if="authUser.id && !subscriptionDiscount" class="mb-12 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <div class="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-8">
          <div class="flex-1 text-center lg:text-left">
            <div class="flex items-center justify-center lg:justify-start mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">¡Desbloquea descuentos exclusivos!</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-lg">
              Suscríbete a Premium y obtén <span class="font-semibold text-green-600 dark:text-green-400">15% de descuento</span> en todas las entradas, 
              acceso anticipado a eventos y beneficios exclusivos.
            </p>
          </div>
          <div class="flex-shrink-0">
            <router-link 
              to="/perfil" 
              class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Ver Planes Premium
            </router-link>
          </div>
        </div>
      </div>

      <!-- Loader mejorado -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <Loader />
          <p class="mt-4 text-gray-600 dark:text-gray-400">Cargando eventos...</p>
        </div>
      </div>

      <!-- Grid de eventos mejorado -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <EventCard
          v-for="event in events"
          :key="event.id"
          :imageSrc="event.img"
          :title="event.title"
          :price="getDiscountedPrice(event)"
          :originalPrice="event.price"
          :hasEarlyAccess="isEarlyAccessEvent(event)"
          :isPremiumEvent="isPremiumEvent(event)"
          containerHeight="420px"
          imageHeight="280px"
          @click="goToEventDetail(event.id)"
        />
      </div>

      <!-- Estado vacío -->
      <div v-if="!loading && events.length === 0" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay eventos disponibles</h3>
        <p class="text-gray-600 dark:text-gray-400">Pronto tendremos nuevos eventos para ti.</p>
      </div>
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
