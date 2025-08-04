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
  <div class="container mx-auto py-32 p-5 mt-5 mb-5">
    <h1 class="text-3xl font-bold mb-6 main-title">Eventos Disponibles</h1>

    <!-- Banner de suscripción premium -->
    <div v-if="authUser.id && !subscriptionDiscount" class="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold mb-2">¡Desbloquea descuentos exclusivos!</h3>
          <p class="text-blue-100">Suscríbete a Premium y obtén 15% de descuento en todas las entradas</p>
        </div>
        <router-link 
          to="/perfil" 
          class="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
        >
          Ver Planes
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center">
      <Loader />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
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
        imageHeight="300px"
        @click="goToEventDetail(event.id)"
      />
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
