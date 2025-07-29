<script>
import Card from '../ui/Card.vue';
import Container from '../ui/Container.vue';

export default {
  name: 'HighlightsSection',
  components: { Card, Container }
}
</script>

<template>
  <div class="w-full py-20 bg-gray-50 dark:bg-neutral-950">
    <Container>
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
          Descubre tu próximo evento
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Explora las mejores experiencias de música electrónica y conéctate con la comunidad
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <!-- Tarjeta de eventos -->
        <Card padding="lg">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-black dark:text-white">Explora eventos destacados</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Descubre los eventos más populares y emocionantes de la escena de la música electrónica cerca de ti.
          </p>
          <router-link to="/eventos">
            <span class="inline-flex items-center text-black dark:text-white font-semibold hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Ver eventos
              <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </span>
          </router-link>
        </Card>
        
        <!-- Tarjeta de comunidad -->
        <Card padding="lg">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-black dark:text-white">¡Comenta tu evento favorito!</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Descubre tu evento favorito y conéctate con personas con los mismos gustos musicales.
          </p>
          <router-link to="/chat">
            <span class="inline-flex items-center text-black dark:text-white font-semibold hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Ir al chat
              <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </span>
          </router-link>
        </Card>
      </div>
    </Container>
  </div>
</template> 