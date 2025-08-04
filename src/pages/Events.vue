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
  <div class="min-h-screen bg-white dark:bg-neutral-950 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header elegante -->
      <div class="mb-16">
        <h1 class="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 tracking-tight">
          Eventos Disponibles
        </h1>
      </div>

      <!-- Banner de suscripción elegante -->
      <div v-if="authUser.id && !subscriptionDiscount" class="mb-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div class="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-8">
          <div class="flex-1 text-center lg:text-left">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              ✨ Desbloquea beneficios exclusivos
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-lg">
              Suscríbete a Premium y obtén <span class="font-semibold text-purple-600 dark:text-purple-400">15% de descuento</span> en todas las entradas
            </p>
          </div>
          <div class="flex-shrink-0">
            <router-link 
              to="/perfil" 
              class="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-300"
            >
              Ver Planes
            </router-link>
          </div>
        </div>
      </div>

      <!-- Loader elegante -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <Loader />
          <p class="mt-4 text-gray-600 dark:text-gray-400">Cargando eventos...</p>
        </div>
      </div>

      <!-- Grid de eventos -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <EventCard
          v-for="event in events"
          :key="event.id"
          :imageSrc="event.img"
          :title="event.title"
          :price="getDiscountedPrice(event)"
          :originalPrice="event.price"
          :hasEarlyAccess="isEarlyAccessEvent(event)"
          :isPremiumEvent="isPremiumEvent(event)"
          containerHeight="400px"
          imageHeight="250px"
          @click="goToEventDetail(event.id)"
        />
      </div>

      <!-- Estado vacío elegante -->
      <div v-if="!loading && events.length === 0" class="text-center py-20">
        <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
