<template>
  <div class="subscription-section">
    <!-- Estado actual de suscripción - Mejorado -->
    <div v-if="currentSubscription" class="mb-8">
      <div v-if="currentSubscription.type === 'premium'" 
           class="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 dark:from-green-700 dark:via-emerald-700 dark:to-green-800 rounded-2xl p-6 text-white shadow-xl border border-green-500/20">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <svg class="w-6 h-6 mr-2 text-green-200" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <h3 class="text-xl font-bold">Suscripción Premium Activa</h3>
            </div>
            <p class="text-green-100 text-sm">Disfrutando de todos los beneficios premium</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold">${{ currentSubscription.benefits?.price || 9.99 }}</div>
            <div class="text-green-100 text-sm">por mes</div>
          </div>
        </div>
        
        <!-- Fechas de suscripción -->
        <div class="mt-4 pt-4 border-t border-green-400/30">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-green-200">Inicio</p>
              <p class="font-semibold">{{ formatDate(currentSubscription.startDate) }}</p>
            </div>
            <div>
              <p class="text-green-200">Vence</p>
              <p class="font-semibold">{{ formatDate(currentSubscription.endDate) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else 
           class="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 dark:from-blue-700 dark:via-purple-700 dark:to-blue-800 rounded-2xl p-6 text-white shadow-xl border border-blue-500/20">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <svg class="w-6 h-6 mr-2 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-xl font-bold">Plan Gratuito</h3>
            </div>
            <p class="text-blue-100 text-sm">Acceso básico a la plataforma</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold">Gratis</div>
            <div class="text-blue-100 text-sm">para siempre</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de acción mejorados -->
    <div v-if="currentSubscription?.type === 'premium'" class="mb-8">
      <div class="grid grid-cols-1 gap-3">
        <button 
          @click="renewSubscription" 
          class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white py-4 px-6 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Renovar Premium
        </button>
        <button 
          @click="downgradeToFree" 
          class="w-full bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white py-4 px-6 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Cambiar a Plan Gratuito
      </button>
      </div>
    </div>

    <!-- Planes disponibles mejorados -->
    <div class="space-y-6">
      <!-- Plan Gratuito -->
      <div class="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h4 class="text-xl font-bold text-gray-900 dark:text-white">Plan Gratuito</h4>
            <p class="text-gray-500 dark:text-gray-400 text-sm">Ideal para empezar</p>
          </div>
          <div class="text-right">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">$0</span>
            <span class="text-sm text-gray-500 dark:text-gray-400 block">para siempre</span>
          </div>
        </div>
        <ul class="space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <li class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>Acceso a todos los eventos</span>
          </li>
          <li class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>Chat público ilimitado</span>
          </li>
          <li class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>5 chats privados</span>
          </li>
          <li class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-500 dark:text-gray-400">Sin descuentos en entradas</span>
          </li>
        </ul>
      </div>

      <!-- Plan Premium -->
      <div class="border-2 border-blue-500 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 relative shadow-xl hover:shadow-2xl transition-all duration-300">
        <div v-if="currentSubscription?.type === 'premium'" class="absolute -top-3 -right-3 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
          ACTIVO
        </div>
        <div class="flex items-center justify-between mb-6">
          <div>
            <h4 class="text-xl font-bold text-gray-900 dark:text-white">Plan Premium</h4>
            <p class="text-blue-600 dark:text-blue-400 text-sm">Para verdaderos amantes de la música</p>
          </div>
          <div class="text-right">
            <span class="text-3xl font-bold text-blue-600 dark:text-blue-400">$9.99</span>
            <span class="text-sm text-gray-500 dark:text-gray-400 block">/mes</span>
          </div>
        </div>
        <ul class="space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <li class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="font-semibold text-green-600 dark:text-green-400">15% descuento en todas las entradas</span>
          </li>
          <li class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>Acceso anticipado a eventos (24h antes)</span>
          </li>
          <li class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>Chats privados ilimitados</span>
          </li>
          <li class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>Sin anuncios</span>
          </li>
          <li class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>Soporte prioritario</span>
          </li>
        </ul>
        

        
        <!-- Botón de suscripción -->
        <button 
          v-if="currentSubscription?.type !== 'premium'"
          @click="subscribe" 
          class="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white py-4 px-6 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Suscribirse Premium
      </button>
      </div>
    </div>

    <!-- Ejemplo de ahorro mejorado -->
    <div v-if="currentSubscription?.type !== 'premium'" class="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl shadow-lg">
      <h5 class="font-bold text-green-800 dark:text-green-200 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        Ejemplo de ahorro con Premium
      </h5>
      <div class="space-y-3 text-sm text-green-700 dark:text-green-300">
        <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
          <span>Entrada de $50</span>
          <span class="font-bold">$42.50</span>
          <span class="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-medium">Ahorras $7.50</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
          <span>Entrada de $100</span>
          <span class="font-bold">$85</span>
          <span class="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-medium">Ahorras $15</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { subscribeUser, getSubscriptionStatus, unsubscribeUser, SUBSCRIPTION_TYPES } from '../services/subscription.js';
import { ref, onMounted } from 'vue';
import { auth } from '../services/firebase';
import { getUserProfileById } from '../services/user-profile';

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
          await subscribeUser(auth.currentUser.uid, SUBSCRIPTION_TYPES.PREMIUM);
          await loadSubscription(auth.currentUser.uid);
          alert('¡Suscripción Premium activada! Disfruta de todos los beneficios.');
        }
      } catch (error) {
        console.error('Error al suscribirse:', error);
        alert('Error al activar la suscripción. Intenta nuevamente.');
      }
    };

    const renewSubscription = async () => {
      try {
        if (auth.currentUser) {
          await subscribeUser(auth.currentUser.uid, SUBSCRIPTION_TYPES.PREMIUM);
          await loadSubscription(auth.currentUser.uid);
          alert('¡Suscripción Premium renovada exitosamente!');
        }
      } catch (error) {
        console.error('Error al renovar la suscripción:', error);
        alert('Error al renovar la suscripción. Intenta nuevamente.');
      }
    };

    const downgradeToFree = async () => {
      if (confirm('¿Estás seguro de que quieres cambiar al plan gratuito? Perderás todos los beneficios premium.')) {
        try {
          if (auth.currentUser) {
            await unsubscribeUser(auth.currentUser.uid);
            currentSubscription.value = null;
            
            // Recargar el perfil del usuario para actualizar el estado global
            try {
              const updatedProfile = await getUserProfileById(auth.currentUser.uid);
              // Emitir un evento personalizado para notificar el cambio
              window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
                detail: { user: updatedProfile } 
              }));
            } catch (error) {
              console.error('Error al recargar perfil:', error);
            }
            
            alert('Cambiado al plan gratuito exitosamente.');
          }
        } catch (error) {
          console.error('Error al cambiar al plan gratuito:', error);
          alert('Error al cambiar al plan gratuito. Intenta nuevamente.');
        }
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
        }).format(new Date(date));
      } catch (error) {
        console.error('Error al formatear la fecha:', error);
        return '';
      }
    };

    return { 
      currentSubscription, 
      subscribe, 
      renewSubscription,
      downgradeToFree,
      formatDate 
    };
  },
};
</script>

<style scoped>
.subscription-section {
  @apply space-y-6;
}
</style>
