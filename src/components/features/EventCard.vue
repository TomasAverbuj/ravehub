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
    class="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2 hover:scale-105"
    :style="{ height: containerHeight }"
    @click="handleClick"
  >
    <!-- Efecto de luz de fondo -->
    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 dark:from-purple-400/30 dark:to-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <!-- Imagen del evento -->
    <div class="relative w-full h-full overflow-hidden">
      <img 
        :src="imageSrc" 
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        @error="$event.target.src = '/default-event-image.jpg'"
      />
      
      <!-- Overlay con gradiente para texto -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/80 group-hover:via-black/30 transition-all duration-500"></div>
      
      <!-- Efecto de luz en la esquina -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/30 to-transparent dark:from-purple-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <!-- Badge flotante con efecto glassmorphism -->
      <div class="absolute top-4 left-4 bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/30 dark:border-gray-600/30">
        <span class="text-sm font-bold text-white drop-shadow-lg">
          EVENTO
        </span>
      </div>
      
      <!-- Contenido superpuesto sobre la imagen -->
      <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
        <!-- Título con efecto de gradiente -->
        <div class="mb-3">
          <h3 class="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent line-clamp-2 group-hover:from-purple-200 group-hover:via-white group-hover:to-blue-200 transition-all duration-500 drop-shadow-lg">
            {{ title }}
          </h3>
        </div>
        
        <!-- Información adicional -->
        <div class="flex items-center justify-between text-sm text-gray-200">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
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
    </div>
    
    <!-- Borde con gradiente animado -->
    <div class="absolute inset-0 rounded-2xl p-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div class="w-full h-full rounded-2xl bg-transparent"></div>
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

/* Animación de pulso personalizada */
@keyframes pulse-purple {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse-purple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Efecto de brillo en hover */
.group:hover .bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 2s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style> 