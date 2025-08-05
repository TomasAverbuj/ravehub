<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Overlay de fondo -->
    <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" @click="close"></div>
    
    <!-- Modal de notificación -->
    <div class="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
      <!-- Icono de éxito animado -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-green-600 dark:text-green-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
      
      <!-- Título -->
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
        ¡Compra Exitosa!
      </h2>
      
      <!-- Mensaje -->
      <p class="text-center text-gray-600 dark:text-gray-300 mb-6">
        Tu entrada ha sido procesada correctamente. Recibirás un email con los detalles de tu compra.
      </p>
      
      <!-- Detalles de la compra -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">{{ eventTitle }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-xs">{{ eventDate }}</p>
          </div>
        </div>
        
        <div class="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
          <span class="text-sm text-gray-600 dark:text-gray-400">Total pagado:</span>
          <span class="font-bold text-green-600 dark:text-green-400">${{ totalPrice }}</span>
        </div>
      </div>
      
      <!-- Botones de acción -->
      <div class="flex space-x-3">
        <button 
          @click="goToTickets"
          class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
        >
          Ver Mis Entradas
        </button>
        <button 
          @click="close"
          class="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessNotification',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    eventTitle: {
      type: String,
      default: ''
    },
    eventDate: {
      type: String,
      default: ''
    },
    totalPrice: {
      type: [Number, String],
      default: 0
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    goToTickets() {
      this.$router.push('/mis-entradas');
      this.close();
    }
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}
</style> 