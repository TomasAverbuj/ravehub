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
    class="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
    :style="{ height: containerHeight }"
    @click="handleClick"
  >
    <!-- Imagen del evento -->
    <div class="relative w-full h-full overflow-hidden">
      <img 
        :src="imageSrc" 
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        @error="$event.target.src = '/default-event-image.jpg'"
      />
      
      <!-- Overlay sutil para mejorar legibilidad -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      
      <!-- Badge flotante con efecto glassmorphism -->
      <div class="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20 group-hover:bg-black/30 group-hover:border-white/40 transition-all duration-300">
        <span class="text-sm font-bold text-white">
          EVENTO
        </span>
      </div>
      
      <!-- Badge de acceso anticipado para Premium -->
      <div v-if="hasEarlyAccess" class="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20 group-hover:bg-purple-700 group-hover:bg-blue-700 transition-all duration-300">
        <span class="text-sm font-bold text-white flex items-center">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          PREMIUM
        </span>
      </div>
      
      <!-- Badge de evento premium -->
      <div v-if="isPremiumEvent" class="absolute top-16 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20 group-hover:bg-yellow-600 group-hover:bg-orange-600 transition-all duration-300">
        <span class="text-sm font-bold text-white flex items-center">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          VIP
        </span>
      </div>
      
      <!-- Contenido superpuesto sobre la imagen -->
      <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
        <!-- Título -->
        <div class="mb-3">
          <h3 class="text-2xl font-bold text-white line-clamp-2 group-hover:text-white transition-all duration-300">
            {{ title }}
          </h3>
        </div>
        
        <!-- Precio con descuento -->
        <div v-if="originalPrice > price" class="mb-3">
          <div class="flex items-center space-x-2">
            <span class="text-lg font-bold text-green-400">${{ price }}</span>
            <span class="text-sm text-gray-300 line-through">${{ originalPrice }}</span>
            <span class="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              -{{ Math.round(((originalPrice - price) / originalPrice) * 100) }}%
            </span>
          </div>
        </div>
        
        <!-- Precio normal -->
        <div v-else-if="price > 0" class="mb-3">
          <span class="text-lg font-bold text-white">${{ price }}</span>
        </div>
        
        <!-- Información adicional -->
        <div class="flex items-center justify-between text-sm text-gray-200">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Música Electrónica</span>
          </div>
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Disponible</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Borde sutil en hover -->
    <div class="absolute inset-0 rounded-2xl border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <!-- Efecto de brillo sutil en hover -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Efecto de sombra suave en hover */
.group:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Transición suave para todos los elementos */
* {
  transition: all 0.3s ease;
}

/* Efecto de profundidad en la imagen */
.group:hover img {
  filter: brightness(1.05);
}
</style> 