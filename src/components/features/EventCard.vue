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
      default: '400px'
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
    class="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
    :style="{ height: containerHeight }"
    @click="handleClick"
  >
    <!-- Imagen del evento -->
    <div class="relative w-full h-full overflow-hidden">
      <img 
        :src="imageSrc" 
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        @error="$event.target.src = '/default-event-image.jpg'"
      />
      
      <!-- Overlay mejorado para legibilidad -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
      
      <!-- Badge de evento mejorado -->
      <div class="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30 group-hover:bg-white/30 group-hover:border-white/50 transition-all duration-300">
        <span class="text-sm font-bold text-white">
          EVENTO
        </span>
      </div>
      
      <!-- Badge de acceso anticipado para Premium -->
      <div v-if="hasEarlyAccess" class="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30 group-hover:from-purple-700 group-hover:to-blue-700 transition-all duration-300 shadow-lg">
        <span class="text-sm font-bold text-white flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          PREMIUM
        </span>
      </div>
      
      <!-- Contenido superpuesto sobre la imagen -->
      <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
        <!-- Título -->
        <div class="mb-4">
          <h3 class="text-xl font-bold text-white line-clamp-2 group-hover:text-white transition-all duration-300 leading-tight">
            {{ title }}
          </h3>
        </div>
        
        <!-- Precio con descuento -->
        <div v-if="originalPrice > price" class="mb-4">
          <div class="flex items-center space-x-3">
            <span class="text-2xl font-bold text-green-400">${{ price.toLocaleString() }}</span>
            <span class="text-sm text-gray-300 line-through">${{ originalPrice.toLocaleString() }}</span>
            <span class="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-semibold">
              -{{ Math.round(((originalPrice - price) / originalPrice) * 100) }}%
            </span>
          </div>
        </div>
        
        <!-- Precio normal -->
        <div v-else-if="price > 0" class="mb-4">
          <span class="text-2xl font-bold text-white">${{ price.toLocaleString() }}</span>
        </div>
        
        <!-- Información adicional -->
        <div class="flex items-center justify-between text-sm text-gray-200">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="font-medium">Música Electrónica</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span class="font-medium">Disponible</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Efecto de brillo sutil en hover -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <!-- Borde sutil en hover -->
    <div class="absolute inset-0 rounded-3xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Efecto de sombra mejorado en hover */
.group:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* Transición suave para todos los elementos */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efecto de profundidad en la imagen */
.group:hover img {
  filter: brightness(1.1) contrast(1.05);
}

/* Animación sutil para el badge de estado */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Mejora para el backdrop blur */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style> 