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
      default: '280px'
    },
    imageHeight: {
      type: String,
      default: '200px'
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
    class="group relative bg-transparent rounded-lg cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200"
    @click="handleClick"
  >
    <!-- Imagen cuadrada estilo Spotify -->
    <div class="relative mb-4">
      <div class="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img 
          :src="imageSrc" 
          :alt="title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          @error="$event.target.src = '/default-event-image.jpg'"
        />
        
        <!-- Badge de descuento -->
        <div v-if="originalPrice > price" class="absolute top-2 right-2">
          <div class="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            -{{ Math.round(((originalPrice - price) / originalPrice) * 100) }}%
          </div>
        </div>
        
        <!-- Badge de premium -->
        <div v-if="hasEarlyAccess" class="absolute top-2 left-2">
          <div class="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            PREMIUM
          </div>
        </div>
      </div>
    </div>
    
    <!-- Información del evento -->
    <div class="px-1">
      <!-- Título -->
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
        {{ title }}
      </h3>
      
      <!-- Precio -->
      <div class="mb-2">
        <div v-if="originalPrice > price" class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-900 dark:text-white">${{ price.toLocaleString() }}</span>
          <span class="text-xs text-gray-500 line-through">${{ originalPrice.toLocaleString() }}</span>
        </div>
        <div v-else-if="price > 0" class="flex items-center">
          <span class="text-sm font-medium text-gray-900 dark:text-white">${{ price.toLocaleString() }}</span>
        </div>
        <div v-else class="flex items-center">
          <span class="text-sm font-medium text-green-600 dark:text-green-400">Gratis</span>
        </div>
      </div>
      
      <!-- Género -->
      <p class="text-xs text-gray-600 dark:text-gray-400">
        Música Electrónica
      </p>
    </div>
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