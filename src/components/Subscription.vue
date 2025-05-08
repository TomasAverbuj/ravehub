<template>
  <div class="subscription-section my-8 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-6">Suscripción</h2>
    <p v-if="!currentSubscription" class="text-gray-700 mb-4 font-light">¡Aprovecha la suscripción gratuita por tiempo limitado!</p>
    <div v-if="currentSubscription" class="space-y-4">
      <p class="text-gray-700 mb-4">Estado: {{ currentSubscription.status }}</p>
      <p class="text-gray-700 mb-4">Fecha de inicio: {{ formatDate(currentSubscription.startDate) }}</p>
      <p class="text-gray-700 mb-4">Fecha de vencimiento: {{ formatDate(currentSubscription.endDate) }}</p>
      <button @click="unsubscribe" class="custom-button w-full p-3 rounded-lg transition duration-300 bg-red-500 border-red-500">
        Cancelar Suscripción
      </button>
    </div>
    <div v-else>
      <button @click="subscribe" class="custom-button w-full p-3 rounded-lg transition duration-300">
        Suscribirse
      </button>
    </div>
  </div>
</template>

<script>
import { subscribeUser, getSubscriptionStatus, unsubscribeUser } from '../services/subscription.js';
import { ref, onMounted } from 'vue';
import { auth } from '../services/firebase';

export default {
  name: 'Subscription',
  setup() {
    const currentSubscription = ref(null);

    const loadSubscription = async (userId) => {
      try {
        currentSubscription.value = await getSubscriptionStatus(userId);
      } catch (error) {
        console.error('Error al obtener el estado de la suscripción:', error);
      }
    };

    const subscribe = async () => {
      try {
        if (auth.currentUser) {
          await subscribeUser(auth.currentUser.uid);
          await loadSubscription(auth.currentUser.uid);
        }
      } catch (error) {
        console.error('Error al suscribirse:', error);
      }
    };

    const unsubscribe = async () => {
      try {
        if (auth.currentUser) {
          await unsubscribeUser(auth.currentUser.uid);
          currentSubscription.value = null;
        }
      } catch (error) {
        console.error('Error al cancelar la suscripción:', error);
      }
    };

    onMounted(() => {
      if (auth.currentUser) {
        loadSubscription(auth.currentUser.uid);
      }
    });

    const formatDate = (date) => {
      if (!date) return '';
      try {
        return new Intl.DateTimeFormat('es-AR', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit',
        }).format(new Date(date)).replace(',', '');
      } catch (error) {
        console.error('Error al formatear la fecha:', error);
        return '';
      }
    };

    return { currentSubscription, subscribe, unsubscribe, formatDate };
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
