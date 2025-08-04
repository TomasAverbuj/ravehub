<script>
export default {
  name: 'EventCard',
  props: {
    imageSrc: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    containerHeight: {
      type: String,
      default: '400px'
    },
    imageHeight: {
      type: String,
      default: '250px'
    },
    hasEarlyAccess: {
      type: Boolean,
      default: false
    },
    isPremiumEvent: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      default: 0
    },
    originalPrice: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
}
</script>

<template>
  <div 
    class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700"
    :style="{ height: containerHeight }"
    @click="handleClick"
  >
    <!-- Imagen del evento -->
    <div class="relative w-full overflow-hidden" :style="{ height: imageHeight }">
      <img 
        :src="imageSrc" 
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        @error="$event.target.src = '/default-event-image.jpg'"
      />
      
      <!-- Overlay sutil -->
      <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
      
      <!-- Indicador de descuento sutil -->
      <div v-if="originalPrice > price" class="absolute top-3 right-3">
        <div class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{{ Math.round(((originalPrice - price) / originalPrice) * 100) }}%
        </div>
      </div>
      
      <!-- Indicador de acceso anticipado sutil -->
      <div v-if="hasEarlyAccess" class="absolute top-3 left-3">
        <div class="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          PREMIUM
        </div>
      </div>
    </div>
    
    <!-- Contenido de la card -->
    <div class="p-6">
      <!-- Título -->
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
        {{ title }}
      </h3>
      
      <!-- Precio -->
      <div class="mb-4">
        <div v-if="originalPrice > price" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">${{ price.toLocaleString() }}</span>
          <span class="text-sm text-gray-500 line-through">${{ originalPrice.toLocaleString() }}</span>
        </div>
        <div v-else-if="price > 0" class="flex items-center">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">${{ price.toLocaleString() }}</span>
        </div>
        <div v-else class="flex items-center">
          <span class="text-lg font-semibold text-green-600 dark:text-green-400">Gratis</span>
        </div>
      </div>
      
      <!-- Información adicional -->
      <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Música Electrónica</span>
        </div>
        <div class="flex items-center space-x-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>Disponible</span>
        </div>
      </div>
    </div>
    
    <!-- Efecto de hover sutil -->
    <div class="absolute inset-0 border-2 border-purple-500/0 group-hover:border-purple-500/20 rounded-2xl transition-all duration-300 pointer-events-none"></div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Transición suave */
* {
  transition: all 0.3s ease;
}
</style> 