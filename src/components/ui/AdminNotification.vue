<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Overlay de fondo -->
    <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" @click="close"></div>
    
    <!-- Modal de notificación -->
    <div class="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
      <!-- Icono animado -->
      <div class="flex justify-center mb-6">
        <div :class="[
          'w-20 h-20 rounded-full flex items-center justify-center',
          iconClasses
        ]">
          <svg class="w-10 h-10 animate-bounce" :class="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            <path v-else-if="type === 'error'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            <path v-else-if="type === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
      
      <!-- Título -->
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
        {{ title }}
      </h2>
      
      <!-- Mensaje -->
      <p class="text-center text-gray-600 dark:text-gray-300 mb-6">
        {{ message }}
      </p>
      
      <!-- Detalles adicionales -->
      <div v-if="details" class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
        <div class="space-y-2">
          <div v-for="(detail, key) in details" :key="key" class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ key }}:</span>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ detail }}</span>
          </div>
        </div>
      </div>
      
      <!-- Botones de acción -->
      <div class="flex space-x-3">
        <button 
          v-if="primaryAction"
          @click="handlePrimaryAction"
          :class="[
            'flex-1 font-semibold py-3 px-4 rounded-xl transition-colors duration-200',
            primaryActionClasses
          ]"
        >
          {{ primaryAction }}
        </button>
        <button 
          @click="close"
          :class="[
            'flex-1 font-semibold py-3 px-4 rounded-xl transition-colors duration-200',
            closeButtonClasses
          ]"
        >
          {{ closeButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminNotification',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'success', // 'success', 'error', 'warning', 'info'
      validator: value => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    details: {
      type: Object,
      default: null
    },
    primaryAction: {
      type: String,
      default: ''
    },
    closeButtonText: {
      type: String,
      default: 'Cerrar'
    }
  },
  computed: {
    iconClasses() {
      const classes = {
        success: 'bg-green-100 dark:bg-green-900/30',
        error: 'bg-red-100 dark:bg-red-900/30',
        warning: 'bg-yellow-100 dark:bg-yellow-900/30',
        info: 'bg-blue-100 dark:bg-blue-900/30'
      };
      return classes[this.type] || classes.info;
    },
    iconColor() {
      const colors = {
        success: 'text-green-600 dark:text-green-400',
        error: 'text-red-600 dark:text-red-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        info: 'text-blue-600 dark:text-blue-400'
      };
      return colors[this.type] || colors.info;
    },
    primaryActionClasses() {
      const classes = {
        success: 'bg-green-600 hover:bg-green-700 text-white',
        error: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        info: 'bg-blue-600 hover:bg-blue-700 text-white'
      };
      return classes[this.type] || classes.info;
    },
    closeButtonClasses() {
      return 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300';
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    handlePrimaryAction() {
      this.$emit('primary-action');
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