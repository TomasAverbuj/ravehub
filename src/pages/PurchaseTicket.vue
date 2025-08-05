<template>
  <div class="w-full bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-16">
      <!-- Header con botón volver -->
      <div class="flex items-center mb-8">
        <button 
          @click="$router.back()" 
          class="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Volver</span>
        </button>
      </div>

      <!-- Título de la página -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 tracking-tight">
          Comprar Entrada
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Completa tu compra para {{ event?.title }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Formulario de compra -->
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 class="text-2xl font-bold text-black dark:text-white mb-6">Información de Pago</h2>
          
          <form @submit.prevent="processPurchase" class="space-y-6">
            <!-- Información personal -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-black dark:text-white">Datos Personales</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre
                  </label>
                  <input 
                    v-model="formData.firstName"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Apellido
                  </label>
                  <input 
                    v-model="formData.lastName"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input 
                  v-model="formData.email"
                  type="email" 
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
                  placeholder="tu@email.com"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teléfono
                </label>
                <input 
                  v-model="formData.phone"
                  type="tel" 
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
                  placeholder="+54 9 11 1234-5678"
                />
              </div>
            </div>

            <!-- Información de pago -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-black dark:text-white">Información de Pago</h3>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número de Tarjeta
                </label>
                <input 
                  v-model="formData.cardNumber"
                  type="text" 
                  required
                  maxlength="19"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha de Vencimiento
                  </label>
                  <input 
                    v-model="formData.expiryDate"
                    type="text" 
                    required
                    maxlength="5"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
                    placeholder="MM/YY"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVV
                  </label>
                  <input 
                    v-model="formData.cvv"
                    type="text" 
                    required
                    maxlength="4"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            <!-- Botón de compra -->
            <button 
              type="submit"
              :disabled="isProcessing"
              class="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Loader v-if="isProcessing" class="w-5 h-5" />
              <span v-else>Procesar Compra</span>
            </button>
          </form>
        </div>

        <!-- Resumen de la compra -->
        <div class="space-y-6">
          <!-- Detalles del evento -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h2 class="text-2xl font-bold text-black dark:text-white mb-6">Resumen de Compra</h2>
            
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <img 
                  v-if="event"
                  :src="event.img" 
                  :alt="event.title"
                  class="w-20 h-20 object-cover rounded-xl"
                />
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-black dark:text-white">{{ event?.title }}</h3>
                  <p class="text-gray-600 dark:text-gray-300">{{ event?.date }}</p>
                  <p class="text-gray-600 dark:text-gray-300">{{ event?.location }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Desglose de costos -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 class="text-xl font-bold text-black dark:text-white mb-4">Desglose de Costos</h3>
            
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-300">Entrada</span>
                <span class="font-semibold text-black dark:text-white">${{ eventPrice }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-300">Tarifa de Servicio</span>
                <span class="font-semibold text-black dark:text-white">${{ serviceFee }}</span>
              </div>
              
              <!-- Descuento Premium -->
              <div v-if="hasDiscount" class="flex justify-between items-center text-green-600 dark:text-green-400">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Descuento Premium ({{ (subscriptionDiscount * 100).toFixed(0) }}%)
                </span>
                <span class="font-semibold">-${{ discountAmount.toFixed(0) }}</span>
              </div>
              
              <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-black dark:text-white">Total</span>
                  <span class="text-lg font-bold text-black dark:text-white">${{ totalPrice.toFixed(0) }}</span>
                </div>
                
                <!-- Ahorro total -->
                <div v-if="hasDiscount" class="mt-2 text-sm text-green-600 dark:text-green-400">
                  <span>¡Ahorras ${{ discountAmount.toFixed(0) }} con tu suscripción Premium!</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div class="flex items-start space-x-3">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Información Importante</h4>
                <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• La entrada será enviada por email</li>
                  <li>• No se permiten reembolsos</li>
                  <li>• Llega 30 minutos antes del evento</li>
                  <li>• Trae tu documento de identidad</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notificación de éxito -->
    <SuccessNotification
      :show="showSuccessNotification"
      :eventTitle="event?.title"
      :eventDate="event?.date"
      :totalPrice="totalPrice.toFixed(0)"
      @close="hideSuccessNotification"
    />
  </div>
</template>

<script>
import Loader from '../components/ui/Loader.vue';
import SuccessNotification from '../components/ui/SuccessNotification.vue';
import { eventsService } from '../services/events.js';
import { ticketsService } from '../services/tickets.js';
import { subscribeToAuth } from '../services/auth.js';
import { getSubscriptionDiscount, calculateDiscountedPrice } from '../services/subscription.js';

export default {
  name: "PurchaseTicket",
  components: { Loader, SuccessNotification },
  data() {
    return {
      event: null,
      isProcessing: false,
      authUser: { id: null },
      subscriptionDiscount: 0,
      showSuccessNotification: false,
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      }
    };
  },
  computed: {
    eventPrice() {
      return this.event?.price || 0;
    },
    serviceFee() {
      return 3000; // $30.00 en centavos
    },
    originalTotal() {
      return this.eventPrice + this.serviceFee;
    },
    discountAmount() {
      return this.originalTotal * this.subscriptionDiscount;
    },
    totalPrice() {
      return this.originalTotal - this.discountAmount;
    },
    hasDiscount() {
      return this.subscriptionDiscount > 0;
    }
  },
  async created() {
    const eventId = this.$route.params.id;
    try {
      this.event = await eventsService.getEventById(eventId);
    } catch (error) {
      console.error('Error loading event:', error);
      this.$router.push('/eventos');
    }
    
    // Suscribirse a cambios de autenticación
    subscribeToAuth(async (newUserData) => {
      this.authUser = newUserData;
      // Obtener descuento de suscripción si el usuario está autenticado
      if (newUserData.id) {
        try {
          this.subscriptionDiscount = await getSubscriptionDiscount(newUserData.id);
        } catch (error) {
          console.error('Error getting subscription discount:', error);
          this.subscriptionDiscount = 0;
        }
      }
    });
  },
  methods: {
    async processPurchase() {
      this.isProcessing = true;
      
      try {
        // Verificar que el usuario esté autenticado
        if (!this.authUser.id) {
          alert('Debes iniciar sesión para comprar entradas.');
          this.$router.push('/iniciar-sesion');
          return;
        }
        
        // Simular procesamiento de pago
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Crear la entrada en la base de datos
        const ticketData = {
          userId: this.authUser.id,
          eventId: this.event.id,
          totalPrice: this.totalPrice,
          originalPrice: this.originalTotal,
          discountAmount: this.discountAmount,
          discountPercentage: this.subscriptionDiscount,
          customerInfo: {
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            email: this.formData.email,
            phone: this.formData.phone
          }
        };
        
        await ticketsService.createTicket(ticketData);
        
        // Mostrar notificación de éxito
        this.showSuccessNotification = true;
        
      } catch (error) {
        console.error('Error processing purchase:', error);
        alert('Error al procesar la compra. Intenta nuevamente.');
      } finally {
        this.isProcessing = false;
      }
    },
    hideSuccessNotification() {
      this.showSuccessNotification = false;
    }
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